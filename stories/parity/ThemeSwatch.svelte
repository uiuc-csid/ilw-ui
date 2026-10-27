<script lang="ts">
  import type { Theme } from './themes.ts';

  import './ThemeSwatch.css';

  let { theme }: { theme: Theme } = $props();
  // `theme` isn't a typed HTML attribute; the toolkit selects on it ([theme=blue]).
  const attrs = $derived(theme.attr ? { theme: theme.attr } : {});
</script>

<!-- Paints a theme's --ilw-color--* properties: the theme rules only set
     properties, and components read them. Story-only styles, so both sides of
     a parity pair paint the same way and only the property values differ. -->
<div class={['theme-swatch', theme.cls]} id="swatch-{theme.id}" data-theme-id={theme.id} {...attrs}>
  <h2>{theme.label}</h2>
  <p>Body text with <a href="#swatch-{theme.id}">a link</a>.</p>
  <button type="button">Control</button>
</div>
