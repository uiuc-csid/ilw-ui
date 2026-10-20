<script lang="ts">
  // A small island for the mountIslands stories: a labelled counter.
  let { label, start = 0 }: { label: string; start?: number } = $props();
  // svelte-ignore state_referenced_locally
  let count = $state(start);
</script>

<button type="button" class="island-counter" onclick={() => count++}>{label}: {count}</button>
