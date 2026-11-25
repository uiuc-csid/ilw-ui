<!--
  A run's notes section for the Tabs panel-context stories: one TabPanel used
  on its own, without a Tabs, as a headed section whose content (TabPanelProbe)
  reads `getTabPanel()`.
-->
<script lang="ts">
  import TabPanel from '../src/svelte/TabPanel.svelte';
  import TabPanelProbe from './TabPanelProbe.svelte';
</script>

<h2>Matcher run notes</h2>
<p>A single section needs no tab list; its content still knows its panel.</p>
<TabPanel id="run-notes" label="Notes">
  <TabPanelProbe sheet="Notes" />
</TabPanel>
