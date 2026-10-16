import { defineConfig, devices } from '@playwright/test';

// Keyboard/focus specs run against the static Storybook build (`pnpm build-storybook` first).
export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['junit', { outputFile: 'test-results/e2e-junit.xml' }]] : 'list',
  use: { baseURL: 'http://localhost:6007' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'vite preview --outDir storybook-static --port 6007 --strictPort',
    port: 6007,
    reuseExistingServer: !process.env.CI,
  },
});
