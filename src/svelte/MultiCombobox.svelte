<!--
  A multi-select Combobox: chosen options become removable tokens, and `name`
  adds one hidden input per value, so a plain form POST sends them all. A
  component of its own so Combobox keeps its single-value API and markup.
-->
<script lang="ts">
  import * as combobox from '@zag-js/combobox';
  import { mergeProps, normalizeProps, useMachine } from '@zag-js/svelte';
  import { tick } from 'svelte';

  import { type ComboboxItem, filterItems } from '../core/index.ts';
  import { AsyncSearch, type AsyncSource, statusText } from './async-search.svelte.ts';
  import { focusLeft, focusStaysPut, keepCaret, keepLiveRegionIn } from './zag-input.ts';

  let {
    id,
    popupId = `${id}-popup`,
    items = [],
    source,
    debounce = 250,
    value = [],
    onchange,
    name,
    placeholder = '',
    minChars = 2,
    max = 200,
    block = false,
    disabled = false,
    invalid = false,
    required = false,
    labelId,
    loadingText = 'Loading…',
    errorText = "Couldn't load results",
    requiredText = 'Select at least one option.',
    removeLabel = (label: string) => `Remove ${label}`,
  }: {
    /** The input's id. */
    id: string;
    /** The listbox's id. */
    popupId?: string;
    /** The options; with `source`, the known items (e.g. the selected ones, for their labels). */
    items?: ComboboxItem[];
    /** Fetches the options for the typed text, in place of filtering `items`. */
    source?: AsyncSource<ComboboxItem>;
    /** With `source`: milliseconds to wait after the last keystroke before searching. */
    debounce?: number;
    /** The selected values, in the order chosen (controlled: update it from `onchange`). */
    value?: string[];
    /** Called when an option is added or a token removed. */
    onchange: (value: string[], items: ComboboxItem[]) => void;
    /** Adds one hidden input with this name per selected value. */
    name?: string;
    placeholder?: string;
    /** Typing opens the list at this many characters. ArrowDown always opens it. */
    minChars?: number;
    /** Options shown before the "…N more" row. */
    max?: number;
    block?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    /** At least one value: the form won't submit without one. */
    required?: boolean;
    /** The id of the `<label>` for the input; it also labels the listbox and the tokens. */
    labelId?: string;
    /** With `source`: the list's row (and the status message) while a search runs. */
    loadingText?: string;
    /** With `source`: the list's row (and the status message) when the source fails. */
    errorText?: string;
    /** The validation message when `required` and nothing is selected. */
    requiredText?: string;
    /** The accessible name of a token's remove button. */
    removeLabel?: (label: string) => string;
  } = $props();

  // Items seen in async results, so tokens keep their labels after the results
  // move on.
  let seen = $state.raw<ComboboxItem[]>([]);
  const find = (v: string) => items.find((i) => i.value === v) ?? seen.find((i) => i.value === v);
  const itemOf = (v: string): ComboboxItem => find(v) ?? { value: v, label: v };

  let text = $state('');
  let query = $state('');
  // The last add or removal, for the status region.
  let note = $state('');

  // Where to put the highlight when results arrive for an ArrowDown/Up search.
  let arrowed: 'first' | 'last' | null = null;
  const search = new AsyncSearch<ComboboxItem>(
    () => source!,
    () => debounce,
    (q, results) => {
      seen = [...results.filter((r) => !find(r.value)), ...seen];
      const shown = results.slice(0, max);
      if (!api.open || !shown.length) return;
      if (arrowed) api.setHighlightValue((arrowed === 'first' ? shown[0] : shown[shown.length - 1]).value);
      else if (shown.length === 1 && q === text) api.setHighlightValue(shown[0].value);
      arrowed = null;
    },
  );
  $effect(() => () => search.cancel());

  const filtered = $derived.by(() => {
    if (!source) return filterItems(items, query, max);
    const results = search.status === 'done' ? search.results : [];
    return { shown: results.slice(0, max), more: Math.max(0, results.length - max) };
  });
  const status = $derived(
    note ||
      (source ? statusText(search.status, search.results.length, { loadingText, emptyText: 'No matches', errorText }) : ''),
  );
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

  function report(next: string[]) {
    onchange(next, next.map(itemOf));
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
    multiple: true,
    get value() {
      return value;
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
    get placeholder() {
      return placeholder;
    },
    allowCustomValue: true,
    selectionBehavior: 'clear',
    closeOnSelect: true,
    // A function here sees the text before the keystroke (zag 1.44.0), so
    // the list is opened from onInputValueChange instead.
    openOnChange: false,
    onInputValueChange({ inputValue, reason }) {
      // A choice clears the text; Zag's other rewrites (value change, focus
      // leaving) are ignored: the text is ours.
      if (reason === 'item-select') {
        text = '';
        query = '';
        search.cancel();
        return;
      }
      if (reason !== 'input-change') return;
      text = inputValue;
      query = inputValue;
      note = '';
      const open = inputValue.trim().length >= minChars;
      if (source) {
        arrowed = null;
        if (open) search.search(inputValue);
        else search.cancel();
      }
      api.setOpen(open);
      if (filtered.shown.length === 1) api.setHighlightValue(filtered.shown[0].value);
      else api.clearHighlightValue();
    },
    onValueChange({ value: next }) {
      const added = next.find((v) => !value.includes(v));
      const removed = value.find((v) => !next.includes(v));
      if (added) note = `Added ${itemOf(added).label}`;
      else if (removed) note = `Removed ${itemOf(removed).label}`;
      report(next);
    },
  });

  $effect(() => keepCaret(input));
  $effect(() => keepLiveRegionIn(root));
  // The text input is empty after each choice, so `required` on it would
  // block every submit. Validity follows the selection instead.
  $effect(() => input.setCustomValidity(required && !value.length ? requiredText : ''));

  const api = $derived(combobox.connect(service, normalizeProps));

  const tokenButtons = () => [...root.querySelectorAll<HTMLButtonElement>('.combobox-token-remove')];

  async function remove(v: string) {
    const index = value.indexOf(v);
    note = `Removed ${itemOf(v).label}`;
    report(value.filter((x) => x !== v));
    // Focus the token that took its place, else the one before, else the input.
    await tick();
    const buttons = tokenButtons();
    (buttons[index] ?? buttons[index - 1] ?? input).focus();
  }

  function onTokenKeydown(event: KeyboardEvent, v: string) {
    const buttons = tokenButtons();
    const at = buttons.indexOf(event.currentTarget as HTMLButtonElement);
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      void remove(v);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      buttons[Math.max(0, at - 1)].focus();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      (buttons[at + 1] ?? input).focus();
    }
  }

  // Zag's blur handler (onBlur, onfocusout in Svelte) moves a closed list to
  // idle, where typing no longer opens it. A window switch fires it too, so it
  // runs from our onfocusout, after the focusLeft check.
  const { onfocusout: zagFocusout, ...zagInputProps } = $derived(api.getInputProps());

  // mergeProps runs later arguments' handlers first, so ours go last.
  const inputProps = $derived(
    mergeProps(zagInputProps, {
      onkeydown(event: KeyboardEvent) {
        // Zag closes the list and lets the form submit when Enter has
        // nothing to pick. Do nothing instead (zag skips prevented events).
        if (event.key === 'Enter' && api.open && api.highlightedValue == null) {
          event.preventDefault();
          return;
        }
        // Backspace at the start of an empty input steps back into the tokens.
        if (event.key === 'Backspace' && text === '' && value.length) {
          event.preventDefault();
          tokenButtons().at(-1)?.focus();
          return;
        }
        if (api.open || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
        query = text;
        if (source) {
          arrowed = event.altKey ? null : event.key === 'ArrowDown' ? 'first' : 'last';
          search.search(query, true);
        }
      },
      onfocusout(event: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
        // Measured from the input, not the root: moving into a token closes the list too.
        if (!focusLeft(input, event)) return;
        if (api.open) service.send({ type: 'LAYER.INTERACT_OUTSIDE', src: 'interact-outside', restoreFocus: false });
        search.cancel();
        zagFocusout?.(event);
      },
    }),
  );

  // Zag points aria-activedescendant at the highlighted value even while
  // closed or filtered out, leaving a dangling IDREF.
  const activeDescendant = $derived.by(() => {
    const v = api.highlightedValue;
    return api.open && v != null && filtered.shown.some((i) => i.value === v) ? optionId(v) : undefined;
  });

  let root: HTMLElement;
  let input: HTMLInputElement;
</script>

<span class={['combobox', 'combobox-multi', block && 'cb-block']} {...api.getRootProps()} bind:this={root}>
  {#if value.length}
    <ul class="combobox-tokens" aria-labelledby={labelId}>
      {#each value as v (v)}
        {@const label = itemOf(v).label}
        <li class="combobox-token" data-value={v}>
          <span class="combobox-token-label">{label}</span>
          <button
            type="button"
            class="combobox-token-remove"
            aria-label={removeLabel(label)}
            {disabled}
            onclick={() => remove(v)}
            onkeydown={(event) => onTokenKeydown(event, v)}><span aria-hidden="true">×</span></button
          >
        </li>
      {/each}
    </ul>
  {/if}
  <input
    class="combobox-input"
    {...inputProps}
    aria-activedescendant={activeDescendant}
    aria-required={required || undefined}
    bind:this={input}
  />
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
  <span class="ilw-visually-hidden" role="status">{status}</span>
  {#if name}
    {#each value as v (v)}
      <input type="hidden" {name} value={v} />
    {/each}
  {/if}
</span>
