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

export interface ComboboxItem {
  value: string;
  label: string;
  /** Text matched by filterItems; defaults to the label. */
  search?: string;
  group?: string;
}

/** Case-insensitive substring match of the trimmed query over each item's search text (or label), capped at `max`. */
export function filterItems<T extends ComboboxItem>(items: T[], query: string, max: number): { shown: T[]; more: number } {
  const needle = query.trim().toLowerCase();
  const matches = items.filter((i) => (i.search ?? i.label).toLowerCase().includes(needle));
  return { shown: matches.slice(0, max), more: Math.max(0, matches.length - max) };
}

export interface AutocompleteItem {
  value: string;
  /** The suggestion's text in the list. */
  label: string;
  /** What choosing it writes into the input; defaults to the label. */
  text?: string;
  /** Text matched by filterItems; defaults to the label. */
  search?: string;
}

/** The item typed text commits to on blur: an exact label or value match, else the only substring match, else null. */
export function blurMatch(items: ComboboxItem[], text: string): ComboboxItem | null {
  const typed = text.trim().toLowerCase();
  if (!typed) return null;
  const exact = items.find((i) => i.label.toLowerCase() === typed || i.value.toLowerCase() === typed);
  if (exact) return exact;
  const subs = items.filter((i) => (i.search ?? i.label).toLowerCase().includes(typed));
  return subs.length === 1 ? subs[0] : null;
}

export {
  type Comparator,
  comparatorSortFn,
  type Predicate,
  predicateFilterFn,
  pageHref,
  pageWindow,
  type RowColumn,
  rowColumn,
  type RowColumnOptions,
} from './table.ts';

export { announce, type AnnounceOptions, type Politeness } from './announce.ts';

export {
  type CampusFooterData,
  type CampusFooterSection,
  type CampusLink,
  campusFooter,
  campusLink,
  DEFAULT_FOOTER_SOURCE,
} from './campus-footer.ts';

export { tabbables } from './tabbable.ts';
