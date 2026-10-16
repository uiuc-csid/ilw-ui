import { describe, expect, it } from 'vitest';

import { nextId, nextSort } from '../../src/core/index.ts';

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
