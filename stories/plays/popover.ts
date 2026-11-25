// Play functions for the popover stories, shared by the Svelte and React twins.

import type { StoryContext, WebRenderer } from 'storybook/internal/types';
import { expect, userEvent, waitFor } from 'storybook/test';

import type { PopoverPlacement } from '../../src/core/popover.ts';

export const PLACEMENTS: PopoverPlacement[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

/** The panel a button's `popovertarget` names. */
export function panelOf(button: Element): HTMLElement {
  return document.getElementById(button.getAttribute('popovertarget')!)!;
}

const isOpen = (panel: Element) => panel.matches(':popover-open');

/** Checks the panel sits 4px off the button's `placement` side, aligned as named. */
async function expectPlaced(button: Element, panel: Element, placement: PopoverPlacement) {
  const t = button.getBoundingClientRect();
  const b = panel.getBoundingClientRect();
  const [side, align] = placement.split('-');
  const near = (actual: number, expected: number, what: string) =>
    expect(Math.abs(actual - expected), `${placement}: ${what} (${actual} vs ${expected})`).toBeLessThanOrEqual(1);
  if (side === 'top') await near(b.bottom, t.top - 4, 'gap above');
  else await near(b.top, t.bottom + 4, 'gap below');
  if (align === 'left') await near(b.left, t.left, 'left edge');
  else if (align === 'right') await near(b.right, t.right, 'right edge');
  else await near(b.left + b.width / 2, t.left + t.width / 2, 'centre');
}

/** Overlays/Popover → Open: the contract, the placement and the look of the open filters panel. */
export async function open({ canvas }: StoryContext<WebRenderer>) {
  const button = canvas.getByRole('button', { name: 'Filters' });
  const panel = panelOf(button);
  await expect(button).toHaveAttribute('type', 'button');
  await expect(button).toHaveClass('ilw-button');
  await expect(panel).toHaveClass('ilw-popover-panel');
  await expect(panel).toHaveAttribute('popover', '');
  await expect(panel.parentElement).toHaveClass('ilw-popover', 'ilw-popover--bottom-left');
  await expect(panel.parentElement!.firstElementChild).toBe(button);
  await expect(panel.parentElement!.lastElementChild).toBe(panel);
  await waitFor(() => expect(isOpen(panel)).toBe(true));
  await expect(canvas.getByTestId('filters-state')).toHaveTextContent('open');
  // Opening never moves focus (the APG disclosure pattern).
  await expect(panel).not.toContainElement(document.activeElement as HTMLElement | null);

  await document.fonts.ready;
  await expectPlaced(button, panel, 'bottom-left');
  const style = getComputedStyle(panel);
  await expect(style.backgroundColor).toBe('rgb(255, 255, 255)');
  await expect(style.color).toBe('rgb(37, 37, 37)');
  await expect([style.borderTopWidth, style.borderTopStyle, style.borderTopColor]).toEqual([
    '1px',
    'solid',
    'rgb(198, 199, 198)',
  ]);
  await expect([style.paddingTop, style.paddingLeft, style.borderTopLeftRadius]).toEqual(['16px', '16px', '8px']);
  await expect(panel.getBoundingClientRect().width).toBeLessThanOrEqual(320);
}

/**
 * Overlays/Popover → Toggle: the button and Done close it, and one opens at a time. Escape and a
 * click outside are the keyboard spec's: user-event's synthetic events don't reach the browser's
 * light dismiss.
 */
export async function toggle({ canvas }: StoryContext<WebRenderer>) {
  const button = canvas.getByRole('button', { name: 'Filters' });
  const panel = panelOf(button);
  const state = canvas.getByTestId('filters-state');
  const help = canvas.getByRole('button', { name: 'About office hours' });
  const helpPanel = panelOf(help);
  await expect(isOpen(panel)).toBe(false);
  await expect(panel).not.toBeVisible();
  await expect(state).toHaveTextContent('closed');

  // Enter on the button opens it, and focus stays on the button; Enter again closes it. (By
  // keyboard: WebKit doesn't focus a button on click.)
  button.focus();
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(isOpen(panel)).toBe(true));
  await expect(state).toHaveTextContent('open');
  await expect(button).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(isOpen(panel)).toBe(false));
  await expect(state).toHaveTextContent('closed');

  // Focus inside is kept: a checkbox toggles and the panel stays open.
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(isOpen(panel)).toBe(true));
  const graders = canvas.getByLabelText('Graders');
  graders.focus();
  await userEvent.keyboard(' ');
  await expect(graders).not.toBeChecked();
  await expect(isOpen(panel)).toBe(true);

  // Done closes it, and focus returns to the button.
  canvas.getByRole('button', { name: 'Done' }).focus();
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(isOpen(panel)).toBe(false));
  await expect(button).toHaveFocus();

  // Opening another popover closes this one.
  await userEvent.click(button);
  await waitFor(() => expect(isOpen(panel)).toBe(true));
  await userEvent.click(help);
  await waitFor(() => expect(isOpen(helpPanel)).toBe(true));
  await expect(isOpen(panel)).toBe(false);
  await expect(state).toHaveTextContent('closed');
  await expect(canvas.getByRole('link', { name: 'the staffing policy' })).toBeVisible();
  await userEvent.click(help);
  await waitFor(() => expect(isOpen(helpPanel)).toBe(false));
}

/** Overlays/Popover → Phone: at 375 px wide the open panel is placed as on a laptop, inside the viewport. */
export async function phone({ canvas }: StoryContext<WebRenderer>) {
  const button = canvas.getByRole('button', { name: 'Filters' });
  const panel = panelOf(button);
  const width = document.documentElement.clientWidth;
  await expect(width).toBeLessThanOrEqual(375);
  await waitFor(() => expect(isOpen(panel)).toBe(true));
  await document.fonts.ready;
  await expectPlaced(button, panel, 'bottom-left');
  const b = panel.getBoundingClientRect();
  await expect(b.left).toBeGreaterThanOrEqual(0);
  await expect(b.right).toBeLessThanOrEqual(width);
  // popover.css caps it at the viewport less 16 px.
  await expect(b.width).toBeLessThanOrEqual(width - 16);
}

/** Overlays/Popover → Placements: each panel opens where its `placement` says. */
export async function placements({ canvas }: StoryContext<WebRenderer>) {
  await document.fonts.ready;
  for (const placement of PLACEMENTS) {
    const button = canvas.getByRole('button', { name: placement });
    const panel = panelOf(button);
    await expect(panel.parentElement).toHaveClass(`ilw-popover--${placement}`);
    await userEvent.click(button);
    await waitFor(() => expect(isOpen(panel)).toBe(true));
    await expectPlaced(button, panel, placement);
    await userEvent.click(button);
    await waitFor(() => expect(isOpen(panel)).toBe(false));
  }
}
