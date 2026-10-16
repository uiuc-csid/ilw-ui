<script lang="ts">
  import type { Sort } from '../core/index.ts';

  let {
    key,
    label,
    sort,
    onsort,
  }: {
    key: string;
    label: string;
    sort: Sort;
    onsort: (key: string) => void;
  } = $props();

  let active = $derived(sort.key === key);
</script>

<th scope="col" aria-sort={active ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}>
  <button type="button" class={['th-sort', active && 'on']} data-sort={key} onclick={() => onsort(key)}
    >{label}{#if active}<span aria-hidden="true">&nbsp;{sort.dir === 1 ? '↑' : '↓'}</span>{/if}</button
  >
</th>
