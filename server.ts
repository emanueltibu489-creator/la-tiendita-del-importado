import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { PERFUMES } from './src/data';

// Load environment variables
dotenv.config();

let aiClient: GoogleGenAI | null = null;

const SOMMELIER_MAX_QUERY_LENGTH = 500;
const SOMMELIER_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const SOMMELIER_MAX_REQUESTS_PER_WINDOW = 8;
const sommelierRequests = new Map<string, { count: number; resetAt: number }>();

function consumeSommelierRequest(ip: string) {
  const now = Date.now();
  const current = sommelierRequests.get(ip);
  if (!current || current.resetAt <= now) {
    sommelierRequests.set(ip, { count: 1, resetAt: now + SOMMELIER_RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (current.count >= SOMMELIER_MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json({ limit: '8kb' }));

  // API endpoint for AI Sommelier
  app.post('/api/sommelier', async (req, res) => {
    try {
      const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
      if (!query) {
        return res.status(400).json({ error: 'La consulta es requerida.' });
      }

      if (query.length > SOMMELIER_MAX_QUERY_LENGTH) {
        return res.status(400).json({
          error: `La consulta no puede superar ${SOMMELIER_MAX_QUERY_LENGTH} caracteres.`,
        });
      }

      const rateLimit = consumeSommelierRequest(req.ip);
      if (!rateLimit.allowed) {
        res.set('Retry-After', String(rateLimit.retryAfterSeconds));
        return res.status(429).json({
          error: 'Demasiadas consultas. Probá nuevamente en unos minutos.',
        });
      }

      const ai = getAiClient();
      
      const stockDescription = PERFUMES.map((p, idx) => {
        return `${idx + 1}. ${p.brand} - ${p.name}:
- Carácter: ${p.character || p.description}
- Notas de Salida: ${p.notes?.salida || 'No especificadas'}
- Notas de Corazón: ${p.notes?.corazon || 'No especificadas'}
- Notas de Fondo: ${p.notes?.fondo || 'No especificadas'}
- Momento propicio: ${p.metrics?.momento || 'Cualquier momento'}
- Clima idóneo: ${p.metrics?.clima || 'Cualquier clima'}
- Estilo: ${p.metrics?.estilo || 'Elegante'}
- Proyección: ${p.metrics?.proyeccion || 'Normal'}`;
      }).join('\n\n');

      const systemInstruction = `Eres un refinado Sommelier de Perfumería e Importados de lujo, representante exclusivo de 'La Tiendita del Importado'. Tu tono de voz es elegante, sofisticado, apasionado y sumamente conocedor de la mística olfativa del mundo árabe.

Disponemos exclusivamente de las siguientes fragancias de lujo en stock real actualmente:

${stockDescription}

El cliente te describirá sus gustos, tipo de piel, clima, prendas, o la ocasión para la que busca el perfume.
Tu tarea:
- Evalúa sus requerimientos de manera sumamente profesional, con palabras elegantes y poéticas de alta costura olfativa.
- Elige y recomienda estrictamente y sin excepciones una (o máximo dos) de las fragancias exclusivas de nuestro stock real arriba listadas que mejor se adecúe a sus gustos. NO ofrezcas ni inventes fragancias que no figuren en la lista de arriba.
- Detalla de forma encantadora las notas aromáticas (salida, corazón, fondo) del perfume de nuestro stock que le recomiendas y el porqué de la profunda afinidad con la ocasión descrita.
- Mantén la respuesta concisa e inspiradora (máximo 3 párrafos cortos). Responde de manera profesional en español de Argentina/Latinoamérica de forma muy cálida y respetuosa.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      const recommendation = response.text || 'Lamentablemente no pude procesar la recomendación olfativa. Reintente con otros descriptores.';
      res.json({ recommendation });
    } catch (error: any) {
      console.error('Error in/api/sommelier:', error);
      res.status(500).json({
        error: 'Error interno de procesamiento de IA.',
      });
    }
  });

  // Vite development or production routing
  if (process.env.NODE_ENV !== 'production') {
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start fullstack server:', err);
});
