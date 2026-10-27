import type { Meta, StoryObj } from '@storybook/react-vite';

import { SectionNav } from '../../../src/react/SectionNav.tsx';
import * as plays from '../../plays/section-nav.ts';
import { programs } from '../../section-nav-data.ts';

// The React twin of stories/parity/SectionNav.parity.stories.svelte: its IlwUi
// side. No autodocs, as there.
const meta = { title: 'Parity/SectionNav' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `SectionNav` with the same tree and every branch open (`expanded`), styled by ilw-ui's `section-nav.css` only.
 *
 * **Why:** the play function checks the computed look against upstream's values: item height and indent per level, the root link's size and plate, and the current page's colour and triangle.
 *
 * **Review:** matches **Toolkit**, plus a chevron toggle at the right of each branch.
 */
export const IlwUi: Story = {
  name: 'IlwUi',
  parameters: { styles: 'ilw-ui' },
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <SectionNav items={programs} expanded />
    </div>
  ),
  play: plays.parity,
};
