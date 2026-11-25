import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { assistantRouter } from './routes/assistant.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 3000;

export async function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  // CORS headers for API routes (supports Vercel frontend + Render backend deployments)
  app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Backend API routes
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/api/assistant', assistantRouter);
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  // Serve frontend via Vite in development or prebuilt static bundle in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT_DIR, 'dist');
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(indexPath);
      });
    }
  }

  return app;
}

export async function startServer() {
  const app = await createApp();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Navique server running at http://localhost:${PORT}`);
  });
}
