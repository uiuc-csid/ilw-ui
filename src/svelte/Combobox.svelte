<script lang="ts">
  import * as combobox from '@zag-js/combobox';
  import { mergeProps, normalizeProps, useMachine } from '@zag-js/svelte';
  import { untrack } from 'svelte';

  import { blurMatch, type ComboboxItem, filterItems } from '../core/index.ts';
  import { focusLeft, focusStaysPut, highlightAtOnce, keepCaret, keepLiveRegionIn } from '../core/zag-input.ts';
  import { AsyncSearch, type AsyncSource, statusText } from './async-search.svelte.ts';

  let {
    id,
    popupId = `${id}-popup`,
    items = [],
    source,
    debounce = 250,
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
    name,
    loadingText = 'Loading…',
    errorText = "Couldn't load results",
  }: {
    /** The input's id. */
    id: string;
    /** The listbox's id. */
    popupId?: string;
    /** The options; with `source`, the known items (e.g. the selected one, for its label). */
    items?: ComboboxItem[];
    /** Fetches the options for the typed text, in place of filtering `items`. */
    source?: AsyncSource<ComboboxItem>;
    /** With `source`: milliseconds to wait after the last keystroke before searching. */
    debounce?: number;
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
    /** Adds a hidden input with this name and the selected value (`''` when none). */
    name?: string;
    /** With `source`: the list's row (and the status message) while a search runs. */
    loadingText?: string;
    /** With `source`: the list's row (and the status message) when the source fails. */
    errorText?: string;
  } = $props();

  // Items seen in async results, so a selection keeps its label after the
  // results move on.
  let seen = $state.raw<ComboboxItem[]>([]);
  const find = (v: string) => items.find((i) => i.value === v) ?? seen.find((i) => i.value === v);
  const labelOf = (v: string | null) => (v == null ? '' : (find(v)?.label ?? ''));

  // Where to put the highlight when results arrive for an ArrowDown/Up search.
  let arrowed: 'first' | 'last' | null = null;
  const search = new AsyncSearch<ComboboxItem>(
    () => source!,
    () => debounce,
    (q, results) => {
      seen = [...results.filter((r) => !find(r.value)), ...seen];
      const shown = results.slice(0, max);
      if (!api.open || !shown.length) return;
      if (arrowed) {
        const sel = shown.find((i) => i.value === value);
        api.setHighlightValue((sel ?? (arrowed === 'first' ? shown[0] : shown[shown.length - 1])).value);
      } else if (shown.length === 1 && q === text) {
        api.setHighlightValue(shown[0].value);
      }
      arrowed = null;
    },
  );
  $effect(() => () => search.cancel());

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

  const filtered = $derived.by(() => {
    if (!source) return filterItems(items, query, max);
    const results = search.status === 'done' ? search.results : [];
    return { shown: results.slice(0, max), more: Math.max(0, results.length - max) };
  });
  const status = $derived(
    source ? statusText(search.status, search.results.length, { loadingText, emptyText: 'No matches', errorText }) : '',
  );

  /** What typed text commits to on blur: `blurMatch`, or with `source` an exact match or the only result for this text. */
  function matchText(t: string): ComboboxItem | null {
    if (!source) return blurMatch(items, t);
    const typed = t.trim().toLowerCase();
    if (!typed) return null;
    const done = search.status === 'done' ? search.results : [];
    const exact = [...done, ...items, ...seen].find((i) => i.label.toLowerCase() === typed || i.value.toLowerCase() === typed);
    if (exact) return exact;
    return search.query === t && done.length === 1 ? done[0] : null;
  }
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

  const service = useMachine(highlightAtOnce(focusStaysPut(combobox.machine, () => input)), {
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
      const open = inputValue.trim().length >= minChars;
      if (source) {
        arrowed = null;
        if (open) search.search(inputValue);
        else search.cancel();
      }
      api.setOpen(open);
      // As before: highlight only a lone match, so Enter can't pick a guess.
      if (filtered.shown.length === 1) api.setHighlightValue(filtered.shown[0].value);
      else api.clearHighlightValue();
    },
    onValueChange({ value: [v] }) {
      const item = filtered.shown.find((i) => i.value === v) ?? find(v);
      if (item) commit(item);
    },
  });

  $effect(() => keepCaret(input));
  $effect(() => keepLiveRegionIn(root));

  const api = $derived(combobox.connect(service, normalizeProps));

  // Zag's blur handler (onBlur, onfocusout in Svelte) moves a closed list to
  // idle, where typing no longer opens it. A window switch fires it too, so it
  // runs from our onfocusout, after the focusLeft check.
  const { onfocusout: zagFocusout, ...zagInputProps } = $derived(api.getInputProps());

  // mergeProps runs later arguments' handlers first, so ours go last.
  const inputProps = $derived(
    mergeProps(
      zagInputProps,
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
          if (source) {
            // Alt+ArrowDown opens without a highlight, as it does with items.
            arrowed = event.altKey ? null : event.key === 'ArrowDown' ? 'first' : 'last';
            search.search(query, true);
          }
        },
        onfocusout(event: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
          if (!focusLeft(root, event)) return;
          commit(matchText(text));
          search.cancel();
          // Close the way zag's own dismissal does. Its outside-click handling
          // otherwise races the blur and can leave the list open or pull focus
          // back into the input.
          if (api.open) service.send({ type: 'LAYER.INTERACT_OUTSIDE', src: 'interact-outside', restoreFocus: false });
          zagFocusout?.(event);
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
    {#if source && search.status === 'loading'}
      <div class="combobox-loading" role="option" aria-disabled="true" aria-selected="false">{loadingText}</div>
    {:else if source && search.status === 'error'}
      <div class="combobox-error" role="option" aria-disabled="true" aria-selected="false">{errorText}</div>
    {:else if filtered.more}
      <div class="combobox-more" role="option" aria-disabled="true" aria-selected="false">
        …{filtered.more} more — keep typing to narrow
      </div>
    {:else if !filtered.shown.length && (!source || search.status === 'done')}
      <div class="combobox-empty" role="option" aria-disabled="true" aria-selected="false">No matches</div>
    {/if}
  </div>
  {#if source}
    <span class="ilw-visually-hidden" role="status">{status}</span>
  {/if}
  {#if name}
    <input type="hidden" {name} value={value ?? ''} />
  {/if}
</span>
