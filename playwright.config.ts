import { defineConfig, devices } from '@playwright/test';

// Keyboard/focus specs run against the static Storybook build (`pnpm build-storybook` first).
// ILW_E2E_PORT moves its preview server off 6007, so worktrees can run e2e side by side.
const port = Number(process.env.ILW_E2E_PORT ?? 6007);

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['junit', { outputFile: 'test-results/e2e-junit.xml' }]] : 'list',
  use: { baseURL: `http://localhost:${port}` },
  projects: [
    { name: 'svelte-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'svelte-webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `vite preview --outDir storybook-static --port ${port} --strictPort`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
