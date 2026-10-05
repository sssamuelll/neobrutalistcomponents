import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { CSS_TARGET } from './css-target';

// Docs site. Examples import from 'neobrutalistcomponents' so the code shown
// on the site is exactly what a consumer would paste; the alias points that
// specifier at the library source.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      neobrutalistcomponents: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
    },
  },
  build: {
    cssTarget: CSS_TARGET,
    outDir: 'site-dist',
    emptyOutDir: true,
  },
  base: './',
});
