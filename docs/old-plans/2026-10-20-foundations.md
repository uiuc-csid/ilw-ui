# Phase 1: Foundations

_Phase 1 of [the toolkit-replacement plan](2026-10-20-toolkit-replacement.md) (tracking: [uiuc-csid/ilw-ui#9](https://github.com/uiuc-csid/ilw-ui/issues/9)). Covers the layering change, the parity-story harness, A1–A4 (themes, prose, buttons, tables), A8 `mountIslands` and A9 `announce()`. Every later phase builds on these._

## Decisions

- **Same names as the toolkit.** The CSS layer reuses the toolkit's class names (`.ilw-theme-*`, `.ilw-format`, `.ilw-button(s)`, `.ilw-table`, …) and its custom properties (`--ilw-color--*`). Existing server templates and ta-manager markup move over by swapping `toolkit.css` for `ilw-ui/styles.css`, with no markup changes. The cost: a page can't load both stylesheets and get either look, so a page migrates as a whole, and the parity harness has to keep the two apart (below).
- **Low specificity.** Toolkit rules like `ilw-page.ilw-format main table th` win over component styles. Ours use `:where()` for every context selector, so a single class in a component always beats them. The `--ilw-color--*` properties are the theming API; a component reads them and never names a theme.
- **Split stylesheet.** `src/styles.css` becomes an index that `@import`s partials from `src/styles/` (`tokens.css`, `format.css`, `button.css`, `table.css`, then the existing component rules). `package.json` also exports `./styles/*`, so a page can take only the foundations. Each partial keeps the brand-tokens-only rule: `--il-*` with fallbacks, no hard-coded hex.
- **Dark mode interoperates with the toolkit header.** The toolkit's `<ilw-header>` toggle writes the `ilw-dark-mode` cookie and sets `document.documentElement.dataset.theme` to `dark`/`light`. The vendored bundle has no CSS for it yet. Ours: dark when `html[data-theme="dark"]`, or when `prefers-color-scheme: dark` and `html` has no `data-theme="light"`. Same attribute, so the toolkit header (and later B2) drives it.

## Order

```text
PR 0  layering docs ───────────────┐
PR 1  parity harness ── PR 2 A1 ───┼── PR 3 A2 ┐
                                   ├── PR 4 A3 ├─ (independent)
                                   └── PR 5 A4 ┘
PR 6  A8 mountIslands   (independent)
PR 7  A9 announce()     (independent)
```

PR 1 and PR 2 can be one PR if that's simpler: A1 is the harness's first real user.

## PR 0: layering docs

AGENTS.md already says "native HTML first, ilw-ui second". The README still says "where the toolkit already has a component, ilw-ui uses it" and "the host page must load the toolkit". Rewrite both to the replacement goal, and say what still needs the toolkit today: `Modal` (wraps `<ilw-modal>`) and the table components (styled by `<ilw-page class="ilw-format">`). That paragraph shrinks as each item lands. Done in the PR that adds this plan.

## PR 1: parity harness

Problem: Storybook loads `toolkit.css` and `toolkit.js` for every story (`.storybook/preview-head.html`) and `styles.css` for every story (`preview.ts`). With shared class names, an ilw-ui story is styled by both.

- **Per-story stylesheet switch.** Move both stylesheets out of the static head into `<link>` elements a decorator manages, keyed on a `parameters.styles` value: `'toolkit'` (toolkit only), `'ilw-ui'` (ours only) or `'both'` (default, today's behaviour, until Phase 4). `toolkit.js` stays loaded: it only acts on `ilw-*` elements, which `'ilw-ui'` stories don't render. The decorator also picks the wrapper: `IlwPage.svelte` for `'toolkit'`/`'both'`, a plain `<main>` for `'ilw-ui'` (replaced by B1 later).
- **Story pairs.** A parity file (`stories/parity/<Name>.parity.stories.svelte`) has a `Toolkit` story (`styles: 'toolkit'`, the toolkit's own markup) and an `IlwUi` story (`styles: 'ilw-ui'`, the same markup, or the Svelte component). Chromatic snapshots both. The `Toolkit` story turns axe off (`a11y.test = 'off'`) with a comment: it documents upstream, it isn't our code.
- **Side-by-side view.** A `SideBySide` story renders two `<iframe>`s of `iframe.html?id=<story>&viewMode=story`, one per member of the pair, each its own document so the stylesheets can't collide. Each theme variant (A1) gets a row. This is for people; tests use the pair stories directly.
- **Dark mode.** A Storybook toolbar global sets `html[data-theme]`, so every story (and Chromatic, via `modes`) can be checked in both.
- **Automated diff: not now.** Chromatic compares each story with its own baseline, not the pair with each other. Revisit if review misses drift: a Playwright spec could screenshot both stories and compare with a tolerance.

Done when: the switch, wrapper choice and `data-theme` toolbar work; a sample pair (plain `<a class="ilw-button">`, which also seeds A3) renders correctly in all three views; `mise run test` passes with `styles` unset everywhere else.

## PR 2: A1 themes and tokens

Read first: the toolkit's theme rules in `vendor/illinois-toolkit/toolkit.css` (`.ilw-theme-*`, `[theme=…]`) and `web-illinois/ilw-page` (its `dark-mode.css` and the `--ilw-color--*` defaults on `:root`/`ilw-page`).

- `tokens.css`: the `--ilw-color--*` defaults on `:root`, and every theme class the toolkit has: `blue`, `orange` and their `-1`, `-2`, `-solid`, `-outline`, `-inverse`; the `[theme=…]` attribute forms; the `-table-*` themes go to A4. Each sets the same properties the toolkit sets (background, text, border, link, heading, control, focus, table), defined from `--il-*`.
- Dark-mode values for the defaults and each theme, per the decision above. Where upstream has none, choose from the brand palette and check contrast (axe covers text; check focus and control borders by hand against WCAG 1.4.11).
- Stories: a swatch grid of every theme (`styles: 'ilw-ui'`) with text, a link, a heading and a control in each, in light and dark; parity pairs per theme.
- README: the theme classes, the properties a component may read, and the dark-mode hook.

## PR 3: A2 prose (`.ilw-format`, `.ilw-font`, `.ilw-heading`)

Read first: every `.ilw-format` rule in `toolkit.css` and `web-illinois/ilw-page`.

- Headings, paragraphs, lists, links (incl. visited and the new-window icon), `blockquote`, `hr`, `code`, inside `:where(.ilw-format)` (the toolkit only applies these to `ilw-page.ilw-format main`; ours apply to any `.ilw-format` element). Tables come from A4.
- Parity pair on a long sample page, plus a story with a `Combobox` and `DataTable` inside `.ilw-format` proving component styles still win.
- Once the toolkit is gone from a page, the "no rules on bare `th`/`td`" rule in AGENTS.md is no longer needed for it; leave the rule in place until Phase 4.

## PR 4: A3 buttons

Read first: `.ilw-button`/`ul.ilw-buttons` in `toolkit.css` and `web-illinois/ilw-button` if it exists.

- `a.ilw-button`, `button.ilw-button`, `ul.ilw-buttons(-left)`, sizes, theme variants (driven by `--ilw-color--control*`), disabled (`button:disabled` and `a[aria-disabled="true"]`), and a visible `:focus-visible` outline that meets 1.4.11 on every theme.
- Svelte `Button`: renders `<a>` when given `href`, else `<button type="button">`; props `size`, `theme`, `disabled`, snippet children; never sets `aria-disabled` on a `<button>` (it uses `disabled`).
- Parity pair per size × theme; Playwright: Tab reaches both forms, Enter/Space activate, disabled is skipped.

## PR 5: A4 tables

Read first: the `ilw-content table`/`.ilw-table`/`.ilw-table-responsive`/`.ilw-theme-table-*` rules in `toolkit.css`.

- `table.ilw-table`, the responsive variant (small-screen stacked layout: check it with a screen reader, since `display: block` on table parts drops table semantics in some browsers; add `role` fixes or drop the stacking if it can't be made accessible), striped rows, and the table themes.
- `DataTable` and `SortableTh` stories switch to `styles: 'ilw-ui'` with `class="ilw-table"`; their contract in the README gains the class. ta-manager keeps working because the toolkit styles the same markup.

## PR 6: A8 `mountIslands`

In `src/svelte/islands.ts`, exported from `ilw-ui/svelte`.

```ts
mountIslands(registry: Record<string, Component<any>>, root?: ParentNode): () => void
```

- Finds `[data-ilw-island="<name>"]` under `root` (default `document`), mounts `registry[name]` with `mount(Component, { target, props })`.
- Props: `data-props` (a JSON string), or `data-props-id` naming a `<script type="application/json">` (Django's `json_script`). Parsed with `JSON.parse` only. A parse error or unknown name logs once and skips that element; it never throws past the call.
- Idempotent: marks mounted elements, so calling it again (after a fragment swap) mounts only new ones. Returns a function that unmounts what this call mounted.
- bfcache: don't unmount on `pagehide` when `event.persisted` (the page comes back as it was); unmount when not persisted. This is a change from the roadmap's "unmounts on `pagehide`".
- No DOM access at import time. Unit tests in node for parsing and registry errors; a story that server-renders a few island hosts and mounts them for the browser layer.

## PR 7: A9 `announce()`

In `src/core/announce.ts`, exported from `ilw-ui/core` (DOM, but no Svelte).

```ts
announce(message: string, opts?: { politeness?: 'polite' | 'assertive' }): void
```

- Creates two visually hidden regions on first call (`role="status"` and `role="alert"`), appended to `document.body`, reused after that. Nothing at import time.
- Repeating the same message re-announces it (clear, then set on the next frame). A new message replaces a pending one.
- A visually hidden class (`.ilw-visually-hidden`) lands in `styles.css`, shared with later components.
- Story with buttons for both politeness levels; play function checks the region text and roles; add a VoiceOver/NVDA line to `docs/at-smoke.md`.

## Done when

- PRs 0–7 are merged and ticked on #9.
- A page with only the brand stylesheet and `ilw-ui/styles.css` renders themes, prose, buttons and tables like the toolkit, in light and dark, shown by the parity stories.
- This plan moves to `docs/old-plans/`.
