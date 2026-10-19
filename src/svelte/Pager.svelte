<!--
  Page buttons for a paged createDataTable table: previous, the page window
  (first, last and two either side of the current page, with an ellipsis for a
  gap), next, and the "first–last of total" count. A page may render two pagers
  over one table; they stay in step. After paging by keyboard, focus stays in
  this pager: on the pressed button, or on the current page's button when the
  pressed one is now disabled.
-->
<script lang="ts" generics="T extends RowData">
  import type { RowData } from '@tanstack/svelte-table';
  import { flushSync } from 'svelte';

  import { pageWindow } from '../core/index.ts';
  import type { PagedDataTableInstance, PagerClasses } from './data-table.ts';

  let {
    table,
    emptyLabel,
    label = 'Pages',
    classes = {},
    onpage,
  }: {
    table: PagedDataTableInstance<T>;
    /** The count text when no row passes the filters, e.g. "No courses". */
    emptyLabel: string;
    /** The navigation landmark's accessible name. */
    label?: string;
    /** Class names, e.g. a consumer's existing pager classes. */
    classes?: Partial<PagerClasses>;
    /** Called after the page changes (1-based), e.g. to scroll the table into view. */
    onpage?: (page: number) => void;
  } = $props();

  const cls = $derived({
    root: 'ilw-pager',
    label: 'ilw-pager-label',
    button: 'ilw-pager-btn',
    current: 'on',
    ellipsis: 'ilw-pager-ellipsis',
    count: 'ilw-pager-count',
    ...classes,
  });

  let root: HTMLElement;

  const pagination = $derived(table.atoms.pagination.get());
  const total = $derived(table.getPrePaginatedRowModel().rows.length);
  const totalPages = $derived(Math.max(1, Math.ceil(total / pagination.pageSize)));
  const page = $derived(Math.min(pagination.pageIndex + 1, totalPages));
  const first = $derived((page - 1) * pagination.pageSize);
  const count = $derived(
    total === 0 ? emptyLabel : `${first + 1}–${Math.min(first + pagination.pageSize, total)} of ${total}`,
  );
  const pages = $derived(pageWindow(page, totalPages));

  function go(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
    const button = event.currentTarget;
    const p = parseInt(button.dataset.page ?? '', 10);
    if (Number.isNaN(p) || p < 1 || p > totalPages) return;
    const hadFocus = document.activeElement === button;
    table.setPageIndex(p - 1);
    flushSync();
    if (hadFocus && (button.disabled || !button.isConnected)) {
      root.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus();
    }
    onpage?.(p);
  }
</script>

<nav class={cls.root} aria-label={label} bind:this={root}>
  <span class={cls.label}>Page:</span>
  <button
    type="button"
    class={cls.button}
    data-page={page - 1}
    disabled={page <= 1}
    aria-label="Previous page"
    onclick={go}>‹</button
  >
  {#each pages as p, i (p ?? `gap-after-${pages[i - 1]}`)}
    {#if p === null}
      <span class={cls.ellipsis}>…</span>
    {:else}
      <button
        type="button"
        class={[cls.button, p === page && cls.current]}
        data-page={p}
        aria-current={p === page ? 'page' : undefined}
        onclick={go}>{p}</button
      >
    {/if}
  {/each}
  <button
    type="button"
    class={cls.button}
    data-page={page + 1}
    disabled={page >= totalPages}
    aria-label="Next page"
    onclick={go}>›</button
  >
  <span class={cls.count}>{count}</span>
</nav>
