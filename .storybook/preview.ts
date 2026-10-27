import type { Preview } from '@storybook/svelte-vite';

import IlwPage from './IlwPage.svelte';
import IlwUiPage from './IlwUiPage.svelte';
import { shared } from './shared.ts';

const preview: Preview = {
  ...shared,
  decorators: [
    // The page shell, inside the shared theme decorator.
    (Story, { parameters }) => {
      // `shell: false`: the story renders a whole page (its own shell and landmarks).
      if (parameters.shell === false) return Story();
      if (parameters.styles !== 'ilw-ui') return { Component: IlwPage };
      // `format: false`: the ilw-ui shell without .ilw-format, to catch a component that needs it for its font.
      return { Component: IlwUiPage, props: { format: parameters.format !== false } };
    },
    ...shared.decorators,
  ],
};

export default preview;
