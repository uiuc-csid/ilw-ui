<!--
  Breadcrumbs (B4), rendering the markup documented in the README: a labelled
  nav with an ordered list of links, ending in the current page, unlinked and
  marked aria-current="page". Styled by breadcrumbs.css.
-->
<script module lang="ts">
  export interface Crumb {
    label: string;
    href: string;
  }
</script>

<script lang="ts">
  import { type LayoutWidth, widthClass } from '../core/layout.ts';

  let {
    items,
    current,
    label = 'Breadcrumbs',
    width,
    class: className = '',
  }: {
    /** The trail from the site's home page, all linked. */
    items: Crumb[];
    /** The current page's title, shown last and not linked. */
    current: string;
    /** The navigation landmark's accessible name. */
    label?: string;
    /** Breaks out of the page margins (`full`, `auto`), or keeps to them (`page`). */
    width?: LayoutWidth;
    /** More classes on the nav, e.g. a theme class. */
    class?: string;
  } = $props();
</script>

<nav class={['ilw-breadcrumbs', widthClass(width), className]} aria-label={label}>
  <ol>
    {#each items as item, i (i)}
      <li><a href={item.href}>{item.label}</a></li>
    {/each}
    <li><span aria-current="page">{current}</span></li>
  </ol>
</nav>
