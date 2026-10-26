<!--
  An icon (A6), the replacement for <ilw-icon>: one Phosphor icon
  (https://phosphoricons.com) as inline SVG, sized by the font and coloured by
  currentColor as the toolkit's icon font is. Decorative unless it has `alt`.
  Styled by icon.css.
-->
<script lang="ts">
  import type { Component } from 'svelte';
  import type { IconComponentProps } from 'phosphor-svelte';

  let {
    icon: Glyph,
    type = 'solid',
    alt = '',
    size,
    class: className = '',
  }: {
    /** The icon: a Phosphor component, imported by its own path (`phosphor-svelte/lib/Calendar`). */
    icon: Component<IconComponentProps>;
    /** The toolkit's `type`: `'solid'` is Phosphor's fill weight, `'line'` its regular weight. */
    type?: 'solid' | 'line';
    /** The icon's accessible name. Leave it empty when text next to the icon says the same thing. */
    alt?: string;
    /** A CSS length for the width and height. Unset, the icon is 1em: it follows the font size. */
    size?: string;
    /** More classes on the `<svg>`. */
    class?: string;
  } = $props();
</script>

<!-- Phosphor sets role="img" on every icon; ours replace it, so a decorative icon has no role. -->
<Glyph
  weight={type === 'line' ? 'regular' : 'fill'}
  size={size ?? '1em'}
  class={['ilw-icon', className]}
  role={alt ? 'img' : undefined}
  aria-label={alt || undefined}
  aria-hidden={alt ? undefined : 'true'}
/>
