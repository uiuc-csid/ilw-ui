<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import BackToTop from '../../src/svelte/BackToTop.svelte';
  import * as plays from '../plays/back-to-top.ts';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/BackToTop' });

  const paragraphs = Array.from({ length: 60 }, (_, i) => i + 1);

  // The toolkit's scroll listener drops `top-of-page` from its shadow button once it re-renders.
  function toolkitShown(root: HTMLElement): boolean {
    const button = root.querySelector('ilw-back-to-top')?.shadowRoot?.querySelector('button');
    return !!button && !button.classList.contains('top-of-page');
  }
</script>

{#snippet filler()}
  {#each paragraphs as n (n)}<p>Paragraph {n}, so the page scrolls.</p>{/each}
{/snippet}

<!--
  `<ilw-back-to-top>`, scrolled to the bottom of a long page, styled and scripted by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code. The play function only scrolls, and waits for the button to drop `top-of-page`.

  **Review:** compare with **IlwUi** or **Side By Side**: a round arrow at the bottom right.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }} play={({ canvasElement }) => plays.scrollDown(() => toolkitShown(canvasElement))}>
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
  play={plays.parity}
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
