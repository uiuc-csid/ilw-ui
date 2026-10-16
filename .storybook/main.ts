import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  framework: '@storybook/svelte-vite',
  core: { disableTelemetry: true },
  stories: ['../stories/**/*.stories.svelte'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    // MCP server for coding agents at http://localhost:6006/mcp (see .mcp.json).
    '@storybook/addon-mcp',
  ],
  // The toolkit is served locally: its CDN CAPTCHA-blocks automated browsers.
  staticDirs: [{ from: '../vendor/illinois-toolkit', to: '/toolkit' }],
};

export default config;
