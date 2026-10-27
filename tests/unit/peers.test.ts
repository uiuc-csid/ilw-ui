// The framework adapters are optional peers, so a React app doesn't get
// Svelte and the other way round (pnpm's autoInstallPeers installs required
// peers). The pinning rule still holds: each adapter peer is exact, and equals
// the devDependency the stories and tests run on. Renovate bumps adapter peers
// rather than widening them, and leaves the framework peers alone
// (.github/renovate.json5).
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  peerDependenciesMeta: Record<string, { optional?: boolean }>;
};

// The frameworks themselves take a caret range: any later minor works.
const frameworks = ['react', 'react-dom', 'svelte'];
const peers = Object.entries(pkg.peerDependencies);
const adapters = peers.filter(([name]) => !frameworks.includes(name));

describe('peer dependencies', () => {
  it('include both frameworks and their adapters', () => {
    expect(Object.keys(pkg.peerDependencies).sort()).toEqual(
      [
        '@phosphor-icons/react',
        '@tanstack/react-table',
        '@tanstack/svelte-table',
        '@zag-js/react',
        '@zag-js/svelte',
        'phosphor-svelte',
        'react',
        'react-dom',
        'svelte',
      ].sort(),
    );
  });

  it('are all optional and none is also a dependency', () => {
    for (const [name] of peers) {
      expect(pkg.peerDependenciesMeta[name]?.optional, name).toBe(true);
      expect(pkg.dependencies[name], name).toBeUndefined();
    }
  });

  it.each(adapters)('%s is pinned exactly and equals its devDependency', (name, version) => {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(pkg.devDependencies[name]).toBe(version);
  });

  it.each(peers.filter(([name]) => frameworks.includes(name)))(
    '%s is a caret range its devDependency satisfies',
    (name, range) => {
      const [, major, minor] = /^\^(\d+)\.(\d+)$/.exec(range) ?? [];
      expect(major, `${name}: ${range}`).toBeDefined();
      const [, devMajor, devMinor] = /^\^?(\d+)\.(\d+)\.\d+$/.exec(pkg.devDependencies[name] ?? '') ?? [];
      expect(devMajor, `${name} devDependency`).toBe(major);
      expect(Number(devMinor)).toBeGreaterThanOrEqual(Number(minor));
    },
  );

  it('keep the adapter families in lockstep with the headless engines', () => {
    const zag = pkg.dependencies['@zag-js/combobox'];
    const table = pkg.dependencies['@tanstack/table-core'];
    expect(pkg.peerDependencies['@zag-js/svelte']).toBe(zag);
    expect(pkg.peerDependencies['@zag-js/react']).toBe(zag);
    expect(pkg.peerDependencies['@tanstack/svelte-table']).toBe(table);
    expect(pkg.peerDependencies['@tanstack/react-table']).toBe(table);
  });
});
