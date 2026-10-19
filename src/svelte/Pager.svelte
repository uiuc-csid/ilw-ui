<!--
  Page buttons for a paged createDataTable table: previous, the page window
  (first, last and two either side of the current page, with an ellipsis for a
  gap), next, and the "first–last of total" count. A page may render two pagers
  over one table; they stay in step. After paging by keyboard, focus stays in
  this pager: on the pressed button, or on the current page's button when the
  pressed one is now disabled.

  By default the markup is ta-manager's legacy unranked-courses pager, byte for
  byte (no whitespace between elements, no ARIA). `a11y` adds the nav landmark,
  type=button, named previous/next and aria-current.
-->
<script lang="ts" generics="T extends RowData">
  import type { RowData } from '@tanstack/svelte-table';
  import { flushSync } from 'svelte';

  import { pageWindow } from '../core/index.ts';
  import { legacyPagerClasses, type PagedDataTableInstance, type PagerClasses } from './data-table.ts';

  let {
    table,
    emptyLabel,
    a11y = false,
    label = 'Pages',
    classes = {},
    onpage,
  }: {
    table: PagedDataTableInstance<T>;
    /** The count text when no row passes the filters, e.g. "No courses". */
    emptyLabel: string;
    /** Render the accessible markup: a labelled `<nav>`, `type="button"`, named previous/next, `aria-current`. */
    a11y?: boolean;
    /** With `a11y`, the navigation landmark's accessible name. */
    label?: string;
    /** Class names, merged over `legacyPagerClasses` (e.g. pass `ilwPagerClasses`). */
    classes?: Partial<PagerClasses>;
    /** Called after the page changes (1-based), e.g. to scroll the table into view. */
    onpage?: (page: number) => void;
  } = $props();

  const cls = $derived({ ...legacyPagerClasses, ...classes });

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
  const type = $derived(a11y ? 'button' : undefined);

  function go(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
    const button = event.currentTarget;
    const p = parseInt(button.dataset.page ?? '', 10);
    if (Number.isNaN(p) || p < 1 || p > totalPages) return;
    const hadFocus = document.activeElement === button;
    table.setPageIndex(p - 1);
    flushSync();
    if (hadFocus && (button.disabled || !button.isConnected)) {
      root.querySelector<HTMLButtonElement>(`button.${cls.current.trim().split(/\s+/).map(CSS.escape).join('.')}`)?.focus();
    }
    onpage?.(p);
  }
</script>

<!-- No whitespace between elements: the legacy markup has none. -->
<svelte:element
  this={a11y ? 'nav' : 'div'}
  class={cls.root}
  aria-label={a11y ? label : undefined}
  bind:this={root}
  ><span class={cls.label}>Page:</span><button
    {type}
    class={cls.button}
    data-page={page - 1}
    disabled={page <= 1}
    aria-label={a11y ? 'Previous page' : undefined}
    onclick={go}>‹</button
  >{#each pages as p, i (p ?? `gap-after-${pages[i - 1]}`)}{#if p === null}<span class={cls.ellipsis}>…</span
      >{:else}<button
        {type}
        class={p === page ? `${cls.button} ${cls.current}` : cls.button}
        data-page={p}
        aria-current={a11y && p === page ? 'page' : undefined}
        onclick={go}>{p}</button
      >{/if}{/each}<button
    {type}
    class={cls.button}
    data-page={page + 1}
    disabled={page >= totalPages}
    aria-label={a11y ? 'Next page' : undefined}
    onclick={go}>›</button
  ><span class={cls.count}>{count}</span></svelte:element
>
