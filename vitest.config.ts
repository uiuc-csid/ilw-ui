import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig, type TestProjectInlineConfiguration } from 'vitest/config';

import viteConfig from './vite.config.ts';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/** One Storybook's stories as browser tests: play functions, axe, and each story's DOM contract. */
function storybookProject(framework: 'svelte' | 'react', configDir: string, port: number): TestProjectInlineConfiguration {
  return {
    extends: true,
    // storybookUrl: where a failure's "debug it in Storybook" link points (`pnpm storybook`, `pnpm storybook:react`).
    plugins: [storybookTest({ configDir: `${dirname}${configDir}`, storybookUrl: `http://localhost:${port}` })],
    test: {
      name: `storybook-${framework}`,
      // Writes or checks each story's DOM contract, stories/contracts/<story-id>.html.
      // Both frameworks' twins compare against the same file.
      setupFiles: ['tests/contracts/setup.ts'],
      provide: { contractsDir: `${dirname}stories/contracts` },
      // The contract files are written through the browser server's API, which
      // @storybook/addon-vitest makes read-only unless this says otherwise. It
      // listens on localhost only.
      api: { allowWrite: true },
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }, { browser: 'webkit' }],
      },
    },
  };
}

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          // The JSX transform, for tests/unit/react-ssr.test.ts.
          plugins: [react()],
          test: {
            name: 'unit',
            environment: 'node',
            include: ['tests/unit/**/*.test.ts'],
          },
        },
        storybookProject('svelte', '.storybook', 6006),
        storybookProject('react', '.storybook-react', 6008),
      ],
    },
  }),
);
