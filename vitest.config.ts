import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.ts';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            include: ['tests/unit/**/*.test.ts'],
          },
        },
        {
          extends: true,
          plugins: [storybookTest({ configDir: `${dirname}.storybook` })],
          test: {
            name: 'storybook-svelte',
            // Writes or checks each story's DOM contract, stories/contracts/<story-id>.html.
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
        },
      ],
    },
  }),
);
