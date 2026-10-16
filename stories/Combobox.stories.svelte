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
