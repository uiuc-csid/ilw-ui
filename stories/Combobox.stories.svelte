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
    component: ComboboxDemo,
    args: { items: people, placeholder: 'Select faculty or type NetID' },
  });
</script>

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
    await expect(input).toHaveAttribute('aria-expanded', 'false');
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
    await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-dadams');
    await userEvent.keyboard('{Enter}');
    await expect(selected).toHaveTextContent('dadams');
    await expect(input).toHaveValue('Drew Adams');
    await expect(input).toHaveAttribute('aria-expanded', 'false');

    // Escape closes and keeps focus.
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getAllByRole('option')).toHaveLength(4);
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(document.activeElement).toBe(input);

    // A unique match commits on blur.
    await userEvent.clear(input);
    await userEvent.keyboard('blake');
    await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-bbrown');
    await userEvent.tab();
    await expect(selected).toHaveTextContent('bbrown');
    await expect(input).toHaveValue('Blake Brown');

    // Unmatched free text stays and clears the selection.
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.keyboard('zz9');
    await expect(canvas.getByRole('option', { name: 'No matches' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.tab();
    await expect(input).toHaveValue('zz9');
    await expect(selected).toHaveTextContent('');
    await expect(canvas.getByTestId('changes')).toHaveTextContent('3');
  }}
/>

<Story
  name="Preselected"
  args={{ value: 'cclark' }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await expect(input).toHaveValue('Casey Clark');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  }}
/>


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
    await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-s001');
  }}
/>

<Story
  name="Free text"
  play={async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await userEvent.click(input);
    await userEvent.keyboard('newperson');
    await waitFor(() => expect(canvas.getByRole('option', { name: 'No matches' })).toBeVisible());
    await userEvent.tab();
    await expect(input).toHaveValue('newperson');
    await expect(canvas.getByTestId('selected')).toHaveTextContent('');
    await expect(canvas.getByTestId('changes')).toHaveTextContent('0');
  }}
/>

<Story
  name="Disabled"
  args={{ value: 'aadams', disabled: true }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue('Avery Adams');
  }}
/>

<Story
  name="Invalid"
  args={{ invalid: true, required: true }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Person' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toBeRequired();
  }}
/>

<Story
  name="Block"
  args={{ block: true }}
  play={async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.combobox')!.className).toBe('combobox cb-block');
  }}
/>

<!-- Left open with a highlighted option so axe scans the open listbox. -->
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

<!-- Fixtures for the Playwright keyboard spec: no play function. -->
<Story name="Fixture" />
<Story name="Fixture preselected" args={{ value: 'cclark' }} />
