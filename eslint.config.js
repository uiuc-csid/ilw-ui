// ESLint checks the React side only (`pnpm check`): the hooks rules and the
// JSX a11y rules, each on its recommended config. It is the counterpart of the
// a11y warnings svelte-check fails on (docs/plans/2026-10-27-react-components.md,
// "Static checks"). typescript-eslint is only the parser: tsc does the type checks.

import { defineConfig } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['src/react/**/*.{ts,tsx}', 'stories/react/**/*.{ts,tsx}', '.storybook-react/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, jsxA11y.flatConfigs.recommended],
    languageOptions: { parser: tseslint.parser },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
  },
]);
