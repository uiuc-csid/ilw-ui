<script lang="ts">
  import { nextSort, type Sort } from '../src/core/index.ts';
  import SortableTh from '../src/svelte/SortableTh.svelte';

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'course', label: 'Course' },
    { key: 'hours', label: 'Hours' },
  ] as const;
  const rows = [
    { name: 'Avery', course: 'CS 225', hours: 20 },
    { name: 'Blake', course: 'CS 124', hours: 10 },
    { name: 'Casey', course: 'CS 173', hours: 15 },
  ];

  let sort: Sort = $state({ key: 'name', dir: 1 });
  let sorted = $derived(
    rows.toSorted((a, b) => {
      const x = a[sort.key as keyof typeof a];
      const y = b[sort.key as keyof typeof b];
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
    }),
  );
</script>

<table>
  <caption>TA hours</caption>
  <thead>
    <tr>
      {#each columns as col (col.key)}
        <SortableTh key={col.key} label={col.label} {sort} onsort={(key) => (sort = nextSort(sort, key))} />
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each sorted as row (row.name)}
      <tr><td>{row.name}</td><td>{row.course}</td><td>{row.hours}</td></tr>
    {/each}
  </tbody>
</table>
