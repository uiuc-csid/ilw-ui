<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import type { ComboboxItem } from '../src/core/index.ts';
  import ComboboxDemo from './ComboboxDemo.svelte';

  const people: ComboboxItem[] = [
    { value: 'aadams', label: 'Avery Adams', search: 'Avery Adams aadams', group: 'Faculty' },
    { value: 'bbrown', label: 'Blake Brown', search: 'Blake Brown bbrown', group: 'Faculty' },
    { value: 'cclark', label: 'Casey Clark', search: 'Casey Clark cclark', group: 'Staff' },
    { value: 'dadams', label: 'Drew Adams', search: 'Drew Adams dadams', group: 'Staff' },
  ];

  const plain: ComboboxItem[] = people.map(({ group: _, ...item }) => item);
  const many: ComboboxItem[] = Array.from({ length: 500 }, (_, i) => {
    const n = String(i + 1).padStart(3, '0');
    return { value: `s${n}`, label: `Student ${n}` };
  });

  const { Story } = defineMeta({
    title: 'Combobox',
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
    component: ComboboxDemo,
    args: { items: people, placeholder: 'Select faculty or type NetID' },
  });
</script>

<!--
  The DOM contract and the full flow with grouped items: open at two characters, arrow, Enter, Escape, commit on blur, free text.

  **Why:** the README documents this markup as API (ta-manager's tests select on it), and grouped faculty/staff is the shape ta-manager uses.

  **Review:** typing one character does nothing, and the list opens at two. Group headings (FACULTY, STAFF) are visually distinct from options and aren't reachable with the arrows. With two matches nothing is highlighted until you press ArrowDown. Enter commits and shows the label. Typing `blake` and tabbing away commits Blake Brown, because it is the only match. Text that matches nothing stays in the field and clears the selection.
-->
<Story
  name="Grouped"
  play={async ({ canvas, canvasElement, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    const popup = canvasElement.querySelector<HTMLElement>('#person-popup')!;
    const selected = canvas.getByTestId('selected');
    await expect(input.id).toBe('person-cb');
    await expect(input.className).toBe('combobox-input');
    await expect(input.parentElement!.className).toBe('combobox');
    await expect(popup.className).toBe('combobox-popup');
    await expect(popup).toHaveAttribute('role', 'listbox');
    await expect(popup).toHaveAttribute('aria-labelledby', 'person-label');
    await expect(input).toHaveAttribute('aria-controls', 'person-popup');

    // Opens at two characters.
    await userEvent.click(input);
    await userEvent.keyboard('a');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await userEvent.keyboard('d');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    const groups = canvas.getAllByRole('group');
    await expect(groups.map((g) => g.getAttribute('aria-labelledby'))).toEqual([
      'person-popup-group-Faculty-label',
      'person-popup-group-Staff-label',
    ]);
    await expect(canvas.getByRole('group', { name: 'Faculty' })).toBeVisible();
    await expect(canvas.getAllByRole('option').map((o) => o.textContent)).toEqual(['Avery Adams', 'Drew Adams']);
    // Two matches: nothing highlighted until the user moves.
    await expect(input).not.toHaveAttribute('aria-activedescendant');

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-aadams'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-dadams'));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(selected).toHaveTextContent('dadams'));
    await waitFor(() => expect(input).toHaveValue('Drew Adams'));
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));

    // Escape closes and keeps focus.
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getAllByRole('option')).toHaveLength(4);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(input).not.toHaveAttribute('aria-activedescendant'));
    await expect(document.activeElement).toBe(input);

    // A unique match commits on blur.
    await userEvent.clear(input);
    await userEvent.keyboard('blake');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-bbrown'));
    await userEvent.tab();
    await waitFor(() => expect(selected).toHaveTextContent('bbrown'));
    await waitFor(() => expect(input).toHaveValue('Blake Brown'));

    // Unmatched free text stays and clears the selection.
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.keyboard('zz9');
    await expect(canvas.getByRole('option', { name: 'No matches' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveValue('zz9'));
    await waitFor(() => expect(input).not.toHaveAttribute('aria-activedescendant'));
    await waitFor(() => expect(selected).toHaveTextContent(''));
    await expect(canvas.getByTestId('changes')).toHaveTextContent('3');
  }}
