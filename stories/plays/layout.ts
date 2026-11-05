// Play functions for the Layout stories, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect } from 'storybook/test';

/** Every Columns mode, in the order the Columns story renders them. */
export const modes = ['1x1', '1x2', '2x1', '1x3', '3x1', '1x2x1', 'sidebar-left', 'sidebar-right'] as const;

const grow = (el: Element) => Number(getComputedStyle(el).flexGrow);
const px = (v: string) => parseFloat(v);
/** The toolkit's side margin, max(1.875rem, 50cqw - 35.625rem), for a container this wide. */
const side = (width: number) => Math.max(30, width / 2 - 570);

/** Layout → Content: the markup, the theme colours, the alignment, and transparent's background. */
export async function content({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const boxes = canvasElement.querySelectorAll<HTMLElement>('.ilw-content');
  await expect(boxes).toHaveLength(4);
  for (const box of boxes) {
    await expect(box).toHaveClass('ilw-format');
    await expect(box.firstElementChild).toHaveClass('ilw-content-inner');
  }
  await expect(boxes[0]).toHaveAttribute('theme', 'gray');
  await expect(getComputedStyle(boxes[0]).backgroundColor).toBe('rgb(244, 244, 244)');
  await expect(getComputedStyle(boxes[1]).backgroundColor).toBe('rgb(19, 41, 75)');
  await expect(getComputedStyle(boxes[1]).color).toBe('rgb(255, 255, 255)');
  await expect(getComputedStyle(boxes[2].firstElementChild!).textAlign).toBe('center');
  await expect(getComputedStyle(boxes[2].querySelector('ul')!).listStylePosition).toBe('inside');
  await expect(boxes[3]).not.toHaveAttribute('theme');
  await expect(getComputedStyle(boxes[3]).backgroundColor).toBe('rgba(0, 0, 0, 0)');
}

/** Layout → Content Modes: each mode's text size and column, the decoration's side, and the inset's padding. */
export async function contentModes({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const [intro, lede, right, center, inset] = canvasElement.querySelectorAll<HTMLElement>('.ilw-content');
  await expect(intro).toHaveClass('ilw-content--introduction');
  await expect(getComputedStyle(intro.querySelector('p')!).fontSize).toBe('22px');
  await expect(getComputedStyle(intro.querySelector('em')!).fontSize).toBe('36px');
  await expect(getComputedStyle(intro.firstElementChild!).maxWidth).toBe('1060px');
  await expect(getComputedStyle(lede.querySelector('p')!).fontStyle).toBe('italic');
  const bar = getComputedStyle(lede.firstElementChild!);
  await expect(bar.borderLeftWidth).toBe('6px');
  await expect(bar.borderLeftColor).toBe('rgb(255, 95, 5)');
  await expect(getComputedStyle(right.firstElementChild!).borderRightWidth).toBe('6px');
  await expect(getComputedStyle(right.firstElementChild!).borderLeftWidth).toBe('0px');
  await expect(getComputedStyle(center.firstElementChild!).borderLeftWidth).toBe('0px');
  await expect(getComputedStyle(center.firstElementChild!, '::after').borderBottomWidth).toBe('6px');
  await expect(px(getComputedStyle(inset.querySelector('h2')!).fontSize)).toBeCloseTo(29.008, 2);
  await expect(px(getComputedStyle(inset.firstElementChild!).paddingTop)).toBeGreaterThan(0);
}

/** Layout → Columns: each mode's class and flex weights, the sidebar width, reverse and the gap. */
export async function columns({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const rows = [...canvasElement.querySelectorAll<HTMLElement>('.ilw-columns')];
  await expect(rows).toHaveLength(modes.length + 1);
  const weights = rows.map((r) => [...r.children].map(grow).join(' '));
  await expect(weights).toEqual(['1 1 1', '1 2', '2 1', '1 3', '3 1', '1 2 2 1', '0 1', '1 0', '1 1']);
  await expect(rows[1]).toHaveClass('ilw-1x2');
  await expect(rows[6]).toHaveClass('ilw-columns--sidebar-left');
  await expect(rows[8]).toHaveClass('ilw-columns--reverse');
  await expect(getComputedStyle(rows[0]).columnGap).toBe('20px');
  await expect(getComputedStyle(rows[6]).columnGap).toBe('30px');
  const stacked = window.innerWidth <= 700;
  await expect(getComputedStyle(rows[0]).flexDirection).toBe(stacked ? 'column' : 'row');
  await expect(getComputedStyle(rows[8]).flexDirection).toBe(stacked ? 'column' : 'row-reverse');
  if (!stacked) await expect(rows[6].firstElementChild!.getBoundingClientRect().width).toBe(280);
}

/** Layout → Columns In A Container: stacking by container query, and the themed row's background. */
export async function columnsInAContainer({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const [narrow, wide, themed] = canvasElement.querySelectorAll<HTMLElement>('.ilw-columns');
  await expect(getComputedStyle(narrow.parentElement!).containerType).toBe('inline-size');
  await expect(getComputedStyle(narrow).flexDirection).toBe('column');
  await expect(getComputedStyle(wide).flexDirection).toBe(window.innerWidth <= 700 ? 'column' : 'row');
  await expect(getComputedStyle(themed).backgroundColor).toBe('rgb(19, 41, 75)');
  await expect(getComputedStyle(themed).columnGap).toBe('40px');
}

/** Layout → Grid: the list markup, the track count and the gap. */
export async function grid({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const [list, div] = canvasElement.querySelectorAll<HTMLElement>('.ilw-grid');
  await expect(list.tagName).toBe('UL');
  await expect(list.querySelectorAll(':scope > li')).toHaveLength(8);
  await expect(getComputedStyle(list).listStyleType).toBe('none');
  const width = list.getBoundingClientRect().width;
  // auto-fit collapses the empty tracks; WebKit still lists them, as 0px.
  const tracks = getComputedStyle(list).gridTemplateColumns.split(' ').filter((t) => t !== '0px').length;
  await expect(tracks).toBe(Math.min(8, Math.floor((width + 10) / 130)));
  await expect(div.tagName).toBe('DIV');
  await expect(getComputedStyle(div).columnGap).toBe('20px');
}

/** Layout → Spacer: the heights, hidden from assistive technology. */
export async function spacer({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const [a, b] = canvasElement.querySelectorAll<HTMLElement>('.ilw-spacer');
  await expect(a).toHaveAttribute('aria-hidden', 'true');
  await expect(a.getBoundingClientRect().height).toBe(20);
  await expect(b.getBoundingClientRect().height).toBe(48);
}

/** Layout → Widths: the breakouts span the page; `auto` keeps its content at the side margin. */
export async function widths({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const page = canvasElement.querySelector<HTMLElement>('.ilw-page')!;
  await expect(getComputedStyle(page).containerType).toBe('inline-size');
  const pageBox = page.getBoundingClientRect();
  const margin = side(page.clientWidth);
  for (const el of canvasElement.querySelectorAll<HTMLElement>('.ilw-width-full, .ilw-width-auto')) {
    const box = el.getBoundingClientRect();
    await expect(box.left, el.className).toBeCloseTo(pageBox.left, 0);
    await expect(box.width, el.className).toBeCloseTo(page.clientWidth, 0);
  }
  for (const el of canvasElement.querySelectorAll<HTMLElement>(':is(.ilw-content, .ilw-columns, .ilw-breadcrumbs).ilw-width-auto')) {
    await expect(px(getComputedStyle(el).paddingLeft), el.className).toBeCloseTo(margin, 0);
  }
  const autoTitle = canvasElement.querySelector('.ilw-page-title.ilw-width-auto .ilw-page-title-text')!;
  await expect(autoTitle.getBoundingClientRect().left - pageBox.left).toBeCloseTo(margin, 0);
  await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
}

/** Layout → Page Width: `width="page"` boxes start at the side margin. */
export async function pageWidth({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const page = canvasElement.querySelector<HTMLElement>('.ilw-page')!;
  const left = page.getBoundingClientRect().left;
  const margin = side(page.clientWidth);
  const boxes = canvasElement.querySelectorAll<HTMLElement>('.ilw-width-page');
  await expect(boxes).toHaveLength(3);
  for (const el of boxes) await expect(el.getBoundingClientRect().left - left, el.className).toBeCloseTo(margin, 0);
  const title = canvasElement.querySelector('.ilw-page-title')!;
  await expect(title).toHaveClass('ilw-width-auto');
}

/** The items in Parity/Layout → IlwUi's grid. */
export const parityItems = [1, 2, 3, 4, 5, 6];

/** Parity/Layout → IlwUi: the markup each component renders. */
export async function parity({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  await expect(canvasElement.querySelectorAll('.ilw-content.ilw-format > .ilw-content-inner')).toHaveLength(4);
  await expect(canvasElement.querySelectorAll('.ilw-spacer[aria-hidden="true"]')).toHaveLength(3);
  const [split, sidebar] = canvasElement.querySelectorAll('.ilw-columns');
  await expect(split).toHaveClass('ilw-2x1');
  await expect(sidebar).toHaveClass('ilw-columns--sidebar-left');
  await expect(sidebar).toHaveAttribute('theme', 'blue');
  await expect(canvasElement.querySelectorAll('ul.ilw-grid > li')).toHaveLength(parityItems.length);
}
