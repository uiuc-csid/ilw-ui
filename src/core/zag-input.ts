// Workarounds shared by the components built on Zag's combobox machine
// (Combobox, MultiCombobox, Autocomplete), in every framework: they work
// around the core machine, not an adapter. Each returns its own cleanup, for
// an effect.

/**
 * Zag moves the caret to the end (dom-query's setCaretToEnd) after nearly
 * every state change: opening, closing, even a keystroke that opens the list
 * or moves the highlight. Typing mid-text then jumps to the end. A real text
 * change already puts the caret at the end, so drop those calls.
 */
export function keepCaret(input: HTMLInputElement): () => void {
  const own = input.setSelectionRange;
  input.setSelectionRange = function (start, end, direction) {
    const len = this.value.length;
    if (start === len && end === len && direction === undefined) return;
    own.call(this, start, end, direction);
  };
  return () => {
    input.setSelectionRange = own;
  };
}

/**
 * On Apple platforms Zag re-announces the highlighted option through a live
 * region it appends to `document.body` (`@zag-js/live-region`; the combobox
 * machine passes it no root). That puts it outside the page's own landmarks
 * (ta-manager's `<ilw-page>`), and outside a modal dialog, which makes the rest
 * of the page inert and would silence it. While focus is in `root`, move each one into
 * `root`. Zag finds the region by id and sets its text a task later, so moving
 * it in the same microtask keeps announcing working.
 */
export function keepLiveRegionIn(root: HTMLElement): () => void {
  const observer = new MutationObserver((records) => {
    if (!root.contains(document.activeElement)) return;
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof HTMLElement && node.dataset.liveAnnouncer !== undefined && node.parentNode === document.body) {
          root.append(node);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true });
  return () => observer.disconnect();
}

/**
 * Zag focuses the input a frame after the list opens or closes
 * (`setInitialFocus`, `setFinalFocus`: a `raf` around `focusInputEl`). Typing
 * opens the list, so a Tab within that frame moves focus on and Zag then pulls
 * it back into the input. Run the same deferred focus, but only while focus is
 * still where it was when Zag asked (or has fallen to `<body>`). Neither
 * component has a trigger button, so the input is always the target. Zag's
 * caret-to-end is left out: `keepCaret` drops it anyway.
 */
export function focusStaysPut<M extends { implementations?: { actions?: Record<string, unknown> } }>(
  machine: M,
  input: () => HTMLInputElement | undefined,
): M {
  function focusInput() {
    const el = input();
    if (!el) return;
    const doc = el.ownerDocument;
    const from = doc.activeElement;
    requestAnimationFrame(() => {
      const now = doc.activeElement;
      if (!el.isConnected || now === el || (now && now !== from && now !== doc.body)) return;
      el.focus({ preventScroll: true });
    });
  }
  const implementations = machine.implementations ?? {};
  return {
    ...machine,
    implementations: {
      ...implementations,
      actions: { ...implementations.actions, setInitialFocus: focusInput, setFinalFocus: focusInput },
    },
  };
}

interface HighlightParams {
  context: { get(key: 'value'): string[]; set(key: 'highlightedValue', value: string): void };
  prop(key: 'collection'): {
    has(value: string): boolean;
    sort(values: string[]): string[];
    firstValue: string | null;
    lastValue: string | null;
  };
}

/**
 * ArrowDown or ArrowUp on a closed list opens it on the selection, else the
 * first or last option (`highlightFirstOrSelectedItem`,
 * `highlightLastOrSelectedItem`; a click, `highlightFirstSelectedItem`). Zag
 * sets that highlight a frame later (a `raf`), from whatever list shows then.
 * Keys typed inside that frame have filtered the list since, so it replaced a
 * lone match with a selection now hidden (a WebKit CI flake), or highlighted a
 * guess that Enter or Tab would take. Each component updates its list before
 * Zag's keydown handler runs, so highlight at once, and only a shown option.
 */
export function highlightAtOnce<M extends { implementations?: { actions?: Record<string, unknown> } }>(machine: M): M {
  const highlight =
    (fallback: 'firstValue' | 'lastValue' | null) =>
    ({ context, prop }: HighlightParams) => {
      const collection = prop('collection');
      const selected = collection.sort(context.get('value')).find((v) => collection.has(v));
      const value = selected ?? (fallback && collection[fallback]);
      if (value != null) context.set('highlightedValue', value);
    };
  const implementations = machine.implementations ?? {};
  return {
    ...machine,
    implementations: {
      ...implementations,
      actions: {
        ...implementations.actions,
        highlightFirstSelectedItem: highlight(null),
        highlightFirstOrSelectedItem: highlight('firstValue'),
        highlightLastOrSelectedItem: highlight('lastValue'),
      },
    },
  };
}

/**
 * Whether a `focusout` inside `root` means focus has left it. When the window
 * loses focus (switching windows or tabs, or a headless browser's window
 * deactivating), the input gets `focusout` with no `relatedTarget` but stays
 * the document's `activeElement`, and gets focus back on return. Committing
 * then would rewrite the text mid-word: typing `bla`, switching away and back,
 * then `ke` gave `Blake Brownke`. A real blur (Tab, a click elsewhere) has
 * already moved `activeElement` by the time `focusout` fires, and leaves the
 * document focused. The document check covers a browser that reports
 * `<body>` as active while the window deactivates.
 */
export function focusLeft(root: HTMLElement, event: { relatedTarget: EventTarget | null }): boolean {
  const to = event.relatedTarget as Node | null;
  if (root.contains(to)) return false;
  if (to != null) return true;
  const doc = root.ownerDocument;
  return doc.hasFocus() && !root.contains(doc.activeElement);
}
