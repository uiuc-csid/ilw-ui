<!--
  The page title (B5), rendering the markup documented in the README: the
  page's <h1> on a colour plate, over an optional decorative background image.
  Styled by page-title.css.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { LayoutWidth } from './layout.ts';

  let {
    theme,
    fade = false,
    image,
    width,
    class: className = '',
    children,
  }: {
    /** The toolkit's `theme`: unset is white text on the heading colour. */
    theme?: 'blue' | 'orange' | 'white';
    /** Fades the image out downwards and makes the plate solid. */
    fade?: boolean;
    /** The background image's URL. It is decorative (`alt=""`): the heading carries the content. */
    image?: string;
    /** `full` spans the page; `auto` and `page` span it with the text at the side margin (the toolkit treats them alike). */
    width?: LayoutWidth;
    /** More classes on the outer element. */
    class?: string;
    /** The heading text, rendered inside the `<h1>`. */
    children: Snippet;
  } = $props();
</script>

<div
  class={[
    'ilw-page-title',
    theme && `ilw-page-title--${theme}`,
    fade && 'ilw-page-title--fade',
    width && (width === 'full' ? 'ilw-width-full' : 'ilw-width-auto'),
    className,
  ]}
>
  {#if image}
    <img class="ilw-page-title-background" src={image} alt="" />
  {/if}
  <div class="ilw-page-title-inner">
    <div class="ilw-page-title-text">
      <h1>{@render children()}</h1>
    </div>
  </div>
</div>
