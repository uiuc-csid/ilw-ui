<!--
  The tab list (C3) that turns a `.ilw-tabs` box of headed sections into APG
  tabs. `Tabs` renders it once mounted; `enhanceTabs` mounts it into server
  markup. It renders the tablist and, while it lives, makes each panel a
  tabpanel (role, name, tabindex, hidden) and marks the host
  `.ilw-tabs--ready`; on destroy it puts the sections back as they were.
  Manual activation by default (arrows, Home and End move focus; Enter, Space
  or a click selects); `automatic` selects on focus. A URL fragment naming a
  panel, or anything in one, selects that tab. Styled by tabs.css.
-->
<script lang="ts">
  import { tick, untrack } from 'svelte';

  import {
    fragmentTab,
    replaceTabHash,
    scrollToFragment,
    showTabPanel,
    tabKeyTarget,
    type TabRef,
    wireTabPanels,
  } from '../core/tabs.ts';

  let {
    host,
    tabs,
    selected = $bindable(),
    automatic = false,
    hash = false,
    horizontal = false,
    label,
    labelledby,
    onchange,
  }: {
    /** The `.ilw-tabs` element holding the panels. */
    host: HTMLElement;
    tabs: TabRef[];
    /** The selected panel's id (bindable); the first tab when unset or unknown. */
    selected?: string;
    /** Select a tab when it gets focus (arrows), not only on Enter, Space or click. */
    automatic?: boolean;
    /** Write `#<panel id>` to the URL (replaceState) when a tab is chosen. */
    hash?: boolean;
    /** Tabs in a row over the panels (`aria-orientation="horizontal"`). */
    horizontal?: boolean;
    /** The tab list's name, when no visible heading names it. */
    label?: string;
    /** The id of the heading that names the tab list. */
    labelledby?: string;
    /** Called with the panel id when the selection changes. */
    onchange?: (id: string) => void;
  } = $props();

  const current = $derived(tabs.some((tab) => tab.id === selected) ? selected : tabs[0]?.id);
  const buttons: HTMLButtonElement[] = $state([]);

  function select(id: string, writeHash = true): void {
    if (id === current) return;
    selected = id;
    onchange?.(id);
    if (hash && writeHash) replaceTabHash(id);
  }

  function onkeydown(event: KeyboardEvent, i: number): void {
    const to = tabKeyTarget(event, i, tabs.length);
    if (to === null) return;
    event.preventDefault();
    buttons[to]?.focus();
    if (automatic) select(tabs[to].id);
  }

  // The panels' tabpanel wiring, undone on destroy (or when the tabs change).
  $effect(() => wireTabPanels(host, tabs));

  $effect(() => showTabPanel(host, tabs, current));

  // Follow the URL fragment: on mount and on every hashchange.
  $effect(() => {
    const view = host.ownerDocument.defaultView;
    if (!view) return;
    const follow = () => {
      const found = fragmentTab(host, tabs);
      if (!found) return;
      select(found.tab.id, false);
      void tick().then(() => scrollToFragment(host, found.tab, found.target));
    };
    untrack(follow);
    view.addEventListener('hashchange', follow);
    return () => view.removeEventListener('hashchange', follow);
  });
</script>

<div
  class="ilw-tabs-list"
  role="tablist"
  aria-label={label}
  aria-labelledby={labelledby}
  aria-orientation={horizontal ? 'horizontal' : 'vertical'}
>
  {#each tabs as tab, i (tab.id)}
    <button
      bind:this={buttons[i]}
      type="button"
      class="ilw-tabs-tab"
      role="tab"
      id="{tab.id}-tab"
      aria-controls={tab.id}
      aria-selected={tab.id === current ? 'true' : 'false'}
      tabindex={tab.id === current ? 0 : -1}
      onclick={() => select(tab.id)}
      onkeydown={(event) => onkeydown(event, i)}>{tab.label}</button
    >
  {/each}
</div>
