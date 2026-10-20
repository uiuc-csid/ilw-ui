<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<!-- 'ilw-ui' stories: no toolkit page shell, only the landmark a page would have. -->
<main>
  {@render children()}
</main>
