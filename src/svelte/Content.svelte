<!--
  Content (A5), rendering the markup documented in the README: a box of
  prose in the toolkit's type, with its modes. Styled by content.css and
  format.css.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  import { type LayoutTheme, type LayoutWidth, widthClass } from './layout.ts';

  let {
    mode,
    align = 'left',
    decoration = false,
    transparent = false,
    theme,
    width,
    class: className = '',
    children,
  }: {
    /** `introduction` opens a story, `lede` is a single highlighted passage, `inset` sits in a call to action. */
    mode?: 'introduction' | 'lede' | 'inset';
    /** The text alignment. */
    align?: 'left' | 'center' | 'right';
    /** A lede's accent bar (or, centred, a short rule underneath). */
    decoration?: boolean;
    /** No background of its own, whatever the theme. */
    transparent?: boolean;
    /** A theme: background, text and link colours. */
    theme?: LayoutTheme;
    /** Breaks out of the page margins, or keeps to them. */
    width?: LayoutWidth;
    /** More classes on the box. */
    class?: string;
    /** The prose. */
    children: Snippet;
  } = $props();

  // `theme` isn't a typed HTML attribute; tokens.css selects on it ([theme=blue]).
  const themeAttr = $derived(theme ? { theme } : {});
</script>

<div
  class={[
    'ilw-content',
    'ilw-format',
    mode && `ilw-content--${mode}`,
    align !== 'left' && `ilw-content--${align}`,
    decoration && 'ilw-content--decoration',
    transparent && 'ilw-content--transparent',
    widthClass(width),
    className,
  ]}
  {...themeAttr}
>
  <div class="ilw-content-inner">
    {@render children()}
  </div>
</div>
