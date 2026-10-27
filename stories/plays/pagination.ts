// Play functions for the pagination stories, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect } from 'storybook/test';

/** Pagination → Ends: the first and last pages, and a single page. */
export async function ends({ canvas }: PlayFunctionContext<WebRenderer>) {
  const first = canvas.getByRole('navigation', { name: 'Pages, first' });
  await expect(first.querySelector('.ilw-pagination-previous > span')).toHaveTextContent('Previous');
  await expect(first.querySelector('.ilw-pagination-next > a')).toHaveAttribute('href', '#page-2');

  const last = canvas.getByRole('navigation', { name: 'Pages, last' });
  await expect(last.querySelector('.ilw-pagination-previous > a')).toHaveAttribute('href', '#page-7');
  await expect(last.querySelector('.ilw-pagination-next > span')).toHaveTextContent('Next');
  await expect(last.querySelector('a[aria-current="page"]')).toHaveAccessibleName('Page 8');

  const one = canvas.getByRole('navigation', { name: 'Pages, single' });
  await expect([...one.querySelectorAll('li')].map((li) => li.textContent?.trim())).toEqual(['Previous', '1', 'Next']);
  await expect(one.querySelectorAll('a')).toHaveLength(1);
  await expect(one.querySelector('.ilw-pagination-count')).toHaveTextContent('Page 1 of 1');
}

/** Pagination → Links: `url` and `parameter`, a 0-based `href`, clamping and `hidePageCount`. */
export async function links({ canvas }: PlayFunctionContext<WebRenderer>) {
  const query = canvas.getByRole('navigation', { name: 'Pages, query' });
  await expect(query.querySelector('a[aria-label="Page 3"]')).toHaveAttribute('href', '?q=chem&p=3#results');

  // Drupal-style 0-based pages: the link for page 1 says p=0.
  const zero = canvas.getByRole('navigation', { name: 'Pages, 0-based' });
  await expect(zero.querySelector('a[aria-label="Page 1"]')).toHaveAttribute('href', '?p=0');
  await expect(zero.querySelector('.ilw-pagination-count')).toBeNull();

  // page 9 of 5 is page 5.
  const clamped = canvas.getByRole('navigation', { name: 'Pages, clamped' });
  await expect(clamped.querySelector('a[aria-current="page"]')).toHaveAccessibleName('Page 5');
}

/** Pagination → Themes: a theme class restyles the links. */
export async function themes({ canvas }: PlayFunctionContext<WebRenderer>) {
  const blue = canvas.getByRole('navigation', { name: 'Pages, blue' });
  const link = blue.querySelector('a:not([aria-current])')!;
  await expect(getComputedStyle(link).backgroundColor).toBe('rgb(19, 41, 75)');
  await expect(getComputedStyle(link).color).toBe('rgb(255, 255, 255)');
}

/** Parity/Pagination → IlwUi: the contract, and the first page's text Previous. */
export async function parity({ canvas }: PlayFunctionContext<WebRenderer>) {
  const nav = canvas.getByRole('navigation', { name: 'Pages' });
  const items = [...nav.querySelectorAll(':scope > ul > li')];
  await expect(items.map((li) => li.textContent?.trim())).toEqual(['Previous', '1', '…', '4', '5', '6', '7', '8', '…', '12', 'Next']);
  const current = nav.querySelector('a[aria-current="page"]')!;
  await expect(current).toHaveAccessibleName('Page 6');
  await expect(current).toHaveAttribute('href', 'https://example.edu/courses?term=fa26&page=6');
  await expect(nav.querySelectorAll('[aria-current]')).toHaveLength(1);
  await expect(canvas.getAllByRole('link', { name: 'Previous page' })[0]).toHaveAttribute(
    'href',
    'https://example.edu/courses?term=fa26&page=5',
  );
  await expect(nav.querySelector(':scope > .ilw-pagination-count')).toHaveTextContent('Page 6 of 12');
  // The current page is filled with the control text colour.
  await expect(getComputedStyle(current).backgroundColor).toBe(getComputedStyle(nav).color);

  // Page 1: Previous is text, not a link; Next is.
  const first = canvas.getByRole('navigation', { name: 'Pages, first' });
  const previous = first.querySelector('.ilw-pagination-previous > *')!;
  await expect(previous.tagName).toBe('SPAN');
  await expect(previous).toHaveTextContent('Previous');
  await expect(first.querySelector('.ilw-pagination-next > a')).toHaveAccessibleName('Next page');
  await expect(first.querySelectorAll('a')).toHaveLength(5);
}
