import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
    hmr: {
      clientPort: 8080,
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
  },
  preview: {
    port: 8080,
    host: '0.0.0.0',
    allowedHosts: [
      'vertx-home-dve6brb4hde5cqbz.centralindia-01.azurewebsites.net' // Explicitly allow this host
    ]
  },
});
