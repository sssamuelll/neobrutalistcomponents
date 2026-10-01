import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Library build: ESM-only JS bundle + a single dist/styles.css.
// Type declarations are emitted separately by `tsc -p tsconfig.lib.json`,
// theme stylesheets by scripts/build-themes.mjs.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'styles',
    },
    copyPublicDir: false,
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
