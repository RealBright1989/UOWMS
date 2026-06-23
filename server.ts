import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Set up body parsers with limits for image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize Gemini client lazily and safely
let aiClient: GoogleGenAI | null = null;
const getGeminiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
};

// Waste Classifier Endpoint
app.post('/api/classify', async (req, res) => {
  try {
    const { image, description } = req.body;
    const client = getGeminiClient();

    if (!client) {
      console.log('Gemini API key is not configured or in placeholder state. Falling back to local heuristic analyzer.');
      // Local Heuristic Fallback for previewing without configuring a key
      const descLower = (description || '').toLowerCase();
      let category = 'Mixed Waste';
      let confidence = 0.85;
      let handlingTip = 'Place securely in any trash bin.';
      let recyclePotential: 'High' | 'Medium' | 'Low' = 'Low';
      let greenTip = 'Try to separate reusable items next time to help campus recycling efforts!';

      if (descLower.includes('bottle') || descLower.includes('plastic') || descLower.includes('cup') || descLower.includes('nylon') || descLower.includes('can')) {
        category = 'Plastic';
        confidence = 0.92;
        handlingTip = 'Clean food residue first. Place in the Green Bin labeled PLASTICS.';
        recyclePotential = 'High';
        greenTip = 'Plastic bottles can take up to 450 years to decompose in campus landfills!';
      } else if (descLower.includes('glass') || descLower.includes('jar') || descLower.includes('cup') && descLower.includes('glass') || descLower.includes('window')) {
        category = 'Glass';
        confidence = 0.90;
        handlingTip = 'Handle carefully to prevent breakage. Dispose in the Blue Bin labeled GLASS.';
        recyclePotential = 'High';
        greenTip = 'Glass does not wear out; it can be recycled endlessly without loss of purity or quality!';
      } else if (descLower.includes('food') || descLower.includes('banana') || descLower.includes('peel') || descLower.includes('organic') || descLower.includes('apple') || descLower.includes('plant') || descLower.includes('leaf') || descLower.includes('leaves') || descLower.includes('rice') || descLower.includes('waste')) {
        category = 'Organic';
        confidence = 0.95;
        handlingTip = 'Dispose within 12 hours inside compost boxes near the cafeteria or Faculty of Agriculture farm.';
        recyclePotential = 'High';
        greenTip = 'Organic food waste produces methane, but is highly valuable as nutrient-rich compost for campus forestry!';
      } else if (descLower.includes('paper') || descLower.includes('book') || descLower.includes('notebook') || descLower.includes('exam') || descLower.includes('cardboard') || descLower.includes('box')) {
        category = 'Paper';
        confidence = 0.91;
        handlingTip = 'Keep dry. Flatten boxes and deposit in the Blue Bin labeled PAPERS.';
        recyclePotential = 'High';
        greenTip = 'Recycling 1 ton of campus examination papers saves up to 17 mature trees and 7,000 gallons of water!';
      } else if (descLower.includes('metal') || descLower.includes('iron') || descLower.includes('can') || descLower.includes('aluminium') || descLower.includes('tin') || descLower.includes('pipe')) {
        category = 'Metal';
        confidence = 0.88;
        handlingTip = 'Ensure cans are thoroughly crushed. Drop items in the Grey Bin labeled METALS.';
        recyclePotential = 'High';
        greenTip = 'Aluminium cans are back on the shelf as new cans in less than 60 days when recycled!';
      } else if (descLower.includes('electronic') || descLower.includes('wire') || descLower.includes('battery') || descLower.includes('phone') || descLower.includes('computer') || descLower.includes('charger') || descLower.includes('bulb')) {
        category = 'Electronic';
        confidence = 0.94;
        handlingTip = 'DO NOT incinerate or place in general campus trash. Request specialist electronic disposal.';
        recyclePotential = 'High';
        greenTip = 'E-waste represents 2% of campus landfills but accounts for 70% of highly toxic heavy metal pollution!';
      }

      return res.json({
        category,
        confidence,
        handlingTip,
        recyclePotential,
        greenTip,
        note: 'Simulated classification (configure GEMINI_API_KEY in secrets for live AI)'
      });
    }

    // Call real Gemini API
    console.log('Sending classification request to Gemini API (gemini-3.5-flash)...');
    
    let contents: any[] = [];
    
    if (image) {
      // image is usually a base64 encoded string from canvas or input
      const match = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        contents.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }

    const promptText = `
    Analyze this campus waste entry. 
    ${description ? `Description provided by the user: "${description}".` : ''}
    Categorize it into exactly one of these categories: Plastic, Glass, Organic, Paper, Metal, Electronic, Mixed Waste.
    
    Provide the response in raw JSON format matching this schema:
    {
      "category": "Plastic | Glass | Organic | Paper | Metal | Electronic | Mixed Waste",
      "confidence": 0.0 to 1.0,
      "handlingTip": "Short practical advisory on where or how to dispose of this specifically on a university campus",
      "recyclePotential": "High | Medium | Low",
      "greenTip": "One interesting, inspiring environmental stat or fact related to this type of waste"
    }
    
    Ensure you return ONLY a JSON block, no markdown formatting.
    `;

    contents.push({ text: promptText });

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: { parts: contents },
      config: {
        responseMimeType: 'application/json',
      }
    });

    const resultText = response.text || '{}';
    try {
      const parsed = JSON.parse(resultText.replace(/```json|```/gi, '').trim());
      return res.json(parsed);
    } catch (parseErr) {
      console.error('Failed to parse Gemini output:', resultText, parseErr);
      return res.status(500).json({ error: 'AI gave an invalid response format.' });
    }

  } catch (error: any) {
    console.error('Gemini classification crash:', error);
    return res.status(500).json({ error: error.message || 'AI Classification error occured.' });
  }
});

// App Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    campus: 'UNICROSS Online Campus Waste Management System',
    geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
    time: new Date().toISOString()
  });
});

// Server client assets in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UNICROSS OCWMS server starting on http://localhost:${PORT}`);
  });
}

startServer();
