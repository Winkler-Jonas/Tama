import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './public/manifest.json';
import dotenv from 'dotenv'

dotenv.config()

// Check if we are in development mode
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,  // Enable PWA features in development mode for testing
      },
      manifest,
      ...(isDev ? {
        workbox: {
          globPatterns: [],  // No precaching in development
        },
      } : {
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,png,jpg,svg}'],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/static/'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'django-static-files',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: isDev ? {
      clientPort: parseInt(process.env.VITE_HMR_PORT) || 5173,
      host: process.env.VITE_HMR_HOST || 'localhost',
    } : undefined,
  },
});
