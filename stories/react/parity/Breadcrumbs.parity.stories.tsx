import type { Meta, StoryObj } from '@storybook/react-vite';

import { Breadcrumbs } from '../../../src/react/Breadcrumbs.tsx';
import * as plays from '../../plays/breadcrumbs.ts';

// The React twin of stories/parity/Breadcrumbs.parity.stories.svelte: its IlwUi
// side. No autodocs, as there.
const meta = { title: 'Parity/Breadcrumbs' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const trail = [
  { label: 'Home', href: '#home' },
  { label: 'Academics', href: '#academics' },
  { label: 'Undergraduate programs', href: '#undergraduate' },
];

/**
 * `Breadcrumbs`, default and with the blue theme class, styled by ilw-ui's `breadcrumbs.css` only.
 *
 * **Why:** the play function checks the contract: a named nav, an ordered list, the current page unlinked with `aria-current="page"`, and separators that screen readers skip.
 *
 * **Review:** matches **Toolkit**: small links separated by `>` (Altgeld; orange on blue). Tab to a link: it gets the focus colours and a bottom border.
 */
export const IlwUi: Story = {
  name: 'IlwUi',
  parameters: { styles: 'ilw-ui' },
  render: () => (
    <>
      <Breadcrumbs items={trail} current="Degree programs" />
      <Breadcrumbs items={trail} current="Degree programs" label="Breadcrumbs, blue" className="ilw-theme-blue-1" />
    </>
  ),
  play: plays.parity,
};
