# Draft upstream issues: Zag combobox

Draft issues for <https://github.com/chakra-ui/zag>, against **1.44.0**
(`@zag-js/combobox`, `@zag-js/core`). **Not filed.** Each is worked around in
`src/svelte/Combobox.svelte` (and its siblings) or `src/core/zag-input.ts`, and
listed under **Known issues** in the README.
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

## 4. `aria-activedescendant` points at options that aren't rendered

**Status:** Not filed.

`getInputProps()` sets `aria-activedescendant` whenever `highlightedValue` is
set (`combobox.connect.mjs`), even while the list is closed, or when the
highlighted value (often the current selection) is no longer in the collection.
The IDREF then names an element that doesn't exist, which fails axe
`aria-valid-attr-value`. We saw it on WebKit in CI after selecting an option and
then typing text that matched nothing.

**Proposal:** emit it only when `open` and the value is in the collection.

**Workaround in ilw-ui:** set `aria-activedescendant` after spreading the input
props, gated on `api.open` and on the value being among the rendered items.

## 5. The caret jumps to the end after open, close and many keystrokes

**Status:** Not filed.

`dom.focusInputEl` (used by `setInitialFocus` and `setFinalFocus`) and the
`syncInputValue` action (in a microtask, for any event but `INPUT.CHANGE`) call
`setCaretToEnd` from `@zag-js/dom-query`. Opening or closing the list, or a
keystroke whose `onInputValueChange` opens the list or moves the highlight
(so the current event is no longer `INPUT.CHANGE`), moves the caret to the end.

**Repro:** type `ams`, press Escape, move the caret to the start, type `ad`. The
text is `aamsd`, not `adams`.

**Proposal:** move the caret only when the input text actually changed, or
leave it to the browser, which already moves it to the end when `value` is set
to a different string.

**Workaround in ilw-ui:** the input's own `setSelectionRange` ignores calls
that put a collapsed caret at the end with no direction.

## 6. An outside click right after opening leaves the list open

**Status:** Not filed. This needs a repro outside automation: it takes a click
within about a frame of opening.

The dismissable layer is tracked with `defer: true`, and `setInitialFocus`
focuses the input in a `requestAnimationFrame`. A pointerdown outside in that
window blurs the input without closing the list, then the deferred focus pulls
focus back.

**Workaround in ilw-ui:** on blur to outside the root, send
`{ type: 'LAYER.INTERACT_OUTSIDE', src: 'interact-outside', restoreFocus: false }`
when the list is open. `focusStaysPut` (`src/core/zag-input.ts`) replaces the
machine's `setInitialFocus` and `setFinalFocus` with a deferred focus that runs
only while focus is still where it was (or has fallen to `<body>`), so the
focus pull is gone too.

## 7. The live region can't be placed: it always goes on `document.body`

**Status:** Not filed.

On Apple platforms the combobox machine's `trackLiveRegion` effect calls
`createLiveRegion({ level: 'assertive', document: scope.getDoc() })`, and
`announceHighlightedItem` appends a `span[role=alert]` to `doc.body`.
`@zag-js/live-region` accepts a `root`, but the machine never passes one. Apps
whose content sits in a landmark wrapper (`<ilw-page>`), or that make the rest
of the page `inert` while a modal is open, can't keep the region where it is
heard and where their landmark checks expect it.

**Repro:** in Safari, render a combobox inside a `<dialog>`-like container and
set `inert` on the other `body` children; open the list and arrow through it.
VoiceOver reads nothing from the live region: it is under `body`, which is not
inert, but outside the container the user is in, and axe's `region` rule flags
it outside the landmarks.

**Proposal:** a `liveRegionRoot` (or `getLiveRegionRoot`) prop, passed to
`createLiveRegion` as `root`, defaulting to `doc.body`.

**Workaround in ilw-ui:** `keepLiveRegionIn` (`src/core/zag-input.ts`) moves
each `[data-live-announcer]` appended to `body` into the component's root while
focus is inside it.

## 8. The arrow-key highlight lands a frame late, on whatever list shows then

**Status:** Not filed. Found on 1.46.0.

ArrowDown or ArrowUp on a closed list runs `highlightFirstOrSelectedItem` or
`highlightLastOrSelectedItem` (a click with `openOnClick`,
`highlightFirstSelectedItem`). Each sets `highlightedValue` inside a
`requestAnimationFrame`, from the collection as it is when the frame runs.
`collection.sort(value)` keeps values the collection no longer has, so the
selection is highlighted even when it is filtered out.

**Repro:** select an option, press ArrowDown, Escape, clear the text and type
a query with one match, all within a frame (delay `requestAnimationFrame`, or a
slow machine). The app's lone-match highlight is replaced by the selection,
which is no longer shown, so nothing is highlighted. With no selection, the
first option of the filtered list is highlighted instead: a guess that Enter
(or an app that commits on Tab) takes.

**Proposal:** set the highlight in the transition, or have the deferred action
skip values the collection doesn't have and do nothing if the input changed
since.

**Workaround in ilw-ui:** `highlightAtOnce` (`src/core/zag-input.ts`) replaces
the three actions with synchronous ones that highlight only a shown option. The
components update their list before Zag's keydown handler runs, so the
collection is already current.