/>

<!--
  Starts with a value, as when editing a saved record.

  **Why:** the input must show the item's label, not its value (`Casey Clark`, not `cclark`), and must not open on load.

  **Review:** the field reads `Casey Clark` and the list is closed. The Playwright spec checks that ArrowDown then opens the whole list at the selection (`Fixture preselected`).
-->
<Story
  name="Preselected"
  args={{ value: 'cclark' }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await expect(input).toHaveValue('Casey Clark');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  }}
/>


<!--
  Items with no groups, and the input attributes every combobox gets.

  **Why:** the ungrouped list renders no `group` roles, and only the selected option carries `aria-selected` (a Zag behaviour this story pins down).

  **Review:** type `brown` and press Enter. ArrowDown reopens the list, and Blake Brown is bold (selected) while the others are not.
-->
<Story
  name="Basic"
  args={{ items: plain }}
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await expect(input).toHaveAttribute('aria-autocomplete', 'list');
    await expect(input).toHaveAttribute('autocomplete', 'off');
    await expect(input).toHaveAttribute('placeholder', 'Select faculty or type NetID');
    await userEvent.click(input);
    await userEvent.keyboard('brown');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.queryAllByRole('group')).toEqual([]);
    const option = canvas.getByRole('option', { name: 'Blake Brown' });
    await expect(option.id).toBe('person-popup-opt-bbrown');
    // Zag marks only the selected option; the others carry no aria-selected.
    await expect(option).not.toHaveAttribute('aria-selected');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByTestId('selected')).toHaveTextContent('bbrown');
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByRole('option', { name: 'Blake Brown' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('option', { name: 'Avery Adams' })).not.toHaveAttribute('aria-selected');
  }}
/>

<!--
  500 items, capped at 200 options plus a disabled "…300 more — keep typing to narrow" row.

  **Why:** ta-manager's student lists are this long, and rendering every option would be slow and swamp a screen reader.

  **Review:** type `student`. The list scrolls inside its 20rem cap, and the last row is muted italic text you can't pick. ArrowUp highlights Student 200, the last real option, skipping the "more" row. ArrowDown from there wraps to Student 001.
-->
<Story
  name="Many"
  args={{ items: many }}
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await userEvent.click(input);
    await userEvent.keyboard('student');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    const options = canvas.getAllByRole('option');
    await expect(options).toHaveLength(201);
    const more = options[200];
    await expect(more).toHaveTextContent('…300 more — keep typing to narrow');
    await expect(more).toHaveAttribute('aria-disabled', 'true');
    // The highlight wraps from the last real option, skipping the "more" row.
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-s200'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-s001'));
  }}
/>

<!--
  Text that matches nothing is kept on blur and commits nothing.

  **Why:** the user may be about to type a NetID the list doesn't know yet. Silently wiping what they typed loses work.

  **Review:** type `newperson`. A disabled "No matches" row shows. Tab away: the text stays, and `changes` stays at 0.
-->
<Story
  name="Free text"
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await userEvent.click(input);
    await userEvent.keyboard('newperson');
    await waitFor(() => expect(canvas.getByRole('option', { name: 'No matches' })).toBeVisible());
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveValue('newperson'));
    await expect(canvas.getByTestId('selected')).toHaveTextContent('');
    await expect(canvas.getByTestId('changes')).toHaveTextContent('0');
  }}
/>

<!--
  Switching windows mid-word leaves the text and the list alone.

  **Why:** when the window loses focus the input gets `blur`/`focusout` but stays the focused element. Treating that as leaving the field committed `Blake Brown` after `bla`, and the rest of the word landed after it (`Blake Brownke`). Headless WebKit on Linux does this on its own now and then, which made `Grouped` flaky in CI.

  **Review:** type `bla`, switch to another window and back, then type `ke`. The field reads `blake`, the list is still open with Blake Brown highlighted, and nothing is selected until you press Enter or Tab. Press Escape, switch away and back, then Backspace: the list opens again.
