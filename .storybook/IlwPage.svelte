<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<!-- Stories render inside the toolkit page shell, as in consuming apps. -->
<ilw-page class="ilw-format">
  <main>
    {@render children()}
  </main>
</ilw-page>
