<script lang="ts">
  import type { Sort } from '../core/index.ts';
  import { sortHeading } from '../core/sort.ts';

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

  const heading = $derived(sortHeading(sort, key));
</script>

<th scope="col" aria-sort={heading.ariaSort}>
  <button type="button" class={heading.className} data-sort={key} onclick={() => onsort(key)}
    >{label}{#if heading.arrow}<span aria-hidden="true">&nbsp;{heading.arrow}</span>{/if}</button
  >
</th>
