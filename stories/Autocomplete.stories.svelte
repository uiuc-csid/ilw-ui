<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import type { AutocompleteItem } from '../src/core/index.ts';
  import AutocompleteDemo from './AutocompleteDemo.svelte';

  const faculty: AutocompleteItem[] = [
    { value: 'aadams', label: 'A. Adams — Avery Adams (aadams)', text: 'A. Adams', search: 'A. Adams Avery Adams aadams' },
    { value: 'bbrown', label: 'B. Brown — Blake Brown (bbrown)', text: 'B. Brown', search: 'B. Brown Blake Brown bbrown' },
    { value: 'cclark', label: 'C. Clark — Casey Clark (cclark)', text: 'C. Clark', search: 'C. Clark Casey Clark cclark' },
    { value: 'dadams', label: 'D. Adams — Drew Adams (dadams)', text: 'D. Adams', search: 'D. Adams Drew Adams dadams' },
  ];
  const many: AutocompleteItem[] = Array.from({ length: 50 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return { value: `cs1${n}`, label: `CS 1${n}` };
  });

  const { Story } = defineMeta({
    title: 'Autocomplete',
    component: AutocompleteDemo,
    args: { items: faculty, placeholder: 'Name or NetID' },
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
  });
</script>

<!--
  The DOM contract and the core flow: the markup ta-manager selects on, then type, arrow, Enter, Escape, clear.

  **Why:** the README documents this markup as API, and this is the path most users take.

  **Review:** type `a`. The list opens with nothing highlighted, and the text you typed stays. ArrowDown highlights an option, and Enter writes its short text (`D. Adams`, not the full label) and closes the list. Escape closes the list and leaves focus and text alone. Clearing the input closes the list. No option ever shows as selected.
-->
<Story
  name="Basic"
  play={async ({ canvas, canvasElement, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    const popup = canvasElement.querySelector<HTMLElement>('#prof-popup')!;
    const text = canvas.getByTestId('text');
    const chosen = canvas.getByTestId('chosen');
    await expect(input.id).toBe('prof');
    await expect(input.className).toBe('autocomplete-input');
    await expect(input.parentElement!.className).toBe('autocomplete');
    await expect(input).toHaveAttribute('aria-autocomplete', 'list');
    await expect(input).toHaveAttribute('aria-controls', 'prof-popup');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveAttribute('autocomplete', 'off');
    await expect(input).toHaveAttribute('placeholder', 'Name or NetID');
    await expect(popup.className).toBe('autocomplete-popup');
    await expect(popup).toHaveAttribute('role', 'listbox');
    await expect(popup).toHaveAttribute('aria-labelledby', 'prof-label');
    await expect(popup).toHaveAttribute('hidden');

    // Opens at one character; nothing is highlighted, so the text stays.
    await userEvent.click(input);
    await userEvent.keyboard('a');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await expect(popup).not.toHaveAttribute('hidden');
    await expect(input).not.toHaveAttribute('aria-activedescendant');
    await userEvent.keyboard('dams');
    await expect(canvas.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'A. Adams — Avery Adams (aadams)',
      'D. Adams — Drew Adams (dadams)',
    ]);
    await expect(text).toHaveTextContent('adams');
    await expect(input).not.toHaveAttribute('aria-activedescendant');

    // Arrows move the highlight; Enter writes the suggestion's text.
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-aadams'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-dadams'));
    const option = canvas.getByRole('option', { name: 'D. Adams — Drew Adams (dadams)' });
    await expect(option.id).toBe('prof-popup-opt-dadams');
    await expect(option).toHaveAttribute('data-highlighted');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(input).toHaveValue('D. Adams'));
    await waitFor(() => expect(text).toHaveTextContent('D. Adams'));
    await waitFor(() => expect(chosen).toHaveTextContent('dadams'));
    // The choice fires one bubbling change, with the new text already in.
    await expect(canvas.getByTestId('picks')).toHaveTextContent(/^D\. Adams$/);
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(input).not.toHaveAttribute('aria-activedescendant'));
    // Zag's selection is never kept: no option is ever aria-selected.
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvasElement.querySelector('[aria-selected="true"]')).toBeNull();

    // Escape closes and keeps focus and the text.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await expect(document.activeElement).toBe(input);
    await expect(input).toHaveValue('D. Adams');

    // Clearing the text closes the list.
    await userEvent.clear(input);
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(text).toHaveTextContent(''));
  }}
/>

<!--
  The text is the value: anything typed is kept, even when it matches no suggestion.

  **Why:** unlike Combobox, Autocomplete must accept names that aren't in the list (a visiting professor).

  **Review:** type text with no matches and Tab away. The text stays and `selects` stays at 0. Typing a match and tabbing out *without* arrowing also keeps your text, not the first suggestion.
