import { defineConfig, devices } from '@playwright/test';

// Keyboard/focus specs run against the static Storybook builds (`pnpm build-storybook` and
// `pnpm build-storybook:react` first). Every spec runs on both builds: the twin stories have the
// same ids. ILW_FW=svelte|react|both (default both) picks the builds, and with them the projects
// and preview servers: Playwright starts every server before it filters projects, so a run
// without one build would otherwise fail. ILW_E2E_PORT and ILW_E2E_REACT_PORT move the preview
// servers off 6007 and 6009, so worktrees can run e2e side by side.
const builds = {
  svelte: { dir: 'storybook-static', port: Number(process.env.ILW_E2E_PORT ?? 6007) },
  react: { dir: 'storybook-static-react', port: Number(process.env.ILW_E2E_REACT_PORT ?? 6009) },
};
type Framework = keyof typeof builds;

const fw = process.env.ILW_FW ?? 'both';
if (fw !== 'both' && !(fw in builds)) throw new Error(`ILW_FW must be svelte, react or both, not '${fw}'`);
const frameworks = (fw === 'both' ? Object.keys(builds) : [fw]) as Framework[];

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['junit', { outputFile: 'test-results/e2e-junit.xml' }]] : 'list',
  projects: frameworks.flatMap((f) => {
    const baseURL = `http://localhost:${builds[f].port}`;
    return [
      { name: `${f}-chromium`, use: { ...devices['Desktop Chrome'], baseURL } },
      { name: `${f}-webkit`, use: { ...devices['Desktop Safari'], baseURL } },
    ];
  }),
  webServer: frameworks.map((f) => ({
    command: `vite preview --outDir ${builds[f].dir} --port ${builds[f].port} --strictPort`,
    port: builds[f].port,
    reuseExistingServer: !process.env.CI,
  })),
});
