<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import { enhanceSelect, enhanceSelects } from '../src/svelte/enhance-select.ts';
  import EnhanceSelectDemo from './EnhanceSelectDemo.svelte';

  const { Story } = defineMeta({
    title: 'EnhanceSelect',
    component: EnhanceSelectDemo,
    parameters: { styles: 'ilw-ui' },
  });

  const person = (root: HTMLElement) => root.querySelector<HTMLSelectElement>('#person')!;
  const input = (select: HTMLSelectElement) => select.nextElementSibling!.querySelector<HTMLInputElement>('input')!;
</script>

<!--
  `enhanceSelects()` on a server-rendered form: a `<select data-combobox>` with a `<label for>` and optgroups, and a second select with no id.

  **Why:** the play function checks the markup ta-manager selects on: the select stays (hidden, `data-comboboxed="1"`) as the value source, the `combobox cb-block` wrapper is its next sibling, the label now points at `#person-cb`, the popup is `#person-popup` labelled by the label, a select with no id gets a generated `combobox-N` input, and enhancing again adds nothing.

  **Review:** "Person" over a full-width field showing the select's first option as its placeholder, between the Before and After fields; below it, the "+ add…" field. No native select is visible.
-->
<Story
  name="Contract"
  play={async ({ canvas, canvasElement }) => {
    const select = person(canvasElement);
    // The select stays, hidden, as the value source.
    await expect(select.isConnected).toBe(true);
    await expect(select.style.display).toBe('none');
    await expect(select.dataset.comboboxed).toBe('1');
    // The combobox is its next sibling; the label now points at the input.
    const wrap = select.nextElementSibling!;
    await expect(wrap.className).toBe('combobox cb-block');
    const cb = canvas.getByRole('combobox', { name: 'Person' });
    await expect(cb.id).toBe('person-cb');
    await expect(cb.className).toBe('combobox-input');
    await expect(wrap.contains(cb)).toBe(true);
    await expect(canvasElement.querySelector<HTMLLabelElement>('#person-label')!.htmlFor).toBe('person-cb');
    await expect(cb).toHaveAttribute('placeholder', '— Select a person or type a NetID —');
    const popup = canvasElement.querySelector('#person-popup')!;
    await expect(popup.className).toBe('combobox-popup');
    await expect(cb).toHaveAttribute('aria-controls', 'person-popup');
    await expect(popup).toHaveAttribute('aria-labelledby', 'person-label');

    // A select with no id still gets an input, with a generated id.
    const bare = canvasElement.querySelector<HTMLSelectElement>('select.row-add')!;
    await expect(input(bare).id).toMatch(/^combobox-\d+$/);
    await expect(input(bare)).toHaveAttribute('placeholder', '+ add…');

    // Enhancing again is a no-op.
    enhanceSelects(canvasElement);
    await expect(canvasElement.querySelectorAll('.combobox-input')).toHaveLength(2);
  }}
/>

<!--
  Choosing an option writes it back to the select.

  **Why:** the page's form reads the select, so a commit must set `select.value` and fire one bubbling `change`, and only when the value changes. Text that matches nothing stays in the field and clears the select without a `change`.

  **Review:** type `drew` and press Enter. The field reads "Drew Adams (dadams)" and "Changes" reads `person=dadams`. Type `newnetid` and Tab away: the text stays and "Changes" doesn't grow.
-->
<Story
  name="Commit"
  play={async ({ canvas, canvasElement, userEvent }) => {
    const select = person(canvasElement);
    const cb = canvas.getByRole('combobox', { name: 'Person' });
    const changes = canvas.getByTestId('changes');
    await userEvent.click(cb);
    await userEvent.keyboard('drew');
    await waitFor(() => expect(cb).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(select.value).toBe('dadams'));
    await expect(cb).toHaveValue('Drew Adams (dadams)');
    // One bubbling change on the select (the form saw it).
    await expect(changes).toHaveTextContent(/^person=dadams$/);

    // The same value again fires nothing.
    await userEvent.clear(cb);
    await userEvent.keyboard('dadams');
    await userEvent.tab();
    await waitFor(() => expect(select.value).toBe('dadams'));
    await expect(changes).toHaveTextContent(/^person=dadams$/);

    // Text that matches nothing stays, and clears the select silently.
    await userEvent.click(cb);
    await userEvent.clear(cb);
    await userEvent.keyboard('newnetid');
    await userEvent.tab();
    await waitFor(() => expect(select.value).toBe(''));
    await expect(cb).toHaveValue('newnetid');
    await expect(changes).toHaveTextContent(/^person=dadams$/);
  }}
