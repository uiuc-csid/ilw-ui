import type { Preview } from '@storybook/react-vite';
import { StrictMode } from 'react';

import { shared } from '../.storybook/shared.ts';
import { Page } from '../src/react/Page.tsx';

// The React twin of .storybook/preview.ts. Everything renders inside <StrictMode>,
// so development runs (the storybook-react Vitest project) mount, unmount and
// mount every effect, as a React app in development does.
const preview: Preview = {
  ...shared,
  decorators: [
    // The page shell, inside the shared theme decorator.
    (Story, { parameters }) => {
      // `shell: false`: the story renders a whole page (its own shell and landmarks).
      if (parameters.shell === false) {
        return (
          <StrictMode>
            <Story />
          </StrictMode>
        );
      }
      // The toolkit shell, as .storybook/IlwPage.svelte. React twins all set `styles: 'ilw-ui'`.
      if (parameters.styles !== 'ilw-ui') {
        return (
          <StrictMode>
            <ilw-page class="ilw-format">
              <main>
                <Story />
              </main>
            </ilw-page>
          </StrictMode>
        );
      }
      // `format: false`: the ilw-ui shell without .ilw-format, to catch a component that needs it for its font.
      return (
        <StrictMode>
          <Page format={parameters.format !== false}>
            <Story />
          </Page>
        </StrictMode>
      );
    },
    ...shared.decorators,
  ],
};

export default preview;
