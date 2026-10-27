<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import type { ComboboxItem } from '../src/core/index.ts';
  import MultiComboboxDemo from './MultiComboboxDemo.svelte';
  import { StubServer } from './stub-source.svelte.ts';

  const faculty: ComboboxItem[] = [
    { value: 'aadams', label: 'Avery Adams', search: 'Avery Adams aadams', group: 'Crop Sciences' },
    { value: 'bbrown', label: 'Blake Brown', search: 'Blake Brown bbrown', group: 'Crop Sciences' },
    { value: 'cclark', label: 'Casey Clark', search: 'Casey Clark cclark', group: 'Microbiology' },
    { value: 'dadams', label: 'Drew Adams', search: 'Drew Adams dadams', group: 'Microbiology' },
  ];
  const directory: ComboboxItem[] = faculty.map(({ group: _, ...item }) => item);

  // One stub endpoint per async story, so stories on the Docs page don't share requests.
  const asyncServer = new StubServer(directory);
  const fixtureServer = new StubServer(directory, { auto: true });

  const { Story } = defineMeta({
    title: 'MultiCombobox',
    parameters: { styles: 'ilw-ui' },
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
    component: MultiComboboxDemo,
    args: { items: faculty, placeholder: 'Type a name or NetID' },
  });

  const tokens = (root: HTMLElement) => [...root.querySelectorAll('.combobox-token-label')].map((t) => t.textContent);
  const hidden = (root: HTMLElement) =>
    [...root.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="mentors"]')].map((i) => i.value);
</script>

<!--
  The DOM contract and the keyboard flow: pick two mentors, then remove one from the keyboard.

  **Why:** E3, the replacement for the opportunities app's Select2 `ModelSelect2Multiple`. The play function checks the README's markup (tokens list, remove buttons, one hidden input per value, `aria-multiselectable`), that a choice clears the text and closes the list, that Backspace in the empty input steps into the tokens and removes one, where focus goes after, and the status messages.

  **Review:** type `ad`, ArrowDown, Enter: an "Avery Adams ×" token appears above the field and the field empties. Type `bro`, Enter. Press Backspace: focus moves to Blake Brown's ×. Backspace again removes it and focus moves to Avery's ×. ArrowRight returns to the field. Check the tokens and focus ring in light and dark.
-->
<Story
  name="Basic"
  play={async ({ canvas, canvasElement, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Faculty mentors' });
    const root = canvasElement.querySelector<HTMLElement>('.combobox')!;
    const popup = canvasElement.querySelector<HTMLElement>('#mentors-popup')!;
    const status = root.querySelector(':scope > [role="status"]')!;
    await expect(root.className).toBe('combobox combobox-multi');
    await expect(input.className).toBe('combobox-input');
    await expect(popup).toHaveAttribute('role', 'listbox');
    await expect(popup).toHaveAttribute('aria-multiselectable', 'true');
    await expect(root.querySelector('.combobox-tokens')).toBeNull();
    await expect(hidden(canvasElement)).toEqual([]);

    await userEvent.click(input);
    await userEvent.keyboard('ad');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'mentors-popup-opt-aadams'));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(tokens(canvasElement)).toEqual(['Avery Adams']));
    await expect(input).toHaveValue('');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await expect(document.activeElement).toBe(input);
    await expect(status).toHaveTextContent('Added Avery Adams');

    // A lone match is highlighted, so Enter adds it.
    await userEvent.keyboard('bro');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'mentors-popup-opt-bbrown'));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(tokens(canvasElement)).toEqual(['Avery Adams', 'Blake Brown']));
    await expect(hidden(canvasElement)).toEqual(['aadams', 'bbrown']);
    await expect(canvas.getByTestId('selected')).toHaveTextContent('aadams bbrown');

    const list = canvas.getByRole('list', { name: 'Faculty mentors' });
    await expect(list.className).toBe('combobox-tokens');
    const removeBlake = canvas.getByRole('button', { name: 'Remove Blake Brown' });
    await expect(removeBlake.className).toBe('combobox-token-remove');
    await expect(removeBlake.closest('li')).toHaveAttribute('data-value', 'bbrown');

    // Backspace in the empty input steps into the tokens; Backspace there removes one.
    await userEvent.keyboard('{Backspace}');
    await expect(document.activeElement).toBe(removeBlake);
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => expect(tokens(canvasElement)).toEqual(['Avery Adams']));
    await expect(document.activeElement).toBe(canvas.getByRole('button', { name: 'Remove Avery Adams' }));
    await expect(status).toHaveTextContent('Removed Blake Brown');
    await expect(hidden(canvasElement)).toEqual(['aadams']);
    await userEvent.keyboard('{ArrowRight}');
    await expect(document.activeElement).toBe(input);
    await expect(canvas.getByTestId('changes')).toHaveTextContent('3');
  }}
