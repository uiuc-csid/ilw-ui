# Draft upstream issues: Zag combobox

Draft issues for <https://github.com/chakra-ui/zag>, against **1.44.0**
(`@zag-js/combobox`, `@zag-js/core`). **Not filed.** Each is worked around in
`src/svelte/Combobox.svelte` and listed under **Known issues** in the README.
When one is filed, replace its "Not filed" line with the issue link here and in
the README. First check whether a newer release (1.46.0 at the time of writing)
already fixes it.

---

## 1. `openOnChange` function receives the previous input value

**Status:** Not filed.

`openOnChange` accepts `(details: InputValueChangeDetails) => boolean`, but the
`openOnChange` guard on `INPUT.CHANGE` (`combobox.machine.mjs`, guards) calls it
with `context.get("inputValue")` **before** the transition's `setInputValue`
action runs. The function therefore sees the text without the new keystroke.

**Repro:** `openOnChange: ({ inputValue }) => inputValue.length >= 2`, type
`a`, `b`: the list doesn't open; it opens on the third character.

**Proposal:** pass the incoming value, `event.value`, to the guard, e.g.
`openOnChange?.({ inputValue: event.value })`.

**Workaround in ilw-ui:** set `openOnChange: false` and call
`api.setOpen(inputValue.length >= minChars)` from `onInputValueChange` when
`reason === 'input-change'`.

## 2. `mergeProps` calls event handlers in reverse argument order

**Status:** Not filed. It may be intended; if so, it should be documented.

`@zag-js/core` `mergeProps` merges handlers with
`callAll(props[key], result[key])`, so a handler from a later argument runs
**before** one from an earlier argument. With
`mergeProps(ownProps, api.getInputProps())` (the order the docs show), Zag's
`onkeydown` runs before ours, so we can't prepare state (e.g. the collection)
before Zag acts on the key.

**Proposal:** call handlers in argument order (`callAll(result[key], props[key])`),
or document the order.

**Workaround in ilw-ui:** pass our handlers last.

## 3. A controlled `value` change rewrites a controlled `inputValue`

**Status:** Not filed. This needs a minimal repro first; it may be expected
behaviour for `selectionBehavior: 'replace'`.

With `allowCustomValue: true` and both `value` and `inputValue` controlled,
changing `value` to `[]` after the user has typed unmatched text makes Zag call
`onInputValueChange` with `reason: 'script'` and an empty string. A consumer that
mirrors `inputValue` loses the typed text.

**Workaround in ilw-ui:** accept `inputValue` only for the reasons
`'input-change'` and `'item-select'`.
