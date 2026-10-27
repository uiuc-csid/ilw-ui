<!--
  A department's "Programs" page section for Tabs stories: a heading that names
  the tab list, a lead-in paragraph, four program tabs, and a closing paragraph
  whose links point at panels by fragment. Shows the selected tab and every
  change under it.
-->
<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import Tabs from '../src/svelte/Tabs.svelte';

  let {
    selected = $bindable(),
    prefix = 'programs',
    ...props
  }: Omit<ComponentProps<typeof Tabs>, 'tabs'> & {
    /** Prefix for the heading's and panels' ids, so two demos can share a page. */
    prefix?: string;
  } = $props();
  let changes = $state<string[]>([]);
</script>

{#snippet degree()}
  <p>
    Choose from more than 150 undergraduate majors and 100 graduate and professional programs. Every program pairs
    coursework with research, internships and study abroad.
  </p>
  <p><a href="#{prefix}-majors">Browse all majors</a></p>
{/snippet}
{#snippet nonDegree()}
  <p>Certificates, summer sessions and courses for visiting students, on campus and online.</p>
  <p><a href="#{prefix}-certificates">Find a certificate</a></p>
{/snippet}
{#snippet classroom()}
  <p>Small discussion sections, hands-on labs and faculty who know your name.</p>
{/snippet}
{#snippet research()}
  <p>Undergraduates join faculty labs from their first year, with paid positions in every college.</p>
  <ul>
    <li>Summer research programs</li>
    <li>Research symposium each April</li>
  </ul>
{/snippet}

<h2 id="{prefix}-heading">Programs</h2>
<p>Find the program that fits where you want to go. Each tab covers one way to study with us.</p>
<Tabs
  {...props}
  labelledby="{prefix}-heading"
  bind:selected
  onchange={(id) => changes.push(id)}
  tabs={[
    { id: `${prefix}-degree`, label: 'Degree Programs', content: degree },
    { id: `${prefix}-non-degree`, label: 'Non-degree Programs', content: nonDegree },
    { id: `${prefix}-classroom`, label: 'Classroom Experience', content: classroom },
    { id: `${prefix}-research`, label: 'Undergraduate Research', content: research },
  ]}
/>
<p>
  Still deciding? Read about <a href="#{prefix}-research">undergraduate research</a> or
  <a href="#{prefix}-classroom">the classroom experience</a>.
</p>
<p>Selected: <output data-testid="selected">{selected ?? 'none'}</output> (changes: <span data-testid="changes">{changes.join(', ')}</span>)</p>
