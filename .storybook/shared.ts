// Preview annotations with no framework code, shared by every Storybook's
// preview (.storybook/preview.ts here): the theme global, the per-story
// stylesheets and the axe level. Each preview adds its own shell decorator.

import type { ProjectAnnotations, WebRenderer } from 'storybook/internal/types';

import { applyStyles, applyTheme, type StylesMode, type ThemeGlobal } from './styles.ts';

export const shared = {
  // Stylesheets go in before the story renders, so play functions and specs see it styled.
  loaders: [({ parameters }) => applyStyles(parameters.styles as StylesMode | undefined)],
  decorators: [
    (Story, { globals }) => {
      applyTheme(globals.theme as ThemeGlobal | undefined);
      return Story();
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
} satisfies ProjectAnnotations<WebRenderer>;
