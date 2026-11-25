import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popover } from '../../src/react/Popover.tsx';
import * as plays from '../plays/popover.ts';
import { args, argTypes, viewport } from '../popover-controls.ts';
import { PopoverDemo } from './PopoverDemo.tsx';

import '../Popover.stories.css';

// The React twin of stories/Popover.stories.svelte. The demo page is the
// component, so the controls (`label`, `placement`) drive its filters popover;
// Placements renders its own Popovers and has no controls. The viewport toolbar
// offers a phone, a tablet and a laptop.
const meta = {
  title: 'Overlays/Popover',
  component: PopoverDemo,
  args,
  argTypes,
  parameters: { styles: 'ilw-ui', viewport },
} satisfies Meta<typeof PopoverDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The course staff page: a "Filters" popover of checkboxes with a Done button, and a "?" help popover beside a field. No play function: the keyboard spec (`tests/e2e/popover.spec.ts`) drives this one from a fresh load.
 *
 * **Why:** the fixture for the keyboard and focus checks: Enter opens with focus on the button, Tab enters the panel, Escape and Done close it with focus back on the button, and focus leaving closes it.
 *
 * **Review:** Tab to Filters and press Enter: the panel opens under it and focus stays on the button. Tab into the checkboxes, then press Escape: it closes and focus is back on Filters. Open it again and click the heading: it closes. Tab past Done: it closes as focus moves on. Click "?": the filters panel closes and the help opens.
 */
export const Fixture: Story = { name: 'Fixture' };

/**
 * The same page with the filters panel open from the start.
 *
 * **Why:** the open state, for axe (the panel's contrast, the checkboxes' names). The play function checks the contract: the button's `popovertarget` names a `div.ilw-popover-panel[popover]`, the last child of `span.ilw-popover.ilw-popover--bottom-left`, whose first child is the button; the bound state is open, focus didn't move, and the panel is 4 px under the button, left edges aligned, at most 20rem wide, in the page's colours with a light border, 1rem padding and 0.5rem radius.
 *
 * **Review:** a white panel with a thin grey border and a soft shadow, just under Filters, holding three checkboxes and Done. Switch to dark: it turns dark. Change `placement` in the controls: the panel moves.
 */
export const Open: Story = { name: 'Open', args: { open: true }, play: plays.open };

/**
 * The same page at phone width (375 × 667), with the filters panel open.
 *
 * **Why:** the panel on a small screen: its width is capped at the viewport less 16 px, and it stays under its button. The play function checks the viewport is phone-sized, then that the panel is 4 px under the button, left edges aligned, inside the viewport and no wider than it less 16 px. axe scans the open state at this width.
 *
 * **Review:** the panel fits on the screen under Filters. Try the other placements from the controls, and the Tablet and Laptop viewports from the toolbar.
 */
export const Phone: Story = {
  name: 'Phone',
  args: { open: true },
  globals: { viewport: { value: 'phone', isRotated: false } },
  play: plays.phone,
};

/**
 * The course staff page; the play function opens and closes the popovers from their buttons.
 *
 * **Why:** the behaviour under user events, and the bound `open`: Enter on the button opens it and Enter closes it, focus staying on the button; a checkbox inside toggles with the panel left open; Done (`popovertargetaction="hide"`) closes it and returns focus; opening the help popover closes the filters one (one auto popover at a time). Escape, a click outside and Tab are the keyboard spec's, with real input: user-event's synthetic events don't reach the browser's light dismiss.
 *
 * **Review:** as **Fixture**.
 */
export const Toggle: Story = { name: 'Toggle', play: plays.toggle };

/**
 * A grid of buttons, one per `placement` value, each opening a short panel.
 *
 * **Why:** the placement table. The play function clicks each button and checks its panel is 4 px off the named side and aligned as named (left edges, centres or right edges), placed by anchor positioning where supported. The keyboard spec checks the script fallback.
 *
 * **Review:** click each button: its panel opens on the side and at the edge its name gives.
 */
export const Placements: Story = {
  name: 'Placements',
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <h1>Placements</h1>
      <p>Each button&apos;s panel opens on the side and at the edge its name gives.</p>
      <div className="popover-placements">
        {plays.PLACEMENTS.map((placement) => (
          <Popover key={placement} placement={placement} label={placement}>
            <p>A short panel, placed {placement}.</p>
          </Popover>
        ))}
      </div>
    </>
  ),
  play: plays.placements,
};
