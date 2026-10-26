<!--
  Pagination (C5), rendering the markup documented in the README: links to the
  pages of a server-rendered list, the CSS form of <ilw-pagination>. The page
  list is Pager's (pageWindow: the first, the last and two either side of the
  current page), between First and Previous and Next and Last, with "Page x of
  y" after it. The current page stays a link, marked aria-current="page";
  First and Previous on the first page, and Next and Last on the last, are
  plain text. Styled by pagination.css.
-->
<script lang="ts">
  import { pageHref, pageWindow } from '../core/index.ts';

  let {
    page,
    pages,
    url = '',
    parameter = 'page',
    href,
    label = 'Pages',
    hidePageCount = false,
    class: className = '',
  }: {
    /** The current page, 1-based. */
    page: number;
    /** How many pages there are. */
    pages: number;
    /** The list's URL, relative or absolute; each link sets `parameter` in its query and keeps the rest. */
    url?: string;
    /** The query parameter holding the page number. */
    parameter?: string;
    /** Builds each page's link instead of `url` and `parameter`, e.g. for 0-based or path-based pages. */
    href?: (page: number) => string;
    /** The navigation landmark's accessible name; give two paginations on one page distinct names. */
    label?: string;
    /** Leave out "Page x of y". */
    hidePageCount?: boolean;
    /** More classes on the nav, e.g. a theme class. */
    class?: string;
  } = $props();

  const total = $derived(Math.max(1, Math.floor(pages)));
  const current = $derived(Math.min(Math.max(1, Math.floor(page)), total));
  const link = $derived(href ?? ((p: number) => pageHref(url, p, parameter)));
  const shown = $derived(pageWindow(current, total));
</script>

<nav class={['ilw-pagination', className]} aria-label={label}>
  <ul>
    <li class="ilw-pagination-first">
      {#if current > 1}<a href={link(1)} aria-label="First page">First</a>{:else}<span>First</span>{/if}
    </li>
    <li class="ilw-pagination-previous">
      {#if current > 1}<a href={link(current - 1)} aria-label="Previous page">Previous</a>{:else}<span>Previous</span>{/if}
    </li>
    {#each shown as p, i (p ?? `gap-${i}`)}
      {#if p === null}
        <li class="ilw-pagination-ellipsis"><span>…</span></li>
      {:else}
        <li><a href={link(p)} aria-label="Page {p}" aria-current={p === current ? 'page' : undefined}>{p}</a></li>
      {/if}
    {/each}
    <li class="ilw-pagination-next">
      {#if current < total}<a href={link(current + 1)} aria-label="Next page">Next</a>{:else}<span>Next</span>{/if}
    </li>
    <li class="ilw-pagination-last">
      {#if current < total}<a href={link(total)} aria-label="Last page">Last</a>{:else}<span>Last</span>{/if}
    </li>
  </ul>
  {#if !hidePageCount}<span class="ilw-pagination-count">Page {current} of {total}</span>{/if}
</nav>
