// The React Storybook: the twins of the Svelte stories (docs/plans/2026-10-27-react-components.md,
// "A second Storybook"). Same addons, static files and <head> as .storybook/; `pnpm storybook:react`
// serves it on :6008, `pnpm build-storybook:react` builds it into storybook-static-react/.

import { readFileSync } from 'node:fs';

import type { StorybookConfig } from '@storybook/react-vite';
import react from '@vitejs/plugin-react';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  core: { disableTelemetry: true },
  stories: ['../stories/react/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    // MCP server for coding agents at http://localhost:6008/mcp (see .mcp.json).
    '@storybook/addon-mcp',
  ],
  // The toolkit is served locally: its CDN CAPTCHA-blocks automated browsers.
  staticDirs: [{ from: '../vendor/illinois-toolkit', to: '/toolkit' }],
  // The Svelte Storybook's <head>: the brand stylesheet (fonts, --il-* tokens) and toolkit.js.
  previewHead: (head) => `${head}${readFileSync(new URL('../.storybook/preview-head.html', import.meta.url), 'utf8')}`,
  // The framework preset doesn't add the JSX transform and Fast Refresh.
  viteFinal: (vite) => mergeConfig(vite, { plugins: [react()] }),
};

export default config;