-->
<Story
  name="Free text"
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await userEvent.click(input);
    await userEvent.keyboard('Visiting Prof');
    // No matches and no emptyText: the list stays closed.
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveValue('Visiting Prof'));
    await expect(canvas.getByTestId('text')).toHaveTextContent('Visiting Prof');
    await expect(canvas.getByTestId('selects')).toHaveTextContent('0');

    // Tab with matches but nothing highlighted keeps the typed text too.
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.keyboard('clark');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveValue('clark'));
    await expect(canvas.getByTestId('selects')).toHaveTextContent('0');
  }}
/>

<!--
  Tab with a highlighted suggestion takes it, as Enter does.

  **Why:** a user who arrows to a suggestion and tabs on expects it to stick. Losing it on Tab is a common combobox bug.

  **Review:** type `brown`, ArrowDown, Tab. The input reads `B. Brown` and the list is closed. Where focus lands is checked by the Playwright spec, not here (WebKit on macOS skips fields on Tab unless Option is held).
-->
<Story
  name="Tab takes the highlight"
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await userEvent.click(input);
    await userEvent.keyboard('brown');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-bbrown'));
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveValue('B. Brown'));
    await expect(canvas.getByTestId('chosen')).toHaveTextContent('bbrown');
    // Where focus goes is the keyboard spec's (tests/e2e): macOS WebKit's Tab
    // skips fields unless Option is held.
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  }}
/>

<!--
  Switching windows leaves the highlight and the text alone.

  **Why:** when the window loses focus the input gets `blur`/`focusout` but stays the focused element. Treating that like Tab took the highlighted suggestion while the user was away.

  **Review:** type `brown`, ArrowDown, switch to another window and back. The field still reads `brown`, the list is open with B. Brown highlighted, and `chosen` is empty. Press Escape, switch away and back, then Backspace: the list opens again.
-->
<Story
  name="Window switch"
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await userEvent.click(input);
    await userEvent.keyboard('brown');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-bbrown'));
    // What the browser fires when the window loses focus: focus stays on the input.
    input.dispatchEvent(new FocusEvent('blur'));
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await expect(document.activeElement).toBe(input);
    await expect(input).toHaveValue('brown');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-bbrown');
    await expect(canvas.getByTestId('chosen')).toHaveTextContent('');
    // With the list closed, Zag's own blur handling used to idle the machine,
    // and typing never reopened the list.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    input.dispatchEvent(new FocusEvent('blur'));
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
  }}
/>

<!--
  With `emptyText`, a search with no matches shows a disabled "No matches" row instead of closing the list.

  **Why:** a screen-reader user otherwise gets no feedback that the search came up empty.

  **Review:** type `zz`. The row is visible, styled as muted rather than as a choice, and `aria-disabled`. Enter on it keeps `zz` and doesn't count as a select.
-->
<Story
  name="Empty text"
  args={{ emptyText: 'No matches' }}
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await userEvent.click(input);
    await userEvent.keyboard('zz');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    const empty = canvas.getByRole('option', { name: 'No matches' });
    await expect(empty.className).toBe('autocomplete-empty');
    await expect(empty).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(input).toHaveValue('zz'));
    await expect(canvas.getByTestId('selects')).toHaveTextContent('0');
  }}
/>

<!--
  A 50-item list capped by `max: 12`, with items that have only a `label`.

  **Why:** checks the cap and the fallback where the label doubles as the text written to the input.

  **Review:** type `cs`. Exactly 12 options show, and the popup scrolls once it reaches its 20rem height cap. ArrowUp wraps to the last one (`CS 112`), and Enter writes the label.
-->
<Story
  name="Many"
  args={{ items: many, max: 12 }}
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await userEvent.click(input);
    await userEvent.keyboard('cs');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getAllByRole('option')).toHaveLength(12);
    // The label is the text when there is no `text`.
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-cs112'));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(input).toHaveValue('CS 112'));
  }}
/>

<!--
  Starts with text already in the input, as when editing a saved record.

  **Why:** a prefilled value must not open the list on load, and the user needs a keyboard way to see suggestions for it.

  **Review:** on load the list is closed. Focus the input and press ArrowDown: it opens, filtered by the current text (only Adams).
-->
<Story
  name="Prefilled"
  args={{ value: 'A. Adams' }}
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await expect(input).toHaveValue('A. Adams');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    // ArrowDown opens on the current text.
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getAllByRole('option').map((o) => o.getAttribute('data-value'))).toEqual(['aadams']);
  }}
/>

<!--
  Extra props (`class`, `name`, `size`, `data-*`) are passed through to the `<input>`.

  **Why:** ta-manager posts the field in a plain form and selects rows by `data-*`.

  **Review:** in the DOM, the input has the added class after `autocomplete-input` and carries the other attributes. Its width stays 200px, since the stylesheet sets it.
