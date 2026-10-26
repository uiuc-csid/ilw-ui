<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import Modal from '../../src/svelte/Modal.svelte';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Modal', args: { size: 'small' } });

  const title = 'Delete assignment?';
  const message = 'This removes the TA from CS 225.';
  const buttons = [
    { label: 'Cancel', value: false, autofocus: true },
    { label: 'Delete', value: true },
  ];
</script>

<!--
  `<ilw-modal open>` with a title, a message and two buttons, styled by the vendored toolkit only. The `size` arg picks the width.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  {#snippet template(args)}
    <ilw-modal open size={args.size}>
      <h2 slot="title">{title}</h2>
      <p>{message}</p>
      <div class="modal-buttons" style="display: flex; gap: 12px; margin-top: 1rem">
        {#each buttons as b (b.label)}<button type="button" class="ilw-button">{b.label}</button>{/each}
      </div>
    </ilw-modal>
  {/snippet}
</Story>

<!--
  `Modal`, open on mount, styled by ilw-ui's `styles.css` only.

  **Why:** the play function checks the look against the toolkit's values: the orange top border, the dimmed backdrop, the width for each size, the Montserrat title and the round × button.

  **Review:** matches **Toolkit**: same width, top offset, border, title, spacing and × button. The title is Illinois blue here (upstream's heading colour is a typo, so its title takes the text colour).
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ args }) => {
    const m = await waitFor(() => {
      const d = document.querySelector<HTMLDialogElement>('dialog.ilw-modal:modal');
      expect(d).not.toBeNull();
      return d!;
    });
    const s = getComputedStyle(m);
    await expect(s.borderTopWidth).toBe('8px');
    await expect(s.borderTopColor).toBe('rgb(255, 95, 5)');
    // color-mix() serialises as color(srgb …) in Chromium.
    await expect(getComputedStyle(m, '::backdrop').backgroundColor).toMatch(
      /^(rgba\(0, 0, 0, 0\.5\)|color\(srgb 0 0 0 \/ 0\.5\))$/,
    );
    const vw = document.documentElement.clientWidth;
    const rect = m.getBoundingClientRect();
    if (window.innerWidth <= 600) {
      // Below 600px (the Side By Side frames), every size is full width, 0.5rem in.
      await expect(rect.width).toBeCloseTo(vw - 16, 0);
      await expect(rect.top).toBeCloseTo(8, 0);
    } else {
      const want = { small: Math.max(vw * 0.35, 320), medium: Math.max(vw * 0.5, 320), large: Math.min(vw, 1200) };
      // Within 2%: with classic scrollbars (Linux CI), the gutter that
      // scrollbar-gutter keeps narrows the viewport the percentages resolve against.
      const expected = want[args.size as keyof typeof want];
      await expect(rect.width).toBeGreaterThan(expected * 0.98);
      await expect(rect.width).toBeLessThanOrEqual(expected + 0.5);
      await expect(rect.top).toBeCloseTo(window.innerHeight * 0.05, 0);
    }
    const h2 = getComputedStyle(m.querySelector('h2')!);
    await expect(h2.fontSize).toBe('36px');
    await expect(h2.fontFamily).toMatch(/Montserrat/);
    const close = getComputedStyle(m.querySelector('.ilw-modal-close')!);
    await expect([close.width, close.height, close.borderRadius]).toEqual(['32px', '32px', '50%']);
  }}
>
  {#snippet template(args)}
    <Modal {title} {message} {buttons} size={args.size} onclose={() => {}} />
  {/snippet}
</Story>

<!--
  Both sides, each in its own iframe, at each size.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same dialog on both sides at small, medium and large.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide
      pair="parity-modal"
      theme={String(context.globals.theme ?? 'light')}
      height={420}
      rows={[
        { label: 'Small', args: { size: 'small' } },
        { label: 'Medium', args: { size: 'medium' } },
        { label: 'Large', args: { size: 'large' } },
      ]}
    />
  {/snippet}
</Story>
