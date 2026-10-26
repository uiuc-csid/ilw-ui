<!-- A RadioGroup bound to state, with the value shown under it, for stories. -->
<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import RadioGroup from '../src/svelte/RadioGroup.svelte';

  let { value = $bindable(), ...props }: ComponentProps<typeof RadioGroup> = $props();
  let changes = $state<string[]>([]);
</script>

<RadioGroup {...props} bind:value onchange={(v) => changes.push(v)} />
<p>Chosen: <output data-testid="chosen">{value ?? 'none'}</output> (changes: <span data-testid="changes">{changes.join(', ')}</span>)</p>
