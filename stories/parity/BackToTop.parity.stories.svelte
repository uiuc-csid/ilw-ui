<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import BackToTop from '../../src/svelte/BackToTop.svelte';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/BackToTop' });

  const paragraphs = Array.from({ length: 30 }, (_, i) => i + 1);

  // Both sides start hidden at the top of the page; scroll to the bottom so they show.
  async function scrollDown() {
    const scroller = document.scrollingElement!;
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'instant' });
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
</script>

{#snippet filler()}
  {#each paragraphs as n (n)}<p>Paragraph {n}, so the page scrolls.</p>{/each}
{/snippet}

<!--
  `<ilw-back-to-top>`, scrolled to the bottom of a long page, styled and scripted by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code. The play function only scrolls, so the button shows.

  **Review:** compare with **IlwUi** or **Side By Side**: a round arrow at the bottom right.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }} play={scrollDown}>
  {@render filler()}
  <ilw-back-to-top></ilw-back-to-top>
</Story>

<!--
  `BackToTop`, scrolled to the bottom of the same page, styled by ilw-ui's `back-to-top.css` only.

  **Why:** the play function checks the look against upstream's: a 48 px circle in the heading colour with a 2 px border, 40 px from the bottom right, and a 36 px arrow.

  **Review:** matches **Toolkit**. Hover swaps the colours; Tab to it for the focus colours.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ canvas }) => {
    await scrollDown();
    const link = canvas.getByRole('link', { name: 'Back to top' });
    const style = getComputedStyle(link);
    await expect([style.width, style.height, style.borderRadius, style.borderTopWidth]).toEqual(['48px', '48px', '50%', '2px']);
    await expect([style.right, style.bottom]).toEqual(['40px', '40px']);
    await expect(style.backgroundColor).toBe('rgb(19, 41, 75)');
    await expect(getComputedStyle(link.querySelector('svg')!).width).toBe('36px');
  }}
>
  {@render filler()}
  <BackToTop />
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same button at the bottom right of each frame.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-backtotop" theme={String(context.globals.theme ?? 'light')} height={240} />
  {/snippet}
</Story>
