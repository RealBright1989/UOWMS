import { Router, Request, Response } from 'express';
import { getDb, commit } from '../data';
import { WasteReport } from '../../src/types';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  let reports = [...db.reports];
  const { studentId, status, category, search } = req.query;
  if (studentId) reports = reports.filter(r => r.studentId === studentId);
  if (status && status !== 'all') reports = reports.filter(r => r.status === status);
  if (category && category !== 'all') reports = reports.filter(r => r.category === category);
  if (search) {
    const q = (search as string).toLowerCase();
    reports = reports.filter(r => r.description.toLowerCase().includes(q) || r.location.faculty.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
  }
  res.json(reports);
});

router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const report = db.reports.find(r => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
});

router.post('/', (req: Request, res: Response) => {
  const db = getDb();
  const newReport: WasteReport = {
    id: 'R-' + Math.floor(1000 + Math.random() * 9000),
    status: 'Pending',
    dateSubmitted: new Date().toISOString(),
    comments: [],
    ...req.body
  };
  db.reports.unshift(newReport);
  db.notifications.unshift({
    id: 'not_' + Math.floor(Math.random() * 1000),
    title: `${newReport.category} Incident Reported`,
    message: `Report ${newReport.id} registered at ${newReport.location.faculty} (${newReport.priority} priority).`,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'info'
  });
  db.logs.unshift({
    id: 'log_' + Math.floor(Math.random() * 1000),
    action: 'New Report Filed',
    user: newReport.studentName,
    role: 'Student',
    timestamp: new Date().toISOString(),
    details: `Filed ${newReport.id} (${newReport.category}) at ${newReport.location.building}.`
  });
  commit();
  res.status(201).json(newReport);
});

router.put('/:id/status', (req: Request, res: Response) => {
  const db = getDb();
  const idx = db.reports.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Report not found' });
  const { status, completionImageUrl } = req.body;
  db.reports[idx] = { ...db.reports[idx], status, completionImageUrl: completionImageUrl || db.reports[idx].completionImageUrl };
  if (status === 'Completed' && db.reports[idx].studentId) {
    db.notifications.unshift({
      id: 'not_' + Math.floor(Math.random() * 1000),
      title: `Cleanup Completed (${req.params.id})`,
      message: `Your report at ${db.reports[idx].location.faculty} is fully cleared.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'success'
    });
  }
  db.logs.unshift({
    id: 'log_' + Math.floor(Math.random() * 1000),
    action: `Status: ${status}`,
    user: req.body.userName || 'Sanitation Staff',
    role: 'Staff',
    timestamp: new Date().toISOString(),
    details: `Marked ${req.params.id} (${db.reports[idx].category}) as ${status}.`
  });
  commit();
  res.json(db.reports[idx]);
});

router.put('/:id/assign', (req: Request, res: Response) => {
  const db = getDb();
  const idx = db.reports.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Report not found' });
  const { staffId, staffName } = req.body;
  db.reports[idx] = { ...db.reports[idx], assignedStaffId: staffId, assignedStaffName: staffName, status: 'Assigned' };
  db.notifications.unshift({
    id: 'not_' + Math.floor(Math.random() * 1000),
    title: 'New Dispatch Assignment',
    message: `Case ${req.params.id} allocated to ${staffName}.`,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'info'
  });
  db.logs.unshift({
    id: 'log_' + Math.floor(Math.random() * 1000),
    action: 'Task Assigned',
    user: req.body.adminName || 'Admin',
    role: 'Admin',
    timestamp: new Date().toISOString(),
    details: `Assigned ${req.params.id} to ${staffName}.`
  });
  commit();
  res.json(db.reports[idx]);
});

router.post('/:id/comments', (req: Request, res: Response) => {
  const db = getDb();
  const idx = db.reports.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Report not found' });
  const comment = {
    id: 'c_' + Math.floor(Math.random() * 1000),
    author: req.body.author,
    authorRole: req.body.authorRole,
    content: req.body.content,
    timestamp: new Date().toISOString()
  };
  db.reports[idx].comments.push(comment);
  commit();
  res.status(201).json(comment);
});

router.delete('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const idx = db.reports.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Report not found' });
  db.reports.splice(idx, 1);
  commit();
  res.json({ success: true });
});

export default router;
