import { getContext, setContext } from 'svelte';

/** The toolkit's accent colours: the line at each panel's left. Compact accordions have none. */
export type AccordionAccent = 'blue' | 'orange' | 'arches' | 'industrial' | 'altgeld' | 'gray' | 'black' | 'white';

/** What an `Accordion` shares with its `AccordionPanel`s. */
export interface AccordionContext {
  /** The shared `name` that makes the panels an exclusive group (`single`), or undefined. */
  readonly name: string | undefined;
  /** Registers a panel's open setter, for Expand All / Collapse All; returns the unregister function. */
  add(setOpen: (open: boolean) => void): () => void;
}

const key = Symbol('ilw-accordion');

export function setAccordionContext(context: AccordionContext): void {
  setContext(key, context);
}

/** The enclosing `Accordion`'s context, or undefined for a panel on its own. */
export function getAccordionContext(): AccordionContext | undefined {
  return getContext<AccordionContext | undefined>(key);
}
