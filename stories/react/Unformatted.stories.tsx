import { EnvelopeIcon } from '@phosphor-icons/react/dist/ssr/Envelope';
import type { Meta, StoryObj } from '@storybook/react-vite';

import * as ilw from '../../src/react/index.ts';
import * as plays from '../plays/unformatted.ts';

// The React twin of stories/Unformatted.stories.svelte. The Page shell without
// .ilw-format (`format: false`): a component that leans on the prose styles for
// its font falls back to the browser's serif here.
//
// One group per row of docs/plans/2026-10-27-react-components.md, so ports
// running side by side each add their stories under their own comment. Each
// group takes its components from `ilw`, so no port edits a shared import line.
const meta = {
  title: 'Unformatted',
  parameters: { styles: 'ilw-ui', format: false },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// R1 layout, Button, Icon: Button, Icon

/**
 * `Button`, link and button, outside `.ilw-format`.
 *
 * **Why:** the play function checks the label is in Source Sans without the prose styles.
 *
 * **Review:** the labels look the same as on **Button → Sizes And Themes**.
 */
export const Button: Story = {
  name: 'Button',
  render: () => (
    <p>
      <ilw.Button href="#unformatted">Link button</ilw.Button> <ilw.Button>Plain button</ilw.Button>
    </p>
  ),
  play: plays.button,
};

/**
 * `Icon` in an `.ilw-icon-row` and beside text, outside `.ilw-format`.
 *
 * **Why:** an icon has no text of its own: it is 1em in the text's colour, so it follows whatever font the page sets (here the browser's serif). The play function checks it still sizes and colours itself from that text.
 *
 * **Review:** the envelope sits beside its line, sized to the text.
 */
export const Icon: Story = {
  name: 'Icon',
  render: () => (
    <div className="ilw-icon-row">
      <ilw.Icon icon={EnvelopeIcon} />
      <p>Email the department office.</p>
    </div>
  ),
  play: plays.icon,
};

// R1 page chrome: Breadcrumbs, Pagination, Page Title, Section Nav, Footer

// R2 forms: Field, ChoiceChips

// R3 islands and header: Header

// R5 data: Data Table

// R10 accordion: Accordion

// R11 alert: Alert

// R12 toggle group: Toggle Group
