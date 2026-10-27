import type { Meta, StoryObj } from '@storybook/react-vite';

import { Page } from '../../../src/react/Page.tsx';
import * as plays from '../../plays/page.ts';

// The React twin of stories/parity/Page.parity.stories.svelte: its IlwUi side.
// No autodocs, as there. Both sides are whole pages, so neither gets the
// Storybook page wrapper.
const meta = {
  title: 'Parity/Page',
  parameters: { shell: false },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Content() {
  return (
    <>
      <h1>Douglas Adams</h1>
      <p>
        Douglas Adams was an English author, best known for <em>The Hitchhiker&apos;s Guide to the Galaxy</em>. Read more on{' '}
        <a href="#wikipedia">Wikipedia</a>.
      </p>
    </>
  );
}

/**
 * The `Page` shell with the same content, styled by ilw-ui's `page.css` only.
 *
 * **Why:** proves the shell's contract: the skip link is the first focusable element, it targets `main`, and there is one each of the banner, main and content-info landmarks.
 *
 * **Review:** looks like **Toolkit**, with the theme's link colours. Press Tab once: "Skip to main content" appears at the top left; Enter moves focus into the content (the next Tab reaches the Wikipedia link).
 */
export const IlwUi: Story = {
  name: 'IlwUi',
  parameters: { styles: 'ilw-ui' },
  render: () => (
    <Page
      format
      header={
        <header>
          <p style={{ margin: 0 }}>Header</p>
        </header>
      }
      footer={
        <footer>
          <p style={{ margin: 0 }}>Footer</p>
        </footer>
      }
    >
      <Content />
    </Page>
  ),
  play: plays.parity,
};
