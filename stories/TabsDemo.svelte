<!--
  A department's "Programs" page section for Tabs stories: a heading that names
  the tab list, a lead-in paragraph, four program tabs, and a closing paragraph
  whose links point at panels by fragment. Shows the selected tab and every
  change under it. With `online`, a button above the box adds or removes an
  "Online Programs" panel between two others.
-->
<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import TabPanel from '../src/svelte/TabPanel.svelte';
  import Tabs from '../src/svelte/Tabs.svelte';

  let {
    selected = $bindable(),
    prefix = 'programs',
    online = false,
    ...props
  }: Omit<ComponentProps<typeof Tabs>, 'children'> & {
    /** Prefix for the heading's and panels' ids, so two demos can share a page. */
    prefix?: string;
    /** Adds the button that shows or hides the "Online Programs" panel. */
    online?: boolean;
  } = $props();
  let changes = $state<string[]>([]);
  let showOnline = $state(false);
</script>

<h2 id="{prefix}-heading">Programs</h2>
<p>Find the program that fits where you want to go. Each tab covers one way to study with us.</p>
{#if online}
  <p>
    <button type="button" class="ilw-button" aria-pressed={showOnline} onclick={() => (showOnline = !showOnline)}>
      Include online programs
    </button>
  </p>
{/if}
<Tabs {...props} labelledby="{prefix}-heading" bind:selected onchange={(id) => changes.push(id)}>
  <TabPanel id="{prefix}-degree" label="Degree Programs">
    <p>
      Choose from more than 150 undergraduate majors and 100 graduate and professional programs. Every program pairs
      coursework with research, internships and study abroad.
    </p>
    <p><a href="#{prefix}-majors">Browse all majors</a></p>
  </TabPanel>
  <TabPanel id="{prefix}-non-degree" label="Non-degree Programs">
    <p>Certificates, summer sessions and courses for visiting students, on campus and online.</p>
    <p><a href="#{prefix}-certificates">Find a certificate</a></p>
  </TabPanel>
  <TabPanel id="{prefix}-classroom" label="Classroom Experience">
    <p>Small discussion sections, hands-on labs and faculty who know your name.</p>
  </TabPanel>
  {#if showOnline}
    <TabPanel id="{prefix}-online" label="Online Programs">
      <p>Earn a degree or certificate online, with the same faculty and the same diploma.</p>
    </TabPanel>
  {/if}
  <TabPanel id="{prefix}-research" label="Undergraduate Research">
    <p>Undergraduates join faculty labs from their first year, with paid positions in every college.</p>
    <ul>
      <li>Summer research programs</li>
      <li>Research symposium each April</li>
    </ul>
  </TabPanel>
</Tabs>
<p>
  Still deciding? Read about <a href="#{prefix}-research">undergraduate research</a> or
  <a href="#{prefix}-classroom">the classroom experience</a>.
</p>
<p>Selected: <output data-testid="selected">{selected ?? 'none'}</output> (changes: <span data-testid="changes">{changes.join(', ')}</span>)</p>
