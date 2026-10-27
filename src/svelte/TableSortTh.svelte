<!--
  A SortableTh driven by a createDataTable table's sort state for column `id`:
  the sorted column flips, another column starts ascending, and a paged table
  goes back to page 1. Focus stays on the heading button.
-->
<script lang="ts" generics="T extends RowData">
  import type { RowData } from '@tanstack/svelte-table';
  import { flushSync } from 'svelte';

  import { type AnyDataTable, columnSort, toggleColumnSort } from '../core/data-table.ts';
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

  const sort = $derived(columnSort(table, id));

  function onsort() {
    const button = document.activeElement;
    const scope = button instanceof HTMLElement ? button.closest('table') : null;
    if (!toggleColumnSort(table, id)) return;
    flushSync();
    // If the page re-rendered its header, focus the new button.
    if (scope && !scope.contains(document.activeElement)) {
      scope.querySelector<HTMLButtonElement>(`th > button[data-sort="${CSS.escape(id)}"]`)?.focus();
    }
  }
</script>

<SortableTh key={id} {label} {sort} {onsort} />
