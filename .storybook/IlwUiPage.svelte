<script lang="ts">
  import type { Snippet } from 'svelte';

  import Page from '../src/svelte/Page.svelte';

  let { format = true, children }: { format?: boolean; children: Snippet } = $props();
</script>

<!-- 'ilw-ui' stories render inside ilw-ui's own page shell (B1): skip link, then main.
     Formatted (.ilw-format) by default, as the toolkit side's <ilw-page class="ilw-format">. -->
<Page {format}>
  {@render children()}
</Page>
