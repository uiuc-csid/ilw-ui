import type { Preview } from '@storybook/svelte-vite';

import IlwPage from './IlwPage.svelte';
import PlainMain from './PlainMain.svelte';
import { applyStyles, applyTheme, type StylesMode, type ThemeGlobal } from './styles.ts';

const preview: Preview = {
  // Stylesheets go in before the story renders, so play functions and specs see it styled.
  loaders: [({ parameters }) => applyStyles(parameters.styles as StylesMode | undefined)],
  decorators: [
    (_, { parameters, globals }) => {
      applyTheme(globals.theme as ThemeGlobal | undefined);
      return { Component: parameters.styles === 'ilw-ui' ? PlainMain : IlwPage };
    },
  ],
  globalTypes: {
    theme: {
      description: 'Colour scheme: sets html[data-theme] like the toolkit header toggle',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System (no data-theme)' },
        ],
      },
    },
  },
  // Light by default: with no data-theme, ilw-ui follows the OS preference,
  // and stories should look the same on every machine.
  initialGlobals: { theme: 'light' },
  parameters: {
    styles: 'both',
    a11y: {
      // Any axe violation fails the story's test.
      test: 'error',
      options: {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      },
    },
  },
};

export default preview;
