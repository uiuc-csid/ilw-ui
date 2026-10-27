import { CalendarIcon } from '@phosphor-icons/react/dist/ssr/Calendar';
import { EnvelopeIcon } from '@phosphor-icons/react/dist/ssr/Envelope';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '../../../src/react/index.ts';
import * as plays from '../../plays/icon.ts';
import { toolkitIcons } from './icons.ts';

import '../../parity/Icon.parity.stories.css';

// The React twin of stories/parity/Icon.parity.stories.svelte: its IlwUi side.
// No autodocs, as there.
const meta = { title: 'Parity/Icon' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Icon` with the Phosphor icon that replaces each toolkit name, solid (fill) then line (regular), then a labelled icon and an `.ilw-icon-row`, styled by ilw-ui's `styles.css` only, inside the `.ilw-format` shell as on the toolkit side.
 *
 * **Why:** the play function checks the contract: decorative icons are hidden from assistive technology, a labelled one is an image with that name, the size follows the font or the `size` prop, the colour is the text's, and the text is in the brand font. axe checks the rest. The grid is the migration table: each toolkit name with its replacement.
 *
 * **Review:** matches **Toolkit** in size, weight and colour, icon by icon; the glyphs differ (Phosphor draws them, not the brand). The social logos and campus-specific names (Bluesky, Substack, Weibo, Yelp, Flickr, admissions, donor, …) are the nearest Phosphor idea.
 */
export const IlwUi: Story = {
  name: 'IlwUi',
  parameters: { styles: 'ilw-ui' },
  render: () => (
    <>
      <ul className="icon-grid">
        {toolkitIcons.map(([name, icon]) => (
          <li key={name}>
            <Icon icon={icon} />
            <Icon icon={icon} type="line" /> {name}
          </li>
        ))}
      </ul>
      <p>
        Next session: <Icon icon={CalendarIcon} alt="Calendar" size="2rem" />
      </p>
      <div className="ilw-icon-row">
        <Icon icon={EnvelopeIcon} size="18px" />
        <p>Email the department office.</p>
      </div>
    </>
  ),
  play: plays.parity,
};
