import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pagination } from '../../../src/react/Pagination.tsx';
import * as plays from '../../plays/pagination.ts';

// The React twin of stories/parity/Pagination.parity.stories.svelte: its IlwUi
// side. No autodocs, as there.
const meta = { title: 'Parity/Pagination' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const url = 'https://example.edu/courses?term=fa26';

/**
 * `Pagination` on page 6 of 12, then page 1 of 4, styled by ilw-ui's `pagination.css` only.
 *
 * **Why:** the play function checks the contract: a named nav, a list of links with the current page marked `aria-current="page"`, named Previous and Next links, Previous as plain text on the first page, links that keep the rest of the query, and "Page x of y" after the list.
 *
 * **Review:** matches **Toolkit**: outlined page links, the current one filled, Previous and Next as text, the count after a gap. Tab to a link: it fills with the focus colour inside a two-tone ring.
 */
export const IlwUi: Story = {
  name: 'IlwUi',
  parameters: { styles: 'ilw-ui' },
  render: () => (
    <>
      <Pagination page={6} pages={12} url={url} />
      <Pagination page={1} pages={4} url={url} label="Pages, first" />
    </>
  ),
  play: plays.parity,
};
