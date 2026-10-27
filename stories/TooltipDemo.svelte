<!--
  Stands in for a course's grade book page in ta-manager: a toolbar of icon
  buttons over the table, each described by a tooltip, and a form field whose
  "What's this?" link explains a term. `open` opens the first tooltip;
  `arrow` and `theme` apply to the toolbar's tooltips.
-->
<script lang="ts">
  import DownloadSimple from 'phosphor-svelte/lib/DownloadSimple';
  import Printer from 'phosphor-svelte/lib/Printer';
  import ShareNetwork from 'phosphor-svelte/lib/ShareNetwork';

  import type { LayoutTheme } from '../src/core/layout.ts';
  import Icon from '../src/svelte/Icon.svelte';
  import Tooltip, { type TooltipArrow } from '../src/svelte/Tooltip.svelte';

  import './TooltipDemo.css';

  let {
    open = false,
    // The toolbar is at the page's left edge, so its bubbles start at the button and extend right.
    arrow = 'top-left',
    theme,
  }: { open?: boolean; arrow?: TooltipArrow; theme?: LayoutTheme } = $props();

  // A deliberate one-time read: the story's initial state.
  // svelte-ignore state_referenced_locally
  let first = $state(open);
</script>

<h1>CS 225: Grade book</h1>
<p>Grades for every section you assist with. Use the toolbar to take a copy of the table.</p>

<div class="tooltip-demo-toolbar">
  <Tooltip id="tip-export" text="Download the grades as a CSV file" {arrow} {theme} bind:open={first}>
    {#snippet children(attrs)}
      <button type="button" class="ilw-button" {...attrs}><Icon icon={DownloadSimple} alt="Export" /></button>
    {/snippet}
  </Tooltip>
  <Tooltip id="tip-print" text="Print the table on one page per section" {arrow} {theme}>
    {#snippet children(attrs)}
      <button type="button" class="ilw-button" {...attrs}><Icon icon={Printer} alt="Print" /></button>
    {/snippet}
  </Tooltip>
  <Tooltip id="tip-share" {arrow} {theme}>
    {#snippet content()}<strong>Instructors only.</strong> Other TAs see the link but can't open it.{/snippet}
    {#snippet children(attrs)}
      <button type="button" class="ilw-button" {...attrs}><Icon icon={ShareNetwork} alt="Share" /></button>
    {/snippet}
  </Tooltip>
</div>

<div class="ilw-input-entry">
  <label for="drop-lowest">Drop the lowest quizzes</label>
  <input id="drop-lowest" type="number" min="0" value="2" />
  <p class="ilw-input-description">
    How many quiz scores to ignore per student.
    <Tooltip id="tip-quiz" arrow="right" text="Only quizzes count; exams and labs are always kept.">
      {#snippet children(attrs)}
        <a href="#quizzes" {...attrs}>Which scores?</a>
      {/snippet}
    </Tooltip>
  </p>
</div>
