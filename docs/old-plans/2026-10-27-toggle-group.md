# E4: ToggleGroup

_Phase 3 of [the toolkit-replacement plan](../plans/2026-10-20-toolkit-replacement.md) (tracking: [uiuc-csid/ilw-ui#9](https://github.com/uiuc-csid/ilw-ui/issues/9)). No toolkit equivalent: filter buttons with `aria-pressed`, single- or multi-select, in a labelled group._

## What ta-manager does today

About 60 rows of filter buttons, hand-built in templates and modules (`student.html.j2` `.filter-btn`, `special_cases.html.j2` `.nr-degree-btn`, `unranked-students-module.js` `.picker-tog`, …). The common shape:

- a `role="group"` named by `aria-label`, `aria-labelledby` or a visible text label ("Order:", "Degree");
- `<button type="button" aria-pressed="true|false">`, one pressed at a time, often with an "All" option that is itself a button;
- a click handler that sets `aria-pressed` on every button and re-filters a list or table;
- each page's own CSS for the pressed look (a fill colour only);
- Playwright tests that select `[data-…][aria-pressed='true']`.

## Decisions

- **Markup and CSS first, Svelte second.** `.ilw-toggle-group` works in a server template with the page's own click handler; `ToggleGroup` renders exactly that markup. The buttons are `.ilw-button` buttons (default `.ilw-button-small`), so sizes and themes come from `button.css`.
- **Semantics:** a `div role="group"` named by a visible label (`label` prop → a `span.ilw-toggle-group-label` the group's `aria-labelledby` points at) or by `aria-label`/`aria-labelledby` passed through. Each option is a `button type="button"` with `aria-pressed` and `data-value` (for consumers' tests). Toggle buttons in a group, as in the APG button pattern; not a radio group, not a toolbar.
- **Plain Tab stops, no roving focus.** Rows are short (2–7 buttons); every option stays one Tab away, Space and Enter toggle natively, and nothing new to learn. Roving tabindex (APG toolbar) would hide options from Tab and needs arrow-key script, for little gain at this size. Disabled options are native `disabled`, so they leave the Tab order.
- **Modes:** `multiple={false}` (default): `value` is a string or `undefined`; pressing another button moves the press; pressing the pressed button does nothing unless `allowNone`, which releases it (`value` becomes `undefined`). `multiple`: `value` is a `string[]`, in option order; each button toggles independently. `onchange(value)` fires only when the value changes.
- **Exactly-one and form submission:** a single-select group without `allowNone` is still buttons, as ta-manager uses it. The README points to `RadioGroup` when the choice is a form field.
- **The pressed look isn't colour alone:** a pressed button is filled (the hover colours of `.ilw-button`) _and_ shows a check mark before its label (`::before`, with empty alt text `content: '✓' / ''` so screen readers don't read it; `aria-pressed` carries the state). Within a group, hover only underlines, so hovering an unpressed button can't look pressed. Focus keeps the fill of a pressed button and adds the two-tone ring. Colours come from `--ilw-color--control*`, so themes and dark mode follow.
- **CSS lives in `src/styles/toggle-group.css`**, imported by `styles.css` (one partial per component, as button, pagination, modal). That also keeps the edit to shared files to one added line.

## Tests

- Play functions: the contract (role, name from the visible label or `aria-label`, `aria-pressed`, `data-value`, classes, `type="button"`), single mode (moves, pressing the pressed one does nothing, `onchange` count), `allowNone`, multiple mode (value order), disabled options, the pressed look (fill plus check mark, hover underline only) in light and dark, Source Sans outside `.ilw-format`.
- `tests/e2e/toggle-group.spec.ts` on a fixture story without a play function: each button is a Tab stop (disabled skipped), Space and Enter toggle, focus stays on the button, Shift+Tab back, focus never on `<body>`.
- axe on every story; screen-reader checks in `docs/at-smoke.md`.
