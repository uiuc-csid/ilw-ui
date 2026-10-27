<script module lang="ts">
  import './ButtonGrid.css';

  // The theme classes the toolkit's button rules name ('none': no class, the
  // blue outline button). -2 and -inverse aren't button themes upstream. Ids
  // double as story args, which allow only letters, digits, '-' and '_'.
  export const BUTTON_THEMES = ['none', 'blue', 'blue-outline', 'blue-1', 'blue-solid', 'orange', 'orange-outline', 'orange-1', 'orange-solid'];
  export const BUTTON_VARIANTS = ['all', 'lists', ...BUTTON_THEMES];
</script>

<script lang="ts">
  import { Button, type ButtonTheme } from '../../src/svelte/index.ts';

  /** 'all', 'lists', or one theme id from BUTTON_THEMES ('none' is no theme class). */
  let { variant = 'all' }: { variant?: string } = $props();
  const themes = $derived(variant === 'all' ? BUTTON_THEMES : BUTTON_THEMES.filter((t) => t === variant));
  const themeOf = (t: string) => (t === 'none' ? undefined : (t as ButtonTheme));
</script>

<!-- One row per theme: every size, then both disabled forms. Rendered with the
     Button component on both sides of the pair: its markup is the toolkit's. -->
<div class="button-grid">
  {#each themes as t (t)}
    <div class="button-grid-row" data-theme-id={t}>
      <Button theme={themeOf(t)} size="small" href="#{t}-small">Small</Button>
      <Button theme={themeOf(t)}>Medium</Button>
      <Button theme={themeOf(t)} size="large" href="#{t}-large">Large</Button>
      <Button theme={themeOf(t)} disabled>Disabled</Button>
      <Button theme={themeOf(t)} href="#{t}-off" disabled>Disabled link</Button>
    </div>
  {/each}
  {#if variant === 'all' || variant === 'lists'}
    <ul class="ilw-buttons">
      <li><a href="#list-1">Centred list</a></li>
      <li><button type="button">Of buttons</button></li>
    </ul>
    <ul class="ilw-buttons ilw-button-small">
      <li><a href="#list-2">Small list</a></li>
      <li><a href="#list-3">Of links</a></li>
    </ul>
    <ul class="ilw-buttons-left">
      <li><a class="ilw-button" href="#list-4">Left list</a></li>
      <li><a class="ilw-button ilw-theme-blue-solid" href="#list-5">Items carry .ilw-button</a></li>
    </ul>
  {/if}
</div>
