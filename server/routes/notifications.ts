import { Router, Request, Response } from 'express';
import { getDb, commit } from '../data';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const { userId } = req.query;
  let nots = [...db.notifications];
  if (userId) nots = nots.filter(n => n.id.includes('not_'));
  res.json(nots);
});

router.put('/read-all', (req: Request, res: Response) => {
  const db = getDb();
  db.notifications = db.notifications.map(n => ({ ...n, read: true }));
  commit();
  res.json({ success: true });
});

router.put('/:id/read', (req: Request, res: Response) => {
  const db = getDb();
  const idx = db.notifications.findIndex(n => n.id === req.params.id);
  if (idx !== -1) {
    db.notifications[idx].read = true;
    commit();
  }
  res.json({ success: true });
});

export default router;
