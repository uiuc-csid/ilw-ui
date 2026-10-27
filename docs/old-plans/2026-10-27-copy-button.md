# CopyButton (E6)

Roadmap item E6 of [2026-10-20-toolkit-replacement.md](../plans/2026-10-20-toolkit-replacement.md), tracked in uiuc-csid/ilw-ui#9:
"Copies a value or an element's text and announces it through A9." The toolkit has no equivalent, so there is no
parity story.

## What ta-manager needs

ta-manager copies in six places, all through `src/static/shared/clipboard.js` (`copyToClipboard(text, btn?)`):

| Module | What it copies | Button |
| --- | --- | --- |
| `api-tokens-module.js` | a new token, the text of `#newTokenValue` | "Copy" → "Copied" |
| `assignments-module.js` | confirmed netids of one course, joined | "Copy (N) netids …", error text in a sibling status span |
| `instructor-students-module.js` | an email list from `data-emails` | "Copy email list" |
| `perfect-match-module.js` | a TSV built from the current rows | "Copy to clipboard", "Copy Full Table to Clipboard" |
| `review-student-responses.js` | one netid (icon-only "⧉", `aria-label="Copy netid"`); netid and name lists | "Copy NetIDs", … |

So the component must copy: a literal string, a string computed at click time (rows change after render), and the
text of an element by id. Its contract (ta-manager's islands plan): the label reads "Copied!" for 1500 ms, one
`role="status"` region announces it, and a refusal is reported, not swallowed.

## Design

- **`copyText(text, opts?)` in `ilw-ui/core`** (`src/core/clipboard.ts`): `navigator.clipboard.writeText`, then
  `announce(copied)` (polite) and resolve `true`; on any failure (no `navigator.clipboard` outside a secure context,
  permission denied, a throwing `value`) `announce(failed, { politeness: 'assertive' })` and resolve `false`. Modules
  that build their own buttons call it directly; it replaces `copyToClipboard`.
- **`CopyButton`** (`src/svelte/CopyButton.svelte`) renders `Button` (so every `size`/`theme` and the focus rings come
  for free) with class `ilw-copy-button`, a Phosphor icon and a label span.
  - Source, one of: `value` (a string, or a function called on each click) or `target` (an element id; an `<input>`
    or `<textarea>` gives its value, anything else its trimmed `textContent`).
  - `label` (default "Copy"), `copiedLabel` ("Copied"), `failedLabel` ("Copy failed"), `failedMessage` (the
    announced error, default "Could not copy to the clipboard"), `hideLabel` (icon-only; the label stays as
    visually hidden text, so the name is always the visible state's text), `resetAfter` (ms, default 1500),
    `oncopy(text)`, `onerror(error)`, plus `Button`'s props and any `<button>` attribute.
  - State on `data-state`: `idle` → `copied` (Check icon, copied label) or `failed` (Warning icon, failed label), back
    to `idle` after `resetAfter`. A second click restarts the timer. Focus never moves; the button is never disabled
    while copying, so focus can't be lost.
  - The swapped label is visible feedback; the announcement is what a screen reader hears (a changed name on a focused
    button is not reliably read out). Only one `role="status"` region exists (A9's), as ta-manager's test expects.
- **CSS**: `src/styles/copy-button.css` (icon and label in a row, icon colour in the failed state), imported from
  `styles.css`.

## Tests

1. Play functions (`stories/CopyButton.stories.svelte`), with `navigator.clipboard` stubbed per story and restored
   in the story's cleanup: what was written, what the polite and assertive regions say, the label and `data-state`,
   that focus stays on the button, the reset, the target-by-id and function sources, icon-only naming, failure
   (rejected write, and no clipboard at all).
2. `tests/e2e/copy-button.spec.ts`: Tab to the button, Enter and Space copy, focus stays; stubbed clipboard via
   `addInitScript`.
3. axe on every story (the failed state is a story of its own).
4. Node unit test for `copyText`.

## Steps

- [x] `copyText` + unit test
- [x] `CopyButton`, CSS, exports
- [x] Stories with page context (share link, API token, netid list), play functions
- [x] Playwright spec
- [x] README section and DOM contract
- [x] `pnpm check`, `mise run test`, stability runs