/>

<!--
  Page code that drives the select directly, as ta-manager's scripts do.

  **Why:** a `change` dispatched on the select updates the input at once; a value set with no event is cleared by an unmatched blur; text written to `input.value` survives a click elsewhere; options added later are searchable.

  **Review:** nothing to do by hand: the play function sets the values. Check the Interactions panel.
-->
<Story
  name="Page code"
  play={async ({ canvasElement, userEvent }) => {
    const select = person(canvasElement);
    const cb = input(select);
    // Page code sets the value and dispatches change: the input follows at once.
    select.value = 'cclark';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await expect(cb).toHaveValue('Casey Clark (cclark)');
    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await expect(cb).toHaveValue('');

    // A value set with no event is cleared by an unmatched blur.
    select.value = 'aadams';
    await userEvent.click(cb);
    await userEvent.keyboard('nobody');
    await userEvent.tab();
    await waitFor(() => expect(select.value).toBe(''));

    // Text written straight to input.value survives for page code to read.
    cb.value = 'rawnetid';
    await userEvent.click(canvasElement.querySelector('button')!);
    await expect(cb.value).toBe('rawnetid');

    // Rebuilt options are searchable.
    select.add(new Option('Newcomer (new9)', 'new9'));
    await userEvent.click(cb);
    await userEvent.clear(cb);
    await userEvent.keyboard('new9');
    await waitFor(() => expect(canvasElement.querySelector('#person-popup [data-value="new9"]')).not.toBeNull());
  }}
/>

<!--
  `enhanceSelect` as a Svelte attachment, and clean-up when a select leaves the page.

  **Why:** `{@attach enhanceSelect}` must remove its combobox on cleanup, and `enhanceSelects()` must remove the combobox of a select that is no longer in the document, so nothing is left behind.

  **Review:** after the play function, the "+ add…" field is gone. Check the Interactions panel.
-->
<Story
  name="Attachment"
  play={async ({ canvasElement }) => {
    // As {@attach enhanceSelect}: the cleanup removes the combobox.
    const host = canvasElement.querySelector('form')!;
    const select = document.createElement('select');
    select.add(new Option('Pick', ''));
    select.add(new Option('One', '1'));
    host.append(select);
    const cleanup = enhanceSelect(select);
    const wrap = select.nextElementSibling!;
    await expect(wrap.className).toBe('combobox cb-block');
    cleanup();
    await waitFor(() => expect(wrap.isConnected).toBe(false));
    select.remove();

    // enhanceSelects removes the combobox of a select that left the document.
    const bare = canvasElement.querySelector<HTMLSelectElement>('select.row-add')!;
    const bareWrap = bare.nextElementSibling!;
    bare.remove();
    enhanceSelects(canvasElement);
    await waitFor(() => expect(bareWrap.isConnected).toBe(false));
  }}
/>

<!--
  Left open with an option highlighted.

  **Why:** axe only checks what is rendered, and the other stories end with the list closed.

  **Review:** the popup floats over the After field, its group headings (FACULTY, STUDENTS) stand apart from the options, and the highlight is easy to see. The a11y panel should show no violations.
-->
<Story
  name="Open"
  play={async ({ canvas, userEvent }) => {
    const cb = canvas.getByRole('combobox', { name: 'Person' });
    await userEvent.click(cb);
    await userEvent.keyboard('ad');
    await waitFor(() => expect(cb).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(cb).toHaveAttribute('aria-activedescendant'));
  }}
/>

<!--
  Has no `play` function: the page for trying the enhancer by hand, and the starting page for a keyboard spec (there is none yet; `tests/e2e/combobox.spec.ts` covers the widget).

  **Why:** Storybook runs a story's `play` function whenever it loads, so a spec needs a story without one to start from a clean state.

  **Review:** use it to try the enhancer by hand. Tab and Shift+Tab move between Before, Person and After, and focus never drops to `<body>`.
-->
<Story name="Fixture" />
