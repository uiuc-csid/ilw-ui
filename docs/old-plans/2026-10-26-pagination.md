# C5: Pagination

_Phase 2 of [the toolkit-replacement plan](../plans/2026-10-20-toolkit-replacement.md) (tracking: [uiuc-csid/ilw-ui#9](https://github.com/uiuc-csid/ilw-ui/issues/9)). Replaces `<ilw-pagination>` with markup, `pagination.css` and a Svelte component that renders it._

## Sources read

`web-illinois/ilw-pagination` v1.1.2: `src/ilw-pagination.ts`, `src/ilw-pagination.styles.ts`, `README.md`. What it does: a `nav` (`label`, default "Page List") around a `ul` of First, Previous, a five-page window with ellipses, Next, Last, and a "Page x of y" item. Links set `parameter` (default `page`) in `url` (default `location.href`), keeping the rest of the query. The current page is an unlinked `li` carrying `aria-current`; First/Previous on the first page and Next/Last on the last are plain `span`s. `zerostart` shifts the numbers for Drupal; `width` and `padding` size the bar. Boxes are 12px × 18px padded, 1.1875rem, a thin `--ilw-color--control-text` outline; the current page is filled; focus swaps in the focus colours.

## Decisions

- **Markup and CSS first, Svelte second.** `.ilw-pagination` works from a server template without script; `Pagination` renders exactly that markup. It needs no island: the links do the work.
- **Shared with `Pager`:** the page window (`pageWindow`: first, last, two either side), a labelled `nav` landmark (default "Pages"), named Previous/Next and `aria-current="page"`. `Pager` keeps its own classes and DOM contract (ta-manager selects on them); the two differ in buttons vs links and in look.
- **No First/Last:** the first and last page numbers are always in the window, so the extra links only add Tab stops.
- **The current page is a link** with `aria-current="page"`, so it's announced in the links list and has a focus stop (as `Pager`'s current button does).
- **Previous/Next stay visible as text** on the first/last page, as upstream, so the row doesn't shift.
- **Links:** `pageHref(url, page, parameter)` in `ilw-ui/core` sets the parameter and keeps the rest of the query and the fragment. `url` defaults to `''` (a relative `?page=N`), not `location.href`: no DOM access, and it renders the same on the server. `href` replaces both for 0-based (`zerostart`) or path-based pages.
- **Focus** uses `.ilw-button`'s two-tone ring (WCAG 1.4.11) instead of only a colour change.
- **Count** is a `span` after the list, not a list item.
- **Deferred:** `width`/`padding` wait for the layout utilities (A5).

## Tests

- Play functions: the contract (items, current, names, hrefs keeping the query, count), the first/last/single page, `url`/`parameter`/`href`/clamping/`hidePageCount`, theme classes, Source Sans outside `.ilw-format`.
- Parity pair (`Parity/Pagination`).
- `tests/e2e/pagination.spec.ts`: Tab and Shift+Tab order (ellipses and count aren't stops), Enter follows a link, focus never on `<body>`.
- `pageHref` unit tests.
- axe on every story; screen-reader checks in `docs/at-smoke.md`.
