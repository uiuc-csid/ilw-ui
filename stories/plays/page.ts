// Play functions for the Page shell's stories, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect } from 'storybook/test';

/** Parity/Page → IlwUi: the skip link, the landmarks and the theme's page colours. */
export async function parity({ canvas, canvasElement }: PlayFunctionContext<WebRenderer>) {
  const shell = canvasElement.querySelector('.ilw-page')!;
  await expect(shell).toHaveAttribute('id', 'top');
  const skip = canvas.getByRole('link', { name: 'Skip to main content' });
  const main = canvas.getByRole('main');
  await expect(skip).toHaveAttribute('href', `#${main.id}`);
  await expect(main).toHaveAttribute('id', 'main-content');
  await expect(main).toHaveAttribute('tabindex', '-1');
  // The skip link is the shell's first element, and the landmarks are its children.
  await expect(shell.firstElementChild).toBe(skip);
  await expect(canvas.getByRole('banner').parentElement).toBe(shell);
  await expect(canvas.getByRole('contentinfo').parentElement).toBe(shell);
  // Off screen until focused, then on screen.
  await expect(skip.getBoundingClientRect().bottom).toBeLessThanOrEqual(0);
  skip.focus();
  await expect(skip.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
  // Following it (Enter, then focus in main) is in tests/e2e/page-chrome.spec.ts:
  // a fragment link would navigate the test runner's frame.
  // The page colours come from the theme.
  await expect(getComputedStyle(shell).backgroundColor).toBe('rgb(255, 255, 255)');
}

/** Page Chrome/Page → Dark: the shell's dark colours, and the footer's brand plate. */
export async function dark({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const shell = canvasElement.querySelector('.ilw-page')!;
  await expect(getComputedStyle(shell).backgroundColor).toBe('rgb(17, 24, 29)');
  await expect(getComputedStyle(shell).color).toBe('rgb(244, 244, 244)');
  await expect(getComputedStyle(canvasElement.querySelector('.ilw-footer-campus')!).backgroundColor).toBe('rgb(19, 41, 75)');
}
