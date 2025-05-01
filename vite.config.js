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
    historyApiFallback: true, // Add this line to handle routes fallback to index.html
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    base: '/', // Ensure base path is root
  },
  preview: {
    port: 8080,
    host: '0.0.0.0',
    allowedHosts: [
      'https://linkedin-one-lilac.vercel.app/' ,// Explicitly allow this host,
      'https://frontend-vertex-472499096510.asia-south1.run.app/',
      'frontend-vertex-472499096510.asia-south1.run.app',

    ],
  },
});
