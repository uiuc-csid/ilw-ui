import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, posix, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('../..', import.meta.url));
const src = join(root, 'src');

// Each subtree of src/ has its own package allow-list. The adapters may import
// their framework, Zag, TanStack Table and Phosphor icons; core only the
// headless table engine. Icons come by their own path: an icon package's index
// pulls in all ~6,000 icon components, which every consumer's Vite would
// compile. The index is fine for types, which are erased.
const subtrees: Record<string, { packages: RegExp; typesOnly: string[] }> = {
  core: { packages: /^@tanstack\/table-core$/, typesOnly: [] },
  svelte: {
    packages: /^(svelte(\/.*)?|@zag-js\/[a-z-]+|@tanstack\/(table-core|svelte-table)|phosphor-svelte\/lib\/[A-Za-z0-9]+)$/,
    typesOnly: ['phosphor-svelte'],
  },
  react: {
    packages:
      /^(react|react\/jsx-runtime|react-dom|react-dom\/client|@zag-js\/[a-z-]+|@tanstack\/(table-core|react-table)|@phosphor-icons\/react\/dist\/ssr\/[A-Za-z0-9]+)$/,
    typesOnly: ['@phosphor-icons/react'],
  },
};
// Relative imports stay inside the file's own subtree, src/core or src/styles.
const shared = ['core', 'styles'];

