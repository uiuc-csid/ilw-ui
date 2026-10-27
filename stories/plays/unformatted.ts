// Play functions for the Unformatted stories (the Page shell without .ilw-format), shared by the
// Svelte and React twins. All of them moved here at once, so the ports only add React stories.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect } from 'storybook/test';

/** Checks each element's text is in the brand sans font (Source Sans), not the browser default. */
export async function brandSans(elements: Iterable<Element>) {
  const all = [...elements];
  await expect(all.length).toBeGreaterThan(0);
  await expect(document.querySelector('.ilw-format')).toBeNull();
  for (const el of all) {
    await expect(getComputedStyle(el).fontFamily, `font of ${el.textContent?.trim().slice(0, 30)}`).toMatch(/^"?Source Sans/);
  }
}

type Context = PlayFunctionContext<WebRenderer>;

export const button = ({ canvasElement }: Context) => brandSans(canvasElement.querySelectorAll('.ilw-button'));

export const field = ({ canvasElement }: Context) =>
  brandSans(canvasElement.querySelectorAll('.ilw-input-entry label, .ilw-input-entry input, .ilw-input-description, .ilw-input-alert'));

export const choiceChips = ({ canvasElement }: Context) =>
  brandSans(canvasElement.querySelectorAll('.ilw-chips legend, .ilw-chip, .ilw-input-description, .ilw-input-alert'));

export async function icon({ canvasElement }: Context) {
  await expect(document.querySelector('.ilw-format')).toBeNull();
  const row = canvasElement.querySelector<HTMLElement>('.ilw-icon-row')!;
  const svg = row.querySelector('svg')!;
  await expect(svg).toHaveClass('ilw-icon');
  await expect(svg.getBoundingClientRect().height).toBeCloseTo(parseFloat(getComputedStyle(row).fontSize), 0);
  await expect(getComputedStyle(svg).fill).toBe(getComputedStyle(row).color);
}

export const header = ({ canvasElement }: Context) =>
  brandSans(
    canvasElement.querySelectorAll(
      '.ilw-header :is(.ilw-header-parent-unit, .ilw-header-site-name, .ilw-header-toggle, .ilw-header-links a, .ilw-header-search input, .ilw-header-search button, .ilw-header-nav a, .ilw-header-nav summary)',
    ),
  );

export const breadcrumbs = ({ canvasElement }: Context) => brandSans(canvasElement.querySelectorAll('.ilw-breadcrumbs li > *'));

export const pagination = ({ canvasElement }: Context) =>
  brandSans(canvasElement.querySelectorAll('.ilw-pagination li > *, .ilw-pagination-count'));

export const pageTitle = ({ canvasElement }: Context) => brandSans(canvasElement.querySelectorAll('.ilw-page-title h1'));

export const sectionNav = ({ canvasElement }: Context) => brandSans(canvasElement.querySelectorAll('.ilw-section-nav a'));

export const footer = ({ canvasElement }: Context) =>
  brandSans(canvasElement.querySelectorAll('.ilw-footer-site-name, .ilw-footer-campus h3, .ilw-footer-legal li'));

export const table = ({ canvasElement }: Context) => brandSans(canvasElement.querySelectorAll('table caption, table th, table td'));

export const dataTable = ({ canvasElement }: Context) =>
  brandSans(canvasElement.querySelectorAll('.th-sort, table td, .ilw-pager-btn, .ilw-pager-count'));

export const toggleGroup = ({ canvasElement }: Context) =>
  brandSans(canvasElement.querySelectorAll('.ilw-toggle-group-label, .ilw-toggle-group button'));

export const accordion = ({ canvasElement }: Context) =>
  brandSans(canvasElement.querySelectorAll('.ilw-accordion-buttons button, .ilw-accordion-heading, .ilw-accordion-body p'));

export async function alert({ canvasElement }: Context) {
  await brandSans(canvasElement.querySelectorAll('.ilw-alert-title, .ilw-alert-body > p, .ilw-alert-actions .ilw-button'));
  await expect(getComputedStyle(canvasElement.querySelector('.ilw-alert-title')!).marginTop).toBe('0px');
}
