// Play functions for the Button stories, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect, userEvent, waitFor } from 'storybook/test';

// WCAG relative luminance and contrast of computed `rgb()` colours.
const rgb = (css: string) => (css.match(/rgba?\(([^)]*)\)/)?.[1] ?? '').split(/[\s,/]+/).filter(Boolean).slice(0, 3).map(Number);
const lum = (css: string) => {
  const [r, g, b] = rgb(css).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [lo, hi] = [lum(a), lum(b)].sort((x, y) => x - y);
  return (hi + 0.05) / (lo + 0.05);
};

/** Tabs to each surface's button and checks one of its two focus rings reaches 3:1 against the surface. */
async function checkRings(canvasElement: HTMLElement, outline: string) {
  const buttons = [...canvasElement.querySelectorAll<HTMLButtonElement>('section button')];
  await expect(buttons).toHaveLength(4);
  // The story's Page shell puts its skip link first in the tab order.
  await userEvent.tab();
  await expect(canvasElement.ownerDocument.querySelector('.ilw-skip-link')).toHaveFocus();
  for (const button of buttons) {
    await userEvent.tab();
    await expect(button).toHaveFocus();
    const style = getComputedStyle(button);
    const surface = getComputedStyle(button.closest('section')!).backgroundColor;
    await expect(style.outlineStyle).toBe('solid');
    await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2);
    // Proves which mode's focus colours are in play.
    await expect(style.outlineColor).toBe(outline);
    const ring = Math.max(contrast(style.outlineColor, surface), contrast(style.boxShadow, surface));
    await expect(ring, `focus ring on ${button.textContent}`).toBeGreaterThanOrEqual(3);
  }
}

/** Button → Contract: both forms, enabled and disabled, and that disabled controls don't run their handlers. */
export async function contract({ canvas, userEvent }: PlayFunctionContext<WebRenderer>) {
  const link = canvas.getByRole('link', { name: 'Link button' });
  await expect(link.tagName).toBe('A');
  await expect(link).toHaveClass('ilw-button');
  await expect(link).toHaveAttribute('href', '#button-demo-target');

  const button = canvas.getByRole('button', { name: 'Plain button' });
  await expect(button).toHaveAttribute('type', 'button');
  await expect(button).toHaveClass('ilw-button');
  await userEvent.click(button);
  await waitFor(() => expect(canvas.getByTestId('pressed')).toHaveTextContent('1'));

  const off = canvas.getByRole('button', { name: 'Disabled button' });
  await expect(off).toBeDisabled();
  await expect(off).not.toHaveAttribute('aria-disabled');

  const offLink = canvas.getByRole('link', { name: 'Disabled link' });
  await expect(offLink).not.toHaveAttribute('href');
  await expect(offLink).toHaveAttribute('aria-disabled', 'true');
  await expect(offLink).not.toHaveAttribute('tabindex');

  await userEvent.click(off);
  await userEvent.click(offLink);
  await expect(canvas.getByTestId('disabled-pressed')).toHaveTextContent('0');
}

/** Button → Sizes And Themes: the props as classes. */
export async function sizesAndThemes({ canvas }: PlayFunctionContext<WebRenderer>) {
  await expect(canvas.getByRole('link', { name: 'Small' })).toHaveClass('ilw-button', 'ilw-button-small');
  const medium = canvas.getByRole('button', { name: 'Solid' });
  await expect(medium.className).toBe('ilw-button ilw-theme-blue-solid');
  await expect(canvas.getByRole('button', { name: 'Large' })).toHaveClass('ilw-button', 'ilw-button-large', 'ilw-theme-orange');
}

/** Button → Focus Rings: light mode's focus colours. */
export const focusRings = ({ canvasElement }: PlayFunctionContext<WebRenderer>) => checkRings(canvasElement, 'rgb(19, 41, 75)');

/** Button → Focus Rings Dark: dark mode swaps the focus colours. */
export const focusRingsDark = ({ canvasElement }: PlayFunctionContext<WebRenderer>) => checkRings(canvasElement, 'rgb(255, 255, 255)');
