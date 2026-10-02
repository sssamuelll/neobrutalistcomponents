import { defineConfig, devices } from '@playwright/test';

// E2E smoke over the built docs site: every route × every theme renders,
// logs no console errors and passes axe (WCAG 2.2 AA, colour contrast
// included — jsdom cannot check that, a real browser can).
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 2,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173/',
    ...devices['Desktop Chrome'],
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npm run build:site && npx vite preview --config vite.site.config.ts --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
