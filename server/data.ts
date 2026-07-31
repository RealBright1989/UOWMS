import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'server', 'db.json');

interface DbSchema {
  users: any[];
  reports: any[];
  notifications: any[];
  logs: any[];
}
let db: DbSchema | null = null;

function loadDb(): DbSchema {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch { /* fall through */ }
  const fresh: DbSchema = { users: [], reports: [], notifications: [], logs: [] };
  saveDb(fresh);
  return fresh;
}

function saveDb(data: DbSchema) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save db.json:', e);
  }
}

export function getDb(): DbSchema {
  if (!db) db = loadDb();
  return db;
}

export function commit() {
  if (db) saveDb(db);
}
