<script lang="ts">
  import * as combobox from '@zag-js/combobox';
  import { mergeProps, normalizeProps, useMachine } from '@zag-js/svelte';
  import { untrack } from 'svelte';

  import { blurMatch, type ComboboxItem, filterItems } from '../core/index.ts';
  import { focusStaysPut, keepCaret, keepLiveRegionIn } from './zag-input.ts';

  let {
    id,
    popupId = `${id}-popup`,
    items,
    value = null,
    onchange,
    placeholder = '',
    minChars = 2,
    max = 200,
    block = false,
    disabled = false,
    invalid = false,
    required = false,
    labelId,
  }: {
    /** The input's id. */
    id: string;
    /** The listbox's id. */
    popupId?: string;
    items: ComboboxItem[];
    /** The selected value (controlled: update it from `onchange`). */
    value?: string | null;
    /** Called on each commit: an option chosen, or text matched (or not) on blur. */
    onchange: (value: string | null, item: ComboboxItem | null) => void;
    placeholder?: string;
    /** Typing opens the list at this many characters. ArrowDown always opens it. */
    minChars?: number;
    /** Options shown before the "…N more" row. */
    max?: number;
    block?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
    /** The id of the `<label>` for the input; it also labels the listbox. */
    labelId?: string;
  } = $props();

  const labelOf = (v: string | null) => (v == null ? '' : (items.find((i) => i.value === v)?.label ?? ''));

  // Zag derives the input text from its (filtered) collection, which can't
  // label a value set from outside, so the text is ours.
  let text = $state('');
  let query = $state('');
  // The value this component last reported, so echoing it back through
  // `value` doesn't overwrite the text (e.g. unmatched free text → null).
  let reported: string | null | undefined;
  $effect.pre(() => {
    const v = value;
    untrack(() => {
      if (v !== reported) text = labelOf(v);
      reported = undefined;
    });
  });

  const filtered = $derived(filterItems(items, query, max));
  const collection = $derived(
    combobox.collection({
      items: filtered.shown,
      itemToValue: (i) => i.value,
      itemToString: (i) => i.label,
      groupBy: (i) => i.group ?? '',
    }),
  );

  // Option ids are IDREFs (aria-activedescendant): no whitespace allowed.
  const optionId = (v: string) => `${popupId}-opt-${encodeURIComponent(v)}`;
  const groupId = (g: string | number) => `${popupId}-group-${encodeURIComponent(String(g))}`;

  function commit(item: ComboboxItem | null) {
    const v = item?.value ?? null;
    if (item) text = item.label;
    if (v === value) return;
    reported = v;
    onchange(v, item);
  }

  const service = useMachine(focusStaysPut(combobox.machine, () => input), {
    get id() {
      return id;
    },
    get ids() {
      return {
        label: labelId,
        input: id,
        content: popupId,
        item: optionId,
        itemGroup: groupId,
        itemGroupLabel: (g: string | number) => `${groupId(g)}-label`,
      };
    },
    get collection() {
      return collection;
    },
    get value() {
      return value == null ? [] : [value];
    },
    get inputValue() {
      return text;
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
    selectionBehavior: 'replace',
    // A function here sees the text before the keystroke (zag 1.44.0), so
    // the list is opened from onInputValueChange instead.
    openOnChange: false,
    onInputValueChange({ inputValue, reason }) {
      // Zag also rewrites the text when the value changes ('script') or focus
      // leaves ('interact-outside'); the text is ours, so take only typing and
      // a chosen option.
      if (reason === 'item-select') text = inputValue;
      if (reason !== 'input-change') return;
      text = inputValue;
      query = inputValue;
      api.setOpen(inputValue.trim().length >= minChars);
      // As before: highlight only a lone match, so Enter can't pick a guess.
      if (filtered.shown.length === 1) api.setHighlightValue(filtered.shown[0].value);
      else api.clearHighlightValue();
    },
    onValueChange({ value: [v] }) {
      const item = items.find((i) => i.value === v);
      if (item) commit(item);
    },
  });

  $effect(() => keepCaret(input));
  $effect(() => keepLiveRegionIn(root));

  const api = $derived(combobox.connect(service, normalizeProps));

  // mergeProps runs later arguments' handlers first, so ours go last.
  const inputProps = $derived(
    mergeProps(
      api.getInputProps(),
      {
        // Before zag's handler: ArrowDown/Up on a closed list opens it on the
        // current text, or everything when the text is just the selection.
        onkeydown(event: KeyboardEvent) {
          // Zag closes the list and lets the form submit when Enter has
          // nothing to pick. Do nothing instead (zag skips prevented events).
          if (event.key === 'Enter' && api.open && api.highlightedValue == null) {
            event.preventDefault();
            return;
          }
          if (api.open || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
          query = text === labelOf(value) ? '' : text;
        },
        onfocusout(event: FocusEvent) {
          if (root.contains(event.relatedTarget as Node | null)) return;
          commit(blurMatch(items, text));
          // Close the way zag's own dismissal does. Its outside-click handling
          // otherwise races the blur and can leave the list open or pull focus
          // back into the input.
          if (api.open) service.send({ type: 'LAYER.INTERACT_OUTSIDE', src: 'interact-outside', restoreFocus: false });
        },
      },
    ),
  );

  // Zag points aria-activedescendant at the highlighted value even while
  // closed or filtered out (e.g. the selection), leaving a dangling IDREF.
  const activeDescendant = $derived.by(() => {
    const v = api.highlightedValue;
    return api.open && v != null && filtered.shown.some((i) => i.value === v) ? optionId(v) : undefined;
  });

  let root: HTMLElement;
  let input: HTMLInputElement;
</script>

<span class={['combobox', block && 'cb-block']} {...api.getRootProps()} bind:this={root}>
  <input class="combobox-input" {...inputProps} aria-activedescendant={activeDescendant} bind:this={input} />
  <div
    class="combobox-popup"
    {...api.getContentProps()}
    aria-labelledby={labelId}
    aria-label={labelId ? undefined : placeholder || undefined}
  >
    {#each collection.group() as [group, groupItems] (group)}
      {#if group}
        <div {...api.getItemGroupProps({ id: group })}>
          <div class="combobox-group-label" {...api.getItemGroupLabelProps({ htmlFor: group })}>{group}</div>
          {#each groupItems as item (item.value)}
            <div {...api.getItemProps({ item })}>{item.label}</div>
          {/each}
        </div>
      {:else}
        {#each groupItems as item (item.value)}
          <div {...api.getItemProps({ item })}>{item.label}</div>
        {/each}
      {/if}
    {/each}
    {#if filtered.more}
      <div class="combobox-more" role="option" aria-disabled="true" aria-selected="false">
        …{filtered.more} more — keep typing to narrow
      </div>
    {:else if !filtered.shown.length}
      <div class="combobox-empty" role="option" aria-disabled="true" aria-selected="false">No matches</div>
    {/if}
  </div>
</span>