-->
<Story
  name="Window switch"
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await userEvent.click(input);
    await userEvent.keyboard('bla');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-bbrown'));
    // What the browser fires when the window loses focus: focus stays on the input.
    input.dispatchEvent(new FocusEvent('blur'));
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await expect(document.activeElement).toBe(input);
    await userEvent.keyboard('ke');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-bbrown'));
    await expect(input).toHaveValue('blake');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByTestId('changes')).toHaveTextContent('0');
    // A browser may report <body> as active while the window deactivates. The
    // document has lost focus then, so it still isn't leaving the field.
    const hasFocus = document.hasFocus;
    document.hasFocus = () => false;
    try {
      input.blur();
    } finally {
      document.hasFocus = hasFocus;
    }
    input.focus();
    await expect(input).toHaveValue('blake');
    await expect(canvas.getByTestId('changes')).toHaveTextContent('0');
    // With the list closed, Zag's own blur handling used to idle the machine,
    // and typing never reopened the list.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    input.dispatchEvent(new FocusEvent('blur'));
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-bbrown'));
  }}
/>

<!--
  Disabled state, with a value already selected.

  **Why:** a locked record still has to show who is assigned.

  **Review:** the field looks disabled but `Avery Adams` is still readable (check the contrast), it can't be focused, and nothing opens.
-->
<Story
  name="Disabled"
  args={{ value: 'aadams', disabled: true }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue('Avery Adams');
  }}
/>

<!--
  `invalid` and `required` reach the input as `aria-invalid` and `required`.

  **Why:** ta-manager's form validation depends on them, and screen readers announce both.

  **Review:** the border is a 2px dark Altgeld (double width, so the state isn't shown by color alone), and a screen reader says "invalid, required".
-->
<Story
  name="Invalid"
  args={{ invalid: true, required: true }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toBeRequired();
  }}
/>

<!--
  `block` adds `cb-block`, so the field fills its container.

  **Review:** the input and the popup both span the full width of the form row.
-->
<Story
  name="Block"
  args={{ block: true }}
  play={async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.combobox')!.className).toBe('combobox cb-block');
  }}
/>

<!--
  Zag's VoiceOver live region is moved inside the component while the input has focus.

  **Why:** on Apple platforms Zag appends the region to `<body>`, outside the page landmarks and outside any open modal (which makes the rest of the page inert), so its announcements are lost. See `docs/upstream-issues/zag.md` #7.

  **Review:** nothing visible. This story only exists for its `play` test. To check by hand, type in Safari and inspect: any `[data-live-announcer]` sits under `.combobox`, not `<body>`. Real announcements are checked in `docs/at-smoke.md`.
-->
<Story
  name="Live region"
  play={async ({ canvas, canvasElement, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await userEvent.click(input);
    await userEvent.keyboard('ad');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    // What @zag-js/live-region appends on Apple platforms; it must end up
    // inside the component, not on <body>.
    const region = document.createElement('span');
    region.id = '__live-region__';
    region.dataset.liveAnnouncer = 'true';
    document.body.append(region);
    await waitFor(() => expect(region.parentElement).toBe(canvasElement.querySelector('.combobox')));
    region.remove();
  }}
/>

<!--
  Left open with an option highlighted, so axe checks the open listbox, its groups and the `aria-activedescendant` reference.

  **Why:** axe only checks what is rendered, and the other stories end with the list closed.

  **Review:** the highlight (light Arches background) is easy to see, and the popup floats over the "After" field instead of pushing it down. The a11y panel should show no violations.
-->
<Story
  name="Open"
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await userEvent.click(input);
    await userEvent.keyboard('ad');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-aadams'));
  }}
/>

<!--
  Has no `play` function: it is the starting page for `tests/e2e/combobox.spec.ts` and `combobox-csp.spec.ts`, which drive it with a real keyboard.

  **Review:** use it to try the component by hand. Try Alt+ArrowDown, Enter with nothing highlighted (it must not submit the form), and Tab and Shift+Tab between Before, Person and After. Focus should never drop to `<body>`.
-->
<Story name="Fixture" />
<!--
  `Fixture` with `cclark` selected, for the Playwright test "ArrowDown on a selected value opens the whole list at the selection".

  **Review:** focus the field and press ArrowDown. Every option shows, and Casey Clark is highlighted.
-->
<Story name="Fixture preselected" args={{ value: 'cclark' }} />
