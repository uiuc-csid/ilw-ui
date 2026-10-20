<script lang="ts">
  import * as combobox from '@zag-js/combobox';
  import { mergeProps, normalizeProps, useMachine } from '@zag-js/svelte';
  import { flushSync } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  import { type AutocompleteItem, filterItems } from '../core/index.ts';
  import { focusStaysPut, keepCaret, keepLiveRegionIn } from './zag-input.ts';

  let {
    id,
    popupId = `${id}-popup`,
    items,
    value = $bindable(''),
    oninput,
    onselect,
    placeholder = '',
    minChars = 1,
    max = 10,
    emptyText,
    block = false,
    disabled = false,
    invalid = false,
    required = false,
    labelId,
    class: inputClass,
    ...attrs
  }: {
    /** The input's id. */
    id: string;
    /** The listbox's id. */
    popupId?: string;
    items: AutocompleteItem[];
    /** The input's text (bindable). It is the value: any text is allowed. */
    value?: string;
    /** Called on each keystroke with the new text. */
    oninput?: (text: string) => void;
    /** Called when a suggestion is chosen, after its text is written to the input. */
    onselect?: (item: AutocompleteItem) => void;
    placeholder?: string;
    /** Typing opens the list at this many characters. ArrowDown always opens it. */
    minChars?: number;
    /** Suggestions shown at most. */
    max?: number;
    /** Shown as a disabled option when nothing matches; without it the list closes. */
    emptyText?: string;
    block?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
    /** The id of the `<label>` for the input; it also labels the listbox. */
    labelId?: string;
    /** Extra classes on the input. */
    class?: string;
  } & Omit<HTMLInputAttributes, 'value' | 'id' | 'oninput' | 'onselect' | 'type' | 'role'> = $props();

  let query = $state('');
  const shown = $derived(filterItems(items, query, max).shown);
  const collection = $derived(
    combobox.collection({
      items: shown,
      itemToValue: (i) => i.value,
      itemToString: (i) => i.label,
    }),
  );

  // Option ids are IDREFs (aria-activedescendant): no whitespace allowed.
  const optionId = (v: string) => `${popupId}-opt-${encodeURIComponent(v)}`;

  function choose(item: AutocompleteItem) {
    value = item.text ?? item.label;
    onselect?.(item);
    // A choice changes the input's value as typing and blurring would, so it
    // fires the bubbling `change` a native input fires, after the text is in.
    flushSync();
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  const service = useMachine(focusStaysPut(combobox.machine, () => input), {
    get id() {
      return id;
    },
    get ids() {
      return { label: labelId, input: id, content: popupId, item: optionId };
    },
    get collection() {
      return collection;
    },
    // The text is the value; Zag's selection is never kept, so every choice
    // (even the same one twice) reaches onValueChange.
    value: [],
    get inputValue() {
      return value;
    },
    get disabled() {
      return disabled;
    },
    get invalid() {
      return invalid;
    },
    get required() {
      return required;
    },
    get placeholder() {
      return placeholder;
    },
    allowCustomValue: true,
    // The text is ours: Zag would rewrite it with the option's label.
    selectionBehavior: 'preserve',
    // A function here sees the text before the keystroke (zag 1.44.0), so
    // the list is opened from onInputValueChange instead.
    openOnChange: false,
    onInputValueChange({ inputValue, reason }) {
      if (reason !== 'input-change') return;
      value = inputValue;
      query = inputValue;
      oninput?.(inputValue);
      const open = inputValue.trim().length >= minChars && (shown.length > 0 || emptyText != null);
      api.setOpen(open);
      // Typing never highlights: Enter and Tab keep the typed text.
      api.clearHighlightValue();
    },
    onValueChange({ value: [v] }) {
      const item = shown.find((i) => i.value === v);
      if (item) choose(item);
    },
  });

  $effect(() => keepCaret(input));
  $effect(() => keepLiveRegionIn(root));

  const api = $derived(combobox.connect(service, normalizeProps));

  // mergeProps runs later arguments' handlers first, so ours go last.
  const inputProps = $derived(
    mergeProps(api.getInputProps(), attrs, {
      onkeydown(event: KeyboardEvent) {
        // ArrowDown/Up on a closed list opens it on the current text.
        if (!api.open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) query = value;
      },
      onfocusout(event: FocusEvent) {
        if (root.contains(event.relatedTarget as Node | null)) return;
        // Tab and blur take the highlighted suggestion, as Enter does.
        const highlighted = api.open ? shown.find((i) => i.value === api.highlightedValue) : undefined;
        if (highlighted) choose(highlighted);
        // Close the way zag's own dismissal does, without pulling focus back.
        if (api.open) service.send({ type: 'LAYER.INTERACT_OUTSIDE', src: 'interact-outside', restoreFocus: false });
      },
    }),
  );

  // Zag points aria-activedescendant at the highlighted value even while
  // closed or filtered out, leaving a dangling IDREF.
  const activeDescendant = $derived.by(() => {
    const v = api.highlightedValue;
    return api.open && v != null && shown.some((i) => i.value === v) ? optionId(v) : undefined;
  });

  let root: HTMLElement;
  let input: HTMLInputElement;
</script>

<span class={['autocomplete', block && 'ac-block']} {...api.getRootProps()} bind:this={root}>
  <input
    {...inputProps}
    class={['autocomplete-input', inputClass]}
    aria-activedescendant={activeDescendant}
    bind:this={input}
  />
  <div
    class="autocomplete-popup"
    {...api.getContentProps()}
    aria-labelledby={labelId}
    aria-label={labelId ? undefined : placeholder || undefined}
  >
    {#each shown as item (item.value)}
      <div {...api.getItemProps({ item })}>{item.label}</div>
    {/each}
    {#if !shown.length && emptyText != null}
      <div class="autocomplete-empty" role="option" aria-disabled="true" aria-selected="false">{emptyText}</div>
    {/if}
  </div>
</span>
