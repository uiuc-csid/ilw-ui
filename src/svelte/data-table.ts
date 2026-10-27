// createDataTable: the core table options (src/core/data-table.ts) on
// @tanstack/svelte-table, so the parts re-render from the table state they read.
import { createTable, type RowData } from '@tanstack/svelte-table';

import {
  type AnyDataTable,
  type DataTableInstance,
  type DataTableOptions,
  dataTableOptions,
  type PagedDataTableInstance,
} from '../core/data-table.ts';

export {
  type AnyDataTable,
  type DataTableInstance,
  type DataTableOptions,
  ilwPagerClasses,
  isPaged,
  legacyPagerClasses,
  type PagedDataTableInstance,
  type PagerClasses,
  setTableFilter,
} from '../core/data-table.ts';

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
  return createTable(dataTableOptions(options)) as unknown as AnyDataTable<T>;
}
