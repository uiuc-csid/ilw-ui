<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import { announce } from '../src/core/index.ts';

  const { Story } = defineMeta({
    title: 'announce',
    parameters: { styles: 'ilw-ui' },
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
  });

  // The regions live on <body>, outside the story's canvas.
  const regionFor = (politeness: string) => document.querySelector<HTMLElement>(`[data-ilw-announce="${politeness}"]`);
</script>

{#snippet buttons()}
  <p>
    <button type="button" onclick={() => announce('3 results')}>Announce politely</button>
    <button type="button" onclick={() => announce('Could not save', { politeness: 'assertive' })}>Announce assertively</button>
  </p>
{/snippet}

<!--
  Has no `play` function: the page for trying `announce()` by hand with a screen reader.

  **Why:** later components (CopyButton, Repeater, RankList) report changes through these shared regions instead of each adding its own.

  **Review:** nothing visible changes when you press a button. With a screen reader on, "Announce politely" says "3 results" after what it is reading; "Announce assertively" interrupts with "Could not save". Pressing the same button twice announces the message twice.
-->
<Story name="Buttons" asChild>
  {@render buttons()}
</Story>

<!--
  Both politeness levels, checked in the DOM.

  **Why:** `role="status"` is polite and `role="alert"` assertive. The regions are created on the first call, appended to `<body>` and reused; a repeated message is cleared and set again on the next frame, so it is announced again.

  **Review:** same as Buttons; the test checks each region's role and text.
-->
<Story
  name="Regions"
  asChild
  play={async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Announce politely' }));
    const status = regionFor('polite');
    await expect(status).not.toBeNull();
    await expect(status).toHaveAttribute('role', 'status');
    await expect(status).toHaveAttribute('aria-atomic', 'true');
    await expect(status).toHaveClass('ilw-visually-hidden');
    await expect(status?.parentElement).toBe(document.body);
    await waitFor(() => expect(status).toHaveTextContent('3 results'));

    await userEvent.click(canvas.getByRole('button', { name: 'Announce assertively' }));
    const alert = regionFor('assertive');
    await expect(alert).toHaveAttribute('role', 'alert');
    await waitFor(() => expect(alert).toHaveTextContent('Could not save'));
    await expect(status).toHaveTextContent('3 results');

    // Again: the same element is reused, emptied, then refilled.
    announce('3 results');
    await expect(regionFor('polite')).toBe(status);
    await expect(status?.textContent).toBe('');
    await waitFor(() => expect(status).toHaveTextContent('3 results'));
    await expect(document.querySelectorAll('[data-ilw-announce]')).toHaveLength(2);
  }}
>
  {@render buttons()}
</Story>
