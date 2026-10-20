<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import { enhanceSelect, enhanceSelects } from '../src/svelte/enhance-select.ts';
  import EnhanceSelectDemo from './EnhanceSelectDemo.svelte';

  const { Story } = defineMeta({ title: 'EnhanceSelect', component: EnhanceSelectDemo });

  const person = (root: HTMLElement) => root.querySelector<HTMLSelectElement>('#person')!;
  const input = (select: HTMLSelectElement) => select.nextElementSibling!.querySelector<HTMLInputElement>('input')!;
</script>

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

<!-- Left open with a highlighted option so axe scans the open listbox. -->
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

<!-- Fixture for the Playwright keyboard spec: no play function. -->
<Story name="Fixture" />
