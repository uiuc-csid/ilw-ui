<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import CopyButtonDemo from './CopyButtonDemo.svelte';

  /**
   * `parameters.clipboard`: what `navigator.clipboard` does in the story.
   * `ok` keeps the text in memory (no permission prompt, nothing on the real
   * clipboard), `denied` rejects as a browser without permission does, `none`
   * has no clipboard at all, as on a plain-http page.
   */
  type ClipboardMode = 'ok' | 'denied' | 'none';

  const { Story } = defineMeta({
    title: 'CopyButton',
    parameters: { styles: 'ilw-ui', clipboard: 'ok' },
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
    // The stub is an own property shadowing Navigator.prototype.clipboard; deleting it restores the real one.
    beforeEach: ({ parameters }) => {
      const mode = (parameters.clipboard ?? 'ok') as ClipboardMode;
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
    },
  });

  const region = (politeness: 'polite' | 'assertive') => document.querySelector(`[data-ilw-announce="${politeness}"]`);
  const clipboardText = () => navigator.clipboard.readText();

  /** Clicks `button` and checks it copied `expected`, said so, and kept focus; then that it resets. */
  async function copies(button: HTMLElement, expected: string, copiedName: string, restName: string) {
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
</script>

<!--
  Has no `play` function: the fixture `tests/e2e/copy-button.spec.ts` drives with the keyboard.

  **Why:** a share link (an input's value, by id), an API token (an element's text, by id), per-row icon-only netid buttons and a "Copy netids" button built from the rows when clicked, with the clipboard stubbed so no permission prompt appears.

  **Review:** click or press Enter/Space on any button: its icon becomes a check and its label "Copied" for 1.5 s, and focus stays put. A screen reader says "Copied". Untick a student and "Copy netids of confirmed students" leaves them out.
-->
<Story name="Fixture" asChild>
  <CopyButtonDemo />
</Story>

<!--
  The DOM contract, checked in the DOM.

  **Why:** ta-manager and server templates rely on this markup: `<button type="button" class="ilw-button ilw-copy-button" data-state>` holding an `ilw-icon` SVG (decorative) and a `.ilw-copy-button-label` span; icon-only buttons put the label in `.ilw-visually-hidden` instead, so it is still the name.

  **Review:** same page as Fixture.
-->
<Story
  name="Contract"
  asChild
  play={async ({ canvas }) => {
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
  }}
>
  <CopyButtonDemo />
</Story>

<!--
  Each source copies, announces "Copied" and keeps focus, then resets.

  **Why:** the three ways ta-manager copies: an input's value and an element's text by `target`, a literal `value`, and a `value` function read at click time (after a student is unticked). The test checks the stub's clipboard, the polite `role="status"` region, the label and `data-state`, and focus; `resetAfter` is 200 ms so it can wait for the reset.

  **Review:** click each button: check icon and "Copied", back to the copy icon after a moment.
-->
<Story
  name="Copies"
  asChild
  play={async ({ canvas, userEvent }) => {
    const link = canvas.getByRole('button', { name: 'Copy link' });
    link.focus();
    await copies(link, 'https://tam.cs.illinois.edu/courses/cs-225/fa26', 'Copied', 'Copy link');

    const token = canvas.getByRole('button', { name: 'Copy token' });
    token.focus();
    await copies(token, 'tam_7Qx2dH9kLm4Rv8Zp', 'Copied', 'Copy token');

    const netid = canvas.getByRole('button', { name: 'Copy netid of Alan Turing' });
    netid.focus();
    await copies(netid, 'aturing2', 'Copied', 'Copy netid of Alan Turing');

    await userEvent.click(canvas.getByRole('checkbox', { name: /Confirmed.*Alan Turing/ }));
    const list = canvas.getByRole('button', { name: 'Copy netids of confirmed students' });
    list.focus();
    await copies(list, 'ghopper3', 'Copied', 'Copy netids of confirmed students');
  }}
>
  <CopyButtonDemo resetAfter={200} />
</Story>

<!--
  The copied state, held: the button shows a check and "Copied".

  **Why:** the "open" state of the component, so axe scans the swapped icon and label (`resetAfter` is long enough that it doesn't reset first).

  **Review:** "Copy link" reads "Copied" with a check icon; light and dark both legible.
-->
<Story
  name="Copied State"
  asChild
  play={async ({ canvas, userEvent }) => {
    const link = canvas.getByRole('button', { name: 'Copy link' });
    await userEvent.click(link);
    await waitFor(() => expect(link).toHaveAttribute('data-state', 'copied'));
    await expect(link).toHaveAccessibleName('Copied');
    await expect(link).toHaveFocus();
  }}
>
  <CopyButtonDemo resetAfter={600_000} />
</Story>

<!--
  The browser refuses the write (permission denied).

  **Why:** a refusal is reported, not swallowed: the label reads "Copy failed" with a warning icon, the assertive `role="alert"` region says "Could not copy to the clipboard", `data-state="failed"`, and focus stays on the button. Also axe's scan of the failed state.

  **Review:** click "Copy link": warning icon and "Copy failed". A screen reader interrupts with the error.
-->
<Story
  name="Denied"
  asChild
  parameters={{ clipboard: 'denied' }}
  play={async ({ canvas, userEvent }) => {
    const link = canvas.getByRole('button', { name: 'Copy link' });
    await userEvent.click(link);
    await waitFor(() => expect(link).toHaveAttribute('data-state', 'failed'));
    await expect(link).toHaveAccessibleName('Copy failed');
    await waitFor(() => expect(region('assertive')).toHaveTextContent('Could not copy to the clipboard'));
    await expect(region('assertive')).toHaveAttribute('role', 'alert');
    await expect(link).toHaveFocus();
  }}
>
  <CopyButtonDemo resetAfter={600_000} />
</Story>

<!--
  No clipboard at all, as on a plain-http page (`navigator.clipboard` is undefined outside a secure context).

  **Why:** the missing API is a failure like any other: the button shows "Copy failed" and the error is announced, instead of a TypeError in the console and no feedback.

  **Review:** click "Copy token": warning icon and "Copy failed".
-->
<Story
  name="No Clipboard"
  asChild
  parameters={{ clipboard: 'none' }}
  play={async ({ canvas, userEvent }) => {
    await expect(navigator.clipboard).toBeUndefined();
    const token = canvas.getByRole('button', { name: 'Copy token' });
    await userEvent.click(token);
    await waitFor(() => expect(token).toHaveAttribute('data-state', 'failed'));
    await expect(token).toHaveAccessibleName('Copy failed');
    await waitFor(() => expect(region('assertive')).toHaveTextContent('Could not copy to the clipboard'));
    await expect(token).toHaveFocus();
  }}
>
  <CopyButtonDemo resetAfter={600_000} />
</Story>
