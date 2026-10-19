<script lang="ts">
  // Story-only page: a DataTable with two sortable headings, a filter field
  // and, when paged, a Pager above and below.
  import { rowColumn } from '../src/core/index.ts';
  import { createDataTable, DataTable, Pager, type PagerClasses, setTableFilter, TableSortTh } from '../src/svelte/index.ts';
  import { byGroup, byName, type Person, people } from './table-data.ts';

  let {
    count = 8,
    pageSize,
    classes,
  }: {
    count?: number;
    pageSize?: number;
    classes?: Partial<PagerClasses>;
  } = $props();

  // svelte-ignore state_referenced_locally
  let rows = $state(people(count));

  const columns = [
    rowColumn<Person, string>('name', {
      compare: byName,
      filter: (row, q) => !q || row.name.toLowerCase().includes(q.toLowerCase()),
    }),
    rowColumn<Person>('group', { compare: byGroup }),
  ];
  const options = {
    get data() {
      return rows;
    },
    columns,
    getRowId: (row: Person) => row.id,
    sorting: [{ id: 'name', desc: false }],
  };
  // svelte-ignore state_referenced_locally
  const table = pageSize ? createDataTable({ ...options, pageSize }) : createDataTable(options);
  const paged = 'setPageIndex' in table ? table : null;

  // New objects with the same ids: rows must be reused, not recreated.
  function rename() {
    rows = rows.map((r) => (r.id === 'r1' ? { ...r, name: 'Person zz' } : { ...r }));
  }
</script>

<p>
  <label>Filter <input type="search" oninput={(e) => setTableFilter(table, 'name', e.currentTarget.value)} /></label>
  <button type="button" onclick={rename}>Rename r1</button>
</p>
{#if paged}<Pager table={paged} emptyLabel="No people" label="Pages, top" {classes} />{/if}
<DataTable {table} class="people" aria-label="People">
  {#snippet header()}
    <tr><TableSortTh {table} id="name" label="Name" /><TableSortTh {table} id="group" label="Group" /></tr>
  {/snippet}
  {#snippet row(person)}
    <tr data-id={person.id}><td>{person.name}</td><td>{person.group}</td></tr>
  {/snippet}
  {#snippet empty()}
    <tr><td colspan="2">None.</td></tr>
  {/snippet}
</DataTable>
{#if paged}<Pager table={paged} emptyLabel="No people" label="Pages, bottom" {classes} />{/if}
