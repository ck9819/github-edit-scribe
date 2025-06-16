
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Using dynamic import for ESM modules
export default defineConfig(async ({ mode }) => {
  // Conditionally import componentTagger only in development mode
  let componentTagger;
  if (mode === 'development') {
    try {
      const lovableTagger = await import('lovable-tagger');
      componentTagger = lovableTagger.componentTagger;
    } catch (error) {
      console.warn('Warning: Could not import lovable-tagger, proceeding without it');
    }
  }

  return {
    plugins: [
      react({
        // Use the classic JSX runtime to avoid issues with react/jsx-runtime resolution.
        jsxRuntime: 'classic',
      }),
      mode === 'development' && componentTagger && componentTagger(),
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
      rollupOptions: {
        external: [],
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  };
});
