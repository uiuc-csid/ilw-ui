<script lang="ts">
  // Story-only: the "server" behind an async story. It lists the searches
  // waiting for an answer, so a reviewer can hold the loading state, answer
  // or fail a search, and answer one that was aborted (nothing must change).
  // Not part of the page the story stands in for.
  import type { StubRequest } from './stub-source.svelte.ts';

  let { server }: { server: { pending: StubRequest[] } } = $props();
</script>

<aside class="stub-server" aria-labelledby="stub-server-heading">
  <h2 id="stub-server-heading">Test server (story only)</h2>
  {#if server.pending.length}
    <ul>
      {#each server.pending as request, i (request)}
        <li>
          Search for <q>{request.query}</q>
          <button type="button" data-testid="respond-{i}" onclick={request.respond}>Respond</button>
          <button type="button" data-testid="fail-{i}" onclick={request.fail}>Fail</button>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No searches waiting.</p>
  {/if}
</aside>
