import { type Component, mount, unmount } from 'svelte';

import { mountIslandsWith } from '../core/islands.ts';

/** Maps a `data-ilw-island` name to the component mounted there. */
export type IslandRegistry = Record<string, Component<any>>;

/**
 * Mounts `registry[name]` on every `[data-ilw-island="name"]` under `root` that isn't mounted yet.
 * Bad props or an unknown name are logged and skipped; this never throws. Returns a function that
 * unmounts what this call mounted. On a `pagehide` that isn't going into the bfcache, it unmounts
 * by itself.
 */
export function mountIslands(registry: IslandRegistry, root: ParentNode = document): () => void {
  return mountIslandsWith(registry, root, (component, el, props) => {
    const instance = mount(component, { target: el, props });
    return () => void unmount(instance);
  });
}
