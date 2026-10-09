import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { essays } from './vite-plugin-essays.ts';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react(), essays()],
  resolve: {
    alias: {
      neobrutalistcomponents: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Study theme CSS is imported with ?raw and linted and compiled in tests; by
    // default Vitest replaces every CSS file it does not process with an empty string.
    css: { include: [/\/src\/study\/themes\/.*\.css/] },
  },
});
