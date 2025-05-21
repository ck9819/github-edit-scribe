
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
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
      react(),
      mode === 'development' && componentTagger && componentTagger(),
    ].filter(Boolean),
    esbuild: {
      loader: 'jsx', // treat .js files as JSX
      include: /src\/.*\.js$/, // only apply to your source files
    },
    server: {
      host: "::",
      open: true,
      port: 3000,
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
  };
});
