export type SortDir = 1 | -1;
export interface Sort {
  key: string;
  dir: SortDir;
}

/** The sort after clicking `key`: same column flips direction, another column starts ascending. */
export function nextSort(sort: Sort, key: string): Sort {
  return sort.key === key ? { key, dir: sort.dir === 1 ? -1 : 1 } : { key, dir: 1 };
}

const counters = new Map<string, number>();

/** A page-unique id: `${prefix}-1`, `${prefix}-2`, … (one counter per prefix). */
export function nextId(prefix: string): string {
  const n = (counters.get(prefix) ?? 0) + 1;
  counters.set(prefix, n);
  return `${prefix}-${n}`;
}
