<!--
  Stands in for a panel's content that needs its panel, like ta-manager's
  SheetTab: it reads `getTabPanel()` and shows the panel's id, label and
  whether it is active, and "loads" (counts a load and shows its rows) the
  first time its panel is active, as a lazy sheet fetches its data. Outside a
  TabPanel it says so.
-->
<script lang="ts">
  import { untrack } from 'svelte';

  import { getTabPanel } from '../src/svelte/tabs-context.ts';

  let { sheet }: { /** The sheet's name, in its caption. */ sheet: string } = $props();

  const panel = getTabPanel();
  const key = $derived(panel?.id ?? 'outside');
  let loads = $state(0);

  // Loads once, the first time the panel shows.
  $effect(() => {
    if (panel?.active && untrack(() => loads) === 0) loads += 1;
  });
</script>

<p>
  Panel <output data-testid="{key}-id">{panel?.id ?? 'none'}</output>, labelled
  <output data-testid="{key}-label">{panel?.label ?? 'none'}</output>; active:
  <output data-testid="{key}-active">{panel ? String(panel.active) : 'none'}</output>; loads:
  <output data-testid="{key}-loads">{loads}</output>.
</p>
{#if loads}
  <p>The {sheet} sheet: 12 rows.</p>
{:else}
  <p>The {sheet} sheet loads when its tab is chosen.</p>
{/if}
