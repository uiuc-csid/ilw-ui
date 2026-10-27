<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Pagination from '../../src/svelte/Pagination.svelte';
  import * as plays from '../plays/pagination.ts';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Pagination' });

  const url = 'https://example.edu/courses?term=fa26';
</script>

<!--
  `<ilw-pagination>` on page 6 of 12, then page 1 of 4, styled by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**. The toolkit adds First and Last and shows a five-page window without the first and last numbers; ilw-ui shows Pager's window (1 … 4 5 6 7 8 … 12) instead, so the rows differ in length.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <!-- Numbers, not strings: Svelte sets the properties, and a string page makes upstream's `page + 2` concatenate. -->
  <ilw-pagination pages={12} page={6} {url}></ilw-pagination>
  <ilw-pagination pages={4} page={1} {url} label="Pages, first"></ilw-pagination>
</Story>

<!--
  `Pagination` on page 6 of 12, then page 1 of 4, styled by ilw-ui's `pagination.css` only.

  **Why:** the play function checks the contract: a named nav, a list of links with the current page marked `aria-current="page"`, named Previous and Next links, Previous as plain text on the first page, links that keep the rest of the query, and "Page x of y" after the list.

  **Review:** matches **Toolkit**: outlined page links, the current one filled, Previous and Next as text, the count after a gap. Tab to a link: it fills with the focus colour inside a two-tone ring.
-->
<Story name="IlwUi" parameters={{ styles: 'ilw-ui' }} play={plays.parity}>
  <Pagination page={6} pages={12} {url} />
  <Pagination page={1} pages={4} {url} label="Pages, first" />
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same link boxes, filled current page, text Previous and Next, and page count on both sides.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-pagination" theme={String(context.globals.theme ?? 'light')} height={220} />
  {/snippet}
</Story>
