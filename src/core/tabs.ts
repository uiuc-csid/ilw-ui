// The tabs (C3) without a framework: reading a server-rendered `.ilw-tabs`
// box of headed sections, making its sections tabpanels and putting them back,
// and the keys and URL fragment the tab list follows.

/** A tab: its panel's id and its label. */
export interface TabRef {
  id: string;
  label: string;
}

/** A server-rendered `.ilw-tabs` box, read for its tab list. */
export interface TabsMarkup {
  /** The panels' parent, which the tab list goes in. */
  container: HTMLElement;
  /** The first panel, which the tab list goes before. */
  anchor: HTMLElement;
  tabs: TabRef[];
  /** From the box's `data-*` attributes and classes. */
  options: {
    selected?: string;
    automatic: boolean;
    hash: boolean;
    horizontal: boolean;
    label?: string;
    labelledby?: string;
  };
}

/** Reads a `.ilw-tabs` box's panels and options, or null when it is already tabs or has no panels. */
export function readTabsMarkup(host: HTMLElement): TabsMarkup | null {
  // .ilw-tabs--ready: already tabs (enhanced, or rendered by Tabs).
  if (host.classList.contains('ilw-tabs--ready')) return null;
  const container = host.querySelector<HTMLElement>(':scope > .ilw-tabs-container') ?? host;
  const panels = [...container.querySelectorAll<HTMLElement>(':scope > .ilw-tabs-panel[id]')];
  if (!panels.length) return null;
  const tabs = panels.map((panel) => ({
    id: panel.id,
    label: panel.querySelector('.ilw-tabs-heading')?.textContent?.trim() || panel.id,
  }));
  const data = host.dataset;
  return {
    container,
    anchor: panels[0],
    tabs,
    options: {
      selected: data.selected,
      automatic: data.automatic !== undefined,
      hash: data.hash !== undefined,
      horizontal: host.classList.contains('ilw-tabs--horizontal'),
      label: data.label,
      labelledby: data.labelledby,
    },
  };
}

/** Tells the page an enhanced box's selection changed: a bubbling `ilw-tabs-change` with `{ id }`. */
export function dispatchTabsChange(host: HTMLElement, id: string): void {
  host.dispatchEvent(new CustomEvent('ilw-tabs-change', { bubbles: true, detail: { id } }));
}

/** The panel with id `id` in `host`. */
export function tabPanel(host: HTMLElement, id: string): HTMLElement | null {
  return host.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
}

/**
 * Marks `host` `.ilw-tabs--ready` and makes each tab's panel a tabpanel
 * (role, name, tabindex). Returns a function that puts the panels back as
 * they were, `hidden` included.
 */
export function wireTabPanels(host: HTMLElement, tabs: TabRef[]): () => void {
  const wired = tabs.map((tab) => [tab, tabPanel(host, tab.id)] as const);
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
}

/** Shows the `current` tab's panel and hides the others. */
export function showTabPanel(host: HTMLElement, tabs: TabRef[], current: string | undefined): void {
  for (const tab of tabs) {
    const el = tabPanel(host, tab.id);
    if (el) el.hidden = tab.id !== current;
  }
}

/**
 * The tab a key on tab `i` of `n` moves focus to, or null for a key the tab
 * list leaves alone. All four arrows work in both orientations: the
 * horizontal list stacks into a column at narrow widths.
 */
export function tabKeyTarget(
  event: { key: string; altKey: boolean; ctrlKey: boolean; metaKey: boolean },
  i: number,
  n: number,
): number | null {
  if (event.altKey || event.ctrlKey || event.metaKey) return null;
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (i + 1) % n;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (i - 1 + n) % n;
    case 'Home':
      return 0;
    case 'End':
      return n - 1;
    default:
      return null;
  }
}

/** Writes `#id` to the URL, without a history entry. */
export function replaceTabHash(id: string): void {
  // An absolute URL: a page's <base href> would resolve a bare '#id' elsewhere.
  const url = new URL(location.href);
  url.hash = id;
  history.replaceState(history.state, '', url);
}

/** The tab whose panel holds the URL fragment's target, and that target; null if there is none. */
export function fragmentTab(host: HTMLElement, tabs: TabRef[]): { tab: TabRef; target: HTMLElement } | null {
  const doc = host.ownerDocument;
  const view = doc.defaultView;
  if (!view) return null;
  const fragment = decodeURIComponent(view.location.hash.slice(1));
  const target = fragment ? doc.getElementById(fragment) : null;
  if (!target) return null;
  const tab = tabs.find((t) => tabPanel(host, t.id)?.contains(target));
  return tab ? { tab, target } : null;
}

/**
 * Scrolls to a fragment's target once its tab shows: the box when the
 * fragment names the panel itself. The target was hidden when the browser
 * tried to scroll to it.
 */
export function scrollToFragment(host: HTMLElement, tab: TabRef, target: HTMLElement): void {
  (target.id === tab.id ? host : target).scrollIntoView({ behavior: 'instant' });
}
