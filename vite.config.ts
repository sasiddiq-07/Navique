import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-frontend-assets',
      apply: 'build',
      closeBundle(error?: Error): void {
        if (error) return;
        const distDir = path.resolve(__dirname, 'dist');
        const srcAssets = path.resolve(__dirname, 'frontend/src/assets');
        const distAssets = path.resolve(distDir, 'frontend/src/assets');
        if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
          fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@frontend': path.resolve(__dirname, 'frontend/src'),
      '@backend': path.resolve(__dirname, 'backend'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
