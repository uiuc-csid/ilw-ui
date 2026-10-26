<!--
  Grid (A5), rendering the markup documented in the README: a list (or div)
  laid out as many equal columns as fit. Styled by grid.css.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  import { type LayoutTheme, type LayoutWidth, widthClass } from './layout.ts';

  let {
    as = 'ul',
    itemWidth,
    gap,
    theme,
    width,
    class: className = '',
    children,
  }: {
    /** `ul` (the default, so screen readers announce the count) or `div`. */
    as?: 'ul' | 'div';
    /** The narrowest a column may be (the toolkit's `innerwidth`); unset is 250px. */
    itemWidth?: string;
    /** The gap between items; unset is 10px. */
    gap?: string;
    /** A theme for the background. */
    theme?: LayoutTheme;
    /** Breaks out of the page margins, or keeps to them. */
    width?: LayoutWidth;
    /** More classes on the grid. */
    class?: string;
    /** The items: `<li>`s in a `ul`, `<div>`s in a `div`. */
    children: Snippet;
  } = $props();

  // `theme` isn't a typed HTML attribute; tokens.css selects on it ([theme=blue]).
  const themeAttr = $derived(theme ? { theme } : {});
</script>

<svelte:element
  this={as}
  class={['ilw-grid', widthClass(width), className]}
  {...themeAttr}
  style:--ilw-grid--item-width={itemWidth}
  style:--ilw-grid--gap={gap}
>
  {@render children()}
</svelte:element>
