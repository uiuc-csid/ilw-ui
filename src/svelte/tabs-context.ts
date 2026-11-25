import { getContext, setContext } from 'svelte';

/** A `TabPanel` as its `Tabs` sees it: getters over the panel's props, and its section once bound. */
export interface TabEntry {
  readonly id: string;
  readonly label: string;
  readonly el: HTMLElement | undefined;
}

/** What a `Tabs` shares with its `TabPanel`s. */
export interface TabsContext {
  /** The panels' heading level. */
  readonly level: 2 | 3 | 4 | 5 | 6;
  /** The id of the panel that shows; undefined in a server render (every panel shows). */
  readonly current: string | undefined;
  /** Registers a panel as it initialises; returns the unregister function. */
  add(entry: TabEntry): () => void;
}

const key = Symbol('ilw-tabs');
const panelKey = Symbol('ilw-tab-panel');

export function setTabsContext(context: TabsContext): void {
  setContext(key, context);
}

/** The enclosing `Tabs`' context, or undefined for a panel on its own. */
export function getTabsContext(): TabsContext | undefined {
  return getContext<TabsContext | undefined>(key);
}

/** What a `TabPanel` tells its content: read it with `getTabPanel()`. */
export interface TabPanelContext {
  /** The panel's id (TabPanel's `id`). */
  readonly id: string;
  /** The panel's label: its heading and its tab's text. */
  readonly label: string;
  /**
   * Whether this panel is the one shown. True for every panel until its `Tabs`'
   * tab list mounts (a server render, or no script, shows them all), and in a
   * `TabPanel` with no `Tabs`; then true for the selected panel only.
   */
  readonly active: boolean;
}

export function setTabPanelContext(context: TabPanelContext): void {
  setContext(panelKey, context);
}

/**
 * The enclosing `TabPanel`'s context, or undefined outside one. Call it while
 * a component initialises; its properties are live (read them in `$derived`
 * or `$effect` to follow the selection, id and label).
 */
export function getTabPanel(): TabPanelContext | undefined {
  return getContext<TabPanelContext | undefined>(panelKey);
}
