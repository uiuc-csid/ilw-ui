// Play functions for the section nav stories, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect } from 'storybook/test';

/** Page Chrome/Section nav → Open: the contract, with every disclosure open. */
export async function open({ canvas, canvasElement }: PlayFunctionContext<WebRenderer>) {
  const nav = canvas.getByRole('navigation', { name: 'Pages In This Section' });
  await expect(nav).toHaveClass('ilw-section-nav');
  const collapse = nav.querySelector(':scope > details.ilw-section-nav-collapse')!;
  await expect(collapse).toHaveAttribute('open');
  await expect(nav.getAttribute('aria-labelledby')).toBe(collapse.querySelector(':scope > summary')!.id);

  const top = collapse.querySelectorAll(':scope > ul > li');
  await expect(top).toHaveLength(3);
  await expect(top[0].firstElementChild).toHaveClass('ilw-section-nav--root');

  // A branch: the link, then a sibling details whose summary holds only the toggle's name and an icon.
  const branch = top[1];
  await expect(branch).toHaveClass('ilw-section-nav-branch');
  await expect([...branch.children].map((el) => el.tagName)).toEqual(['A', 'DETAILS']);
  const summary = branch.querySelector(':scope > details > summary')!;
  await expect(summary.querySelector('a, button, input')).toBeNull();
  await expect(summary).toHaveAccessibleName('Subpages of Undergraduate Degrees');
  await expect(summary.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

  // The current page, and every branch open (expanded).
  const current = canvas.getByRole('link', { name: 'Pre-Veterinary and Medical' });
  await expect(current).toHaveAttribute('aria-current', 'page');
  await expect(canvasElement.querySelectorAll('[aria-current]')).toHaveLength(1);
  await expect(canvasElement.querySelectorAll('.ilw-section-nav-branch > details:not([open])')).toHaveLength(0);
}

/** Page Chrome/Section nav → Current branch: only the current page's ancestors start open. */
export async function currentBranch({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const open = [...canvasElement.querySelectorAll('.ilw-section-nav-branch > details[open]')];
  await expect(open.map((d) => d.parentElement!.firstElementChild!.textContent)).toEqual([
    'Undergraduate Degrees',
    'Animal Sciences Major',
  ]);
  const closed = canvasElement.querySelector('.ilw-section-nav-branch > details:not([open])')!;
  await expect(closed.parentElement!.firstElementChild).toHaveTextContent('Computer & Animal Science');
  // A closed branch's children are not rendered.
  await expect(closed.querySelector('a')).not.toBeVisible();
}

/** Parity/SectionNav → IlwUi: the computed look against upstream's values. */
export async function parity({ canvas }: PlayFunctionContext<WebRenderer>) {
  const root = canvas.getByRole('link', { name: 'Programs of Study' });
  await expect(getComputedStyle(root).fontSize).toBe('20px');
  await expect(getComputedStyle(root).fontWeight).toBe('700');
  // Indent: 1.25rem, + 0.9375rem at level 1, + 1.5625rem more at level 2.
  const pad = (name: string) => getComputedStyle(canvas.getByRole('link', { name })).paddingLeft;
  await expect(pad('Undergraduate Degrees')).toBe('20px');
  await expect(pad('Animal Sciences Major')).toBe('35px');
  await expect(pad('Pre-Veterinary and Medical')).toBe('60px');
  await expect(canvas.getByRole('link', { name: 'Undergraduate Degrees' }).getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  const current = canvas.getByRole('link', { name: 'Pre-Veterinary and Medical' });
  await expect(getComputedStyle(current).color).toBe('rgb(200, 65, 19)');
  await expect(getComputedStyle(current, '::before').borderLeftWidth).not.toBe('0px');
  // Each branch toggle is a 44 × 44 px target.
  const toggle = canvas.getAllByText('Subpages of Undergraduate Degrees')[0].closest('summary')!.getBoundingClientRect();
  await expect([toggle.width, toggle.height]).toEqual([44, 44]);
}
