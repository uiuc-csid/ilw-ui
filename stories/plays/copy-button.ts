// Play functions for the CopyButton stories, and the clipboard stub their meta
// installs, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect, waitFor } from 'storybook/test';

/**
 * `parameters.clipboard`: what `navigator.clipboard` does in the story.
 * `ok` keeps the text in memory (no permission prompt, nothing on the real
 * clipboard), `denied` rejects as a browser without permission does, `none`
 * has no clipboard at all, as on a plain-http page.
 */
type ClipboardMode = 'ok' | 'denied' | 'none';

/**
 * The meta's `beforeEach`: stubs `navigator.clipboard` per `parameters.clipboard`. The stub is
 * an own property shadowing Navigator.prototype.clipboard; deleting it restores the real one.
 */
export function stubClipboard({ parameters }: { parameters: { clipboard?: ClipboardMode } }) {
  const mode = parameters.clipboard ?? 'ok';
  let text = '';
  const stub = {
    ok: {
      writeText: async (t: string) => void (text = t),
      readText: async () => text,
    },
    denied: {
      writeText: () => Promise.reject(new DOMException('Write permission denied.', 'NotAllowedError')),
      readText: async () => text,
    },
    none: undefined,
  }[mode];
  Object.defineProperty(navigator, 'clipboard', { value: stub, configurable: true });
  return () => {
    delete (navigator as { clipboard?: unknown }).clipboard;
  };
}

const region = (politeness: 'polite' | 'assertive') => document.querySelector(`[data-ilw-announce="${politeness}"]`);
const clipboardText = () => navigator.clipboard.readText();

/** Clicks `button` and checks it copied `expected`, said so, and kept focus; then that it resets. */
async function copiesText(button: HTMLElement, expected: string, copiedName: string, restName: string) {
  await expect(button).toHaveAttribute('data-state', 'idle');
  await navigator.clipboard.writeText('');
  button.click();
  await waitFor(() => expect(button).toHaveAttribute('data-state', 'copied'));
  await expect(await clipboardText()).toBe(expected);
  await expect(button).toHaveAccessibleName(copiedName);
  await waitFor(() => expect(region('polite')).toHaveTextContent(copiedName));
  await expect(region('polite')).toHaveAttribute('role', 'status');
  await expect(button).toHaveFocus();
  // The demo's resetAfter is short, so this waits on the reset, not a clock.
  await waitFor(() => expect(button).toHaveAttribute('data-state', 'idle'));
  await expect(button).toHaveAccessibleName(restName);
  await expect(button).toHaveFocus();
}

/** CopyButton → Contract: the button, its icon and its label. */
export async function contract({ canvas }: PlayFunctionContext<WebRenderer>) {
  const link = canvas.getByRole('button', { name: 'Copy link' });
  await expect(link.tagName).toBe('BUTTON');
  await expect(link).toHaveAttribute('type', 'button');
  await expect(link).toHaveClass('ilw-button', 'ilw-copy-button');
  await expect(link).toHaveAttribute('data-state', 'idle');
  const [svg, label] = link.children;
  await expect(svg).toHaveClass('ilw-icon');
  await expect(svg).toHaveAttribute('aria-hidden', 'true');
  await expect(label).toHaveClass('ilw-copy-button-label');
  await expect(label).toHaveTextContent('Copy link');

  const token = canvas.getByRole('button', { name: 'Copy token' });
  await expect(token).toHaveClass('ilw-button', 'ilw-copy-button', 'ilw-button-small', 'ilw-theme-blue-solid');

  const netid = canvas.getByRole('button', { name: 'Copy netid of Grace Hopper' });
  await expect(netid.querySelector('span')).toHaveClass('ilw-visually-hidden');
  await expect(netid.querySelector('.ilw-copy-button-label')).toBeNull();
}

/** CopyButton → Copies: each source copies, announces and keeps focus, then resets. */
export async function copies({ canvas, userEvent }: PlayFunctionContext<WebRenderer>) {
  const link = canvas.getByRole('button', { name: 'Copy link' });
  link.focus();
  await copiesText(link, 'https://tam.cs.illinois.edu/courses/cs-225/fa26', 'Copied', 'Copy link');

  const token = canvas.getByRole('button', { name: 'Copy token' });
  token.focus();
  await copiesText(token, 'tam_7Qx2dH9kLm4Rv8Zp', 'Copied', 'Copy token');

  const netid = canvas.getByRole('button', { name: 'Copy netid of Alan Turing' });
  netid.focus();
  await copiesText(netid, 'aturing2', 'Copied', 'Copy netid of Alan Turing');

  await userEvent.click(canvas.getByRole('checkbox', { name: /Confirmed.*Alan Turing/ }));
  const list = canvas.getByRole('button', { name: 'Copy netids of confirmed students' });
  list.focus();
  await copiesText(list, 'ghopper3', 'Copied', 'Copy netids of confirmed students');
}

/** CopyButton → Copied State: the copied state, held. */
export async function copiedState({ canvas, userEvent }: PlayFunctionContext<WebRenderer>) {
  const link = canvas.getByRole('button', { name: 'Copy link' });
  await userEvent.click(link);
  await waitFor(() => expect(link).toHaveAttribute('data-state', 'copied'));
  await expect(link).toHaveAccessibleName('Copied');
  await expect(link).toHaveFocus();
}

/** CopyButton → Denied: a refused write is shown and announced. */
export async function denied({ canvas, userEvent }: PlayFunctionContext<WebRenderer>) {
  const link = canvas.getByRole('button', { name: 'Copy link' });
  await userEvent.click(link);
  await waitFor(() => expect(link).toHaveAttribute('data-state', 'failed'));
  await expect(link).toHaveAccessibleName('Copy failed');
  await waitFor(() => expect(region('assertive')).toHaveTextContent('Could not copy to the clipboard'));
  await expect(region('assertive')).toHaveAttribute('role', 'alert');
  await expect(link).toHaveFocus();
}

/** CopyButton → No Clipboard: a missing API is a failure like any other. */
export async function noClipboard({ canvas, userEvent }: PlayFunctionContext<WebRenderer>) {
  await expect(navigator.clipboard).toBeUndefined();
  const token = canvas.getByRole('button', { name: 'Copy token' });
  await userEvent.click(token);
  await waitFor(() => expect(token).toHaveAttribute('data-state', 'failed'));
  await expect(token).toHaveAccessibleName('Copy failed');
  await waitFor(() => expect(region('assertive')).toHaveTextContent('Could not copy to the clipboard'));
  await expect(token).toHaveFocus();
}
