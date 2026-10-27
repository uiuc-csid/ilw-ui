<!-- A ChoiceChips bound to state, with the value shown under it, for stories. -->
<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import ChoiceChips from '../src/svelte/ChoiceChips.svelte';

  let { value = $bindable(), ...props }: ComponentProps<typeof ChoiceChips> = $props();
  let changes = $state<string[]>([]);
  const shown = $derived(Array.isArray(value) ? value.join(', ') || 'none' : (value ?? 'none'));
</script>

<ChoiceChips {...props} bind:value onchange={(v) => changes.push(Array.isArray(v) ? `[${v.join(' ')}]` : v)} />
<p>Chosen: <output data-testid="chosen">{shown}</output> (changes: <span data-testid="changes">{changes.join(', ')}</span>)</p>
