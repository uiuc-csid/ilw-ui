import type { Meta, StoryObj } from '@storybook/react-vite';

import { BUTTON_VARIANTS } from '../../parity/button-themes.ts';
import { ButtonGrid } from './ButtonGrid.tsx';

// The React twin of stories/parity/Button.parity.stories.svelte: its IlwUi
// side. No autodocs, as there.
const meta = {
  title: 'Parity/Button',
  component: ButtonGrid,
  args: { variant: 'all' },
  argTypes: { variant: { control: 'select', options: BUTTON_VARIANTS } },
} satisfies Meta<typeof ButtonGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The same markup, styled by ilw-ui's `styles.css` only.
 *
 * **Why:** `button.css` claims the toolkit's button classes; this is where they're compared by eye (and by Chromatic against its baseline).
 *
 * **Review:** every row matches **Toolkit** in size, colour, border and type, except the disabled link, which looks like the disabled button. Switch the toolbar to Dark: the outline buttons and the disabled surface turn dark; the filled ones keep their colours.
 */
export const IlwUi: Story = { name: 'IlwUi', parameters: { styles: 'ilw-ui' } };
