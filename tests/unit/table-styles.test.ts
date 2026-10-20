import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, it } from 'vitest';

const root = fileURLToPath(new URL('../..', import.meta.url));
const read = (p: string) => readFileSync(join(root, p), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

/** selector -> declarations, for every top-level rule whose selector names a -table- theme. */
function themes(css: string): Map<string, Record<string, string>> {
  const out = new Map<string, Record<string, string>>();
  for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    for (const s of sel.split(',').map((x) => x.trim())) {
      if (!/^(table)?\.ilw-theme-table-[a-z-]+$/.test(s)) continue;
      const decls: Record<string, string> = {};
      for (const d of body.split(';')) {
        const i = d.indexOf(':');
        if (i > 0) decls[d.slice(0, i).trim()] = d.slice(i + 1).trim();
      }
      out.set(s, decls);
    }
  }
  return out;
}

// --il-orange is the one brand token set directly; ours carries its fallback.
const norm = (d: Record<string, string>) =>
  Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v.replace(/var\((--il-[a-z0-9-]+), #[0-9a-f]+\)/g, 'var($1)')]));

it('table.css has every -table- theme from toolkit.css, setting the same properties', () => {
  const upstream = themes(read('vendor/illinois-toolkit/toolkit.css'));
  const mine = themes(read('src/styles/table.css'));
  expect([...mine.keys()].sort()).toEqual([...upstream.keys()].sort());
  expect(upstream.size).toBe(5);
  for (const [sel, decls] of upstream) expect(norm(mine.get(sel)!), sel).toEqual(decls);
});
