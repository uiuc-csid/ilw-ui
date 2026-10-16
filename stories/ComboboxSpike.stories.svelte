<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import ComboboxSpike from './ComboboxSpike.svelte';

  // Step 1 spike; deleted once Combobox exists.
  const { Story } = defineMeta({ title: 'Spike/Combobox', component: ComboboxSpike });
</script>

<Story
  name="Spike"
  play={async ({ canvas, canvasElement, userEvent }) => {
    const input = canvas.getByRole('combobox');
    const popup = canvasElement.querySelector<HTMLElement>('#spike-popup')!;
    await expect(input.id).toBe('spike-cb');
    await expect(input).toHaveAttribute('aria-controls', 'spike-popup');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(popup).toHaveAttribute('role', 'listbox');
    await expect(popup).toHaveAttribute('aria-labelledby', 'combobox:spike:label');

    // One character doesn't open; two do.
    await userEvent.click(input);
    await userEvent.keyboard('a');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('s');
    await waitFor(() => expect(input.getAttribute('aria-expanded'), 'open#1 ' + canvas.getByTestId('state').textContent).toBe('true'));
    await expect(popup.hidden).toBe(false);

    // Values with spaces and colons: ids and highlight lookup still work.
    await userEvent.clear(input);
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input.getAttribute('aria-expanded'), 'open#2 ' + canvas.getByTestId('state').textContent).toBe('true'));
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', 'spike-opt-avery'));
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveAttribute('aria-activedescendant', 'spike-opt-has space');
    await expect(document.getElementById('spike-opt-has space')).toHaveAttribute('data-highlighted');
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveAttribute('aria-activedescendant', 'spike-opt-x:y');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByTestId('committed')).toHaveTextContent('x:y');
    await expect(input).toHaveValue('Casey Clark');
    await expect(input).toHaveAttribute('aria-expanded', 'false');

    // Escape closes and keeps focus on the input.
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(input.getAttribute('aria-expanded'), 'open#3 ' + canvas.getByTestId('state').textContent).toBe('true'));
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(document.activeElement).toBe(input);

    // Free text stays.
    await userEvent.clear(input);
    await userEvent.keyboard('zzz');
    await userEvent.tab();
    await expect(input).toHaveValue('zzz');
  }}
/>
