import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('../..', import.meta.url));
const read = (p: string) => readFileSync(join(root, p), 'utf8');

type Rule = { at: string; selector: string; decls: Map<string, string> };

/** Flat list of style rules; `at` is the enclosing at-rule chain (e.g. "@layer base"). */
function rules(css: string): Rule[] {
  const out: Rule[] = [];
  const stack: string[] = [];
  let buf = '';
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (ch === '{') {
      stack.push(buf.trim());
      buf = '';
    } else if (ch === '}') {
      const selector = stack.pop()!;
      const body = buf.trim();
      buf = '';
      if (!body || selector.startsWith('@')) continue;
      const decls = new Map<string, string>();
      for (const d of body.split(';')) {
        const i = d.indexOf(':');
        if (i > 0) decls.set(d.slice(0, i).trim(), d.slice(i + 1).trim().replace(/\s+/g, ' '));
      }
      out.push({ at: stack.join(' '), selector: selector.replace(/\s+/g, ' '), decls });
    } else buf += ch;
  }
  return out;
}

const normSel = (s: string) => s.replace(/\[theme='([^']*)'\]/g, '[theme=$1]').trim();
const toolkit = rules(read('vendor/illinois-toolkit/toolkit.css'));
const ours = rules(read('src/styles/tokens.css'));

// Brand token -> hex, from our own fallbacks (each is the token's brand value).
const brand = new Map<string, string>();
for (const r of ours) for (const v of r.decls.values()) for (const m of v.matchAll(/var\((--il-[a-z0-9-]+), (#[0-9a-f]{6})\)/g)) brand.set(m[1], m[2]);

/** A palette value as a concrete colour: '#fff', 'var(--il-x)' and 'var(--il-x, #hex)' all become hex. */
function colour(v: string): string {
  const fallback = /^var\(--il-[a-z0-9-]+, (#[0-9a-f]{6})\)$/.exec(v);
  if (fallback) return fallback[1];
  const token = /^var\((--il-[a-z0-9-]+)\)$/.exec(v);
  if (token) return brand.get(token[1]) ?? `unknown ${token[1]}`;
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(v);
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
  return v;
}

describe('tokens.css matches the vendored toolkit.css', () => {
  it('has every palette property, with the same colour', () => {
    const upstream = toolkit.find((r) => r.at === '@layer base' && r.selector === ':root' && r.decls.has('--ilw-color--white--background'))!;
    const mine = new Map(ours.filter((r) => r.at === '' && r.selector === ':root').flatMap((r) => [...r.decls]));
    const palette = [...upstream.decls].filter(([k]) => /^--ilw-color--[a-z]+--/.test(k));
    expect(palette.length).toBeGreaterThan(100);
    for (const [k, v] of palette) {
      expect(mine.has(k), `${k} missing`).toBe(true);
      // Gradients are checked by eye in the parity stories (their stops are rewritten as tokens).
      if (v.includes('gradient')) continue;
      expect(colour(mine.get(k)!), k).toBe(colour(v));
    }
  });

  it('has every theme class and [theme] attribute, setting the same properties', () => {
    const isTheme = (s: string) => /^(\.ilw-theme-[a-z0-9-]+|\[theme=[a-z-]+\])$/.test(s);
    // The -table-* themes belong to the table styles (A4).
    const upstream = toolkit.filter((r) => r.selector.split(',').every((s) => isTheme(s.trim())) && [...r.decls.keys()].some((k) => k.startsWith('--ilw-color--')));
    const mine = new Map(ours.flatMap((r) => r.selector.split(',').map((s) => [normSel(s), r.decls] as const)));
    const checked: string[] = [];
    for (const r of upstream) {
      for (const s of r.selector.split(',').map((x) => x.trim())) {
        if (s.includes('-table-')) continue;
        expect(mine.has(s), `${s} missing`).toBe(true);
        expect(Object.fromEntries(mine.get(s)!), s).toEqual(Object.fromEntries(r.decls));
        checked.push(s);
      }
    }
    expect(checked).toHaveLength(18);
  });
});

describe('dark mode', () => {
  it('sets the same values for data-theme="dark" as for the OS preference', () => {
    const media = ours.find((r) => r.at.startsWith('@media (prefers-color-scheme: dark)'))!;
    const explicit = ours.find((r) => r.selector === ":root[data-theme='dark']")!;
    expect(media.selector).toBe(":root:not([data-theme='light'])");
    expect(Object.fromEntries(explicit.decls)).toEqual(Object.fromEntries(media.decls));
  });

  it('only overrides properties that exist in light mode', () => {
    const light = new Set(ours.filter((r) => r.at === '' && r.selector === ':root').flatMap((r) => [...r.decls.keys()]));
    const explicit = ours.find((r) => r.selector === ":root[data-theme='dark']")!;
    for (const k of explicit.decls.keys()) expect(light.has(k), k).toBe(true);
  });
});

it('src/styles uses hex only as a brand-token fallback', () => {
  const dir = join(root, 'src/styles');
  const found = readdirSync(dir).flatMap((f) => {
    const text = read(`src/styles/${f}`).replace(/\/\*[\s\S]*?\*\//g, '');
    const bare = text.replace(/var\(--il-[a-z0-9-]+, #[0-9a-f]{3,8}\)/g, '');
    return [...bare.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => `${f}: ${m[0]}`);
  });
  expect(found).toEqual([]);
});
