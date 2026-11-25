<!--
  Stands in for a course's staff page in ta-manager: a "Filters" popover of
  role checkboxes with a Done button above the staff list, and a "?" help
  popover beside a form field, whose panel explains the term and links to the
  policy. `open` opens the filters panel; the <output> shows its bound state.
  `label` and `placement` are the filters popover's (the stories' controls).
-->
<script lang="ts">
  import type { PopoverPlacement } from '../src/core/popover.ts';
  import Popover from '../src/svelte/Popover.svelte';

  import './PopoverDemo.css';

  let {
    open = false,
    label = 'Filters',
    placement = 'bottom-left',
  }: { open?: boolean; label?: string; placement?: PopoverPlacement } = $props();

  // A deliberate one-time read: the story's initial state.
  // svelte-ignore state_referenced_locally
  let filters = $state(open);
</script>

<h1>CS 225: Course staff</h1>
<p>Teaching assistants, graders and course assistants for this term. Filter the list by role.</p>

<div class="popover-demo-toolbar">
  <Popover id="staff-filters" {label} {placement} bind:open={filters}>
    <fieldset class="ilw-fieldset">
      <legend>Show</legend>
      <div class="ilw-input-entry-checkbox">
        <label for="show-tas">Teaching assistants</label>
        <input id="show-tas" type="checkbox" checked />
      </div>
      <div class="ilw-input-entry-checkbox">
        <label for="show-graders">Graders</label>
        <input id="show-graders" type="checkbox" checked />
      </div>
      <div class="ilw-input-entry-checkbox">
        <label for="show-cas">Course assistants</label>
        <input id="show-cas" type="checkbox" />
      </div>
    </fieldset>
    <button type="button" class="ilw-button" popovertarget="staff-filters" popovertargetaction="hide">Done</button>
  </Popover>
  <p>Filters panel: <output data-testid="filters-state">{filters ? 'open' : 'closed'}</output></p>
</div>

<ul>
  <li>Ana Ruiz, teaching assistant</li>
  <li>Ben Okafor, teaching assistant</li>
  <li>Chen Wei, grader</li>
  <li>Dana Fox, grader</li>
</ul>

<div class="popover-demo-field">
  <div class="ilw-input-entry">
    <label for="office-hours">Office hours per week</label>
    <input id="office-hours" type="number" min="0" value="4" />
  </div>
  <Popover id="help-hours">
    {#snippet trigger(attrs)}
      <button type="button" class="ilw-button popover-demo-help" aria-label="About office hours" {...attrs}>?</button>
    {/snippet}
    <p>
      Count only hours held at a fixed place and time. Review sessions count; answering email doesn't. See
      <a href="#staffing-policy">the staffing policy</a>.
    </p>
  </Popover>
</div>
