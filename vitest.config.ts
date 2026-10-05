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
  },
});
