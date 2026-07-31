import { Router, Request, Response } from 'express';

const router = Router();

const BINS = [
  { id: 'bin1', name: 'Engineering Block A', location: [8.3512, 4.9754] as [number, number], category: 'Plastic', fillLevel: 85, status: 'full' },
  { id: 'bin2', name: 'Bio Sci Garden', location: [8.3520, 4.9760] as [number, number], category: 'Organic', fillLevel: 45, status: 'active' },
  { id: 'bin3', name: 'Library Entrance', location: [8.3508, 4.9751] as [number, number], category: 'Paper', fillLevel: 30, status: 'active' },
  { id: 'bin4', name: 'Physics Lab', location: [8.3510, 4.9755] as [number, number], category: 'Glass', fillLevel: 90, status: 'full' },
  { id: 'bin5', name: 'Admin Building', location: [8.3500, 4.9759] as [number, number], category: 'Mixed Waste', fillLevel: 60, status: 'active' },
  { id: 'bin6', name: 'Comp Sci Block', location: [8.3498, 4.9749] as [number, number], category: 'Electronic', fillLevel: 20, status: 'maintenance' },
  { id: 'bin7', name: 'Law Faculty', location: [8.3518, 4.9745] as [number, number], category: 'Paper', fillLevel: 75, status: 'active' },
  { id: 'bin8', name: 'Hostel C', location: [8.3505, 4.9735] as [number, number], category: 'Mixed Waste', fillLevel: 95, status: 'full' },
  { id: 'bin9', name: 'Agric Farm', location: [8.3499, 4.9721] as [number, number], category: 'Organic', fillLevel: 40, status: 'active' },
  { id: 'bin10', name: 'Arts & Humanities', location: [8.3515, 4.9748] as [number, number], category: 'Paper', fillLevel: 55, status: 'active' }
];

const TRUCKS = [
  { id: 't1', name: 'Collection Truck A', location: [8.3508, 4.9753] as [number, number], driver: 'Emeka Obi', status: 'collecting' },
  { id: 't2', name: 'Collection Truck B', location: [8.3515, 4.9742] as [number, number], driver: 'Asari Bassey', status: 'en-route' },
  { id: 't3', name: 'Collection Truck C', location: [8.3495, 4.9765] as [number, number], driver: 'Idongesit Friday', status: 'returning' }
];

router.get('/bins', (_req: Request, res: Response) => {
  res.json(BINS);
});

router.get('/trucks', (_req: Request, res: Response) => {
  res.json(TRUCKS);
});

export default router;