/>

<!--
  Two mentors already chosen, in the opportunities form, submitted as the browser would POST it.

  **Why:** a plain form POST must carry every value under the field's name (`mentors=aadams&mentors=cclark`, what Django's `getlist` reads), and nothing for the text input. The play function submits, reads the serialised form, removes a token with a click and submits again.

  **Review:** press "Post opportunity": the Posted line shows both mentors. Click Casey Clark's ×: with no token after it, focus moves to Avery's ×, and posting again sends one.
-->
<Story
  name="In a form"
  args={{ value: ['aadams', 'cclark'] }}
  play={async ({ canvas, canvasElement, userEvent }) => {
    await expect(tokens(canvasElement)).toEqual(['Avery Adams', 'Casey Clark']);
    await userEvent.click(canvas.getByRole('button', { name: 'Post opportunity' }));
    await waitFor(() =>
      expect(canvas.getByTestId('posted')).toHaveTextContent('title=Soil+microbiome+survey&mentors=aadams&mentors=cclark&notes='),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Casey Clark' }));
    await waitFor(() => expect(tokens(canvasElement)).toEqual(['Avery Adams']));
    await expect(document.activeElement).toBe(canvas.getByRole('button', { name: 'Remove Avery Adams' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Post opportunity' }));
    await waitFor(() =>
      expect(canvas.getByTestId('posted')).toHaveTextContent('title=Soil+microbiome+survey&mentors=aadams&notes='),
    );
  }}
/>

<!--
  `required` with nothing chosen: the form won't submit, and the field says why.

  **Why:** the text input is empty after every choice, so it can't carry `required` itself. The play function checks `aria-required`, that submitting is blocked with the "Select at least one option." validation message, and that one token is enough.

  **Review:** press "Post opportunity": the browser's validation bubble points at the field. Add a mentor and post again: it goes through.
-->
<Story
  name="Required"
  args={{ required: true }}
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole<HTMLInputElement>('combobox', { name: 'Faculty mentors' });
    await expect(input).toHaveAttribute('aria-required', 'true');
    await expect(input).not.toHaveAttribute('required');
    await expect(input.validationMessage).toBe('Select at least one option.');
    await expect(input.form!.checkValidity()).toBe(false);
    await userEvent.click(input);
    await userEvent.keyboard('clark');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'mentors-popup-opt-cclark'));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(input.validationMessage).toBe(''));
    await userEvent.click(canvas.getByRole('button', { name: 'Post opportunity' }));
    await waitFor(() => expect(canvas.getByTestId('posted')).toHaveTextContent('mentors=cclark'));
  }}
/>

<!--
  Searching the directory through an async source, with tokens labelled from the results.

  **Why:** E3's main case: the opportunities app's mentor field searches the campus directory on the server. The play function holds the stub's answer to check "Loading…" and the status message, checks a newer search aborts the older one, then adds a result. The token keeps its label after the results move on.

  **Review:** type `ad` and watch "Loading…" until you press Respond in the test server panel. Pick one; its token stays labelled when you search for someone else.
