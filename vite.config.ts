import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { CSS_TARGET } from './css-target';

// Library build: ESM-only JS bundle + a single dist/styles.css.
// Type declarations are emitted separately by `tsc -p tsconfig.lib.json`,
// theme stylesheets by scripts/build-themes.mjs.
export default defineConfig({
  plugins: [react()],
  build: {
    cssTarget: CSS_TARGET,
    lib: {
      entry: fileURLToPath(new URL('./src/lib/entry.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'styles',
    },
    copyPublicDir: false,
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      // Every export is interactive (hooks, context, event handlers): mark the
      // bundle as a client module so it can be imported from React Server
      // Components (Next.js App Router) without a wrapper.
      output: { banner: "'use client';" },
    },
  },
});
