import { getContext, setContext } from 'svelte';

/** A `TabPanel` as its `Tabs` sees it: getters over the panel's props, and its section. */
export interface TabEntry {
  readonly id: string;
  readonly label: string;
  readonly el: HTMLElement;
}

/** What a `Tabs` shares with its `TabPanel`s. */
export interface TabsContext {
  /** The panels' heading level. */
  readonly level: 2 | 3 | 4 | 5 | 6;
  /** Registers a panel once its section is in the document; returns the unregister function. */
  add(entry: TabEntry): () => void;
}

const key = Symbol('ilw-tabs');

export function setTabsContext(context: TabsContext): void {
  setContext(key, context);
}

/** The enclosing `Tabs`' context, or undefined for a panel on its own. */
export function getTabsContext(): TabsContext | undefined {
  return getContext<TabsContext | undefined>(key);
}
