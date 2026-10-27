import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, it } from 'vitest';

const root = fileURLToPath(new URL('../..', import.meta.url));

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : e.name.endsWith('.svelte') ? [join(dir, e.name)] : [],
  );
}

// Svelte's scoped classes (svelte-xxxx) would make a story's markup differ from
// its React twin's, so story styles live in plain .css files both import.
it('story components keep their styles in plain .css files', () => {
  const styled = files(join(root, 'stories'))
    .filter((f) => /<style[\s>]/.test(readFileSync(f, 'utf8')))
    .map((f) => relative(root, f));
  expect(styled).toEqual([]);
});