// Static imports and re-exports, which may span lines; side-effect and dynamic imports.
const importRe = /\b(?:import|export)\s+(type\s+)?[^'";]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(?\s*['"]([^'"]+)['"]/g;
// HTML sinks and dynamic code: rich content goes through snippets (Svelte) or children (React).
const sinks = [
  /\{@html\b/,
  /\binnerHTML\b/,
  /\bouterHTML\b/,
  /\binsertAdjacentHTML\b/,
  /\bdangerouslySetInnerHTML\b/,
  /\bdocument\.write/,
  /\beval\s*\(/,
  /\bnew\s+Function\b/,
];

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : /\.(ts|js|tsx|jsx|svelte)$/.test(e.name) ? [join(dir, e.name)] : [],
  );
}

/** Violations in `text`, read as the file at `file` (a repo-relative path under src/). */
export function violations(file: string, text: string): string[] {
  const out: string[] = [];
  const subtree = file.split('/')[1];
  const rules = subtrees[subtree];
  if (!rules) return [`${file} is in src/${subtree}, which has no import allow-list`];
  const own = [subtree, ...shared].map((s) => `src/${s}/`);
  for (const m of text.matchAll(importRe)) {
    const at = `${file}:${text.slice(0, m.index).split('\n').length}`;
    const spec = m[2] ?? m[3];
    if (spec.startsWith('.')) {
      const target = posix.join(posix.dirname(file), spec);
      if (!own.some((dir) => target.startsWith(dir))) out.push(`${at} relative import '${spec}' leaves src/${subtree}`);
    } else if (!rules.packages.test(spec) && !(m[1] && rules.typesOnly.includes(spec))) {
      out.push(`${at} disallowed import '${spec}'`);
    }
  }
  text.split('\n').forEach((line, i) => {
    for (const re of sinks) if (re.test(line)) out.push(`${file}:${i + 1} banned sink ${re.source}`);
  });
  return out;
}

describe('src/ imports only its allow-list and uses no HTML sinks', () => {
  // A subtree that doesn't exist yet (src/react before the React toolchain) has nothing to check.
  it.each(Object.keys(subtrees))('src/%s', (subtree) => {
    const dir = join(src, subtree);
    const found = existsSync(dir)
      ? files(dir).flatMap((f) => violations(relative(root, f).split(sep).join('/'), readFileSync(f, 'utf8')))
      : [];
    expect(found, found.join('\n')).toEqual([]);
  });

  it('every source file is in a subtree with an allow-list', () => {
    const stray = files(src)
      .map((f) => relative(root, f).split(sep).join('/'))
      .filter((f) => !(f.split('/')[1] in subtrees));
    expect(stray).toEqual([]);
  });
});

it('flags what it should', () => {
  const sv = 'src/svelte/x.ts';
  expect(violations(sv, "import { x } from 'lodash';")).toEqual([`${sv}:1 disallowed import 'lodash'`]);
  expect(violations('src/svelte/x.svelte', '{@html s}')).toHaveLength(1);
  expect(violations(sv, 'el.innerHTML = s;')).toHaveLength(1);
  expect(violations(sv, "import { mount } from 'svelte';\nimport M from './M.svelte';")).toEqual([]);
  expect(violations(sv, "import * as combobox from '@zag-js/combobox';")).toEqual([]);
  expect(violations(sv, "import { computePosition } from '@floating-ui/dom';")).toHaveLength(1);
  expect(violations(sv, "import { createTable } from '@tanstack/svelte-table';")).toEqual([]);
  expect(violations(sv, "import type { SortFn } from '@tanstack/table-core';")).toEqual([]);
  expect(violations(sv, "import { Store } from '@tanstack/store';")).toHaveLength(1);
  expect(violations(sv, "import Check from 'phosphor-svelte/lib/Check';")).toEqual([]);
  expect(violations(sv, "import type { IconComponentProps } from 'phosphor-svelte';")).toEqual([]);
  expect(violations(sv, "import { Check } from 'phosphor-svelte';")).toHaveLength(1);
  expect(violations(sv, "import { useState } from 'react';")).toHaveLength(1);
  // A statement over several lines is reported at its first line.
  expect(violations(sv, "const a = 1;\nimport {\n  a,\n  b,\n} from 'lodash';")).toEqual([`${sv}:2 disallowed import 'lodash'`]);
  expect(violations(sv, "export {\n  a,\n} from '@tanstack/store';")).toHaveLength(1);
  expect(violations(sv, "const m = await import('lodash');")).toHaveLength(1);
  // Relative imports: the file's own subtree, core and styles, nothing else.
  expect(violations(sv, "import { nextId } from '../core/index.ts';\nimport '../styles/button.css';")).toEqual([]);
  expect(violations(sv, "import Button from '../react/Button.tsx';")).toEqual([
    `${sv}:1 relative import '../react/Button.tsx' leaves src/svelte`,
  ]);

  const core = 'src/core/x.ts';
  expect(violations(core, "import type { SortFn } from '@tanstack/table-core';\nimport { y } from './y.ts';")).toEqual([]);
  expect(violations(core, "import { mount } from 'svelte';")).toHaveLength(1);
  expect(violations(core, "import * as combobox from '@zag-js/combobox';")).toHaveLength(1);
  expect(violations(core, "import { createTable } from '../svelte/data-table.ts';")).toHaveLength(1);

  const re = 'src/react/X.tsx';
  expect(
    violations(
      re,
      [
        "import { useState, type ReactNode } from 'react';",
        "import { jsx } from 'react/jsx-runtime';",
        "import { createPortal, flushSync } from 'react-dom';",
        "import { createRoot } from 'react-dom/client';",
        "import { useMachine } from '@zag-js/react';",
        "import { useReactTable } from '@tanstack/react-table';",
        "import type { SortFn } from '@tanstack/table-core';",
        "import { Check } from '@phosphor-icons/react/dist/ssr/Check';",
        "import type { IconProps } from '@phosphor-icons/react';",
        "import { nextId } from '../core/index.ts';",
        "import Button from './Button.tsx';",
      ].join('\n'),
    ),
  ).toEqual([]);
  expect(violations(re, "import { Check } from '@phosphor-icons/react';")).toHaveLength(1);
  expect(violations(re, "import { renderToString } from 'react-dom/server';")).toHaveLength(1);
  expect(violations(re, "import { createTable } from '@tanstack/svelte-table';")).toHaveLength(1);
  expect(violations(re, "import { mount } from 'svelte';")).toHaveLength(1);
  expect(violations(re, "import Button from '../svelte/Button.svelte';")).toHaveLength(1);
  expect(violations('src/react/X.jsx', '<div dangerouslySetInnerHTML={{ __html: s }} />')).toEqual([
    'src/react/X.jsx:1 banned sink \\bdangerouslySetInnerHTML\\b',
  ]);

  expect(violations('src/vue/x.ts', "import { ref } from 'vue';")).toEqual([
    'src/vue/x.ts is in src/vue, which has no import allow-list',
  ]);
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
