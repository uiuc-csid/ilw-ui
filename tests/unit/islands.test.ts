import { afterEach, describe, expect, it, vi } from 'vitest';

import { parseProps, readProps } from '../../src/core/islands.ts';
import { mountIslands } from '../../src/svelte/islands.ts';

// Just enough of the DOM for the island loop to walk, in node.
function fakeEl(attrs: Record<string, string>, extra: Partial<Element> = {}): Element {
  const a = new Map(Object.entries(attrs));
  return {
    tagName: 'DIV',
    textContent: '',
    getAttribute: (n: string) => a.get(n) ?? null,
    setAttribute: (n: string, v: string) => void a.set(n, v),
    removeAttribute: (n: string) => void a.delete(n),
    ownerDocument: fakeDoc,
    ...extra,
  } as unknown as Element;
}

const scripts = new Map<string, Element>();
const fakeDoc = { getElementById: (id: string) => scripts.get(id) ?? null, defaultView: null } as unknown as Document;

function fakeRoot(els: Element[]): ParentNode {
  return { ownerDocument: fakeDoc, querySelectorAll: () => els } as unknown as ParentNode;
}

afterEach(() => {
  scripts.clear();
  vi.restoreAllMocks();
});

describe('parseProps', () => {
  it('parses a JSON object', () => {
    expect(parseProps('{"label":"A","n":1}')).toEqual({ ok: true, props: { label: 'A', n: 1 } });
  });

  it('rejects bad JSON and non-objects', () => {
    for (const s of ['{oops}', '', '[1]', 'null', '"x"', '3']) expect(parseProps(s).ok).toBe(false);
  });
});

describe('readProps', () => {
  it('reads data-props', () => {
    expect(readProps(fakeEl({ 'data-props': '{"a":1}' }))).toEqual({ ok: true, props: { a: 1 } });
  });

  it('reads a json_script block named by data-props-id', () => {
    scripts.set(
      'p',
      fakeEl({ type: 'application/json' }, { tagName: 'SCRIPT', textContent: '{"b":2}' } as Partial<Element>),
    );
    expect(readProps(fakeEl({ 'data-props-id': 'p' }))).toEqual({ ok: true, props: { b: 2 } });
  });

  it('rejects a missing or non-JSON script', () => {
    expect(readProps(fakeEl({ 'data-props-id': 'nope' })).ok).toBe(false);
    scripts.set('js', fakeEl({}, { tagName: 'SCRIPT', textContent: '{}' } as Partial<Element>));
    expect(readProps(fakeEl({ 'data-props-id': 'js' })).ok).toBe(false);
  });

  it('gives empty props when there are none', () => {
    expect(readProps(fakeEl({}))).toEqual({ ok: true, props: {} });
  });
});

describe('mountIslands error paths', () => {
  const Component = (() => {}) as never;

  it('logs and skips an unknown name, bad JSON and a failing mount, once each, without throwing', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const els = [
      fakeEl({ 'data-ilw-island': 'missing' }),
      fakeEl({ 'data-ilw-island': 'toString' }),
      fakeEl({ 'data-ilw-island': 'x', 'data-props': '{bad' }),
      // Svelte's server build in node has no mount(), so this one throws inside mount.
      fakeEl({ 'data-ilw-island': 'x' }),
    ];
    let unmount!: () => void;
    expect(() => (unmount = mountIslands({ x: Component }, fakeRoot(els)))).not.toThrow();
    expect(error).toHaveBeenCalledTimes(4);
    expect(error.mock.calls.map((c) => c[0])).toEqual([
      expect.stringMatching(/no component registered as "missing"/),
      expect.stringMatching(/no component registered as "toString"/),
      expect.stringMatching(/bad props for "x"/),
      expect.stringMatching(/"x" failed to mount/),
    ]);
    for (const el of els) expect(el.getAttribute('data-ilw-mounted')).toBeNull();

    mountIslands({ x: Component }, fakeRoot(els));
    expect(error).toHaveBeenCalledTimes(4);
    expect(unmount).not.toThrow();
  });
});
