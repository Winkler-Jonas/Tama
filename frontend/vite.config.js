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
    port: 5173, // Ensure the port matches what Nginx proxies to
    strictPort: true, // Exit if the port is already in use
    watch: {
      usePolling: true, // Needed for hot-reloading to work inside Docker
    },
    hmr: {
      clientPort: 80, // The port on which the client can reach the server
      host: '130.61.49.116' // Use Docker host IP or a specific domain if needed
    },
  },
});
