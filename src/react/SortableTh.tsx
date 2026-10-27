// A sortable column heading, rendering the markup documented in the README: a
// th with aria-sort on the sorted column, holding a button that calls onSort.
// The React twin of SortableTh.svelte, with `key` renamed `sortKey`: React
// keeps `key` for itself and never passes it to the component.

import type { Sort } from '../core/index.ts';
import { sortHeading } from '../core/sort.ts';

export interface SortableThProps {
  /** The column's sort key; also the button's `data-sort`. */
  sortKey: string;
  label: string;
  sort: Sort;
  onSort: (key: string) => void;
}

export function SortableTh({ sortKey, label, sort, onSort }: SortableThProps) {
  const heading = sortHeading(sort, sortKey);
  return (
    <th scope="col" aria-sort={heading.ariaSort}>
      <button type="button" className={heading.className} data-sort={sortKey} onClick={() => onSort(sortKey)}>
        {label}
        {heading.arrow && <span aria-hidden="true">{` ${heading.arrow}`}</span>}
      </button>
    </th>
  );
}
