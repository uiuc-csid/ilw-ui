import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../src/react/index.ts';
import * as plays from '../plays/button.ts';
import { ButtonDemo } from './ButtonDemo.tsx';
import { ButtonSurfaces } from './ButtonSurfaces.tsx';

// The React twin of stories/Button.stories.svelte.
const meta = {
  title: 'Button',
  // ilw-ui's styles only: button.css replaces the toolkit's button rules.
  parameters: { styles: 'ilw-ui' },
  // The Docs page lists every story with its review notes (the comment above it).
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Has no `play` function: the fixture `tests/e2e/button.spec.ts` drives with the keyboard.
 *
 * **Why:** a link and a button, each enabled and disabled, between two native buttons, so the spec can see what Tab reaches and what Enter and Space do.
 *
 * **Review:** Tab goes Before, Link button, Plain button, After: both disabled controls are skipped. Enter on the link moves focus to its target below (`#button-demo-target`, `tabindex="-1"`); Enter or Space on Plain button counts up; clicking a disabled one does nothing.
 */
export const Fixture: Story = { name: 'Fixture', render: () => <ButtonDemo /> };

/**
 * The DOM contract, checked in the DOM.
 *
 * **Why:** ta-manager and server templates rely on this markup: `<a class="ilw-button">` with an `href`, `<button type="button" class="ilw-button">`; a disabled button uses `disabled` (never `aria-disabled`), a disabled link loses its `href` and gets `role="link"` and `aria-disabled="true"`.
 *
 * **Review:** same as Fixture; the test also clicks both disabled controls and checks neither handler runs.
 */
export const Contract: Story = { name: 'Contract', render: () => <ButtonDemo />, play: plays.contract };

/**
 * The `size` and `theme` props, as classes.
 *
 * **Why:** `size` maps to `.ilw-button-small` / `-large` (medium adds nothing) and `theme` to the toolkit's `.ilw-theme-*` class on the element itself.
 *
 * **Review:** a small blue outline link, a medium solid blue button and a large orange outline button.
 */
export const SizesAndThemes: Story = {
  name: 'Sizes And Themes',
  render: () => (
    <p>
      <Button href="#small" size="small">
        Small
      </Button>{' '}
      <Button theme="blue-solid">Solid</Button>{' '}
      <Button size="large" theme="orange">
        Large
      </Button>
    </p>
  ),
  play: plays.sizesAndThemes,
};

/**
 * A button on every flat theme surface, focused in turn (light mode).
 *
 * **Why:** WCAG 1.4.11: the focus ring must stand out from what's around it by 3:1. The ring is two lines, `--ilw-color--focus--background` then `--ilw-color--focus--text`; the test tabs to each button and checks one of them clears 3:1 against its surface.
 *
 * **Review:** Tab through: each button shows a light ring inside a dark line.
 */
export const FocusRings: Story = { name: 'Focus Rings', render: () => <ButtonSurfaces />, play: plays.focusRings };

/**
 * The same, in dark mode.
 *
 * **Why:** dark mode swaps the focus colours (white on Blue 30), so the check runs again.
 *
 * **Review:** Tab through: each button shows a dark ring inside a white line.
 */
export const FocusRingsDark: Story = {
  name: 'Focus Rings Dark',
  globals: { theme: 'dark' },
  render: () => <ButtonSurfaces />,
  play: plays.focusRingsDark,
};
