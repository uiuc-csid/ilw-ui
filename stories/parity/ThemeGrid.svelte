<script lang="ts">
  import ThemeSwatch from './ThemeSwatch.svelte';
  import { THEMES } from './themes.ts';

  /** 'all', or one theme id from THEMES. */
  let { variant = 'all' }: { variant?: string } = $props();
  const shown = $derived(variant === 'all' ? THEMES : THEMES.filter((t) => t.id === variant));
</script>

<!-- The grid sits on the page default, so dark mode shows on the page too. -->
<div class="grid">
  {#each shown as theme (theme.id)}
    <ThemeSwatch {theme} />
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
    gap: 1rem;
    padding: 1rem;
    background: var(--ilw-color--background);
    color: var(--ilw-color--text);
  }
</style>
