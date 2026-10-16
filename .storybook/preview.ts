import type { Preview } from '@storybook/svelte-vite';

import '../src/styles.css';
import IlwPage from './IlwPage.svelte';

const preview: Preview = {
  decorators: [() => ({ Component: IlwPage })],
  parameters: {
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
