<!--
  The page shell (B1), rendering the markup documented in the README: a skip
  link, then the header, main and footer landmarks, and optionally the
  back-to-top link (B7), styled by page.css. The CSS form of <ilw-page>, plus
  the skip link the toolkit lacks. The shell has tabindex="-1" so following
  back-to-top moves focus to it, not to <body>.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  import BackToTop from './BackToTop.svelte';

  let {
    skipLinkText = 'Skip to main content',
    mainId = 'main-content',
    id = 'top',
    format = false,
    margin = false,
    expanded = false,
    backToTop = false,
    class: className = '',
    header,
    footer,
    children,
  }: {
    /** The skip link's text. */
    skipLinkText?: string;
    /** The id of `<main>`, which the skip link targets. */
    mainId?: string;
    /** The shell's own id, the back-to-top target. */
    id?: string;
    /** Adds `ilw-format` (the prose styles) to the shell. */
    format?: boolean;
    /** Adds `ilw-margin`: side margins on `main`. */
    margin?: boolean;
    /** Adds `ilw-page--expanded`: top and bottom margin on `main` (the toolkit's `expanded`). */
    expanded?: boolean;
    /** Adds the back-to-top link (B7) as the shell's last child, targeting its `id`. */
    backToTop?: boolean;
    /** More classes on the shell. */
    class?: string;
    /** The banner: a `<header>` (or the B2 header) is rendered as given. */
    header?: Snippet;
    /** The content info: a `<footer>` (or `Footer`) is rendered as given. */
    footer?: Snippet;
    /** The content of `<main>`. */
    children?: Snippet;
  } = $props();
</script>

<div class={['ilw-page', format && 'ilw-format', margin && 'ilw-margin', expanded && 'ilw-page--expanded', className]} {id} tabindex="-1">
  <a class="ilw-skip-link" href="#{mainId}">{skipLinkText}</a>
  {@render header?.()}
  <main id={mainId} tabindex="-1">
    {@render children?.()}
  </main>
  {@render footer?.()}
  {#if backToTop}
    <BackToTop target={id} />
  {/if}
</div>
