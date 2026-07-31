import { Router, Request, Response } from 'express';
import { getDb } from '../data';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.logs);
});

export default router;
