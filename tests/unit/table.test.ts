// rowColumn's adapters against a stable legacy sort, pageWindow against the
// legacy unranked-courses pager code, and pageHref.
import {
  columnFilteringFeature,
  constructTable,
  createFilteredRowModel,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/table-core';
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings';
import { describe, expect, test } from 'vitest';

import { pageHref, pageWindow, rowColumn } from '../../src/core/index.ts';

interface Item {
  id: string;
  name: string;
  n: number;
}

// Many ties on both keys, in an input order that is neither sorted nor reversed.
const items: Item[] = Array.from({ length: 40 }, (_, i) => ({
  id: `r${i}`,
  name: `name ${(i * 7) % 5}`,
  n: (i * 3) % 4,
}));

const byName = (a: Item, b: Item) => a.name.localeCompare(b.name);
const byN = (a: Item, b: Item) => a.n - b.n;
const nameHas = (row: Item, q: string) => !q || row.name.includes(q);

const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
});

function table() {
  return constructTable({
    features,
    columns: [rowColumn<Item>('name', { compare: byName }), rowColumn<Item, string>('n', { compare: byN, filter: nameHas })],
    data: items,
    getRowId: (row: Item) => row.id,
  } as unknown as Parameters<typeof constructTable<typeof features, Item>>[0]);
}

const ids = (t: ReturnType<typeof table>) => t.getRowModel().rows.map((r) => r.id);

/** The legacy pipeline: a stable sort with the comparator times the direction. */
const legacy = (rows: Item[], cmp: (a: Item, b: Item) => number, dir: 1 | -1) =>
  [...rows].sort((a, b) => dir * cmp(a, b)).map((r) => r.id);

describe('comparatorSortFn (via rowColumn)', () => {
  for (const [id, cmp] of [['name', byName], ['n', byN]] as const) {
    test(`${id}: both directions match a stable legacy sort, ties included`, () => {
      const t = table();
      t.setSorting([{ id, desc: false }]);
      expect(ids(t)).toEqual(legacy(items, cmp, 1));
      t.setSorting([{ id, desc: true }]);
      expect(ids(t)).toEqual(legacy(items, cmp, -1));
    });
  }
});

describe('predicateFilterFn (via rowColumn)', () => {
  test('keeps exactly the rows the predicate passes, in input order', () => {
    const t = table();
    t.setColumnFilters([{ id: 'n', value: 'name 3' }]);
    expect(ids(t)).toEqual(items.filter((r) => nameHas(r, 'name 3')).map((r) => r.id));
  });

  test('an empty-string value stays in state; the predicate decides it', () => {
    const t = table();
    t.getColumn('n')!.setFilterValue('');
    expect(t.atoms.columnFilters.get()).toEqual([{ id: 'n', value: '' }]);
    expect(ids(t)).toEqual(items.map((r) => r.id));
    t.getColumn('n')!.setFilterValue(undefined);
    expect(t.atoms.columnFilters.get()).toEqual([]);
  });

  test('filters, then sorts', () => {
    const t = table();
    t.setColumnFilters([{ id: 'n', value: 'name 1' }]);
    t.setSorting([{ id: 'n', desc: true }]);
    expect(ids(t)).toEqual(legacy(items.filter((r) => nameHas(r, 'name 1')), byN, -1));
  });
});

describe('pageWindow', () => {
  // The legacy unranked-courses page window, verbatim, as the oracle.
  function legacyWindow(page: number, totalPages: number) {
    const shown = new Set([1, totalPages]);
    for (let p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) shown.add(p);
    const sortedPages = [...shown].sort((a, b) => a - b);
    const pageNums: Array<number | null> = [];
    let prev2: number | null = null;
    for (const p of sortedPages) {
      if (prev2 !== null && p - prev2 > 1) pageNums.push(null);
      pageNums.push(p);
      prev2 = p;
    }
    return pageNums;
  }

  test('known windows', () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(1, 6)).toEqual([1, 2, 3, null, 6]);
    expect(pageWindow(4, 6)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(pageWindow(5, 10)).toEqual([1, null, 3, 4, 5, 6, 7, null, 10]);
  });

  test('matches the legacy code for every page of 1..30 pages', () => {
    for (let total = 1; total <= 30; total++) {
      for (let page = 1; page <= total; page++) {
        expect(pageWindow(page, total)).toEqual(legacyWindow(page, total));
      }
    }
  });
});

describe('pageHref', () => {
  test.each([
    ['', 3, 'page', '?page=3'],
    ['?q=chem&page=1', 2, 'page', '?q=chem&page=2'],
    ['/courses', 4, 'page', '/courses?page=4'],
    ['/courses?term=fa26#results', 2, 'page', '/courses?term=fa26&page=2#results'],
    ['#results', 2, 'page', '?page=2#results'],
    ['https://example.edu/list?p=1&q=a+b', 5, 'p', 'https://example.edu/list?p=5&q=a+b'],
  ])('pageHref(%j, %i, %j) is %j', (url, page, parameter, want) => {
    expect(pageHref(url, page, parameter)).toBe(want);
  });

  test('parameter defaults to page', () => {
    expect(pageHref('/list', 2)).toBe('/list?page=2');
  });
});
