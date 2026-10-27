// The internal core modules both framework adapters build on. Their DOM
// halves are covered by the component stories and specs; this covers the
// pure ones.
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AsyncSearch, type AsyncState, statusText } from '../../src/core/async-search.ts';
import { classNames } from '../../src/core/class-names.ts';
import { confirmButtons, defaultButtons } from '../../src/core/modal.ts';
import { pagerModel, paginationModel } from '../../src/core/pager.ts';
import { sortHeading } from '../../src/core/sort.ts';
import { tabKeyTarget } from '../../src/core/tabs.ts';

describe('classNames', () => {
  it('joins in order and leaves out empty and falsy classes', () => {
    expect(classNames('ilw-button', 'ilw-theme-blue-solid')).toBe('ilw-button ilw-theme-blue-solid');
    expect(classNames('a', false, null, undefined, '', 'b')).toBe('a b');
    expect(classNames()).toBe('');
  });

  it('neither dedupes nor reorders', () => {
    expect(classNames('b', 'a', 'b')).toBe('b a b');
  });
});

describe('sortHeading', () => {
  it('marks the sorted column', () => {
    expect(sortHeading({ key: 'name', dir: 1 }, 'name')).toEqual({ ariaSort: 'ascending', className: 'th-sort on', arrow: '↑' });
    expect(sortHeading({ key: 'name', dir: -1 }, 'name')).toEqual({ ariaSort: 'descending', className: 'th-sort on', arrow: '↓' });
  });

  it('leaves the other columns plain', () => {
    expect(sortHeading({ key: 'name', dir: 1 }, 'year')).toEqual({ ariaSort: undefined, className: 'th-sort', arrow: undefined });
  });
});

describe('pagerModel', () => {
  it('gives the page, count and window', () => {
    expect(pagerModel({ pageIndex: 2, pageSize: 10, total: 95, emptyLabel: 'None' })).toEqual({
      page: 3,
      totalPages: 10,
      count: '21–30 of 95',
      pages: [1, 2, 3, 4, 5, null, 10],
    });
  });

  it('clamps a page index past the end, e.g. after filtering', () => {
    expect(pagerModel({ pageIndex: 9, pageSize: 10, total: 25, emptyLabel: 'None' })).toMatchObject({
      page: 3,
      totalPages: 3,
      count: '21–25 of 25',
    });
  });

  it('has one page and the empty label when no row passes', () => {
    expect(pagerModel({ pageIndex: 0, pageSize: 10, total: 0, emptyLabel: 'No courses' })).toEqual({
      page: 1,
      totalPages: 1,
      count: 'No courses',
      pages: [1],
    });
  });
});

describe('paginationModel', () => {
  it('links each page through url and parameter', () => {
    expect(paginationModel({ page: 2, pages: 3, url: '/list?q=a', parameter: 'p' })).toEqual({
      current: 2,
      total: 3,
      previous: '/list?q=a&p=1',
      next: '/list?q=a&p=3',
      pages: [
        { page: 1, href: '/list?q=a&p=1', current: false },
        { page: 2, href: '/list?q=a&p=2', current: true },
        { page: 3, href: '/list?q=a&p=3', current: false },
      ],
    });
  });

  it('floors and clamps page and pages, with no previous or next at the ends', () => {
    const model = paginationModel({ page: 7.6, pages: 4.9, url: '', parameter: 'page', href: (p) => `#${p}` });
    expect(model).toMatchObject({ current: 4, total: 4, next: null, previous: '#3' });
    expect(paginationModel({ page: -3, pages: 0, url: '', parameter: 'page' })).toMatchObject({
      current: 1,
      total: 1,
      previous: null,
      next: null,
    });
  });

  it('keeps gaps as null', () => {
    expect(paginationModel({ page: 1, pages: 20, url: '', parameter: 'page', href: String }).pages.map((p) => p?.page ?? null)).toEqual([
      1,
      2,
      3,
      null,
      20,
    ]);
  });
});

