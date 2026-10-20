<script lang="ts">
  import { TABLE_VARIANTS } from './tables.ts';

  /** 'all', or one variant id from TABLE_VARIANTS. */
  let { variant = 'all' }: { variant?: string } = $props();
  const shown = $derived(variant === 'all' ? TABLE_VARIANTS : TABLE_VARIANTS.filter((v) => v.id === variant));

  const rows = [
    { name: 'Avery', course: 'CS 225', hours: 20 },
    { name: 'Blake', course: 'CS 124', hours: 10 },
    { name: 'Casey', course: 'CS 173', hours: 15 },
    { name: 'Devon', course: 'CS 128', hours: 12 },
  ];
</script>

{#snippet table(cls: string | undefined, caption: string, rowHeaders: boolean)}
  <table class={cls}>
    <caption>{caption}</caption>
    <thead>
      <tr><th scope="col">Name</th><th scope="col">Course</th><th scope="col">Hours per week</th></tr>
    </thead>
    <tbody>
      {#each rows as row (row.name)}
        <tr>
          {#if rowHeaders}<th scope="row">{row.name}</th>{:else}<td>{row.name}</td>{/if}
          <td>{row.course}</td>
          <td>{row.hours}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/snippet}

<!-- Each variant on the page default, so dark mode shows around it too. -->
<div class="tables">
  {#each shown as v (v.id)}
    {#if v.wrap === 'responsive'}
      <!-- A scrolling region must be focusable so keyboard users can scroll it (axe scrollable-region-focusable). -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div class="ilw-table-responsive" role="region" aria-label="{v.label} (scrolls sideways)" tabindex="0">
        {@render table(v.cls, v.label, false)}
      </div>
    {:else if v.wrap === 'format'}
      <div class="ilw-format">{@render table(v.cls, v.label, false)}</div>
    {:else}
      {@render table(v.cls, v.label, v.rowHeaders ?? false)}
    {/if}
  {/each}
</div>

<style>
  .tables {
    display: grid;
    gap: 1.5rem;
    padding: 1rem;
    background: var(--ilw-color--background);
    color: var(--ilw-color--text);
  }
</style>
