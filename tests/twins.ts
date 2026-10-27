// What the twins check (tests/unit/twins.test.ts) and the index.json comparison
// (scripts/compare-index.mjs) share: which Svelte stories need no React twin,
// and the twins-pending lists. Plain TypeScript with erasable syntax only, so
// node runs it as is.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** tests/twins-pending/: one list per component not yet ported. */
export const pendingDir = fileURLToPath(new URL('twins-pending', import.meta.url));

/** Tags a story that renders only markup and CSS, or calls only core/: it has no React twin. */
export const FRAMEWORK_NEUTRAL = 'framework-neutral';

/**
 * Whether a Svelte story is left out of the React build: tagged framework-neutral, or the
 * Toolkit or Side By Side story of a parity pair (upstream's markup, and iframes of the others).
 */
export function noTwin(id: string, tags: readonly string[]): boolean {
  return tags.includes(FRAMEWORK_NEUTRAL) || /^parity-.*--(toolkit|side-by-side)$/.test(id);
}

export interface Pending {
  /** Story id → the list naming it. */
  stories: Map<string, string>;
  /** ilw-ui/svelte export → the list naming it. */
  exports: Map<string, string>;
}

/**
 * Reads tests/twins-pending/*.txt. Each line is a story id, `export <Name>` (an ilw-ui/svelte
 * export), a `#` comment or blank.
 */
export function readPending(dir = pendingDir): Pending {
  const pending: Pending = { stories: new Map(), exports: new Map() };
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.txt')).sort()) {
    for (const raw of readFileSync(join(dir, file), 'utf8').split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const exported = /^export ([A-Za-z_$][\w$]*)$/.exec(line);
      const [map, key] = exported ? [pending.exports, exported[1]] : [pending.stories, line];
      if (map.has(key)) throw new Error(`${file}: '${line}' is also in ${map.get(key)}`);
      map.set(key, file);
    }
  }
  return pending;
}
