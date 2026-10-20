// Workarounds shared by the components built on Zag's combobox machine
// (Combobox, Autocomplete). Each returns its own cleanup, for an `$effect`.

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
 * (ta-manager's `<ilw-page>`), and outside a modal, where `inert` on the rest
 * of the page would silence it. While focus is in `root`, move each one into
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