-->
<Story
  name="Input attributes"
  args={{ class: 'took-prof', name: 'prof', size: 12, 'data-row': '3' } as Record<string, unknown>}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await expect(input.className).toBe('autocomplete-input took-prof');
    await expect(input).toHaveAttribute('name', 'prof');
    await expect(input).toHaveAttribute('size', '12');
    await expect(input).toHaveAttribute('data-row', '3');
  }}
/>

<!--
  Zag's VoiceOver live region is moved inside the component while the input has focus.

  **Why:** on Apple platforms Zag appends the region to `<body>`, outside the page landmarks and outside any open modal (which makes the rest of the page inert), so its announcements are lost. See `docs/upstream-issues/zag.md` #7.

  **Review:** nothing visible. This story only exists for its `play` test. To check by hand, type in Safari and inspect: any `[data-live-announcer]` sits under `.autocomplete`, not `<body>`. Real announcements are checked in `docs/at-smoke.md`.
-->
<Story
  name="Live region"
  play={async ({ canvas, canvasElement, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await userEvent.click(input);
    await userEvent.keyboard('ad');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    // What @zag-js/live-region appends on Apple platforms; it must end up
    // inside the component, not on <body>.
    const region = document.createElement('span');
    region.id = '__live-region__';
    region.dataset.liveAnnouncer = 'true';
    document.body.append(region);
    const root = canvasElement.querySelector('.autocomplete')!;
    await waitFor(() => expect(region.parentElement).toBe(root));
    region.remove();
    // With focus elsewhere it is left alone. Opening focuses the input a
    // frame later (docs/upstream-issues/zag.md #6); blurring before that frame
    // has focus pulled back, so the final state races.
    await new Promise(requestAnimationFrame);
    input.blur();
    const other = document.createElement('span');
    other.dataset.liveAnnouncer = 'true';
    document.body.append(other);
    await new Promise((r) => setTimeout(r));
    await expect(other.parentElement).toBe(document.body);
    other.remove();
    await new Promise(requestAnimationFrame);
    await expect(document.activeElement).not.toBe(input);
  }}
/>

<!--
  Disabled state, with text already filled in.

  **Why:** a locked record still has to show its value.

  **Review:** the field looks disabled but its text is still readable (check the contrast), it can't be focused, and nothing opens.
-->
<Story
  name="Disabled"
  args={{ value: 'A. Adams', disabled: true }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue('A. Adams');
  }}
/>

<!--
  `invalid` and `required` reach the input as `aria-invalid` and `required`.

  **Why:** form validation in ta-manager depends on them, and screen readers announce both.

  **Review:** the border is a 2px dark Altgeld (double width, so the state isn.t shown by color alone), and a screen reader says "invalid, required".
-->
<Story
  name="Invalid"
  args={{ invalid: true, required: true }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toBeRequired();
  }}
/>

<!--
  `block` adds `ac-block`, so the field fills its container.

  **Review:** the input and the popup both span the full width of the form row.
-->
<Story
  name="Block"
  args={{ block: true }}
  play={async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.autocomplete')!.className).toBe('autocomplete ac-block');
  }}
/>

<!--
  Left open with an option highlighted, so axe checks the open listbox and the `aria-activedescendant` reference.

  **Why:** axe only checks what is rendered, and the other stories end with the list closed.

  **Review:** the highlight (light Arches background) is easy to see, and the popup floats over the "After" field instead of pushing it down. The a11y panel should show no violations.
-->
<Story
  name="Open"
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await userEvent.click(input);
    await userEvent.keyboard('ad');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-aadams'));
  }}
/>

<!--
  Left open on the "No matches" row, so axe checks the disabled option.

  **Review:** the a11y panel is clean, and the row reads as a message, not as a choice you can pick.
-->
<Story
  name="Open empty"
  args={{ emptyText: 'No matches' }}
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await userEvent.click(input);
    await userEvent.keyboard('zz');
    await waitFor(() => expect(canvas.getByRole('option', { name: 'No matches' })).toBeVisible());
  }}
/>

<!--
  Has no `play` function: it is the starting page for `tests/e2e/autocomplete.spec.ts`, which drives it with a real keyboard.

  **Review:** use it to try the component by hand. Expect Tab and Shift+Tab to move between Before, Professor and After, and focus never to drop to `<body>`.
-->
<Story name="Fixture" />
<!--
  `Fixture` with `emptyText`, for the Playwright "No matches is not selectable" test.

  **Review:** like `Fixture`, but a search with no matches shows the "No matches" row.
-->
<Story name="Fixture empty text" args={{ emptyText: 'No matches' }} />
