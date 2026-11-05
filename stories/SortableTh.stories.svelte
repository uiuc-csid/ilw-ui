<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { fn } from 'storybook/test';

  import SortableTh from '../src/svelte/SortableTh.svelte';
  import * as plays from './plays/sortable-th.ts';
  import SortableTable from './SortableTable.svelte';

  const { Story } = defineMeta({
    title: 'SortableTh',
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
    component: SortableTh,
    args: { key: 'name', label: 'Name', onsort: fn() },
    // ilw-ui's table.css only, no toolkit: the tables carry class="ilw-table".
    parameters: { styles: 'ilw-ui' },
  });

  const NBSP = ' ';
</script>

{#snippet template(args: { key: string; label: string; sort: { key: string; dir: 1 | -1 }; onsort: (key: string) => void })}
  <table class="ilw-table">
    <thead><tr><SortableTh {...args} /></tr></thead>
    <tbody><tr><td>Avery</td></tr></tbody>
  </table>
{/snippet}

<!--
  A heading that isn't the sorted column.

  **Why:** the README fixes the `th`/button markup as the DOM contract (ta-manager selects on `th-sort` and `data-sort`). An unsorted heading carries no `aria-sort` and no arrow, so a screen reader doesn't announce a sort that isn't there.

  **Review:** the heading looks like plain header text, and underlines on hover. Clicking it calls `onsort('name')` (see the Actions panel).
-->
<Story name="Unsorted" args={{ sort: { key: 'hours', dir: 1 } }} {template} play={plays.unsorted} />

<!--
  The sorted column, ascending.

  **Why:** `aria-sort="ascending"` is what screen readers announce. The ↑ is decorative and `aria-hidden`, so the button's name stays just "Name".

  **Review:** the heading shows "Name ↑", with a non-breaking space so the arrow never wraps onto its own line.
-->
<Story name="Ascending" args={{ sort: { key: 'name', dir: 1 } }} {template} play={plays.ascending} />

<!--
  The sorted column, descending.

  **Why:** the play function checks the descending state: `aria-sort="descending"` on the `th`, `th-sort on` on the button, and the arrow in an `aria-hidden` span so the accessible name stays "Name".

  **Review:** the heading shows "Name ↓", and the arrow is hidden from screen readers.
-->
<Story name="Descending" args={{ sort: { key: 'name', dir: -1 } }} {template} play={plays.descending} />

<!--
  Has no `play` function: it is the starting page for `tests/e2e/sortable-th.spec.ts`. Three headings, sorted with `nextSort`.

  **Why:** Storybook runs a story's `play` function whenever it loads, so a spec needs a story without one to start from a clean state.

  **Review:** tab to a heading and press Enter or Space. The rows re-sort, and focus stays on the same button rather than dropping to `<body>` when the table re-renders.
-->
<Story name="Table" asChild>
  <SortableTable />
</Story>

<!--
  The same table, sorted by mouse.

  **Why:** `nextSort` flips the current column and starts a new column ascending. The heading buttons must survive the re-render, so focus isn't lost.

  **Review:** click Name: the rows reverse (Casey first). Click Hours: the rows sort by hours, Blake first, and the arrow moves to Hours.
-->
<Story name="Click sorts" asChild play={plays.clickSorts}>
  <SortableTable />
</Story>
