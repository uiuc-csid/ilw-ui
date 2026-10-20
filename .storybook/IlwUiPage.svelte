<script lang="ts">
  import type { Snippet } from 'svelte';

  import Page from '../src/svelte/Page.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<!-- 'ilw-ui' stories render inside ilw-ui's own page shell (B1): skip link, then main. -->
<Page>
  {@render children()}
</Page>
