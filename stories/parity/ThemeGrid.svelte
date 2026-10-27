<script lang="ts">
  import ThemeSwatch from './ThemeSwatch.svelte';
  import { THEMES } from './themes.ts';

  import './ThemeGrid.css';

  /** 'all', or one theme id from THEMES. */
  let { variant = 'all' }: { variant?: string } = $props();
  const shown = $derived(variant === 'all' ? THEMES : THEMES.filter((t) => t.id === variant));
</script>

<!-- The grid sits on the page default, so dark mode shows on the page too. -->
<div class="theme-grid">
  {#each shown as theme (theme.id)}
    <ThemeSwatch {theme} />
  {/each}
</div>
