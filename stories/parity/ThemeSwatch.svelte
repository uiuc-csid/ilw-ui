<script lang="ts">
  import type { Theme } from './themes.ts';

  let { theme }: { theme: Theme } = $props();
  // `theme` isn't a typed HTML attribute; the toolkit selects on it ([theme=blue]).
  const attrs = $derived(theme.attr ? { theme: theme.attr } : {});
</script>

<!-- Paints a theme's --ilw-color--* properties: the theme rules only set
     properties, and components read them. Story-only styles, so both sides of
     a parity pair paint the same way and only the property values differ. -->
<div class={['swatch', theme.cls]} id="swatch-{theme.id}" data-theme-id={theme.id} {...attrs}>
  <h2>{theme.label}</h2>
  <p>Body text with <a href="#swatch-{theme.id}">a link</a>.</p>
  <button type="button">Control</button>
</div>

<style>
  .swatch {
    padding: 0.75rem 1rem 1rem;
    border: 1px solid var(--ilw-color--border);
    background: var(--ilw-color--background);
    color: var(--ilw-color--text);
    font-family: var(--il-font-sans, 'Source Sans 3', sans-serif);
  }

  /* Large text (WCAG: 18.66px bold): the toolkit's orange theme puts white on
     Illinois Orange (3.3:1) in headings and controls, which passes only at this size. */
  h2 {
    margin: 0 0 0.5rem;
    color: var(--ilw-color--heading);
    font: 700 1.5rem/1.2 var(--il-font-sans, 'Source Sans 3', sans-serif);
  }

  p {
    margin: 0 0 0.75rem;
    font: 400 1.125rem/1.5 var(--il-font-sans, 'Source Sans 3', sans-serif);
  }

  a {
    color: var(--ilw-color--link);
  }

  a:hover {
    color: var(--ilw-color--link-hover);
  }

  button {
    padding: 0.375rem 1rem;
    border: 2px solid var(--ilw-color--control-text);
    border-radius: 0;
    background: var(--ilw-color--control);
    color: var(--ilw-color--control-text);
    font: 700 1.25rem/1.2 var(--il-font-sans, 'Source Sans 3', sans-serif);
    cursor: pointer;
  }

  a:focus-visible,
  button:focus-visible {
    outline: 3px solid var(--ilw-color--focus--outline);
    outline-offset: 2px;
    background: var(--ilw-color--focus--background);
    color: var(--ilw-color--focus--text);
  }
</style>
