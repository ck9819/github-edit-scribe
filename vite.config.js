
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
//import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development',
  ].filter(Boolean),
  server: {
    host: "::",
    open: true,
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}));
