<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import CopyButtonDemo from './CopyButtonDemo.svelte';
  import * as plays from './plays/copy-button.ts';

  const { Story } = defineMeta({
    title: 'CopyButton',
    // `clipboard`: what navigator.clipboard does in the story ('ok', 'denied' or 'none'; see plays/copy-button.ts).
    parameters: { styles: 'ilw-ui', clipboard: 'ok' },
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
    beforeEach: plays.stubClipboard,
  });
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
  play={plays.contract}
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
  play={plays.copies}
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
  play={plays.copiedState}
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
  play={plays.denied}
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
  play={plays.noClipboard}
>
  <CopyButtonDemo resetAfter={600_000} />
</Story>
