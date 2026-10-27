// How SortableTh shows a column's sort: `aria-sort` on the heading, the
// button's classes, and the arrow after the label.

import { classNames } from './class-names.ts';
import type { Sort } from './index.ts';

export interface SortHeading {
  /** The `th`'s `aria-sort`; undefined unless this column is sorted. */
  ariaSort: 'ascending' | 'descending' | undefined;
  /** The button's classes: `th-sort`, plus `on` on the sorted column. */
  className: string;
  /** The arrow after the label on the sorted column; undefined on the others. */
  arrow: '↑' | '↓' | undefined;
}

/** The heading for column `key` while the table is sorted by `sort`. */
export function sortHeading(sort: Sort, key: string): SortHeading {
  const active = sort.key === key;
  const up = sort.dir === 1;
  return {
    ariaSort: active ? (up ? 'ascending' : 'descending') : undefined,
    className: classNames('th-sort', active && 'on'),
    arrow: active ? (up ? '↑' : '↓') : undefined,
  };
}
