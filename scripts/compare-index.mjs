// After both Storybook builds (CI's last step, `pnpm compare-index`): the React
// build's story ids must be the Svelte build's, minus the stories with no twin
// (framework-neutral ones, parity Toolkit and Side By Side) and those listed in
// tests/twins-pending/ (docs/plans/2026-10-27-react-components.md, "Twins check").
// tests/unit/twins.test.ts checks the same from the sources; this checks what the
// builds actually indexed.
//
//   node scripts/compare-index.mjs [svelte-build] [react-build]

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { noTwin, readPending } from '../tests/twins.ts';

const [svelteBuild = 'storybook-static', reactBuild = 'storybook-static-react'] = process.argv.slice(2);

/** The story entries (not docs) of a build's index.json. */
function stories(build) {
  const { entries } = JSON.parse(readFileSync(join(build, 'index.json'), 'utf8'));
  return Object.values(entries).filter((entry) => entry.type === 'story');
}

const pending = readPending();
const expected = new Set(
  stories(svelteBuild)
    .filter((entry) => !noTwin(entry.id, entry.tags ?? []) && !pending.stories.has(entry.id))
    .map((entry) => entry.id),
);
const actual = new Set(stories(reactBuild).map((entry) => entry.id));

const missing = [...expected].filter((id) => !actual.has(id));
const extra = [...actual].filter((id) => !expected.has(id));
for (const id of missing) console.error(`missing from ${reactBuild}: ${id}`);
for (const id of extra) console.error(`in ${reactBuild} only: ${id}`);
if (missing.length || extra.length) process.exit(1);
console.log(`${actual.size} React stories, the same ids as ${svelteBuild} minus no-twin and pending stories.`);
