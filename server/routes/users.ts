import { Router, Request, Response } from 'express';
import { getDb, commit } from '../data';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  let users = [...db.users];
  const { role, search } = req.query;
  if (role && role !== 'all') users = users.filter(u => u.role === role);
  if (search) {
    const q = (search as string).toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.matricNumber || '').toLowerCase().includes(q));
  }
  res.json(users);
});

router.put('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  db.users[idx] = { ...db.users[idx], ...req.body };
  commit();
  res.json(db.users[idx]);
});

router.put('/:id/status', (req: Request, res: Response) => {
  const db = getDb();
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  db.users[idx].status = req.body.status;
  db.logs.unshift({
    id: 'log_' + Math.floor(Math.random() * 1000),
    action: `User ${req.body.status === 'Suspended' ? 'Suspended' : 'Activated'}`,
    user: req.body.adminName || 'Admin',
    role: 'Admin',
    timestamp: new Date().toISOString(),
    details: `${req.body.status === 'Suspended' ? 'Suspended' : 'Activated'} user ${db.users[idx].name}.`
  });
  commit();
  res.json(db.users[idx]);
});

router.put('/:id/role', (req: Request, res: Response) => {
  const db = getDb();
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  db.users[idx].role = req.body.role;
  db.logs.unshift({
    id: 'log_' + Math.floor(Math.random() * 1000),
    action: 'Role Changed',
    user: req.body.adminName || 'Admin',
    role: 'Admin',
    timestamp: new Date().toISOString(),
    details: `Changed ${db.users[idx].name} role to ${req.body.role}.`
  });
  commit();
  res.json(db.users[idx]);
});

router.delete('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const name = db.users[idx].name;
  db.users.splice(idx, 1);
  db.logs.unshift({
    id: 'log_' + Math.floor(Math.random() * 1000),
    action: 'User Deleted',
    user: req.body.adminName || 'Admin',
    role: 'Admin',
    timestamp: new Date().toISOString(),
    details: `Deleted user ${name}.`
  });
  commit();
  res.json({ success: true });
});

export default router;
