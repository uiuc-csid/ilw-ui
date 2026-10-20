// The TanStack table behind DataTable, DataRows, TableSortTh and Pager. Pages
// build it here, so they never import @tanstack/* themselves.
import {
  columnFilteringFeature,
  type ColumnFiltersState,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  rowPaginationFeature,
  type RowData,
  rowSortingFeature,
  type SortingState,
  type Table,
  tableFeatures,
} from '@tanstack/svelte-table';

import type { RowColumn } from '../core/table.ts';

// Built once: TanStack recomputes its row models when the feature set changes.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
});

const pagedFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

/** A table from `createDataTable` without `pageSize`: no pagination APIs. */
export type DataTableInstance<T extends RowData> = Table<typeof features, T>;

/** A table from `createDataTable` with `pageSize`. */
export type PagedDataTableInstance<T extends RowData> = Table<typeof pagedFeatures, T>;

export type AnyDataTable<T extends RowData> = DataTableInstance<T> | PagedDataTableInstance<T>;

export interface DataTableOptions<T extends RowData> {
  /** Read on every update: pass a getter over `$state`, so new data reaches the table. */
  readonly data: T[];
  /** Columns from `rowColumn` (`ilw-ui/core`). */
  columns: Array<RowColumn<T>>;
  /** A stable id per row; rows render keyed by it. */
  getRowId: (row: T) => string;
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  /** Paginates the rows when set. */
  pageSize?: number;
}

/** Class names for `Pager`'s parts. */
export interface PagerClasses {
  root: string;
  label: string;
  button: string;
  /** Added to the current page's button. */
  current: string;
  ellipsis: string;
  count: string;
}

/** `Pager`'s class names with `legacy`: ta-manager's legacy unranked-courses pager. */
export const legacyPagerClasses: PagerClasses = {
  root: 'picker-ctrl-row',
  label: 'picker-sort-lbl',
  button: 'picker-tog picker-pg-btn',
  current: 'picker-tog-on',
  ellipsis: 'picker-pg-ellipsis',
  count: 'picker-count',
};

/** `Pager`'s default class names, styled by `ilw-ui/styles.css` (`.ilw-pager*`). */
export const ilwPagerClasses: PagerClasses = {
  root: 'ilw-pager',
  label: 'ilw-pager-label',
  button: 'ilw-pager-btn',
  current: 'on',
  ellipsis: 'ilw-pager-ellipsis',
  count: 'ilw-pager-count',
};

/**
 * A client-side table: filter, then sort, then (with `pageSize`) paginate, all
 * with the page's own comparators and predicates. Call it while a component
 * initialises.
 */
export function createDataTable<T extends RowData>(
  options: DataTableOptions<T> & { pageSize: number },
): PagedDataTableInstance<T>;
export function createDataTable<T extends RowData>(
  options: DataTableOptions<T> & { pageSize?: undefined },
): DataTableInstance<T>;
export function createDataTable<T extends RowData>(options: DataTableOptions<T>): AnyDataTable<T> {
  const paged = options.pageSize !== undefined;
  const tableOptions = {
    features: paged ? pagedFeatures : features,
    columns: options.columns,
    get data() {
      return options.data;
    },
    getRowId: (row: T) => options.getRowId(row),
    // One sorted column at a time, flipping between ascending and descending.
    enableSortingRemoval: false,
    enableMultiSort: false,
    // TanStack's own reset runs lazily, when the row model is next read (during
    // a render). TableSortTh and setTableFilter reset the page instead.
    autoResetPageIndex: false,
    initialState: {
      sorting: options.sorting ?? [],
      columnFilters: options.columnFilters ?? [],
      ...(paged && { pagination: { pageIndex: 0, pageSize: options.pageSize } }),
    },
  };
  return createTable(
    tableOptions as unknown as Parameters<typeof createTable<typeof pagedFeatures, T>>[0],
  ) as unknown as AnyDataTable<T>;
}

/** Whether `table` was created with `pageSize`. */
export function isPaged<T extends RowData>(table: AnyDataTable<T>): table is PagedDataTableInstance<T> {
  return 'setPageIndex' in table;
}

/**
 * Sets column `id`'s filter value and, for a paged table, goes back to page 1.
 * `undefined` removes the filter; any other value is passed to the predicate.
 */
export function setTableFilter<T extends RowData>(table: AnyDataTable<T>, id: string, value: unknown): void {
  table.getColumn(id)?.setFilterValue(value);
  if (isPaged(table)) table.setPageIndex(0);
}
