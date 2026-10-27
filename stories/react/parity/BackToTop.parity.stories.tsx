import type { Meta, StoryObj } from '@storybook/react-vite';

import { BackToTop } from '../../../src/react/BackToTop.tsx';
import * as plays from '../../plays/back-to-top.ts';

// The React twin of stories/parity/BackToTop.parity.stories.svelte: its IlwUi
// side. No autodocs, as there.
const meta = { title: 'Parity/BackToTop' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const paragraphs = Array.from({ length: 60 }, (_, i) => i + 1);

/**
 * `BackToTop`, scrolled to the bottom of the same page, styled by ilw-ui's `back-to-top.css` only.
 *
 * **Why:** the play function checks the look against upstream's: a 48 px circle in the heading colour with a 2 px border, 40 px from the bottom right, and a 36 px arrow.
 *
 * **Review:** matches **Toolkit**. Hover swaps the colours; Tab to it for the focus colours.
 */
export const IlwUi: Story = {
  name: 'IlwUi',
  parameters: { styles: 'ilw-ui' },
  render: () => (
    <>
      {paragraphs.map((n) => (
        <p key={n}>Paragraph {n}, so the page scrolls.</p>
      ))}
      <BackToTop />
    </>
  ),
  play: plays.parity,
};
