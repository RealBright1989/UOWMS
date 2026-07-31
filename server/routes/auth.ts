import { Router, Request, Response } from 'express';
import { getDb, commit } from '../data';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  const db = getDb();
  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: 'u_' + Math.floor(Math.random() * 1000),
      name: email.split('@')[0].split('.').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      email,
      role,
      status: 'Active',
    };
    db.users.unshift(user);
    commit();
  }
  if (user.status === 'Suspended') {
    return res.status(403).json({ error: 'Account suspended' });
  }
  res.json({ user, token: 'mock_token_' + user.id });
});

router.post('/register', (req: Request, res: Response) => {
  const db = getDb();
  const newUser = {
    id: 'u_' + Math.floor(Math.random() * 1000),
    role: 'student' as const,
    ...req.body,
    status: 'Active' as const,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
  };
  db.users.unshift(newUser);
  db.notifications.unshift({
    id: 'not_' + Math.floor(Math.random() * 1000),
    title: 'Welcome to UNICROSS OCWMS!',
    message: `Profile activated under Matric ${newUser.matricNumber || 'Direct'}. Start reporting.`,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'success'
  });
  db.logs.unshift({
    id: 'log_' + Math.floor(Math.random() * 1000),
    action: 'New Registration',
    user: newUser.name,
    role: 'Student',
    timestamp: new Date().toISOString(),
    details: `Registered with Matric ${newUser.matricNumber || 'N/A'}`
  });
  commit();
  res.json({ user: newUser, token: 'mock_token_' + newUser.id });
});

router.get('/me/:userId', (req: Request, res: Response) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

export default router;
