// Play functions for the back-to-top stories, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect, waitFor } from 'storybook/test';

/** Scrolls to the bottom of the page and waits until `shown`: both parity sides start hidden at the top. */
export async function scrollDown(shown: () => boolean) {
  const scroller = document.scrollingElement!;
  scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'instant' });
  await waitFor(() => expect(shown()).toBe(true));
}

/** Parity/BackToTop → IlwUi: the look against upstream's, once scrolled into view. */
export async function parity({ canvas }: PlayFunctionContext<WebRenderer>) {
  const link = canvas.getByRole('link', { name: 'Back to top' });
  // It fades in over the first screen of scrolling, so the page must scroll at least that far.
  const scroller = document.scrollingElement!;
  await expect(scroller.scrollHeight - scroller.clientHeight).toBeGreaterThanOrEqual(scroller.clientHeight);
  // Fully shown once the reveal animation is at its end. Opacity alone isn't enough: until the
  // scroll timeline is attached, the link shows its unanimated opacity, 1, wherever the page is.
  const animated = CSS.supports('animation-timeline: scroll()');
  const revealed = () => link.getAnimations().some((a) => a.effect?.getComputedTiming().progress === 1);
  await scrollDown(() => (!animated || revealed()) && getComputedStyle(link).opacity === '1');
  const style = getComputedStyle(link);
  await expect([style.width, style.height, style.borderRadius, style.borderTopWidth]).toEqual(['48px', '48px', '50%', '2px']);
  await expect([style.right, style.bottom]).toEqual(['40px', '40px']);
  await expect(style.backgroundColor).toBe('rgb(19, 41, 75)');
  await expect(getComputedStyle(link.querySelector('svg')!).width).toBe('36px');
}

/** Page Chrome/Back to top → Long page: the contract, and fully shown once scrolled. */
export async function longPage({ canvas, canvasElement }: PlayFunctionContext<WebRenderer>) {
  const shell = canvasElement.querySelector('.ilw-page')!;
  const link = canvas.getByRole('link', { name: 'Back to top' });
  await expect(link).toHaveClass('ilw-back-to-top');
  await expect(shell.lastElementChild).toBe(link);
  await expect(link).toHaveAttribute('href', `#${shell.id}`);
  // Focusable by script only, so following the link moves focus there.
  await expect(shell).toHaveAttribute('tabindex', '-1');
  await expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  const style = getComputedStyle(link);
  await expect(style.position).toBe('fixed');
  await expect(style.display).not.toBe('none');
  await expect(style.visibility).toBe('visible');

  // Hidden at the top of the page is the keyboard spec's check: the test runner's frame doesn't
  // drive the scroll timeline at scroll position 0. Fully shown once scrolled to the end, everywhere.
  const scroller = document.scrollingElement!;
  scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'instant' });
  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);
  await expect(Number(getComputedStyle(link).opacity)).toBe(1);
  scroller.scrollTo({ top: 0, behavior: 'instant' });
}
