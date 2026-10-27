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
<script module lang="ts">
  /** A tab: its panel's id and its label. */
  export interface TabRef {
    id: string;
    label: string;
  }
</script>

<script lang="ts">
  import { tick, untrack } from 'svelte';

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

  function panel(id: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
  }

  function select(id: string, writeHash = true): void {
    if (id === current) return;
    selected = id;
    onchange?.(id);
    if (hash && writeHash) {
      // An absolute URL: a page's <base href> would resolve a bare '#id' elsewhere.
      const url = new URL(location.href);
      url.hash = id;
      history.replaceState(history.state, '', url);
    }
  }

  function onkeydown(event: KeyboardEvent, i: number): void {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const n = tabs.length;
    let to: number;
    // All four arrows in both orientations: the horizontal list stacks into a
    // column at narrow widths.
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        to = (i + 1) % n;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        to = (i - 1 + n) % n;
        break;
      case 'Home':
        to = 0;
        break;
      case 'End':
        to = n - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    buttons[to]?.focus();
    if (automatic) select(tabs[to].id);
  }

  // The panels' tabpanel wiring, undone on destroy (or when the tabs change).
  $effect(() => {
    const wired = tabs.map((tab) => [tab, panel(tab.id)] as const);
    host.classList.add('ilw-tabs--ready');
    for (const [tab, el] of wired) {
      if (!el) continue;
      el.setAttribute('role', 'tabpanel');
      el.setAttribute('aria-labelledby', `${tab.id}-tab`);
      el.tabIndex = 0;
    }
    return () => {
      host.classList.remove('ilw-tabs--ready');
      for (const [, el] of wired) {
        el?.removeAttribute('role');
        el?.removeAttribute('aria-labelledby');
        el?.removeAttribute('tabindex');
        el?.removeAttribute('hidden');
      }
    };
  });

  $effect(() => {
    for (const tab of tabs) {
      const el = panel(tab.id);
      if (el) el.hidden = tab.id !== current;
    }
  });

  // Follow the URL fragment: on mount and on every hashchange.
  $effect(() => {
    const doc = host.ownerDocument;
    const view = doc.defaultView;
    if (!view) return;
    const follow = () => {
      const fragment = decodeURIComponent(view.location.hash.slice(1));
      const target = fragment ? doc.getElementById(fragment) : null;
      if (!target) return;
      const tab = tabs.find((t) => panel(t.id)?.contains(target));
      if (!tab) return;
      select(tab.id, false);
      // The target was hidden when the browser tried to scroll to it.
      void tick().then(() => (target.id === tab.id ? host : target).scrollIntoView({ behavior: 'instant' }));
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