-->
<Story
  name="Async"
  args={{ server: asyncServer, items: [] }}
  play={async ({ canvas, canvasElement, userEvent }) => {
    const server = asyncServer;
    server.reset();
    const input = canvas.getByRole('combobox', { name: 'Faculty mentors' });
    const status = canvasElement.querySelector('.combobox > [role="status"]')!;
    await userEvent.click(input);
    await userEvent.keyboard('ad');
    await waitFor(() => expect(server.last?.query).toBe('ad'));
    await expect(canvas.getByRole('option', { name: 'Loading…' })).toBeVisible();
    await expect(status).toHaveTextContent('Loading…');
    await userEvent.keyboard('a');
    await waitFor(() => expect(server.last?.query).toBe('ada'));
    await expect(server.requests.slice(0, -1).every((r) => r.signal.aborted)).toBe(true);
    server.last!.respond();
    await waitFor(() => expect(canvas.getAllByRole('option').map((o) => o.textContent)).toEqual(['Avery Adams', 'Drew Adams']));
    await expect(status).toHaveTextContent('2 results');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'mentors-popup-opt-dadams'));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(tokens(canvasElement)).toEqual(['Drew Adams']));

    await userEvent.keyboard('cl');
    await waitFor(() => expect(server.last?.query).toBe('cl'));
    server.last!.respond();
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'mentors-popup-opt-cclark'));
    await expect(tokens(canvasElement)).toEqual(['Drew Adams']);
    await expect(hidden(canvasElement)).toEqual(['dadams']);
  }}
/>

<!--
  Left open with a selected option highlighted, so axe checks the multi-select listbox, the tokens and the remove buttons.

  **Why:** axe only checks what is rendered. In the open list a chosen mentor is `aria-selected="true"`; choosing it again removes it (the play function checks the toggle, then reopens the list).

  **Review:** Avery Adams and Casey Clark are tokens and bold in the list. Enter on Avery removes the token.
-->
<Story
  name="Open"
  args={{ value: ['aadams', 'cclark'] }}
  play={async ({ canvas, canvasElement, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Faculty mentors' });
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByRole('option', { name: 'Avery Adams' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('option', { name: 'Casey Clark' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('option', { name: 'Blake Brown' })).not.toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'mentors-popup-opt-aadams'));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(tokens(canvasElement)).toEqual(['Casey Clark']));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'mentors-popup-opt-cclark'));
  }}
/>

<!--
  Disabled, with mentors chosen: tokens show, but neither the field nor the remove buttons respond.

  **Why:** a locked opportunity still lists its mentors. The play function checks the input and every remove button are disabled.

  **Review:** the field looks disabled, the tokens are readable, and their × buttons are muted and can't be focused.
-->
<Story
  name="Disabled"
  args={{ value: ['aadams', 'bbrown'], disabled: true }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Faculty mentors' })).toBeDisabled();
    for (const button of canvas.getAllByRole('button', { name: /^Remove / })) await expect(button).toBeDisabled();
  }}
/>

<!--
  Has no `play` function: the starting page for `tests/e2e/multi-combobox.spec.ts`.

  **Why:** Storybook runs a story's `play` function whenever it loads, so a spec needs a story without one to start from a clean state.

  **Review:** try it by hand: Tab from Title through the field to Notes, add and remove mentors with the keyboard alone. Focus should never drop to `<body>`.
-->
<Story name="Fixture" />
<!--
  `Fixture` with three mentors chosen, for the token-navigation tests in `tests/e2e/multi-combobox.spec.ts`.

  **Why:** Storybook runs a story's `play` function whenever it loads, so a spec needs a story without one to start from a clean state.

  **Review:** Shift+Tab from the field walks back through the × buttons; ArrowLeft and ArrowRight move between them.
-->
<Story name="Fixture preselected" args={{ value: ['aadams', 'bbrown', 'cclark'] }} />
<!--
  Has no `play` function: `Fixture` on an async source whose stub answers at once, for `tests/e2e/multi-combobox.spec.ts`.

  **Why:** Storybook runs a story's `play` function whenever it loads, so a spec needs a story without one to start from a clean state.

  **Review:** type `ad`; the matches appear after the debounce.
-->
<Story name="Fixture async" args={{ server: fixtureServer, items: [] }} />
