// Play functions for the breadcrumbs stories, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect } from 'storybook/test';

/** Parity/Breadcrumbs → IlwUi: the contract, the separators and the blue theme. */
export async function parity({ canvas }: PlayFunctionContext<WebRenderer>) {
  const nav = canvas.getByRole('navigation', { name: 'Breadcrumbs' });
  const items = nav.querySelectorAll(':scope > ol > li');
  await expect(items).toHaveLength(4);
  const current = items[3].firstElementChild!;
  await expect(current.tagName).toBe('SPAN');
  await expect(current).toHaveAttribute('aria-current', 'page');
  await expect(current).toHaveTextContent('Degree programs');
  // The separator is generated text with empty alternative text.
  const sep = getComputedStyle(items[1], '::before').content;
  await expect(sep).toContain('>');
  await expect(getComputedStyle(items[0], '::before').content).toBe('none');
  // The blue theme turns the separator orange.
  const blue = canvas.getByRole('navigation', { name: 'Breadcrumbs, blue' });
  await expect(getComputedStyle(blue.querySelectorAll('li')[1], '::before').color).toBe('rgb(255, 95, 5)');
  await expect(getComputedStyle(items[1], '::before').color).toBe('rgb(200, 65, 19)');
}
