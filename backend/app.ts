import express from 'express';
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

  // Backend API routes
  app.use('/api/assistant', assistantRouter);

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
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  return app;
}

export async function startServer() {
  const app = await createApp();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Navique server running at http://localhost:${PORT}`);
  });
}
