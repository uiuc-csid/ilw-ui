<!--
  A native <table> over a createDataTable table. The page supplies the header
  row and each body row as snippets, so it keeps its own markup; this adds no
  classes and no styles (the toolkit styles th/td).
-->
<script lang="ts" generics="T extends RowData">
  import type { RowData } from '@tanstack/svelte-table';
  import type { Snippet } from 'svelte';
  import type { HTMLTableAttributes } from 'svelte/elements';

  import type { AnyDataTable } from './data-table.ts';
  import DataRows from './DataRows.svelte';

  let {
    table,
    header,
    row,
    empty,
    ...attrs
  }: HTMLTableAttributes & {
    table: AnyDataTable<T>;
    /** The <tr> inside <thead>; there is no <thead> without it. */
    header?: Snippet;
    row: Snippet<[T, number]>;
    empty?: Snippet;
  } = $props();
</script>

<table {...attrs}>
  {#if header}<thead>{@render header()}</thead>{/if}
  <tbody><DataRows {table} {row} {empty} /></tbody>
</table>
