<script lang="ts">
  import { Button } from '../src/svelte/index.ts';

  // Every theme surface with a flat colour; the gradients' stops are checked in
  // the README's contrast table instead.
  const SURFACES = ['white', 'gray', 'blue', 'orange'];
</script>

<!-- `theme` isn't a typed HTML attribute; the theme rules select on it. -->
<div class="surfaces">
  {#each SURFACES as surface (surface)}
    <section class="surface" {...{ theme: surface }} aria-label="{surface} surface">
      <Button>On {surface}</Button>
    </section>
  {/each}
</div>

<style>
  .surfaces {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  /* The theme only sets properties; paint the surface so the ring sits on it. */
  .surface {
    padding: 1.5rem;
    background: var(--ilw-color--background);
  }
</style>
