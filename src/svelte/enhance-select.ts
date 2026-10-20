// Progressive enhancement: turn a server-rendered <select> into a Combobox in
// place. The select stays in the DOM, hidden, as the value source, so forms,
// page code and tests keep reading and setting `select.value`.

import { flushSync, mount, unmount } from 'svelte';

import SelectCombobox from './SelectCombobox.svelte';

const mounted = new Map<HTMLSelectElement, ReturnType<typeof mount>>();

function enhance(select: HTMLSelectElement): ReturnType<typeof mount> | null {
  // data-comboboxed="1" marks a select already enhanced (by this or by
  // ta-manager's legacy enhanceSelect, which skips it).
  if (select.dataset.comboboxed === '1' || !select.parentNode) return null;
  select.dataset.comboboxed = '1';
  select.style.display = 'none';

  let labelId: string | undefined;
  if (select.id) {
    const label = select.ownerDocument.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(select.id)}"]`);
    if (label) {
      label.htmlFor = `${select.id}-cb`;
      // The label also names the listbox.
      if (!label.id) label.id = `${select.id}-label`;
      labelId = label.id;
    }
  }

  const instance = mount(SelectCombobox, {
    target: select.parentNode as Element,
    anchor: select.nextSibling ?? undefined,
    props: { select, labelId },
  });
  mounted.set(select, instance);
  return instance;
}

/**
 * Enhances one select. Returns a cleanup that removes the combobox, so it
 * works as a Svelte attachment: `<select {@attach enhanceSelect}>`.
 */
export function enhanceSelect(select: HTMLSelectElement): () => void {
  const instance = enhance(select);
  flushSync();
  return () => {
    if (!instance) return;
    mounted.delete(select);
    void unmount(instance);
  };
}

/**
 * Enhances every `selector` match under `root` not yet enhanced, after
 * removing the comboboxes of selects that have left the document (e.g. rows
 * re-rendered from a string). Safe to call after every render.
 */
export function enhanceSelects(root: ParentNode = document, selector = 'select[data-combobox]'): void {
  for (const [select, instance] of mounted) {
    if (!select.isConnected) {
      void unmount(instance);
      mounted.delete(select);
    }
  }
  for (const select of root.querySelectorAll<HTMLSelectElement>(selector)) enhance(select);
  flushSync();
}
