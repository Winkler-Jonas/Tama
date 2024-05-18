import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // Port for nginx
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: parseInt(process.env.VITE_HMR_PORT), // client-port
      host: process.env.VITE_HMR_HOST // external ip or domain
    },
  },
});
