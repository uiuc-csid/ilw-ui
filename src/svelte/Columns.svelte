<!--
  Columns (A5), rendering the markup documented in the README: a row of
  weighted columns that stacks below 700px. Styled by columns.css.
-->
<script module lang="ts">
  export type ColumnsMode = '1x1' | '1x2' | '2x1' | '1x3' | '3x1' | '1x2x1' | 'sidebar-left' | 'sidebar-right';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  import { type LayoutTheme, type LayoutWidth, widthClass } from './layout.ts';

  let {
    mode = '1x1',
    reverse = false,
    gap,
    theme,
    width,
    class: className = '',
    children,
  }: {
    /** How the columns share the row (the toolkit's `mode`). */
    mode?: ColumnsMode;
    /** Right to left on wide screens. The reading order stays the DOM order: use it only when one side is decorative. */
    reverse?: boolean;
    /** The gap between columns; unset is 20px (30px for the sidebar modes). */
    gap?: string;
    /** A theme for the background. */
    theme?: LayoutTheme;
    /** Breaks out of the page margins, or keeps to them. */
    width?: LayoutWidth;
    /** More classes on the row. */
    class?: string;
    /** The columns: one element each. */
    children: Snippet;
  } = $props();

  const modeClass = $derived(
    mode === '1x1' ? undefined : mode.startsWith('sidebar') ? `ilw-columns--${mode}` : `ilw-${mode}`,
  );

  // `theme` isn't a typed HTML attribute; tokens.css selects on it ([theme=blue]).
  const themeAttr = $derived(theme ? { theme } : {});
</script>

<div
  class={['ilw-columns', modeClass, reverse && 'ilw-columns--reverse', widthClass(width), className]}
  {...themeAttr}
  style:--ilw-columns--gap={gap}
>
  {@render children()}
</div>
