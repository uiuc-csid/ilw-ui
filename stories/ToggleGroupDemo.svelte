<!--
  Stands in for a ta-manager course list: a heading, two filter rows (course
  level, single-select with "All"; terms offered, multi-select) and the table
  they filter, with a count in a status region. `id` prefixes the groups' ids.
-->
<script lang="ts">
  import ToggleGroup from '../src/svelte/ToggleGroup.svelte';

  let { id = 'courses', terms: initialTerms = ['fa', 'sp'] }: { id?: string; terms?: string[] } = $props();

  const courses = [
    { code: 'CS 124', title: 'Introduction to Computer Science I', level: '100', terms: ['fa', 'sp', 'su'] },
    { code: 'CS 128', title: 'Introduction to Computer Science II', level: '100', terms: ['fa', 'sp'] },
    { code: 'CS 225', title: 'Data Structures', level: '100', terms: ['fa', 'sp', 'su'] },
    { code: 'CS 341', title: 'System Programming', level: '300', terms: ['fa', 'sp'] },
    { code: 'CS 374', title: 'Introduction to Algorithms & Models of Computation', level: '300', terms: ['fa', 'sp'] },
    { code: 'CS 421', title: 'Programming Languages & Compilers', level: '300', terms: ['fa'] },
    { code: 'CS 425', title: 'Distributed Systems', level: '300', terms: ['fa'] },
    { code: 'CS 511', title: 'Advanced Data Management', level: '500', terms: ['sp'] },
    { code: 'CS 598', title: 'Special Topics', level: '500', terms: ['fa', 'sp'] },
  ];

  let level = $state<string | undefined>('all');
  // svelte-ignore state_referenced_locally (the initial terms only)
  let terms = $state<string[]>(initialTerms);
  let levelChanges = $state<string[]>([]);
  let termChanges = $state(0);

  const shown = $derived(
    courses.filter((c) => (level === 'all' || c.level === level) && c.terms.some((t) => terms.includes(t))),
  );
</script>

<h2>Courses needing TAs</h2>
<p>Filter the list by course level and by the terms each course is offered.</p>
<ToggleGroup
  id="{id}-level"
  label="Level"
  options={[
    { value: 'all', label: 'All' },
    { value: '100', label: '100–299' },
    { value: '300', label: '300–499' },
    { value: '500', label: '500+' },
  ]}
  bind:value={level}
  onchange={(v: string | undefined) => levelChanges.push(v ?? 'none')}
/>
<ToggleGroup
  id="{id}-terms"
  label="Offered"
  multiple
  options={[
    { value: 'fa', label: 'Fall' },
    { value: 'sp', label: 'Spring' },
    { value: 'su', label: 'Summer' },
    { value: 'wi', label: 'Winter', disabled: true },
  ]}
  bind:value={terms}
  onchange={() => termChanges++}
/>
<p role="status" data-testid="count">Showing {shown.length} of {courses.length} courses</p>
<table class="ilw-table">
  <caption class="ilw-visually-hidden">Courses</caption>
  <thead><tr><th scope="col">Course</th><th scope="col">Title</th></tr></thead>
  <tbody>
    {#each shown as course (course.code)}
      <tr><td>{course.code}</td><td>{course.title}</td></tr>
    {/each}
  </tbody>
</table>
<p>
  Level: <output data-testid="level">{level ?? 'none'}</output> (changes: <span data-testid="level-changes"
    >{levelChanges.join(', ')}</span
  >); terms: <output data-testid="terms">{terms.join(', ')}</output> (changes: <span data-testid="term-changes"
    >{termChanges}</span
  >)
</p>
