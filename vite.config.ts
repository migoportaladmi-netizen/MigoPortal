import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        manifest: {
          name: 'MigoPortal',
          short_name: 'MigoPortal',
          description: 'All-in-one Employee Portal for Expenses, Travel, and HR',
          theme_color: '#4f46e5',
          background_color: '#f8fafc',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-icon.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-icon.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'maskable-icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});