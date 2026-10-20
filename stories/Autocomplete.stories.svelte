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
  });
</script>

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
    await expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-dadams');
    const option = canvas.getByRole('option', { name: 'D. Adams — Drew Adams (dadams)' });
    await expect(option.id).toBe('prof-popup-opt-dadams');
    await expect(option).toHaveAttribute('data-highlighted');
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('D. Adams');
    await expect(text).toHaveTextContent('D. Adams');
    await expect(chosen).toHaveTextContent('dadams');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).not.toHaveAttribute('aria-activedescendant');
    // Zag's selection is never kept: no option is ever aria-selected.
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvasElement.querySelector('[aria-selected="true"]')).toBeNull();

    // Escape closes and keeps focus and the text.
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(document.activeElement).toBe(input);
    await expect(input).toHaveValue('D. Adams');

    // Clearing the text closes the list.
    await userEvent.clear(input);
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(text).toHaveTextContent('');
  }}
/>

<Story
  name="Free text"
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await userEvent.click(input);
    await userEvent.keyboard('Visiting Prof');
    // No matches and no emptyText: the list stays closed.
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.tab();
    await expect(input).toHaveValue('Visiting Prof');
    await expect(canvas.getByTestId('text')).toHaveTextContent('Visiting Prof');
    await expect(canvas.getByTestId('selects')).toHaveTextContent('0');

    // Tab with matches but nothing highlighted keeps the typed text too.
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.keyboard('clark');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.tab();
    await expect(input).toHaveValue('clark');
    await expect(canvas.getByTestId('selects')).toHaveTextContent('0');
  }}
/>

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
    await expect(input).toHaveValue('B. Brown');
    await expect(canvas.getByTestId('chosen')).toHaveTextContent('bbrown');
    // Where focus goes is the keyboard spec's (tests/e2e): macOS WebKit's Tab
    // skips fields unless Option is held.
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  }}
/>

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
    await expect(input).toHaveValue('zz');
    await expect(canvas.getByTestId('selects')).toHaveTextContent('0');
  }}
/>

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
    await expect(input).toHaveValue('CS 112');
  }}
/>

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
    // With focus elsewhere it is left alone.
    input.blur();
    const other = document.createElement('span');
    other.dataset.liveAnnouncer = 'true';
    document.body.append(other);
    await new Promise((r) => setTimeout(r));
    await expect(other.parentElement).toBe(document.body);
    other.remove();
  }}
/>

<Story
  name="Disabled"
  args={{ value: 'A. Adams', disabled: true }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue('A. Adams');
  }}
/>

<Story
  name="Invalid"
  args={{ invalid: true, required: true }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Professor' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toBeRequired();
  }}
/>

<Story
  name="Block"
  args={{ block: true }}
  play={async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.autocomplete')!.className).toBe('autocomplete ac-block');
  }}
/>

<!-- Left open with a highlighted option so axe scans the open listbox. -->
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

<!-- Left open on "No matches" so axe scans the disabled option. -->
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

<!-- Fixtures for the Playwright keyboard spec: no play function. -->
<Story name="Fixture" />
<Story name="Fixture empty text" args={{ emptyText: 'No matches' }} />
