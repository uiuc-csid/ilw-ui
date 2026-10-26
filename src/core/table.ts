// TanStack Table helpers: adapters that plug a page's own comparator or
// predicate into TanStack, a column builder for them, and the pager's window.
import type { FilterFn, RowData, SortFn, TableFeatures } from '@tanstack/table-core';

/** An `Array.prototype.sort` comparator over the row objects themselves. */
export type Comparator<T> = (a: T, b: T) => number;

/** True when `row` passes the filter whose current value is `value`. */
export type Predicate<T, V> = (row: T, value: V) => boolean;

/**
 * A comparator as a TanStack sort function. Pass the ascending comparator:
 * TanStack negates it for a descending sort and breaks ties by input order, so
 * ties keep the order a stable sort gives them in both directions.
 */
export function comparatorSortFn<T extends RowData>(cmp: Comparator<T>): SortFn<TableFeatures, T> {
  return (rowA, rowB) => cmp(rowA.original, rowB.original);
}

/**
 * A predicate as a TanStack filter function. The filter stays in the table's
 * state for any value but `undefined`, so the predicate alone decides what
 * `''`, `null` or `false` mean (usually: every row passes).
 */
export function predicateFilterFn<T extends RowData, V>(pred: Predicate<T, V>): FilterFn<TableFeatures, T> {
  const fn: FilterFn<TableFeatures, T> = (row, _columnId, value) => pred(row.original, value as V);
  fn.autoRemove = (value) => value === undefined;
  return fn;
}

export interface RowColumnOptions<T, V> {
  /** Sorts the column with this ascending comparator. */
  compare?: Comparator<T>;
  /** Filters the column with this predicate. */
  filter?: Predicate<T, V>;
}

export interface RowColumn<T extends RowData> {
  id: string;
  accessorFn: (row: T) => T;
  enableSorting: boolean;
  enableColumnFilter: boolean;
  sortFn?: SortFn<TableFeatures, T>;
  filterFn?: FilterFn<TableFeatures, T>;
}

/**
 * A column over the whole row object, sorted or filtered by page logic that
 * may read several fields. It renders nothing: pages render rows from snippets.
 */
export function rowColumn<T extends RowData, V = unknown>(
  id: string,
  options: RowColumnOptions<T, V> = {},
): RowColumn<T> {
  return {
    id,
    accessorFn: (row: T) => row,
    enableSorting: Boolean(options.compare),
    enableColumnFilter: Boolean(options.filter),
    ...(options.compare && { sortFn: comparatorSortFn(options.compare) }),
    ...(options.filter && { filterFn: predicateFilterFn(options.filter) }),
  };
}

/**
 * The page numbers a pager shows for 1-based `page` of `totalPages`: the first,
 * the last, and two either side of `page`, with `null` for each skipped gap.
 */
export function pageWindow(page: number, totalPages: number): Array<number | null> {
  const shown = new Set([1, totalPages]);
  for (let p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) shown.add(p);
  const out: Array<number | null> = [];
  let prev: number | null = null;
  for (const p of [...shown].sort((a, b) => a - b)) {
    if (prev !== null && p - prev > 1) out.push(null);
    out.push(p);
    prev = p;
  }
  return out;
}

/**
 * `url` with its `parameter` query value set to `page`, keeping the rest of
 * the query and the fragment. `url` may be relative (`''`, `?q=x`, `/list`)
 * or absolute; the result is relative or absolute to match.
 */
export function pageHref(url: string, page: number, parameter = 'page'): string {
  const hashAt = url.indexOf('#');
  const hash = hashAt < 0 ? '' : url.slice(hashAt);
  const rest = hashAt < 0 ? url : url.slice(0, hashAt);
  const queryAt = rest.indexOf('?');
  const path = queryAt < 0 ? rest : rest.slice(0, queryAt);
  const query = new URLSearchParams(queryAt < 0 ? '' : rest.slice(queryAt + 1));
  query.set(parameter, String(page));
  return `${path}?${query}${hash}`;
}
