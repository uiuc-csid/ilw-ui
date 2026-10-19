<!--
  The rows of a createDataTable table, for a page whose <table> and <thead> are
  already in its HTML: mount it into that table's <tbody>. `row` renders each
  <tr>, keyed by the table's row id; `empty` renders when no row passes the
  filters.
-->
<script lang="ts" generics="T extends RowData">
  import type { RowData } from '@tanstack/svelte-table';
  import type { Snippet } from 'svelte';

  import type { AnyDataTable } from './data-table.ts';

  let {
    table,
    row,
    empty,
  }: {
    table: AnyDataTable<T>;
    /** One body row: the row object and its index on the current page. */
    row: Snippet<[T, number]>;
    empty?: Snippet;
  } = $props();
</script>

{#each table.getRowModel().rows as r, i (r.id)}{@render row(r.original, i)}{:else}{@render empty?.()}{/each}
