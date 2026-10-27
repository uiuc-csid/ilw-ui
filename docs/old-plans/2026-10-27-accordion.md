# C2: Accordion

_Phase 3 of [the toolkit-replacement plan](../plans/2026-10-20-toolkit-replacement.md) (tracking: [uiuc-csid/ilw-ui#9](https://github.com/uiuc-csid/ilw-ui/issues/9)). Replaces `<ilw-accordion>` and `<ilw-accordion-panel>` with `<details>` markup, `accordion.css`, and two Svelte components that render it._

## Sources read

`web-illinois/ilw-accordion` v1.3.2 (`ef32a3e`): `src/Accordion.ts`, `src/AccordionPanel.ts`, `src/Accordion.css`, `src/Accordion.styles.css`, `src/AccordionPanel.styles.css`, `samples/index.html`, `README.md`; the builder page; the `ilw-accordion` rules in the vendored `toolkit.css`.

What it does:

- `<ilw-accordion>` holds `<ilw-accordion-panel>`s and, between them, optional section headings. Attributes: `accent` (`blue` default, `orange`, `arches`, `industrial`, `altgeld`, `gray`, `black`, `white`: the 6 px left border), `width` (`full`, `auto`, `page`), `limit` (opening a panel closes the others), `buttons` (an "Expand All" / "Collapse All" pair above the panels), `compact` (smaller, white, rules between panels, no accent, the buttons become right-aligned text links). Methods `expandAll()` and `collapseAll()`.
- `<ilw-accordion-panel open>`: a `div role="button" tabindex="0" aria-expanded aria-controls` wrapping a chevron and the author's `slot="summary"` heading, then a `div role="region"` that is `hidden="until-found"` while closed, so find-in-page opens it.
- Look: header `padding: 30px 24px`, Storm 95 background (Storm 80 on hover), `600 1.375rem/1.875rem` Blue heading, a 20 px chevron rotated to point right when closed and down when open, 20 px gap; body `padding: 5px 10px 20px 65px`; panels 20 px apart (10 px after an open one). Focus: the focus background and text colours on the whole header.

## Decisions

- **Markup and CSS first.** Each panel is a native `<details class="ilw-accordion-panel">` whose `summary` holds the chevron and the author's heading. It opens and closes without script, find-in-page opens it (as upstream's `until-found`), and the browser exposes the summary as a button with its expanded state.
- **Single-open is the native exclusive accordion:** every panel gets the same `name`, so it works without script too (Chrome 120, Safari 17.2, Firefox 130). Browsers without it just allow several open.
- **"Expand All" / "Collapse All" need script**, so only the `Accordion` component renders them (`buttons`). They are `.ilw-button`s in a `ul.ilw-buttons-left`, which already match upstream's button look, and link-style text in compact mode. With `single` they are not rendered: a native exclusive group can't have all panels open (upstream lets `expandAll()` break its own limit).
- **Components:** `Accordion` (the wrapper: `accent`, `compact`, `single`, `buttons`, `label`, `class`) and `AccordionPanel` (`heading` or a `summary` snippet, `level` 2–6, default 3, bindable `open`). Panels register with the accordion through context, so Expand All sets each panel's bound `open`.
- **Classes:** `.ilw-accordion`, `.ilw-accordion-compact`, `.ilw-accordion-accent-<name>`, `.ilw-accordion-panel`, `.ilw-accordion-icon`, `.ilw-accordion-heading`, `.ilw-accordion-body`, `.ilw-accordion-buttons`. The toolkit's `--ilw-accordion--*` and `--ilw-accordion-panel--*` properties keep their names and values.
- **Colours follow the theme:** the heading uses the gray palette's heading colour rather than a fixed Blue, so it stays readable in dark mode; the compact background is the white palette's.
- **Focus** is on `:focus-visible`: upstream's focus colours plus a 2 px outline inside the header.
- **Width:** no `width` prop. `class="ilw-width-full"` / `ilw-width-page` from the layout utilities work; upstream's `auto` (full-bleed background, text at the margin, no border) is not reproduced.
- **Differs from the APG:** the APG accordion is a heading containing a button. A `summary` can't sit inside a heading, so the heading sits inside the `summary`, which is the button. Screen readers vary in whether they expose that heading in heading navigation; `docs/at-smoke.md` gets a check. No Up/Down/Home/End between headers (optional in the APG; upstream has none either).

## Tests

- Play functions: the DOM contract (details/summary/heading/body, level, accent and compact classes), `single` sets one shared `name`, Expand All / Collapse All open and close every panel and stay focused, no buttons with `single`, the open story (axe on every panel's content), dark mode.
- Parity pair (`Parity/Accordion`): computed header padding, background, heading font, body padding against upstream's values.
- `tests/e2e/accordion.spec.ts`: Tab order (buttons, then each summary; links inside an open panel), Enter and Space toggle, single-open closes the others, Expand All / Collapse All by keyboard, focus never on `<body>`.
- axe on every story; screen-reader checks in `docs/at-smoke.md`.
