import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { expect, it } from 'vitest';

const root = fileURLToPath(new URL('../..', import.meta.url));
const read = (path: string) => readFileSync(`${root}/${path}`, 'utf8');

// CI runs in the Playwright image, whose browsers only work with the same
// Playwright version that pnpm installs.
it('the CI Playwright container matches the pinned playwright packages', () => {
  const tag = read('.github/workflows/ci.yml').match(/mcr\.microsoft\.com\/playwright:v([\d.]+)-/)?.[1];
  const { devDependencies: deps } = JSON.parse(read('package.json'));
  expect(tag).toBeDefined();
  expect(deps['playwright']).toBe(tag);
  expect(deps['@playwright/test']).toBe(tag);
});
