<script lang="ts">
  import { Button } from '../src/svelte/index.ts';

  import './ButtonSurfaces.css';

  // Every theme surface with a flat colour; the gradients' stops are checked in
  // the README's contrast table instead.
  const SURFACES = ['white', 'gray', 'blue', 'orange'];
</script>

<!-- `theme` isn't a typed HTML attribute; the theme rules select on it. -->
<div class="button-surfaces">
  {#each SURFACES as surface (surface)}
    <section class="button-surface" {...{ theme: surface }} aria-label="{surface} surface">
      <Button>On {surface}</Button>
    </section>
  {/each}
</div>