describe('tabKeyTarget', () => {
  const key = (k: string, mods: Partial<Record<'altKey' | 'ctrlKey' | 'metaKey', boolean>> = {}) => ({
    key: k,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    ...mods,
  });

  it('wraps the arrows in both orientations and jumps with Home and End', () => {
    expect(tabKeyTarget(key('ArrowRight'), 2, 3)).toBe(0);
    expect(tabKeyTarget(key('ArrowDown'), 0, 3)).toBe(1);
    expect(tabKeyTarget(key('ArrowLeft'), 0, 3)).toBe(2);
    expect(tabKeyTarget(key('ArrowUp'), 2, 3)).toBe(1);
    expect(tabKeyTarget(key('Home'), 2, 3)).toBe(0);
    expect(tabKeyTarget(key('End'), 0, 3)).toBe(2);
  });

  it('leaves other keys and modified arrows alone', () => {
    expect(tabKeyTarget(key('Enter'), 0, 3)).toBeNull();
    expect(tabKeyTarget(key('ArrowRight', { altKey: true }), 0, 3)).toBeNull();
    expect(tabKeyTarget(key('ArrowRight', { ctrlKey: true }), 0, 3)).toBeNull();
    expect(tabKeyTarget(key('ArrowRight', { metaKey: true }), 0, 3)).toBeNull();
  });
});

describe('modal buttons', () => {
  it('defaults to one "Got it" button', () => {
    expect(defaultButtons()).toEqual([{ label: 'Got it', value: true }]);
  });

  it('puts Cancel first, with focus, for confirm', () => {
    expect(confirmButtons('Delete')).toEqual([
      { label: 'Cancel', value: false, autofocus: true },
      { label: 'Delete', value: true },
    ]);
  });
});

describe('AsyncSearch', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces, notifies subscribers, then calls onresults', async () => {
    vi.useFakeTimers();
    const source = vi.fn((q: string) => Promise.resolve([`${q}1`, `${q}2`]));
    const seen: AsyncState<string>[] = [];
    const onresults = vi.fn(() => expect(search.getSnapshot().status).toBe('done'));
    const search = new AsyncSearch(
      () => source,
      () => 200,
      onresults,
    );
    search.subscribe((s) => seen.push(s));

    search.search('a');
    expect(search.getSnapshot()).toEqual({ status: 'loading', results: [], query: '' });
    expect(source).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(200);
    expect(source).toHaveBeenCalledTimes(1);
    expect(search.getSnapshot()).toEqual({ status: 'done', results: ['a1', 'a2'], query: 'a' });
    expect(onresults).toHaveBeenCalledWith('a', ['a1', 'a2']);
    expect(seen.map((s) => s.status)).toEqual(['idle', 'loading', 'done']);
    // A new object on every change, as useSyncExternalStore needs.
    expect(new Set(seen).size).toBe(seen.length);
  });

  it('aborts the search a new one replaces and drops its late response', async () => {
    let first!: (items: string[]) => void;
    const signals: AbortSignal[] = [];
    const source = (q: string, signal: AbortSignal) => {
      signals.push(signal);
      return q === 'a' ? new Promise<string[]>((resolve) => (first = resolve)) : Promise.resolve(['b1']);
    };
    const search = new AsyncSearch(
      () => source,
      () => 0,
    );

    search.search('a');
    search.search('b');
    expect(signals[0].aborted).toBe(true);
    await Promise.resolve();
    first(['a1']);
    await Promise.resolve();
    expect(search.getSnapshot()).toEqual({ status: 'done', results: ['b1'], query: 'b' });
  });

  it('reports a failed source as an error with no results', async () => {
    const search = new AsyncSearch<string>(
      () => () => Promise.reject(new Error('down')),
      () => 0,
    );
    search.search('a', true);
    await Promise.resolve();
    expect(search.getSnapshot()).toEqual({ status: 'error', results: [], query: 'a' });
  });

  it('cancel goes idle, and unsubscribing stops notifications', () => {
    const search = new AsyncSearch<string>(
      () => () => new Promise(() => {}),
      () => 0,
    );
    const listener = vi.fn();
    const stop = search.subscribe(listener);
    search.search('a');
    search.cancel();
    expect(search.getSnapshot().status).toBe('idle');
    const calls = listener.mock.calls.length;
    stop();
    search.search('b');
    expect(listener).toHaveBeenCalledTimes(calls);
  });
});

describe('statusText', () => {
  const texts = { loadingText: 'Loading…', emptyText: 'No matches', errorText: 'Failed' };

  it('says what the search is doing', () => {
    expect(statusText('idle', 0, texts)).toBe('');
    expect(statusText('loading', 0, texts)).toBe('Loading…');
    expect(statusText('error', 0, texts)).toBe('Failed');
    expect(statusText('done', 0, texts)).toBe('No matches');
    expect(statusText('done', 1, texts)).toBe('1 result');
    expect(statusText('done', 3, texts)).toBe('3 results');
  });
});
