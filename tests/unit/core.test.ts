import { describe, expect, it } from 'vitest';

import { blurMatch, type ComboboxItem, filterItems, nextId, nextSort } from '../../src/core/index.ts';

describe('nextSort', () => {
  it('flips direction on the same key', () => {
    expect(nextSort({ key: 'a', dir: 1 }, 'a')).toEqual({ key: 'a', dir: -1 });
    expect(nextSort({ key: 'a', dir: -1 }, 'a')).toEqual({ key: 'a', dir: 1 });
  });

  it('starts ascending on another key', () => {
    expect(nextSort({ key: 'a', dir: -1 }, 'b')).toEqual({ key: 'b', dir: 1 });
    expect(nextSort({ key: 'a', dir: 1 }, 'b')).toEqual({ key: 'b', dir: 1 });
  });
});

describe('nextId', () => {
  it('counts up per prefix', () => {
    expect(nextId('x')).toBe('x-1');
    expect(nextId('x')).toBe('x-2');
    expect(nextId('y')).toBe('y-1');
  });
});

const people: ComboboxItem[] = [
  { value: 'aadams', label: 'Avery Adams', search: 'Avery Adams aadams', group: 'Faculty' },
  { value: 'bbrown', label: 'Blake Brown', search: 'Blake Brown bbrown', group: 'Faculty' },
  { value: 'cclark', label: 'Casey Clark', group: 'Staff' },
  { value: 'dadams', label: 'Drew Adams', search: 'Drew Adams dadams', group: 'Staff' },
];

describe('filterItems', () => {
  it('matches case-insensitively over the search text, in input order', () => {
    expect(filterItems(people, 'ADAMS', 10).shown.map((i) => i.value)).toEqual(['aadams', 'dadams']);
    expect(filterItems(people, 'bbrown', 10).shown.map((i) => i.value)).toEqual(['bbrown']);
  });

  it('falls back to the label when there is no search text', () => {
    expect(filterItems(people, 'casey', 10).shown.map((i) => i.value)).toEqual(['cclark']);
    expect(filterItems(people, 'cclark', 10).shown).toEqual([]);
  });

  it('trims the query; an empty query matches everything', () => {
    expect(filterItems(people, '  brown ', 10).shown).toHaveLength(1);
    expect(filterItems(people, '', 10).shown).toEqual(people);
  });

  it('caps at max and counts the rest', () => {
    expect(filterItems(people, 'a', 3)).toEqual({ shown: people.slice(0, 3), more: 1 });
    expect(filterItems(people, 'a', 10).more).toBe(0);
  });
});

describe('blurMatch', () => {
  it('commits an exact label or value match, ignoring case and spaces', () => {
    expect(blurMatch(people, ' avery adams ')?.value).toBe('aadams');
    expect(blurMatch(people, 'CCLARK')?.value).toBe('cclark');
  });

  it('prefers an exact match over substring matches', () => {
    const items = [...people, { value: 'adams', label: 'Adams' }];
    expect(blurMatch(items, 'adams')?.value).toBe('adams');
  });

  it('commits the only substring match', () => {
    expect(blurMatch(people, 'blake')?.value).toBe('bbrown');
  });

  it('returns null for ambiguous, unmatched or empty text', () => {
    expect(blurMatch(people, 'adams x')).toBeNull();
    expect(blurMatch(people, 'ada')).toBeNull();
    expect(blurMatch(people, 'zzz')).toBeNull();
    expect(blurMatch(people, '   ')).toBeNull();
  });
});
