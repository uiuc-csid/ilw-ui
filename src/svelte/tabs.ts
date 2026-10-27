// Progressive enhancement: turn a server-rendered `.ilw-tabs` box of headed
// sections into tabs in place, by mounting TabList before its first panel.
// The sections stay as they are; unmounting puts them back.

import { flushSync, mount, unmount } from 'svelte';

import TabList from './TabList.svelte';

const mounted = new Map<HTMLElement, ReturnType<typeof mount>>();

function enhance(host: HTMLElement): ReturnType<typeof mount> | null {
  // .ilw-tabs--ready: already tabs (enhanced here, or rendered by Tabs).
  if (mounted.has(host) || host.classList.contains('ilw-tabs--ready')) return null;
  const container = host.querySelector<HTMLElement>(':scope > .ilw-tabs-container') ?? host;
  const panels = [...container.querySelectorAll<HTMLElement>(':scope > .ilw-tabs-panel[id]')];
  if (!panels.length) return null;
  const tabs = panels.map((panel) => ({
    id: panel.id,
    label: panel.querySelector('.ilw-tabs-heading')?.textContent?.trim() || panel.id,
  }));
  const data = host.dataset;
  const instance = mount(TabList, {
    target: container,
    anchor: panels[0],
    props: {
      host,
      tabs,
      selected: data.selected,
      automatic: data.automatic !== undefined,
      hash: data.hash !== undefined,
      horizontal: host.classList.contains('ilw-tabs--horizontal'),
      label: data.label,
      labelledby: data.labelledby,
      onchange: (id: string) => host.dispatchEvent(new CustomEvent('ilw-tabs-change', { bubbles: true, detail: { id } })),
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
