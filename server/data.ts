import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const DB_PATH = path.join(process.cwd(), 'server', 'db.json');

interface DbSchema {
  users: any[];
  reports: any[];
  notifications: any[];
  logs: any[];
}

type Collection = 'users' | 'reports' | 'notifications' | 'logs';
const COLLECTIONS: Collection[] = ['users', 'reports', 'notifications', 'logs'];

let db: DbSchema | null = null;
let pool: Pool | null = null;
let usePg = false;
let pending: Promise<void> = Promise.resolve();

function loadJson(): DbSchema {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: parsed.users || [],
        reports: parsed.reports || [],
        notifications: parsed.notifications || [],
        logs: parsed.logs || []
      };
    }
  } catch { /* fall through */ }
  return { users: [], reports: [], notifications: [], logs: [] };
}

function saveJson(data: DbSchema) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save db.json:', e);
  }
}

function getConnectionString(): string | null {
  const url = (process.env.DATABASE_URL || '').trim();
  if (url) return url;
  if (process.env.PGHOST) {
    const user = process.env.PGUSER || 'postgres';
    const pass = process.env.PGPASSWORD || '';
    const host = process.env.PGHOST;
    const port = process.env.PGPORT || '5432';
    const name = process.env.PGDATABASE || 'ocwms';
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${name}`;
  }
  return null;
}

// Each collection keeps a JSONB document plus a few indexed scalar columns
// so the data can be queried directly with SQL in pgAdmin / psql.
const CREATE_SQL: Record<Collection, string> = {
  users: `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    email TEXT,
    role TEXT,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  )`,
  reports: `CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    status TEXT,
    category TEXT,
    priority TEXT,
    student_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  )`,
  notifications: `CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
  )`,
  logs: `CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    action TEXT,
    role TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  )`
};

const UPSERT_SQL: Record<Collection, string> = {
  users: `INSERT INTO users (id, data, email, role, status) VALUES ($1, $2::jsonb, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, email = EXCLUDED.email, role = EXCLUDED.role, status = EXCLUDED.status`,
  reports: `INSERT INTO reports (id, data, status, category, priority, student_id) VALUES ($1, $2::jsonb, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, status = EXCLUDED.status, category = EXCLUDED.category, priority = EXCLUDED.priority, student_id = EXCLUDED.student_id`,
  notifications: `INSERT INTO notifications (id, data, is_read) VALUES ($1, $2::jsonb, $3)
                  ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, is_read = EXCLUDED.is_read`,
  logs: `INSERT INTO logs (id, data, action, role) VALUES ($1, $2::jsonb, $3, $4)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, action = EXCLUDED.action, role = EXCLUDED.role`
};

function upsertValues(coll: Collection, item: any): any[] {
  const json = JSON.stringify(item);
  switch (coll) {
    case 'users': return [item.id, json, item.email ?? null, item.role ?? null, item.status ?? null];
    case 'reports': return [item.id, json, item.status ?? null, item.category ?? null, item.priority ?? null, item.studentId ?? null];
    case 'notifications': return [item.id, json, !!item.read];
    case 'logs': return [item.id, json, item.action ?? null, item.role ?? null];
  }
}

async function persistPg(snapshot: DbSchema): Promise<void> {
  if (!pool) return;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const coll of COLLECTIONS) {
      const rows = (snapshot[coll] || []).filter((r: any) => r && r.id);
      for (const item of rows) {
        await client.query(UPSERT_SQL[coll], upsertValues(coll, item));
      }
      const ids = rows.map((r: any) => r.id);
      if (ids.length) {
        await client.query(`DELETE FROM ${coll} WHERE id <> ALL($1::text[])`, [ids]);
      } else {
        await client.query(`DELETE FROM ${coll}`);
      }
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

export async function initDb(): Promise<void> {
  const conn = getConnectionString();
  if (!conn) {
    usePg = false;
    db = loadJson();
    console.log('[db] PostgreSQL not configured - using JSON file store (server/db.json)');
    return;
  }
  try {
    pool = new Pool({ connectionString: conn, max: 5 });
    const probe = await pool.connect();
    probe.release();

    for (const coll of COLLECTIONS) await pool.query(CREATE_SQL[coll]);
    usePg = true;

    const loaded: DbSchema = { users: [], reports: [], notifications: [], logs: [] };
    for (const coll of COLLECTIONS) {
      const res = await pool.query(`SELECT data FROM ${coll} ORDER BY created_at DESC`);
      loaded[coll] = res.rows.map(r => r.data);
    }
    const total = COLLECTIONS.reduce((n, c) => n + loaded[c].length, 0);

    if (total === 0) {
      const json = loadJson();
      const jsonTotal = COLLECTIONS.reduce((n, c) => n + (json[c]?.length || 0), 0);
      if (jsonTotal > 0) {
        db = json;
        await persistPg(json);
        console.log(`[db] Connected to PostgreSQL - seeded ${jsonTotal} records from db.json`);
      } else {
        db = loaded;
        console.log('[db] Connected to PostgreSQL - database is empty');
      }
    } else {
      db = loaded;
      console.log(`[db] Connected to PostgreSQL - loaded ${total} records`);
    }
  } catch (e: any) {
    console.error(`[db] PostgreSQL unavailable (${e.message}) - falling back to JSON file store`);
    usePg = false;
    if (pool) { await pool.end().catch(() => {}); pool = null; }
    db = loadJson();
  }
}

export function getDb(): DbSchema {
  if (!db) db = loadJson();
  return db;
}

export function commit() {
  if (!db) return;
  saveJson(db);
  if (!usePg) return;
  const snapshot: DbSchema = JSON.parse(JSON.stringify(db));
  pending = pending
    .then(() => persistPg(snapshot))
    .catch(e => console.error('[db] PostgreSQL persist failed:', e.message));
}

export async function flushDb(): Promise<void> {
  await pending;
}

export function isUsingPostgres(): boolean {
  return usePg;
}
