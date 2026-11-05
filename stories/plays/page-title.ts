// Play functions for the page title stories, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect } from 'storybook/test';

/** Parity/PageTitle → IlwUi: the markup, and each theme's text and plate colours. */
export async function parity({ canvas, canvasElement }: PlayFunctionContext<WebRenderer>) {
  const titles = canvasElement.querySelectorAll<HTMLElement>('.ilw-page-title');
  await expect(titles).toHaveLength(6);
  await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(6);
  const plate = (el: Element) => getComputedStyle(el.querySelector('.ilw-page-title-text')!, '::after');
  const text = (el: Element) => getComputedStyle(el.querySelector('.ilw-page-title-text')!).color;
  // Default and blue: white on Illinois Blue.
  for (const t of [titles[0], titles[1]]) {
    await expect(text(t)).toBe('rgb(255, 255, 255)');
    await expect(plate(t).backgroundColor).toBe('rgb(19, 41, 75)');
  }
  await expect(plate(titles[2]).backgroundColor).toBe('rgb(255, 95, 5)');
  await expect(plate(titles[3]).backgroundColor).toBe('rgb(255, 255, 255)');
  await expect(text(titles[3])).toBe('rgb(19, 41, 75)');
  // The image is decorative; fade makes the plate solid.
  const img = titles[4].querySelector('img')!;
  await expect(img).toHaveAttribute('alt', '');
  await expect(img).toHaveClass('ilw-page-title-background');
  await expect(plate(titles[4]).opacity).toBe('0.85');
  await expect(plate(titles[5]).opacity).toBe('1');
}
