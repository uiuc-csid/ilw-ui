// Progressive enhancement: turn a server-rendered `.ilw-tabs` box of headed
// sections into tabs in place, by mounting TabList before its first panel.
// The sections stay as they are; unmounting puts them back.

import { flushSync, mount, unmount } from 'svelte';

import { dispatchTabsChange, readTabsMarkup } from '../core/tabs.ts';
import TabList from './TabList.svelte';

const mounted = new Map<HTMLElement, ReturnType<typeof mount>>();

function enhance(host: HTMLElement): ReturnType<typeof mount> | null {
  if (mounted.has(host)) return null;
  const markup = readTabsMarkup(host);
  if (!markup) return null;
  const instance = mount(TabList, {
    target: markup.container,
    anchor: markup.anchor,
    props: {
      host,
      tabs: markup.tabs,
      ...markup.options,
      onchange: (id: string) => dispatchTabsChange(host, id),
    },
  });
  mounted.set(host, instance);
  return instance;
}

function remove(host: HTMLElement): void {
  const instance = mounted.get(host);
  if (!instance) return;
  mounted.delete(host);
  void unmount(instance);
  flushSync();
}

/**
 * Enhances one `.ilw-tabs`. Returns a cleanup that removes the tab list and
 * restores the sections, so it works as a Svelte attachment:
 * `<div class="ilw-tabs" {@attach enhanceTabs}>`.
 */
export function enhanceTabs(host: HTMLElement): () => void {
  const instance = enhance(host);
  flushSync();
  return () => {
    if (instance) remove(host);
  };
}

/**
 * Enhances every `selector` match under `root` not yet enhanced, after
 * removing the tab lists of boxes that have left the document. Safe to call
 * after every fragment swap.
 */
export function enhanceAllTabs(root: ParentNode = document, selector = '.ilw-tabs'): void {
  for (const host of mounted.keys()) if (!host.isConnected) remove(host);
  for (const host of root.querySelectorAll<HTMLElement>(selector)) enhance(host);
  flushSync();
}
