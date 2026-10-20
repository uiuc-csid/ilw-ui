import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, it } from 'vitest';

const root = fileURLToPath(new URL('../..', import.meta.url));
const src = join(root, 'src');

// src/ may import only svelte, @zag-js/*, TanStack Table and its own files.
const allowedImport = /^(svelte(\/.*)?|@zag-js\/[a-z-]+|@tanstack\/(table-core|svelte-table)|\.{1,2}\/.*)$/;
const importRe = /\b(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|\bimport\s*\(?\s*['"]([^'"]+)['"]/g;
// HTML sinks and dynamic code: rich content goes through Svelte snippets.
const sinks = [/\{@html\b/, /\binnerHTML\b/, /\bouterHTML\b/, /\binsertAdjacentHTML\b/, /\bdocument\.write/, /\beval\s*\(/, /\bnew\s+Function\b/];

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : /\.(ts|js|svelte)$/.test(e.name) ? [join(dir, e.name)] : [],
  );
}

export function violations(file: string, text: string): string[] {
  const out: string[] = [];
  text.split('\n').forEach((line, i) => {
    const at = `${file}:${i + 1}`;
    for (const m of line.matchAll(importRe)) {
      const spec = m[1] ?? m[2];
      if (!allowedImport.test(spec)) out.push(`${at} disallowed import '${spec}'`);
    }
    for (const re of sinks) if (re.test(line)) out.push(`${at} banned sink ${re.source}`);
  });
  return out;
}

it('src/ imports only svelte, @zag-js/*, TanStack Table and its own files, and uses no HTML sinks', () => {
  const found = files(src).flatMap((f) => violations(relative(root, f), readFileSync(f, 'utf8')));
  expect(found, found.join('\n')).toEqual([]);
});

it('flags what it should', () => {
  expect(violations('x.ts', "import { x } from 'lodash';")).toEqual(["x.ts:1 disallowed import 'lodash'"]);
  expect(violations('x.svelte', '{@html s}')).toHaveLength(1);
  expect(violations('x.ts', 'el.innerHTML = s;')).toHaveLength(1);
  expect(violations('x.ts', "import { mount } from 'svelte';\nimport M from './M.svelte';")).toEqual([]);
  expect(violations('x.ts', "import * as combobox from '@zag-js/combobox';")).toEqual([]);
  expect(violations('x.ts', "import { computePosition } from '@floating-ui/dom';")).toHaveLength(1);
  expect(violations('x.ts', "import { createTable } from '@tanstack/svelte-table';")).toEqual([]);
  expect(violations('x.ts', "import type { SortFn } from '@tanstack/table-core';")).toEqual([]);
  expect(violations('x.ts', "import { Store } from '@tanstack/store';")).toHaveLength(1);
});

// The ta-manager spikes kept components in a top-level svelte/ folder, and
// Vite (root = the package) resolved the bare `svelte` import to it. They
// patched it twice (an exact alias; optimizeDeps.exclude). Keeping sources
// under src/ settles it: no top-level entry may share a bare import's name.
it('no top-level file or folder shadows a dependency', () => {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as Record<string, Record<string, string>>;
  const deps = new Set(
    ['dependencies', 'devDependencies', 'peerDependencies'].flatMap((k) => Object.keys(pkg[k] ?? {})).map((d) => d.split('/')[0]),
  );
  const clashes = readdirSync(root).filter((name) => deps.has(name));
  expect(clashes).toEqual([]);
});
