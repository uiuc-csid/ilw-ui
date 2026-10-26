# Draft upstream issues: `ilw-modal`

Draft issues for <https://github.com/web-illinois/ilw-modal>, against **v1.2.1**
(`src/ilw-modal.ts`). **Not filed.** ilw-ui no longer wraps `<ilw-modal>`: since
C1, `Modal` is a native `<dialog>` that doesn't have these gaps, so the
"Workaround in ilw-ui" lines below are history. They are kept as drafts for
upstream, for pages that still use the toolkit.

---

## 1. Fire events when the modal opens and closes

**Status:** Not filed.

`open` reflects, but the component dispatches no event when it changes. Escape,
the × button and a backdrop click all just set `this.open = false` through
`closeModal()`, so a host can't tell that the user dismissed the dialog without
a `MutationObserver` on the `open` attribute.

**Proposal:** in `updated()`, when `open` changes, dispatch `ilw-open` /
`ilw-close` (bubbling, composed). Give the close event a reason in `detail`, e.g.
`{ reason: 'escape' | 'close-button' | 'backdrop' | 'api' }`.

**Workaround in ilw-ui:** a `MutationObserver` with `attributeFilter: ['open']`.

## 2. `autofocus` is honoured only on direct slotted children

**Status:** Not filed.

`_setInitialFocus()` checks `hasAttribute('autofocus')` only on the elements a
slot is assigned (`slot.assignedElements()`), not their descendants. A button
marked `autofocus` inside a wrapper, e.g. `<div class="modal-buttons">`, is
ignored, and focus stays on the `.modal` container.

**Proposal:** look for the first `[autofocus]` among each assigned element and
its descendants (`el.matches('[autofocus]') ? el : el.querySelector('[autofocus]')`).

**Workaround in ilw-ui:** after `updateComplete`, focus the `[autofocus]` button
ourselves.

## 3. Clicks inside the dialog don't propagate

**Status:** Not filed.

`.modal` has `@click=${(e) => e.stopPropagation()}`, so it doesn't close the
backdrop. That also stops the event at the shadow root, so delegated listeners on
an ancestor (Svelte 5's `onclick`, React's root listener, any
`document.addEventListener('click', …)`) never see clicks on slotted content.

**Proposal:** don't stop propagation. In the backdrop handler, close only when
`e.target === e.currentTarget`.

**Workaround in ilw-ui:** listeners attached directly to each button.

## 4. `id` and `size` don't reflect; `id` shadows the native property

**Status:** Not filed.

`id` is declared `@property({ type: String, attribute: true }) override id = 'modal'`.
It overrides `Element.id`, so setting `el.id = 'x'` no longer writes the
attribute, and every instance defaults to `id="modal"` in script but has no
`id` attribute. `size` doesn't reflect either. Frameworks that set properties on
custom elements therefore render `<ilw-modal>` without `id` or `size`, and
selectors like `ilw-modal#x` or `ilw-modal[size=small]` miss. Two modals also
both answer `data-modal-target="modal"`.

**Proposal:** drop the `id` override and read `this.id` (the native
property). Add `reflect: true` to `size`, `align` and `theme`.

**Workaround in ilw-ui:** `setAttribute('id', …)` and `setAttribute('size', …)`
after mount.

## 5. The focus trap is snapshotted at open

**Status:** Not filed.

`_setInitialFocus()` builds `_focusableElements` once, when the modal opens.
Content added, removed or enabled after that (a validation message with a link,
a button that becomes enabled) isn't in the Tab cycle. Tab from an element
outside the list jumps to the first focusable element.

**Proposal:** compute the focusable list in `_handleKeydown` on each Tab, or
recompute it on `slotchange` and with a `MutationObserver` on the light DOM.

**Workaround in ilw-ui:** none. Documented as a known issue.

## 6. `aria-describedby` covers the whole body slot

**Status:** Not filed.

The dialog's `aria-describedby="modal-description"` points at `.modal-body`,
which wraps the default slot. Screen readers read everything in it as the
dialog's description, buttons and form controls included, and then read it all
again while the user navigates.

**Proposal:** make the description opt-in, e.g. a `description` slot, or
`aria-describedby` only when the host marks an element as the description. Note
also that `aria-labelledby="modal-title"` / `id="modal-title"` are fixed IDs in
each shadow root. That works, but the label is empty when no `title` slot is
given.

**Workaround in ilw-ui:** none. Documented as a known issue.
