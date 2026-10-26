<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import Pagination from '../src/svelte/Pagination.svelte';

  // Links go to #page-N, so following one keeps the story loaded.
  const { Story } = defineMeta({
    title: 'Pagination',
    parameters: { styles: 'ilw-ui' },
  });

  const href = (p: number) => `#page-${p}`;
</script>

<!--
  Page 6 of 12, with no play function.

  **Why:** the fixture for `tests/e2e/pagination.spec.ts` (Tab order, Enter follows a link).

  **Review:** Previous, 1 … 4 5 6 7 8 … 12, Next, then "Page 6 of 12". 6 is filled.
-->
<Story name="Fixture">
  <Pagination page={6} pages={12} {href} />
</Story>

<!--
  The first and last pages, and a single page.

  **Why:** the play function checks Previous is text on the first page, Next is text on the last, and one page renders just "1" between two text labels.

  **Review:** three rows; the text Previous and Next aren't outlined.
-->
<Story
  name="Ends"
  play={async ({ canvas }) => {
    const first = canvas.getByRole('navigation', { name: 'Pages, first' });
    await expect(first.querySelector('.ilw-pagination-previous > span')).toHaveTextContent('Previous');
    await expect(first.querySelector('.ilw-pagination-next > a')).toHaveAttribute('href', '#page-2');

    const last = canvas.getByRole('navigation', { name: 'Pages, last' });
    await expect(last.querySelector('.ilw-pagination-previous > a')).toHaveAttribute('href', '#page-7');
    await expect(last.querySelector('.ilw-pagination-next > span')).toHaveTextContent('Next');
    await expect(last.querySelector('a[aria-current="page"]')).toHaveAccessibleName('Page 8');

    const one = canvas.getByRole('navigation', { name: 'Pages, single' });
    await expect([...one.querySelectorAll('li')].map((li) => li.textContent?.trim())).toEqual(['Previous', '1', 'Next']);
    await expect(one.querySelectorAll('a')).toHaveLength(1);
    await expect(one.querySelector('.ilw-pagination-count')).toHaveTextContent('Page 1 of 1');
  }}
>
  <Pagination page={1} pages={8} {href} label="Pages, first" />
  <Pagination page={8} pages={8} {href} label="Pages, last" />
  <Pagination page={1} pages={1} {href} label="Pages, single" />
</Story>

<!--
  Links built from `url` and `parameter`, a 0-based `href`, an out-of-range `page`, and `hidePageCount`.

  **Why:** the play function checks `url`'s other query values and fragment survive, `parameter` names the query value, `href` replaces both, `page` is clamped to `1…pages`, and `hidePageCount` drops the count.

  **Review:** three rows; only the first has a page count.
-->
<Story
  name="Links"
  play={async ({ canvas }) => {
    const query = canvas.getByRole('navigation', { name: 'Pages, query' });
    await expect(query.querySelector('a[aria-label="Page 3"]')).toHaveAttribute('href', '?q=chem&p=3#results');

    // Drupal-style 0-based pages: the link for page 1 says p=0.
    const zero = canvas.getByRole('navigation', { name: 'Pages, 0-based' });
    await expect(zero.querySelector('a[aria-label="Page 1"]')).toHaveAttribute('href', '?p=0');
    await expect(zero.querySelector('.ilw-pagination-count')).toBeNull();

    // page 9 of 5 is page 5.
    const clamped = canvas.getByRole('navigation', { name: 'Pages, clamped' });
    await expect(clamped.querySelector('a[aria-current="page"]')).toHaveAccessibleName('Page 5');
  }}
>
  <Pagination page={2} pages={5} url="?q=chem#results" parameter="p" label="Pages, query" />
  <Pagination page={2} pages={5} href={(p) => `?p=${p - 1}`} hidePageCount label="Pages, 0-based" />
  <Pagination page={9} pages={5} {href} hidePageCount label="Pages, clamped" />
</Story>

<!--
  The default and a blue theme class on the nav.

  **Why:** the play function checks a theme class restyles it: on `ilw-theme-blue-1` the links are white on Illinois Blue.

  **Review:** the second row is blue, its current page white.
-->
<Story
  name="Themes"
  play={async ({ canvas }) => {
    const blue = canvas.getByRole('navigation', { name: 'Pages, blue' });
    const link = blue.querySelector('a:not([aria-current])')!;
    await expect(getComputedStyle(link).backgroundColor).toBe('rgb(19, 41, 75)');
    await expect(getComputedStyle(link).color).toBe('rgb(255, 255, 255)');
  }}
>
  <Pagination page={3} pages={5} {href} />
  <Pagination page={3} pages={5} {href} label="Pages, blue" class="ilw-theme-blue-1" />
</Story>
