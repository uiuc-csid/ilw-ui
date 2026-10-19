<!--
  A SortableTh driven by a createDataTable table's sort state for column `id`:
  the sorted column flips, another column starts ascending, and a paged table
  goes back to page 1. Focus stays on the heading button.
-->
<script lang="ts" generics="T extends RowData">
  import type { RowData } from '@tanstack/svelte-table';
  import { flushSync } from 'svelte';

  import type { Sort } from '../core/index.ts';
  import { type AnyDataTable, isPaged } from './data-table.ts';
  import SortableTh from './SortableTh.svelte';

  let {
    table,
    id,
    label,
  }: {
    table: AnyDataTable<T>;
    /** The column id; also the button's `data-sort`. */
    id: string;
    label: string;
  } = $props();

  const sorted = $derived(table.getColumn(id)?.getIsSorted() ?? false);
  const sort: Sort = $derived(sorted ? { key: id, dir: sorted === 'asc' ? 1 : -1 } : { key: '', dir: 1 });

  function onsort() {
    const column = table.getColumn(id);
    if (!column) return;
    const button = document.activeElement;
    const scope = button instanceof HTMLElement ? button.closest('table') : null;
    column.toggleSorting(column.getIsSorted() === 'asc', false);
    if (isPaged(table)) table.setPageIndex(0);
    flushSync();
    // If the page re-rendered its header, focus the new button.
    if (scope && !scope.contains(document.activeElement)) {
      scope.querySelector<HTMLButtonElement>(`th > button[data-sort="${CSS.escape(id)}"]`)?.focus();
    }
  }
</script>

<SortableTh key={id} {label} {sort} {onsort} />
