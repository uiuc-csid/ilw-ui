# Replacing the Illinois Web Toolkit with ilw-ui

_A roadmap for making ilw-ui a full replacement for the [Illinois Web Toolkit](https://builder3.toolkit.illinois.edu/) (`web-illinois/ilw-*`, v3), for Svelte apps. For now it covers what can work as an island in a statically rendered page. Tracking issue: [uiuc-csid/ilw-ui#9](https://github.com/uiuc-csid/ilw-ui/issues/9)._

## Context

ilw-ui began as a gap-filler that sat next to the toolkit: it wrapped `<ilw-modal>`, relied on `toolkit.css` and `<ilw-page class="ilw-format">`, and added only what the toolkit lacks. The goal now is for ilw-ui to replace it. A Svelte app should get the same look and behaviour from ilw-ui alone, without loading `toolkit.js` or `toolkit.css`, and with better accessibility and Svelte-native APIs (snippets, callbacks, bindable state).

Scope for now: everything that works in a **statically rendered page**. That means:

- interactive pieces mounted as islands, using `mount(Component, { target, props })` on a server-rendered element;
- presentational pieces that are just markup and CSS, so a server template can render them without any JavaScript.

The inventory below is the toolkit's full component list (the active `web-illinois/ilw-*` repos as of 2026-10-20), plus gaps the toolkit doesn't fill. A survey of our own apps (ta-manager, opportunities, csid-portal, ngpa-calculator) set the order of the gap-fillers. It doesn't limit the scope, since other apps will use this too.

## Decisions

- **Replace, don't wrap.** The end state has no runtime dependency on `toolkit.js` or `toolkit.css`. The brand stylesheet (`cdn.brand.illinois.edu/illinois.css`) stays: it is the source of the `--il-*` tokens and the fonts, not part of the toolkit.
- **Visual parity, better behaviour.** Each replacement matches the toolkit's look, including its theme variants and dark mode. A parity story renders the toolkit element next to the ilw-ui one, and Chromatic compares them. Behaviour follows the APG, not the toolkit. Where the two differ, the README records the difference.
- **Two delivery forms.**
  - _Presentational components_ (card, hero, quote, footer, and so on) ship as documented markup and classes in `styles.css`, so a server template can use them without JavaScript. They also ship as a Svelte component that renders exactly that markup.
  - _Interactive components_ are islands. Where possible they start from server markup that works without JavaScript (accordion from `<details>`, tabs that fall back to headed sections, filters that fall back to a GET form) and improve it once mounted.
- **CSS before JS for page chrome.** Page chrome that needs no script to work ships as markup and classes only. Disclosure uses `<details>` (with `name` for one open at a time) or `popover` with `popovertarget`. Reveal-on-scroll uses scroll-driven animations, with an always-visible fallback. Script is added only where HTML can't do the job (today: the dark-mode toggle). Svelte pages still get a component that renders the same markup.
- **Island-safe.** No SvelteKit imports, and no DOM access at module top level, so components also work when prerendered. Props come from `data-*` attributes or `json_script`, through a shared `mountIslands` helper.
- **Native first.** Native `<dialog>`, `<details>`, `popover`, form controls and `<table>` come before custom widgets. Zag or TanStack are used only where native elements fall short, and only inside ilw-ui.
- **The layering rule changes.** AGENTS.md's "Illinois toolkit first, native HTML second, ilw-ui third" becomes "native HTML first, ilw-ui second; the toolkit is the visual reference". The README's "host page must load the toolkit" goes away step by step, as each component stops needing it. The first PR under this plan updates both files.
- **DOM contracts move on purpose.** ta-manager's tests select on `ilw-modal[open] .ilw-button` and on the `.ilw-pager*` and `picker-*` markup. Swapping the modal's internals is a breaking change. It gets a release note and a coordinated ta-manager PR.
- **The bar stays the same.** Each component gets the three test layers in AGENTS.md (play-function DOM and ARIA checks, Playwright keyboard and focus, and axe), a README contract, an at-smoke checklist, and a parity story if it replaces a toolkit component. Each gets its own plan in `docs/plans/` when work starts.

## Inventory

Delivery is one of: **CSS** (markup and classes), **Svelte** (component), or **Island** (interactive component).

### A. Foundations

| # | Item | Replaces | Delivery | Notes |
| - | ---- | -------- | -------- | ----- |
| A1 | Theme and tokens | `.ilw-theme-*` (blue, orange, gray, white; `-solid`, `-1`, …), `ilw-page` `dark-mode.css` | CSS | Theme classes set surface, text and link tokens, so every component follows the theme. Dark mode follows `prefers-color-scheme` plus an override attribute. |
| A2 | Prose typography | `.ilw-format`, `.ilw-font`, `.ilw-heading` | CSS | Headings, lists, links and tables inside a content area. Unlike the toolkit, use low-specificity selectors (`:where()`), so component styles don't have to fight them. |
| A3 | Buttons | `.ilw-button(s)`, `-small`/`-large`, theme variants | CSS + Svelte `Button` | Works on `<a>` and `<button>`, with visible focus. |
| A4 | Tables | `.ilw-table`, `.ilw-table-responsive` | CSS | The base styles for `DataTable`. |
| A5 | Layout | `ilw-content`, `ilw-columns`, `ilw-grid`, `ilw-spacer`, `.ilw-container`, `.ilw-width-*` | CSS + Svelte | Built on CSS grid and container queries. |
| A6 | Icons | `ilw-icon`, `.ilw-icon-row` | Svelte `Icon` | Inline SVG, `aria-hidden` unless it has a label. Phosphor icons (MIT) through `phosphor-svelte`. |
| A7 | Form styles | `ilw-input` (`.ilw-input-entry*`, radio and checkbox variants, `-compact`, `.ilw-input-alert`, `.ilw-label-required`, `.ilw-toggle-slider`) | CSS + Svelte `Field` | `Field` connects the label, description and error to the input with `aria-describedby` and `aria-invalid`. The toggle becomes a `role="switch"` checkbox. |
| A8 | `mountIslands` | (none) | core | Mounts components from `[data-ilw-island]`, with props from `data-*` or `json_script`; unmounts on `pagehide`. |
| A9 | `announce()` | (none) | core | One shared polite `role="status"` region, with an assertive option. |

### B. Page chrome

| # | Item | Replaces | Delivery | Notes |
| - | ---- | -------- | -------- | ----- |
| B1 | Page shell | `ilw-page` | CSS + Svelte | Skip link (a plain `<a>` to a `tabindex="-1"` `<main>`), landmark layout, and the A1 dark-mode hook. Without script it follows `prefers-color-scheme`. The toggle that sets `html[data-theme]` and the `ilw-dark-mode` cookie is the only script: a small, optional island. Replaces `IlwPage.svelte` in Storybook. |
| B2 | Header | `ilw-header`, `ilw-header-menu`, `ilw-header-megamenu` | CSS + Svelte | Wordmark, site name, utility links and a GET search form. Menus are disclosure navigation (not `role="menu"`) with no script: `<details name="…">` for in-flow submenus (the shared `name` keeps one open at a time), and a `popovertarget` button with a `popover` panel for the megamenu and the mobile toggle (Escape and light dismiss come free). |
| B3 | Footer | `ilw-footer`, `.ilw-footer-menu` | CSS + Svelte | The campus footer content must match the toolkit's exactly. |
| B4 | Breadcrumbs | `ilw-breadcrumbs` | CSS + Svelte | `<nav aria-label>` with `aria-current="page"`. |
| B5 | Page title | `ilw-page-title` | CSS + Svelte | |
| B6 | Section nav | `ilw-section-nav` | CSS + Svelte | Nested `<details>`: the server sets `open` on the current branch and `aria-current="page"` on the current link. The link and the toggle stay separate (no link inside `<summary>`): the summary holds only the toggle, named "Subpages of …", laid out beside the link. |
| B7 | Back to top | `ilw-back-to-top` | CSS + Svelte | `<a href="#top">` to the skip-link target. A scroll-driven animation (`animation-timeline: scroll()`) reveals it after scrolling; where that isn't supported, it is always visible. |

### C. Interactive toolkit components

| # | Item | Replaces | Delivery | Notes |
| - | ---- | -------- | -------- | ----- |
| C1 | `Modal` | `ilw-modal` | Island | Done (#31, plan in `docs/old-plans/2026-10-26-modal.md`). Native `<dialog>` with `showModal()`, styled by `modal.css`. Keeps the `openModal`/`alert`/`confirm` API, the close reasons and focus return, and fixes the upstream gaps in `docs/upstream-issues/ilw-modal.md`. The DOM contract changed; ta-manager follows in its own PR (see Decisions). |
| C2 | `Accordion` | `ilw-accordion`, `ilw-accordion-panel` | CSS + Island | Starts from `<details>`/`<summary>`. Optional single-open mode and an "expand all" button. |
| C3 | `Tabs` | `ilw-tabs` | Island | APG tabs, with optional automatic activation and a hash link to each tab. Without JavaScript, the panels show as headed sections. |
| C4 | `Tooltip` | `ilw-tooltip` | Island | Uses `popover` plus anchor positioning, with a fallback where those aren't supported. Shows on hover and focus, closes on Escape, and stays open while hovered (WCAG 1.4.13). |
| C5 | `Pagination` | `ilw-pagination` | CSS + Svelte | Link-based pagination for server pages. Shares markup and styles with `Pager`, which is button-based and for client-side paging. |
| C6 | `Filter` | `ilw-filter`, `ilw-filter-form`, `-search`, `-checkboxessimple`, `-dropdownsimple`, `-hidden`, `-button` | Island | A GET `<form>` that works without JavaScript. Once mounted, it syncs with the query string and calls a callback. It pairs with `DataTable` and with server-rendered lists. |
| C7 | `Carousel` | `ilw-carousel`, `ilw-slide` | Island | APG carousel: a pause control, no autoplay by default, and labelled slides. |
| C8 | `ImageGallery` | `ilw-image-gallery` | CSS + Island | A grid of images that opens a lightbox in a `Modal`. |
| C9 | `Video` | `ilw-video` | CSS + Svelte | A responsive embed with a title and a transcript link. |
| C10 | `OrgChart` | `ilw-org-chart` (+ `-container`, `-large`) | Island | The largest item in this list. It needs its own design plan covering tree navigation by keyboard and a list view as an alternative. |

### D. Content components

All are **CSS + Svelte**. The Svelte component renders exactly the documented markup, and each item has a parity story.

| # | Item | Replaces |
| - | ---- | -------- |
| D1 | `Card` | `ilw-card` (with `.ilw-image-cover-*`) |
| D2 | `CallToAction` | `ilw-call-to-action` |
| D3 | `IconPanel` | `ilw-icon-panel` |
| D4 | `Hero` | `ilw-hero` |
| D5 | `Quote` | `ilw-quote` |
| D6 | `Statistic` | `ilw-statistic` |
| D7 | `Profile`, `ProfileCard`, `ProfileList` | `ilw-profile`, `ilw-profile-card`, `ilw-profile-list` |
| D8 | `AwardList` | `ilw-award-list`, `ilw-award-category` |
| D9 | `SearchHeading` | `ilw-search-heading` |

### E. Gaps the toolkit doesn't fill

Some of these are done: `SortableTh`, `Combobox`, `Autocomplete` (E2, #8), `DataTable`/`DataRows`/`TableSortTh`, and `Pager`. "Seen in" lists real uses found in our apps.

| # | Item | What | Seen in |
| - | ---- | ---- | ------- |
| E1 | `Alert` / messages | Dismissible notices. `role="status"` for info and success, `role="alert"` only for errors. Optional actions (retry, log in again). | Django `messages` partials; ta-manager save-error banner |
| E2 | `Autocomplete` (done, #8) | Free text with suggestions from a local list. Uses Zag with `allowCustomValue`. Async suggestions are part of E3. | ta-manager professor, course and thesis pickers; opportunities Select2 |
| E3 | Async sources + `Combobox` multi | An async (debounced, abortable) source for both `Combobox` and `Autocomplete`, multi-select tokens, and hidden inputs for a multi-select form field. | opportunities `ModelSelect2Multiple` |
| E4 | `ToggleGroup` | Filter buttons with `aria-pressed`, single- or multi-select, in a labelled group. | ta-manager (about 60 instances) |
| E5 | Choice chips | Native radios or checkboxes in a `fieldset` with a `legend`, styled as chips. | ngpa country/schema |
| E6 | `CopyButton` | Copies a value or an element's text and announces it through A9. | ta-manager (5+ modules) |
| E7 | `Repeater` | Add and remove rows, with focus moved and the change announced. Has a Django formset mode that keeps `TOTAL_FORMS` and the field prefixes in step. | opportunities, ngpa |
| E8 | `DataTable` from server rows | Takes over a `<tbody>` the server already rendered. | ta-manager `special_cases`, opportunities django-tables2 |
| E9 | `ServerTable` mode | Debounced server query, server sort and filter, paged or "load more". | ta-manager SM results, assignment history |
| E10 | `RankList` | Reorder with the keyboard, focus following the item, and the move announced. | ta-manager top-5 |
| E11 | `TransferList` | Assign items to N groups, with a keyboard "Move to…" control alongside drag. | csid-portal groups |
| E12 | `Stepper` | Multi-page form with `aria-current="step"`, Previous/Next, and focus moved to each step's heading. | ta-manager (3 forms) |
| E13 | `SubmitButton` | Prevents double submits, shows progress, resets on bfcache. | ta-manager SM run, import |
| E14 | `MenuButton` | APG menu button for action menus. | Bootstrap dropdowns in several apps |
| E15 | `FileInput` | A native file input with type and size checks plus a dropzone. | ta-manager import, opportunities emailer |
| E16 | Weekly time picker | Pick weekly availability by keyboard and mouse. Needs its own design plan. | opportunities (FullCalendar, mouse-only) |
| E17 | Small display bits | `StatusPill`, `RelativeTime`, `Avatar`, `downloadResponse()` | queue-next, ngpa |

## Order

Each phase is a set of independent PRs that can run in parallel unless noted.

1. **Foundations.** A1–A4, A8, A9, the parity-story harness, and the README layering change (AGENTS.md is updated with this plan). Everything else depends on these.
2. **Remove today's toolkit dependency.** C1 `Modal` (with the coordinated ta-manager PR), C5 alongside `Pager`, and the remaining foundations A5–A7. After this phase, nothing ilw-ui already ships needs `toolkit.js`.
3. **The most-used interactive pieces.** C2 Accordion, C3 Tabs, C4 Tooltip, E1 Alert, E3 (`Autocomplete`, E2, is done), E4 ToggleGroup, E5 chips, E6 CopyButton.
4. **Page chrome.** B1–B7, all CSS: only B1's dark-mode toggle is an island. They need only A1 and A2, so they can run alongside phases 2 and 3. After this phase, a page can drop the toolkit entirely.
5. **Forms and data.** C6 Filter, E7 Repeater, E8, E9, E12, E13, E15.
6. **Content components.** D1–D9. Each is small and they can be done in bulk.
7. **Media and the rest of the gaps.** C7–C9, E10, E11, E14, E17.
8. **Own design plans first.** C10 OrgChart, E16 weekly time picker.

## Open questions

- **Following upstream.** How do we keep up with toolkit visual changes? One option is a scheduled job that refreshes `vendor/illinois-toolkit` and reruns the parity stories.
- **Footer content.** The campus footer has required links and text. Who owns them, and how do we keep ours in step?
- **Distribution.** ilw-ui is `private` and ships source. Other apps need to install it: as a git dependency, from GitHub Packages, or from npm.
- **Non-Svelte server pages.** The CSS layer makes presentational components usable from any template. Should we also ship Jinja/Django macros for them, or leave markup as documented only?

## Done when

- Every row in A–E is merged, with its plan moved to `docs/old-plans/`, or explicitly dropped on the tracking issue.
- Storybook loads `toolkit.js`/`toolkit.css` only for the parity stories.
- This plan moves to `docs/old-plans/`.
