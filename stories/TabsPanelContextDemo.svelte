<!--
  A matcher run's results page for the Tabs panel-context stories: a heading
  naming the tab list, a lead-in, and one tab per sheet of the run, whose
  content (TabPanelProbe) reads its panel from `getTabPanel()` and loads its
  sheet the first time the panel shows. Buttons above the box show an
  "Overview" panel before the others (in an `{#if}`), pick the Warnings sheet
  through the bound `selected`, and add a warning (the Warnings tab's label
  counts them). A probe after the box sits outside every TabPanel.
-->
<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import TabPanel from '../src/svelte/TabPanel.svelte';
  import Tabs from '../src/svelte/Tabs.svelte';
  import TabPanelProbe from './TabPanelProbe.svelte';

  let {
    selected = $bindable(),
    ...props
  }: Omit<ComponentProps<typeof Tabs>, 'children' | 'labelledby'> = $props();
  let overview = $state(false);
  let warnings = $state(2);
</script>

<h2 id="run-heading">Matcher run results</h2>
<p>Each sheet of the run's workbook is a tab. A sheet loads the first time you open it.</p>
<p>
  <button type="button" class="ilw-button" aria-pressed={overview} onclick={() => (overview = !overview)}>
    Show overview
  </button>
  <button type="button" class="ilw-button" onclick={() => (selected = 'run-warnings')}>Go to warnings</button>
  <button type="button" class="ilw-button" onclick={() => (warnings += 1)}>Add a warning</button>
</p>
<Tabs {...props} labelledby="run-heading" bind:selected>
  {#if overview}
    <TabPanel id="run-overview" label="Overview">
      <TabPanelProbe sheet="Overview" />
    </TabPanel>
  {/if}
  <TabPanel id="run-assignments" label="Assignments">
    <TabPanelProbe sheet="Assignments" />
  </TabPanel>
  <TabPanel id="run-validation" label="Validation">
    <TabPanelProbe sheet="Validation" />
  </TabPanel>
  <TabPanel id="run-warnings" label="Warnings ({warnings})">
    <TabPanelProbe sheet="Warnings" />
  </TabPanel>
</Tabs>
<p>Read the <a href="#run-validation">validation sheet</a> before publishing the run.</p>
<TabPanelProbe sheet="Summary" />
<p>Selected: <output data-testid="selected">{selected ?? 'none'}</output></p>
