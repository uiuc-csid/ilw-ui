<!--
  A Combobox over a server-rendered <select>, which stays (hidden) as the value
  source. Mounted by enhanceSelect / enhanceSelects (enhance-select.ts); see the
  README for the DOM contract.
-->
<script lang="ts">
  import { flushSync, onMount, untrack } from 'svelte';

  import { type ComboboxItem, nextId } from '../core/index.ts';
  import Combobox from './Combobox.svelte';

  const props: { select: HTMLSelectElement; labelId?: string } = $props();
  // Fixed for the instance's life: enhanceSelect mounts one per select.
  const select = untrack(() => props.select);

  function gather(): ComboboxItem[] {
    const out: ComboboxItem[] = [];
    const add = (o: HTMLOptionElement, group?: string) => {
      if (o.value === '') return;
      const label = o.textContent ?? '';
      out.push({ value: o.value, label, search: o.dataset.search || label, group });
    };
    for (const child of select.children) {
      if (child instanceof HTMLOptGroupElement) {
        for (const o of child.children) if (o instanceof HTMLOptionElement) add(o, child.label);
      } else if (child instanceof HTMLOptionElement) {
        add(child);
      }
    }
    return out;
  }

  // A select without an id still needs one for its input (Zag's ids hang off it).
  const id = select.id ? `${select.id}-cb` : nextId('combobox');
  const popupId = select.id ? `${select.id}-popup` : `${id}-popup`;
  // The empty option's text is the prompt, as in the native select.
  const placeholder = [...select.options].find((o) => o.value === '')?.textContent ?? 'Type to search...';

  let items = $state(gather());
  let value = $state<string | null>(select.value || null);

  function onchange(v: string | null) {
    value = v;
    const changed = select.value !== (v ?? '');
    select.value = v ?? '';
    // A choice is a change; text that matches nothing clears the select silently.
    if (v != null && changed) select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  onMount(() => {
    // Page code may rebuild the select's options; keep the list in step.
    const observer = new MutationObserver(() => {
      items = gather();
    });
    observer.observe(select, { childList: true, subtree: true, characterData: true });
    // Page code may set select.value and dispatch change itself.
    const resync = () => {
      if (document.activeElement?.id === id) return;
      value = select.value || null;
      // Synchronously: page code reads the input right after.
      flushSync();
    };
    select.addEventListener('change', resync);
    // Text that matches nothing clears the select on blur, even a value set
    // with JS and no change event, which Combobox never saw. Combobox has
    // already committed any match by now.
    const input = document.getElementById(id)!;
    const clearUnmatched = (event: FocusEvent) => {
      if (input.parentElement!.contains(event.relatedTarget as Node | null)) return;
      if (value == null) select.value = '';
    };
    input.addEventListener('focusout', clearUnmatched);
    return () => {
      observer.disconnect();
      select.removeEventListener('change', resync);
      input.removeEventListener('focusout', clearUnmatched);
    };
  });
</script>

<Combobox {id} {popupId} {items} {value} {onchange} {placeholder} labelId={props.labelId} block />
