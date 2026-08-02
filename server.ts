import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

import authRoutes from './server/routes/auth';
import reportRoutes from './server/routes/reports';
import userRoutes from './server/routes/users';
import notificationRoutes from './server/routes/notifications';
import logRoutes from './server/routes/logs';
import mapRoutes from './server/routes/map';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/map', mapRoutes);

// AI Classification (kept inline)
let aiClient: GoogleGenAI | null = null;
const getGeminiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') return null;
  if (!aiClient) aiClient = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
  return aiClient;
};

app.post('/api/classify', async (req, res) => {
  try {
    const { image, description } = req.body;
    const client = getGeminiClient();
    if (!client) {
      const d = (description || '').toLowerCase();
      let cat = 'Mixed Waste', conf = 0.85, tip = 'Place in any trash bin.';
      let rp: 'High' | 'Medium' | 'Low' = 'Low';
      let gt = 'Try separating reusable items for campus recycling!';
      if (d.includes('bottle') || d.includes('plastic') || d.includes('cup') || d.includes('nylon')) { cat='Plastic'; conf=0.92; tip='Clean residue. Place in Green Bin labeled PLASTICS.'; rp='High'; gt='Plastic bottles take 450 years to decompose!'; }
      else if (d.includes('glass') || d.includes('jar')) { cat='Glass'; conf=0.90; tip='Handle carefully. Dispose in Blue Bin labeled GLASS.'; rp='High'; gt='Glass recycles endlessly without quality loss!'; }
      else if (d.includes('food') || d.includes('banana') || d.includes('peel') || d.includes('organic') || d.includes('leaf')) { cat='Organic'; conf=0.95; tip='Dispose in compost boxes near cafeteria.'; rp='High'; gt='Organic waste makes nutrient-rich compost!'; }
      else if (d.includes('paper') || d.includes('book') || d.includes('cardboard')) { cat='Paper'; conf=0.91; tip='Keep dry, flatten boxes. Deposit in Blue Bin.'; rp='High'; gt='1 ton of paper saves 17 trees!'; }
      else if (d.includes('metal') || d.includes('iron') || d.includes('aluminium')) { cat='Metal'; conf=0.88; tip='Crush cans. Drop in Grey Bin labeled METALS.'; rp='High'; gt='Aluminium cans return as new cans in 60 days!'; }
      else if (d.includes('electronic') || d.includes('battery') || d.includes('phone') || d.includes('bulb')) { cat='Electronic'; conf=0.94; tip='DO NOT incinerate. Request specialist disposal.'; rp='High'; gt='E-waste is 2% of landfill but 70% of toxic pollution!'; }
      return res.json({ category: cat, confidence: conf, handlingTip: tip, recyclePotential: rp, greenTip: gt, note: 'Simulated (set GEMINI_API_KEY for live AI)' });
    }
    let contents: any[] = [];
    if (image) {
      const match = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) contents.push({ inlineData: { mimeType: match[1], data: match[2] } });
    }
    contents.push({ text: `Analyze waste.${description ? ` Description: "${description}".` : ''} Categorize as Plastic, Glass, Organic, Paper, Metal, Electronic, or Mixed Waste. Return JSON: {category, confidence:0-1, handlingTip, recyclePotential: High|Medium|Low, greenTip}. JSON only.` });
    const response = await client.models.generateContent({ model: 'gemini-3.5-flash', contents: { parts: contents }, config: { responseMimeType: 'application/json' } });
    const parsed = JSON.parse((response.text || '{}').replace(/```json|```/gi, '').trim());
    res.json(parsed);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Classification error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', campus: 'UNICROSS OCWMS', time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`UNICROSS OCWMS server starting on http://localhost:${PORT}`));
}

startServer();
