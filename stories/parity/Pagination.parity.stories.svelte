<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import Pagination from '../../src/svelte/Pagination.svelte';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Pagination' });

  const url = 'https://example.edu/courses?term=fa26';
</script>

<!--
  `<ilw-pagination>` on page 6 of 12, then page 1 of 4, styled by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**. The toolkit shows a five-page window without the first and last numbers; ilw-ui shows Pager's window (1 … 4 5 6 7 8 … 12) instead, so the rows differ in length.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <!-- Numbers, not strings: Svelte sets the properties, and a string page makes upstream's `page + 2` concatenate. -->
  <ilw-pagination pages={12} page={6} {url}></ilw-pagination>
  <ilw-pagination pages={4} page={1} {url} label="Pages, first"></ilw-pagination>
</Story>

<!--
  `Pagination` on page 6 of 12, then page 1 of 4, styled by ilw-ui's `pagination.css` only.

  **Why:** the play function checks the contract: a named nav, a list of links with the current page marked `aria-current="page"`, named First, Previous, Next and Last links, First and Previous as plain text on the first page, links that keep the rest of the query, and "Page x of y" after the list.

  **Review:** matches **Toolkit**: outlined page links, the current one filled, First, Previous, Next and Last as text, the count after a gap. Tab to a link: it fills with the focus colour inside a two-tone ring.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Pages' });
    const items = [...nav.querySelectorAll(':scope > ul > li')];
    await expect(items.map((li) => li.textContent?.trim())).toEqual(
      ['First', 'Previous', '1', '…', '4', '5', '6', '7', '8', '…', '12', 'Next', 'Last'],
    );
    const current = nav.querySelector('a[aria-current="page"]')!;
    await expect(current).toHaveAccessibleName('Page 6');
    await expect(current).toHaveAttribute('href', 'https://example.edu/courses?term=fa26&page=6');
    await expect(nav.querySelectorAll('[aria-current]')).toHaveLength(1);
    await expect(canvas.getAllByRole('link', { name: 'Previous page' })[0]).toHaveAttribute(
      'href',
      'https://example.edu/courses?term=fa26&page=5',
    );
    await expect(canvas.getAllByRole('link', { name: 'First page' })[0]).toHaveAttribute(
      'href',
      'https://example.edu/courses?term=fa26&page=1',
    );
    await expect(canvas.getAllByRole('link', { name: 'Last page' })[0]).toHaveAttribute(
      'href',
      'https://example.edu/courses?term=fa26&page=12',
    );
    await expect(nav.querySelector(':scope > .ilw-pagination-count')).toHaveTextContent('Page 6 of 12');
    // The current page is filled with the control text colour.
    await expect(getComputedStyle(current).backgroundColor).toBe(getComputedStyle(nav).color);

    // Page 1: First and Previous are text, not links; Next and Last are links.
    const first = canvas.getByRole('navigation', { name: 'Pages, first' });
    for (const [part, text] of [['first', 'First'], ['previous', 'Previous']]) {
      const el = first.querySelector(`.ilw-pagination-${part} > *`)!;
      await expect(el.tagName).toBe('SPAN');
      await expect(el).toHaveTextContent(text);
    }
    await expect(first.querySelector('.ilw-pagination-next > a')).toHaveAccessibleName('Next page');
    await expect(first.querySelector('.ilw-pagination-last > a')).toHaveAccessibleName('Last page');
    await expect(first.querySelectorAll('a')).toHaveLength(6);
  }}
>
  <Pagination page={6} pages={12} {url} />
  <Pagination page={1} pages={4} {url} label="Pages, first" />
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same link boxes, filled current page, text-or-link First, Previous, Next and Last, and page count on both sides.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-pagination" theme={String(context.globals.theme ?? 'light')} height={220} />
  {/snippet}
</Story>
