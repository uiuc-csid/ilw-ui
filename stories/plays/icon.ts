// Play functions for the Icon stories, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect } from 'storybook/test';

import { toolkitIconNames } from '../parity/toolkit-icons.ts';

/** Parity/Icon → IlwUi: the contract, the size and colour from the text, and the brand font. */
export async function parity({ canvas, canvasElement }: PlayFunctionContext<WebRenderer>) {
  const icons = canvasElement.querySelectorAll<SVGSVGElement>('.icon-grid svg');
  await expect(icons).toHaveLength(toolkitIconNames.length * 2);
  for (const svg of icons) {
    await expect(svg).toHaveClass('ilw-icon');
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg).not.toHaveAttribute('role');
  }
  const li = canvasElement.querySelector('.icon-grid li')!;
  // The text is in the brand font, as on the toolkit side, and it has loaded.
  await expect(getComputedStyle(li).fontFamily).toMatch(/^"?Source Sans/);
  await document.fonts.ready;
  await expect(document.fonts.check('1rem "Source Sans"')).toBe(true);
  // 1em: the icon follows the text's size and colour, as a font glyph does.
  await expect(icons[0].getBoundingClientRect().height).toBeCloseTo(parseFloat(getComputedStyle(li).fontSize), 0);
  await expect(getComputedStyle(icons[0]).fill).toBe(getComputedStyle(li).color);
  // A labelled icon is an image with that name, at the size asked for.
  const labelled = canvas.getByRole('img', { name: 'Calendar' });
  await expect(labelled).toHaveAttribute('width', '2rem');
  const row = canvasElement.querySelector<HTMLElement>('.ilw-icon-row')!;
  await expect(getComputedStyle(row).display).toBe('flex');
  await expect(getComputedStyle(row).columnGap).toBe('18px');
}
