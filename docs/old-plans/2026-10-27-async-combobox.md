# E3: async sources, multi-select tokens, hidden inputs

Roadmap item E3 ([2026-10-20-toolkit-replacement.md](../plans/2026-10-20-toolkit-replacement.md), uiuc-csid/ilw-ui#9):
"An async (debounced, abortable) source for both `Combobox` and `Autocomplete`,
multi-select tokens, and hidden inputs for a multi-select form field." Consumer:
the opportunities app's `ModelSelect2Multiple` (Select2 over a Django
autocomplete view, submitting one `name=pk` pair per selection).

## Design

### Async source (`Combobox`, `Autocomplete`, `MultiCombobox`)

- New prop `source: (query: string, signal: AbortSignal) => Promise<Item[]>`, as an alternative to
  `items`. The source does the matching; the component shows what it returns (capped at `max`).
- `debounce` (ms, default 250): typing waits that long after the last keystroke. ArrowDown on a closed
  list searches at once.
- Each new search aborts the one before it (pending timer or in-flight request) through its
  `AbortController`, and a result that arrives for an aborted search is dropped even if the source
  ignored the signal. Text below `minChars` aborts too and closes the list.
- One framework-free helper, `AsyncSearch` in `src/svelte/async-search.svelte.ts` (a runes module:
  `status`, `results`, `query` are `$state`), used by all three components.
- States in the open list, as disabled options like the existing "No matches" row:
  `.combobox-loading` / `.autocomplete-loading` ("Loading…", `loadingText`),
  `.combobox-empty` / `.autocomplete-empty` (no results), `.combobox-error` / `.autocomplete-error`
  (`errorText`, "Couldn't load results").
- Screen readers: a visually hidden `role="status"` inside the component's root (so it stays inside a
  modal and the page landmarks, like Zag's own live region) reads "Loading…", "N results", "No
  results" or the error. Rendered only with `source`, so the local-items DOM is unchanged.
- `items` stays as the known items (with `source`, it labels a preselected value; results add to it).
- `Combobox` blur match with `source`: an exact label/value match among the current results, else the
  only result when those results are for the text as typed.

### `MultiCombobox` (new)

A separate component rather than a `multiple` flag on `Combobox`, so `Combobox`'s controlled
`string | null` value, its types and its DOM contract stay as they are. Zag runs with `multiple: true`
(listbox gets `aria-multiselectable`, selected options `aria-selected`).

- `value: string[]` (controlled), `onchange(values, items)`.
- Choosing an option adds it (or removes it if already selected); the text clears and the list closes.
- Tokens render before the input in a `<ul class="combobox-tokens">` labelled by the label; each is
  `<li class="combobox-token">` with its text and a `<button class="combobox-token-remove"
  aria-label="Remove {label}">`.
- Keyboard: token buttons are in the tab order. Backspace in an empty input focuses the last token;
  on a token, Backspace/Delete/Enter/Space remove it, ArrowLeft/ArrowRight move between tokens and
  ArrowRight past the last one returns to the input. After a removal focus goes to the next token,
  else the previous one, else the input. The status region says "Removed {label}".
- `name`: one `<input type="hidden" name value>` per selected value, so a plain form POST sends
  `name=a&name=b` (Django `getlist`). `required` blocks submit with no selection via
  `setCustomValidity` on the text input (the text input itself carries `aria-required`, not `required`,
  since it is empty after each choice).

### Hidden input on `Combobox`

`name` on `Combobox` adds one hidden input with the selected value (`''` when none). Additive; the
README's "no `name`" note changes.

## Tests

- Stories stub the source with `stories/stub-source.svelte.ts`: fixed data, each request a promise the
  play function (or a story-only "Test server" panel) resolves or rejects. An `auto` stub resolves on a
  microtask for keyboard fixtures. No network, no sleeps: play functions `waitFor` the request to
  arrive, then resolve it.
- Abort is asserted by outcome (every request but the last is aborted, a stale response changes
  nothing), not by counting debounced calls.
- Stories: Combobox async (+ error, open), Autocomplete async, MultiCombobox (basic, in a form with a
  real submit serialised to the page, open, preselected, required), each with page context.
- Playwright: `tests/e2e/multi-combobox.spec.ts` (tokens by keyboard, focus never on body, form
  data), async loading/abort in `combobox.spec.ts` / `autocomplete.spec.ts`.

## Steps

1. `AsyncSearch` helper.
2. `source` on `Combobox` and `Autocomplete`; `name` on `Combobox`.
3. `MultiCombobox`, styles for tokens and the new rows, export.
4. Stub source, demos and stories with play functions.
5. Playwright specs.
6. README: props, keyboard, DOM contracts; roadmap row.
7. `pnpm check`, `mise run test`, stability runs; move this plan to `docs/old-plans/`; PR.
