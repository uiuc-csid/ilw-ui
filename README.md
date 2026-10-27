# ilw-ui

Accessible Svelte 5 components that look like the
[Illinois Web Toolkit](https://builder3.toolkit.illinois.edu/) and follow the
WAI-ARIA Authoring Practices. The goal is a full replacement for the toolkit in
Svelte apps: the same look without `toolkit.js` or `toolkit.css`, plus what the
toolkit lacks. So far: a modal on native `<dialog>` with close reasons,
focus return and a promise API, a filtering combobox, a free-text autocomplete,
a client-side sortable, filterable, paged table, link-based pagination
for server-rendered lists, and a copy button. The roadmap is
[docs/plans/2026-10-20-toolkit-replacement.md](docs/plans/2026-10-20-toolkit-replacement.md),
tracked in [#9](https://github.com/uiuc-csid/ilw-ui/issues/9).

Layering: native HTML first, `ilw-ui` second. The toolkit is the visual
reference, not a runtime dependency of new components.

Status: pre-release (`private: true`), first consumer
[ta-manager](https://github.com/uiuc-csid/ta-manager).

## Install and use

ilw-ui isn't published to a registry yet. Install it from GitHub, pinned to a
release tag:

```sh
pnpm add github:uiuc-csid/ilw-ui#v0.1.0
```

The repository is private, so the installing machine (and its CI) needs read
access to it, e.g. a token in `.npmrc` or a deploy key. Releases are tags on
`main` (`vX.Y.Z`, with `version` in `package.json` bumped to match); there is no
build step, so the tag is the release.

The package ships source (`.svelte`/`.ts`); your Vite + Svelte build compiles it.
Peer dependency: `svelte ^5.57`. Dependencies, pinned exactly: `@zag-js/combobox`
and `@zag-js/svelte` (1.44.0), `@tanstack/table-core` and
`@tanstack/svelte-table` (9.3.1), and `phosphor-svelte` (3.1.1). To pass icons
to `Icon`, add `phosphor-svelte` to your own dependencies at the same version.

```js
import { Autocomplete, Combobox, MultiCombobox, enhanceSelect, enhanceSelects, SortableTh, openModal, alert, confirm } from 'ilw-ui/svelte';
import { createDataTable, DataTable, DataRows, TableSortTh, Pager, Pagination, setTableFilter } from 'ilw-ui/svelte';
import { Page, Footer, Breadcrumbs, PageTitle, Icon, Field, RadioGroup, ChoiceChips } from 'ilw-ui/svelte';
import { nextSort, filterItems, blurMatch, rowColumn, pageWindow, pageHref, announce, campusFooter, campusLink } from 'ilw-ui/core';
import 'ilw-ui/styles.css';
```

Every page needs the brand stylesheet
(`https://cdn.brand.illinois.edu/illinois.css`). No ilw-ui component needs the
toolkit: a page that uses only ilw-ui can drop `toolkit.js` and `toolkit.css`.
Load one of `toolkit.css` and `styles.css`, not both (see
[Themes and dark mode](#themes-and-dark-mode)).

**Tokens:** `styles.css` uses only the brand palette's `--il-*` custom
properties, each with its brand value as a fallback in case the brand
stylesheet fails to load. It has no rules on bare `th`/`td`.

**Partials:** `styles.css` is an index that `@import`s `src/styles/*.css`.
Each partial is exported too, so a page can take only what it needs, e.g.
`import 'ilw-ui/styles/tokens.css'` for the theme properties alone.

| Partial          | Holds                                                     |
| ---------------- | --------------------------------------------------------- |
| `tokens.css`     | `--ilw-color--*` defaults, theme classes, dark mode       |
| `format.css`     | `.ilw-format`, `.ilw-font`, `.ilw-heading` prose          |
| `button.css`     | `.ilw-button`, `ul.ilw-buttons`, `ul.ilw-buttons-left`    |
| `forms.css`      | `.ilw-input-entry*`, `.ilw-label-required`, `.ilw-input-alert`, `.ilw-fieldset` (A7) |
| `switch.css`     | `input.ilw-switch` (A7)                                   |
| `chips.css`      | `fieldset.ilw-chips`, `label.ilw-chip` (E5)               |
| `table.css`      | `table.ilw-table`, tables in `.ilw-format`, stripes, `.ilw-table-responsive`, `.ilw-theme-table-*` |
| `page.css`       | `.ilw-page` shell, `.ilw-skip-link`, links in `main` (B1) |
| `page-title.css` | `.ilw-page-title` (B5)                                    |
| `breadcrumbs.css`| `.ilw-breadcrumbs` (B4)                                   |
| `pagination.css` | `.ilw-pagination` (C5)                                    |
| `footer.css`     | `.ilw-footer` (B3)                                        |
| `icon.css`       | `.ilw-icon`, `.ilw-icon-row` (A6)                         |
| `modal.css`      | `dialog.ilw-modal` and its parts (C1)                     |
| `dark-mode-toggle.css` | `.ilw-dark-mode-toggle`'s layout; needs `switch.css` (B1) |
| `components.css` | `.ilw-visually-hidden`, SortableTh, Combobox, MultiCombobox, Autocomplete, Pager |

## Themes and dark mode

`tokens.css` uses the toolkit's names, so markup themed for `toolkit.css` is
themed the same way here. A page loads one of the two stylesheets, not both:
they define the same classes and properties.

**Theme classes** (as in `toolkit.css`; the `-table-*` themes are under
[Tables](#tables)):

| Class or attribute                                                                         | Palette                                       |
| ------------------------------------------------------------------------------------------ | --------------------------------------------- |
| none                                                                                       | white (the page default)                      |
| `.ilw-theme-blue`, `.ilw-theme-blue-outline`, `[theme=white]`                              | white: blue outline controls on white         |
| `.ilw-theme-blue-1`, `-blue-2`, `-blue-solid`, `-blue-inverse`, `[theme=blue]`               | Illinois Blue, white text                     |
| `.ilw-theme-orange-1`, `-orange-2`, `-orange-solid`, `-orange-inverse`, `[theme=orange]`    | Illinois Orange, blue text, white headings    |
| `.ilw-theme-orange`, `.ilw-theme-orange-outline`                                            | controls only: white with orange text         |
| `[theme=gray]`                                                                              | Storm 95                                      |
| `[theme=blue-gradient]`, `[theme=orange-gradient]`                                          | Industrial to Blue; Harvest to Orange         |

A theme only sets properties; it paints nothing by itself. Whatever reads the
properties (a component, `.ilw-button`, your own rule) takes the theme's colours.

**Properties a component may read** (it never names a theme or a palette):

| Property                                                                                     | Use                            |
| -------------------------------------------------------------------------------------------- | ------------------------------ |
| `--ilw-color--background`, `--ilw-color--text`                                               | surface and body text          |
| `--ilw-color--border`, `--ilw-color--border-light`                                           | borders, rules                 |
| `--ilw-color--link`, `-link-hover`, `-link-visited`                                          | links                          |
| `--ilw-color--heading`, `-heading-link`, `-heading-link-hover`, `-heading-link-visited`      | headings and links in them     |
| `--ilw-color--control`, `-control-text`, `-control-accent`, `-control-accent-text`          | buttons and other controls     |
| `--ilw-color--focus--background`, `--ilw-color--focus--text`, `--ilw-color--focus--outline` | focus state                    |
| `--ilw-color--table-border`, `-table-background`, `-table-row-stripe`, `-table-head-background`, `-table-head-color` | tables |

The palette properties (`--ilw-color--white--*`, `--ilw-color--blue--*`,
`--orange--`, `--gray--`, `--bluegrad--`, `--orangegrad--`) define the themes.
Override one on `:root` to restyle every place that palette is used.

The toolkit's orange theme puts white on Illinois Orange (3.3:1) in headings
and controls, and every palette's `--control-accent` does the same. That
passes WCAG only for large text (24px, or 18.66px bold); use it accordingly.

**Dark mode:** the page is dark when `<html data-theme="dark">`, or when the OS
prefers dark and `<html>` doesn't have `data-theme="light"`. That's the
attribute the [dark-mode toggle](#dark-mode-toggle-darkmodetoggle) sets (and
the one the toolkit's `DARKMODE.md` asks pages to set).
Dark mode changes the white and gray palettes and the focus colours (near-black
Blue 10 or Storm 10 surfaces, Storm 95 text, Industrial-lighter links, a light
blue focus outline); the blue, orange and gradient themes keep their colours.
The vendored toolkit has no dark rules, and upstream's unreleased
`dark-mode.css` keeps a light background, so these values are ilw-ui's own.
**A page that loads `styles.css` next to `toolkit.css` follows the OS
preference too**, since `tokens.css` overrides the toolkit's properties; set
`data-theme="light"` on `<html>` to keep it light until the page migrates.

**CSP:** nothing here uses `eval`, `new Function`, `{@html}` or `innerHTML`, so
it runs under a same-origin-scripts, no-`eval` policy. Nothing sets inline
`style` attributes either: `tests/e2e/combobox-csp.spec.ts` runs the open
combobox under `style-src-attr 'none'`.

## Prose: `.ilw-format`, `.ilw-font`, `.ilw-heading`

`format.css` gives the toolkit's prose look to everything inside a
`.ilw-format` element: headings, paragraphs, `b`/`strong`, `i`/`em`, lists,
links, `blockquote`, `hr` and `pre`. Sizes and margins match the toolkit's
`ilw-page.ilw-format main` rules; colours come from the `--ilw-color--*`
properties, so themes and dark mode apply.

```html
<main class="ilw-format">
  <h1>Graduate admissions</h1>
  <p>Read the <a href="/requirements">requirements</a> first.</p>
  <p class="ilw-heading">Looks like an h4, isn't a heading</p>
</main>
```

- **Any element**, not only `ilw-page`'s `<main>`. `<ilw-page class="ilw-format">`
  markup keeps working.
- **Zero specificity.** Every selector is wrapped in `:where()`, so a
  component's classed rules, or a page's own bare `h2` rule, always win. The
  **Format → Components inside** story checks this with a `Combobox` and a
  `DataTable`.
- **Paints the theme.** `.ilw-format` sets `color` and `background-color` from
  `--ilw-color--text` and `--ilw-color--background` (the toolkit leaves both
  to the page), so prose is readable in dark mode and in a theme on the same
  element (`<section class="ilw-format" theme="blue">`).
- **Links** use `--ilw-color--link`, `-link-visited` and `-link-hover`; links
  inside headings use the `-heading-link*` colours. Focus shows the
  `--ilw-color--focus--*` background plus a 2px outline (the toolkit has no
  outline). `target="_blank"` links end in the brand link icon, hooked to the
  toolkit's `--ilw-new-window--*` properties (set
  `--ilw-new-window--display: none` to hide it). The icon is decorative: put
  "opens in a new tab" in the link text. In the toolkit only `<ilw-content>`
  draws the icon.
- **`hr` and `pre`** have no toolkit rules: `hr` is a 1px line in
  `--ilw-color--border`, `pre` gets paragraph spacing and scrolls sideways
  rather than widening the page. `code`, `kbd` and `samp` keep the browser's
  monospace, as in the toolkit.
- **`.ilw-heading`** gives any element inside `.ilw-format` the h4 look.
- **`.ilw-font`** sets only the brand fonts: Montserrat on `h1` (except inside
  `ilw-hero` and `ilw-page-title`), Source Sans on other headings, text and
  form fields. `.ilw-format` already sets the same fonts on what it styles.
- **Tables and captions** are not part of this: see [Tables](#tables).

## Tables

`table.css` styles a native table the way `toolkit.css` does: `table.ilw-table`
anywhere, and every table inside `.ilw-format` or `<ilw-content>` (the toolkit
only styles bare tables inside `ilw-page.ilw-format main`). Its selectors have
the specificity of a single element, so a class of yours wins.

```html
<div class="ilw-table-responsive" role="region" aria-label="TA hours" tabindex="0">
  <table class="ilw-table ilw-table-stripe ilw-theme-table-blue">
    <caption>TA hours</caption>
    <thead><tr><th scope="col">Name</th><th scope="col">Hours</th></tr></thead>
    <tbody><tr><th scope="row">Avery</th><td>20</td></tr></tbody>
  </table>
</div>
```

| Class                                     | On             | Effect                                                    |
| ----------------------------------------- | -------------- | --------------------------------------------------------- |
| `ilw-table`                               | `<table>`      | borders, head colours, fonts, padding                     |
| `ilw-table-stripe`                        | `<table>`      | even body rows take `--ilw-color--table-row-stripe`       |
| `ilw-table-responsive`                    | wrapper `<div>` | scrolls a wide table sideways                            |
| `ilw-theme-table-blue`, `-gray`, `-orange` | `<table>`      | a whole theme (as `.ilw-theme-blue-1`, `[theme=gray]`, `.ilw-theme-orange-1`) |
| `ilw-theme-table-blue-light`              | `<table>`      | Industrial head and blue borders on the page's colours    |
| `ilw-theme-table-orange-white-background` | `<table>`      | Illinois Orange head on the page's colours                |

- **Header cells** (`thead th` and row headers in `tbody`) take
  `--ilw-color--table-head-background` and `-head-color`. Below 600px the
  table drops its outer border, as in the toolkit.
- **Responsive tables scroll; they don't stack.** The toolkit has no stacked
  small-screen layout, and ilw-ui adds none: stacking needs `display: block` on
  table parts, which drops the table semantics in some browsers. Give the
  scrolling wrapper `tabindex="0"`, `role="region"` and a label, so keyboard
  users can scroll it (axe's `scrollable-region-focusable`).
- `ilw-theme-table-orange-white-background` puts white on Illinois Orange
  (3.3:1). The head text is 1.2rem bold, which counts as large text, so it
  passes AA there; don't put smaller text in that head.

## Layout

`width.css`, `content.css`, `columns.css`, `grid.css` and `spacer.css`
replace `<ilw-content>`, `<ilw-columns>`, `<ilw-grid>`, `<ilw-spacer>` and the
toolkit's `width` attribute with classes on plain HTML; each also ships as a
Svelte component that renders exactly this markup. The plan is
[docs/plans/2026-10-26-layout.md](docs/plans/2026-10-26-layout.md).

### Widths and `.ilw-container`

```html
<div class="ilw-page ilw-format ilw-margin">
  <main id="main-content" tabindex="-1">
    <div class="ilw-width-full">…</div>   <!-- edge to edge -->
    <div class="ilw-width-auto">…</div>   <!-- edge to edge, content at the side margin -->
    <div class="ilw-width-page">…</div>   <!-- at the side margin, for a page without ilw-margin -->
    <div class="ilw-container">…</div>    <!-- query container and breakout boundary -->
  </main>
</div>
```

- The toolkit's `width="full|auto|page"`, written once. Every component's
  `width` prop (`LayoutWidth`: `'full' | 'auto' | 'page'`) renders one of these
  classes, `Breadcrumbs` and `PageTitle` included.
- The breakout is `margin-inline: calc(50% - 50cqw)` against the nearest
  container: `.ilw-page` (an inline-size container since A5) or an
  `.ilw-container`. So it spans the page without the scrollbar, and the page
  never scrolls sideways. Like the toolkit's `left: 50%`, it assumes the parent is
  centred, as `main` is. Outside any container it spans the viewport.
- The side margin is `--ilw-margin--side`, which `width.css` sets on `:root`
  as the toolkit does: `max(1.875rem, calc(50cqw - 35.625rem))`, 1140 px of
  content and at least 30 px a side. It is also `.ilw-margin`'s and the
  footer's margin; set it to change them all.
- `.ilw-width-full` on `.ilw-button`, `.ilw-buttons` or a `button` keeps its
  button meaning (full-width button) and doesn't break out.
- `.ilw-container` is ours (the toolkit has no layout rule of that name):
  `container-type: inline-size`. A breakout inside it spans the container, and
  columns inside it stack when it is under 700 px.
- Differs from the toolkit: `<ilw-breadcrumbs width="auto">` is the same as
  `full` (the trail goes to the edge); ours keeps the trail at the side margin,
  as the toolkit's docs describe `auto`.

### `Content` and `.ilw-content`

```html
<div class="ilw-content ilw-format" theme="gray">  <!-- + ilw-content--introduction | --lede | --inset,
                                                      ilw-content--center | --right, ilw-content--decoration,
                                                      ilw-content--transparent, ilw-width-* -->
  <div class="ilw-content-inner">
    <h2>Programs</h2>
    <p>…</p>
  </div>
</div>
```

```svelte
<Content mode="lede" decoration>
  <p>Sodium is an essential micronutrient.</p>
</Content>
```

- The prose is `.ilw-format`'s; the box paints `--ilw-color--background` and
  `--ilw-color--text`, so a `theme` attribute (`white`, `gray`, `blue`,
  `orange`, `blue-gradient`, `orange-gradient`; see
  [Themes](#themes-and-dark-mode)) restyles it.
- Modes as upstream: `introduction` (a centred column, max 1000 px + 3.75 rem,
  of larger text), `lede` (the same, italic; `decoration` adds a 6 px accent
  bar on the side the text starts, or a short rule under centred text), `inset`
  (smaller headings, wide padding).
- Props: `mode`, `align` (`'left' | 'center' | 'right'`), `decoration`,
  `transparent` (no background), `theme`, `width`, `class`.
- Differs from `<ilw-content>`: at `full` and `auto` the box spans the page
  (upstream's `max-width: 100%` stops it at the parent's width); no `padding` attribute (an inline style, which
  consumers' CSP blocks; use a class); the centred lede's rule is `::after`, not
  a `<div role="presentation">`.

### `Columns` and `.ilw-columns`

```html
<div class="ilw-columns ilw-2x1">  <!-- | ilw-1x2 | ilw-3x1 | ilw-1x3 | ilw-1x2x1 |
                                      ilw-columns--sidebar-left | --sidebar-right;
                                      + ilw-columns--reverse, ilw-fixed, ilw-width-*, theme -->
  <div>…</div>
  <div>…</div>
</div>
```

```svelte
<Columns mode="sidebar-left">
  <nav aria-label="In this section">…</nav>
  <div>…</div>
</Columns>
```

- A flex row. `ilw-2x1` makes the first child twice the others, however many
  there are (the toolkit's CSS-only classes); the sidebar modes give the first
  (or last) child a fixed `--ilw-columns--width--sidebar` (280 px).
- Gap `--ilw-columns--gap`: 20 px, 30 px for the sidebars (`gap` prop).
- Stacks below 700 px: by container query (the nearest `.ilw-container` or
  `.ilw-page`) and by media query, as upstream.
- `ilw-columns--reverse` (`reverse`) flips the row on wide screens only. The
  reading order stays the DOM order, so use it only when one side is
  decorative.
- Props: `mode` (`ColumnsMode`), `reverse`, `gap`, `theme`, `width`, `class`.
- Differs from `<ilw-columns>`: no `padding` attribute and no default 40 px
  bottom padding (the CSS-only class has none either); the gap defaults to the
  CSS-only class's 20 px, not the element's 0.

### `Grid` and `.ilw-grid`

```html
<ul class="ilw-grid">  <!-- or <div>; + ilw-fixed, ilw-width-*, theme -->
  <li>…</li>
  <li>…</li>
</ul>
```

```svelte
<Grid itemWidth="300px">
  {#each cards as card (card.id)}<li><Card {card} /></li>{/each}
</Grid>
```

- As many columns at least `--ilw-grid--item-width` (250 px; the toolkit's
  `innerwidth`, the `itemWidth` prop) wide as fit, or
  `--ilw-grid--template-columns`. Gap `--ilw-grid--gap` (10 px, `gap` prop).
  An item wider than the grid shrinks to it.
- Items stretch to the row's height, and an item's only child fills it.
- A list by default, so screen readers announce the count. Props: `as`
  (`'ul' | 'div'`), `itemWidth`, `gap`, `theme`, `width`, `class`.
- Differs from `<ilw-grid>`: no `padding` attribute and no default 40 px
  bottom padding.

### `Spacer` and `.ilw-spacer`

```html
<div class="ilw-spacer" aria-hidden="true"></div>  <!-- --ilw-spacer--height, default 20px -->
```

```svelte
<Spacer height="3rem" />
```

- Vertical space between two blocks, hidden from assistive technology
  (`aria-hidden`; upstream's `role="presentation"` does nothing on an empty
  `div`).

## Page chrome

The page shell, header, footer, breadcrumbs, page title, section nav and
back-to-top replace `<ilw-page>`, `<ilw-header>` (with `<ilw-header-menu>` and
`<ilw-header-megamenu>`), `<ilw-footer>`, `<ilw-breadcrumbs>`,
`<ilw-page-title>`, `<ilw-section-nav>` and `<ilw-back-to-top>` with plain HTML
and classes: no script, so a server template renders them as they are. Each
also ships as a Svelte component that renders exactly this markup. The classes
are named after the toolkit elements; their shadow-DOM parts are light-DOM
children. The plan is
[docs/plans/2026-10-20-page-chrome.md](docs/plans/2026-10-20-page-chrome.md).

### Page shell (`Page`)

```html
<div class="ilw-page ilw-format" id="top" tabindex="-1">
  <a class="ilw-skip-link" href="#main-content">Skip to main content</a>
  <header>…</header>
  <main id="main-content" tabindex="-1">…</main>
  <footer class="ilw-footer">…</footer>
  <a class="ilw-back-to-top" href="#top">…</a>  <!-- optional -->
</div>
```

```svelte
<Page format>
  {#snippet header()}<header>…</header>{/snippet}
  …the page content…
  {#snippet footer()}<Footer>…</Footer>{/snippet}
</Page>
```

- The skip link comes first and is visible only when focused. Its `href`
  matches `main`'s `id`; `tabindex="-1"` makes following it move focus into
  `main`, so the next Tab continues from the content. Props: `skipLinkText`,
  `mainId` (default `main-content`), `id` (default `top`, the back-to-top
  target), `backToTop` (renders `BackToTop` as the last child).
- The shell's `tabindex="-1"` lets following back-to-top move focus to it (not
  to `<body>`), so the next Tab is the skip link. Neither the shell nor `main`
  shows a focus ring when focused this way.
- The header and footer are direct children of the shell, outside `main`, so
  they are the page's banner and content-info landmarks.
- The shell sets the page background and text from `--ilw-color--background`
  and `--ilw-color--text`, so it follows the theme and dark mode. Links in
  `main` outside `.ilw-format` get `--ilw-color--link*` at zero specificity;
  inside `.ilw-format`, the prose styles colour them.
- Modifiers (props in Svelte): `ilw-format` (`format`), `ilw-margin` (`margin`:
  side margins on `main`), `ilw-page--expanded` (`expanded`, the toolkit's
  `expanded` attribute: top and bottom margin on `main`).
- Differs from `<ilw-page>`: the skip link (the toolkit has none) and the page
  colours (the toolkit leaves them to the host).

### Header (`Header`)

```html
<header class="ilw-header">
  <div class="ilw-header-main">
    <a class="ilw-header-wordmark" href="https://illinois.edu/?utm_source=…&utm_medium=web&utm_campaign=Header">
      <span class="ilw-visually-hidden">University of Illinois Urbana-Champaign</span>
      <span class="ilw-header-block-i"><svg aria-hidden="true">…</svg></span>
      <svg class="ilw-header-wordmark-text" aria-hidden="true">…</svg>
    </a>
    <div class="ilw-header-identity">
      <a class="ilw-header-parent-unit" href="…">Parent Unit</a>         <!-- optional -->
      <a class="ilw-header-site-name" href="/">Site Name</a>             <!-- or <h1 class="ilw-header-site-name"><a>, or a <div> -->
    </div>
    <button class="ilw-header-toggle" type="button" popovertarget="ilw-header-menu">
      <svg class="ilw-header-toggle-open" aria-hidden="true">…</svg><svg class="ilw-header-toggle-close" aria-hidden="true">…</svg>
      <span class="ilw-header-toggle-label">Menu</span>
    </button>
  </div>
  <div class="ilw-header-menu" id="ilw-header-menu" popover>            <!-- popover="manual" with a megamenu -->
    <nav class="ilw-header-links" aria-label="Utility"><ul><li><a href="…">…</a></li></ul></nav>
    <form class="ilw-header-search" role="search" method="get" action="/search">
      <input type="search" name="q" aria-labelledby="ilw-header-search-button">
      <button type="submit" id="ilw-header-search-button"><svg aria-hidden="true">…</svg> Search</button>
    </form>
    <nav class="ilw-header-nav" aria-label="Main">
      <ul>
        <li><a href="/about">About</a></li>
        <li><details name="ilw-header-nav">                                   <!-- a section -->
          <summary>Start Here<svg class="ilw-header-chevron" aria-hidden="true">…</svg></summary>
          <ul><li><a href="…">…</a></li></ul>
        </details></li>
        <li class="ilw-header-nav-linked">                                    <!-- a linked section -->
          <a href="/info">Information</a>
          <details name="ilw-header-nav">
            <summary><span class="ilw-visually-hidden">Subpages of Information</span><svg class="ilw-header-chevron" aria-hidden="true">…</svg></summary>
            <ul>…<li><details name="ilw-header-nav-3">…</details></li></ul>  <!-- nested: its own name -->
          </details>
        </li>
      </ul>
    </nav>
    <span class="ilw-header-dark-mode" data-ilw-island="dark-mode-toggle"></span>  <!-- optional -->
  </div>
</header>
```

A megamenu (`megamenu` in Svelte) swaps each top-level section's `details` for
a button and a popover panel of columns:

```html
<nav class="ilw-header-nav ilw-header-nav--mega" aria-label="Main">
  <ul>
    <li>
      <button type="button" class="ilw-header-megamenu-toggle" popovertarget="ilw-header-mega-1">Admissions<svg class="ilw-header-chevron" aria-hidden="true">…</svg></button>
      <div class="ilw-header-megamenu-panel" id="ilw-header-mega-1" popover>
        <ul class="ilw-header-megamenu-list ilw-header-megamenu-list--columns">  <!-- --columns when items have children -->
          <li><a href="…">Undergraduate</a><ul><li><a href="…">Apply</a></li></ul></li>
        </ul>
      </div>
    </li>
    <li class="ilw-header-nav-linked">                                        <!-- a linked section -->
      <a href="/research">Research</a>
      <button type="button" class="ilw-header-megamenu-toggle" popovertarget="ilw-header-mega-2"><span class="ilw-visually-hidden">Subpages of Research</span><svg class="ilw-header-chevron" aria-hidden="true">…</svg></button>
      <div class="ilw-header-megamenu-panel" id="ilw-header-mega-2" popover>…</div>
    </li>
  </ul>
</nav>
```

```svelte
<Header
  siteName="My Site"
  parentUnit={{ label: 'Parent Unit', href: '…' }}
  links={[{ label: 'Apply', href: '/apply' }]}
  search={{ action: '/search' }}
  nav={[
    { label: 'About', href: '/about' },
    { label: 'Start Here', children: [{ label: 'Getting Started', href: '/start', current: true }] },
    { label: 'Information', href: '/info', children: [/* … */] },
  ]}
  darkModeToggle
/>
```

- **No script.** Under 990 px (the toolkit's breakpoint) the "Menu" button
  opens the menu as a popover under the header (anchor positioning; without
  it, the browser's centred popover). From 990 px the button is hidden and the
  menu is `display: contents`, so the links, search and nav take the toolkit's
  places in the header. Sections are `<details>` sharing one `name`, so one is
  open at a time; a nested section's `name` adds its position
  (`ilw-header-nav-3`), so opening it keeps its parent open. Megamenu panels
  are `popover` (one at a time, Escape, light dismiss).
- **Focus order is reading order** at every width: skip link, wordmark, parent
  unit, site name, "Menu" (narrow), utility links, search field and button, the
  nav items (a linked section's link, then its toggle), the dark-mode switch,
  then `main`. An open section's links follow its toggle; a panel follows its
  button.
- **Current page:** `current` on a nav item puts `aria-current="page"` on its
  link, or `aria-current="true"` on a section's toggle (the toolkit's
  `current` attribute); both get the toolkit's blue rule.
- **Search** is a GET form labelled by its submit button (the toolkit's
  contract). `search={{ action, name = 'q', label = 'Search' }}`, or `false`
  (the default) for none.
- **Dark-mode toggle:** `darkModeToggle` renders the
  [`DarkModeToggle`](#dark-mode-toggle-darkmodetoggle) island host at the end
  of the menu (at the right of the nav bar from 990 px). In Svelte the
  component mounts it itself and marks the host mounted, so `mountIslands`
  skips it; a server template renders the empty host and calls `mountIslands`.
- Props: `siteName` (text or a snippet), `siteHref` (default `/`; `null` for
  no link), `heading` (the site name is the page's `<h1>`), `parentUnit`,
  `source` (the wordmark's UTM source, default `Illinois_App`), `links`,
  `linksLabel` (default "Utility"), `search`, `nav`, `navLabel` (default
  "Main"), `megamenu`, `darkModeToggle`, `menuLabel` (default "Menu"), `id`
  (default `ilw-header`: the prefix of every id and `details` name; set it if
  a page has two headers), `class`. With no links, search, nav or toggle there
  is no menu and no "Menu" button (the toolkit's `menu="none"`).
- Colours come from the theme (`--ilw-color--heading`, `--ilw-color--background`,
  …), so the header turns dark with the page; the block I keeps its brand blue
  and the top rule stays orange.
- **Gaps against the APG disclosure navigation pattern** (they need script):
  no arrow keys between top-level items (optional in the APG); an open
  `details` dropdown doesn't close on Escape or when focus leaves it (it closes
  when another opens or its toggle is pressed). With a megamenu, the narrow
  menu is a manual popover (Escape and an outside click leave it open; "Menu"
  closes it): a popover restores focus on Escape only when no other auto
  popover is open, so the panels inside the menu must be the only auto ones.
- Differs from `<ilw-header>`: no script; the menu sections are `details`
  rather than buttons with `aria-expanded`; the linked section's toggle is
  named "Subpages of …" (upstream: "… submenu"); a megamenu panel holds a list
  of columns (upstream: slotted lists and `action-left`/`action-right` slots,
  not supported); the dark-mode switch is the B1 island; the wordmark's name is
  visually hidden text in the link, as in the footer; the "Menu" button doesn't
  trap focus in the open menu (upstream loops Tab inside it).

### Footer (`Footer`)

```html
<footer class="ilw-footer">
  <div class="ilw-footer-site">   <!-- + ilw-footer-site--no-actions without actions -->
    <p class="ilw-footer-site-name"><a href="/">Site Name</a></p>
    <div class="ilw-footer-contact">
      <nav class="ilw-footer-social" aria-label="Social media"><ul><li><a href="…">…</a></li></ul></nav>
      <address class="ilw-footer-address"><p>…</p></address>
      <p class="ilw-footer-primary-unit"><a href="…">Primary Unit</a></p>
    </div>
    <div class="ilw-footer-actions"><a href="/give">Give</a></div>
    <div class="ilw-footer-content">
      <nav class="ilw-footer-menu" aria-labelledby="menu-1"><h2 id="menu-1">…</h2><ul>…</ul></nav>
    </div>
  </div>
  <div class="ilw-footer-campus">
    <h2 class="ilw-footer-logo"><a href="https://illinois.edu/?utm_source=…&utm_medium=web&utm_campaign=Footer">
      <span class="ilw-visually-hidden">University of Illinois Urbana-Champaign</span><svg aria-hidden="true">…</svg></a></h2>
    <div class="ilw-footer-sections">
      <div class="ilw-footer-section"><h3>Explore Campus</h3><ul><li><a href="…">…</a></li></ul></div>
    </div>
  </div>
  <div class="ilw-footer-legal">
    <ul>
      <li><button type="button" id="ot-sdk-btn" class="ot-sdk-show-settings">About Cookies</button></li>
      <li><a href="…">Privacy Policy</a></li>
      <li><a href="…">Copyright</a></li>
      <li><a href="…">Your own legal link</a></li>
      <li><a href="…">Accessibility</a></li>
    </ul>
  </div>
</footer>
```

```svelte
<Footer source="My_Site" cookiesButton legalLinks={[{ label: 'Terms', href: '/terms' }]}>
  {#snippet siteName()}<a href="/">My Site</a>{/snippet}
  {#snippet address()}<p>201 N Goodwin Ave<br />Urbana, IL 61801</p>{/snippet}
  {#snippet social()}<li><a href="…">Bluesky</a></li>{/snippet}
  {#snippet primaryUnit()}<a href="…">Primary Unit</a>{/snippet}
  {#snippet actions()}<a href="/give">Give</a>{/snippet}
  <nav class="ilw-footer-menu" aria-labelledby="menu-1">…</nav>
</Footer>
```

- **Campus content.** The campus sections and the privacy, copyright and
  accessibility links come from `campusFooter` in `ilw-ui/core`, a copy of
  `https://api.brand.illinois.edu/footer` (Brand owns it; that API is the
  source of truth). `<ilw-footer>` fetches it on every page view; ilw-ui ships
  it, so the footer works without script, network or a `connect-src`
  exception. `mise run vendor:footer` refreshes the copy; review the diff
  (a weekly job does it too: see [Following upstream](#following-upstream)).
  If Brand changes the content before ilw-ui catches up, pass your own
  `CampusFooterData` as `campus` (it replaces the sections and the privacy,
  copyright and accessibility links).
  Server templates can render the same data: `campusLink(href, source)` adds
  the toolkit's UTM parameters (`source` defaults to `Illinois_App`).
- **Cookies.** `<ilw-footer>` injects the OneTrust script and its "About
  Cookies" button. ilw-ui can't (no script; consumers run a same-origin CSP).
  A site that needs the consent banner loads OneTrust itself and renders the
  button (`cookiesButton` in Svelte); OneTrust binds to
  `.ot-sdk-show-settings`.
- The site name and the slots are snippets, as the toolkit's slots are; the
  social snippet gives the `<li>`s, and the component writes the `nav` and
  `ul`.
- Phone links: the toolkit's README asks for an `aria-label` naming the
  destination. If you add one, start it with the visible number (WCAG 2.5.3,
  axe `label-content-name-mismatch`), or put the destination in the text.
- The footer keeps its brand colours in dark mode, as upstream.
- Differs from `<ilw-footer>`: no runtime fetch or script injection; the legal
  links are a list; the wordmark's name is visually hidden text in the link
  and the SVG is hidden (upstream names both the link and the SVG).

### Breadcrumbs (`Breadcrumbs`)

```html
<nav class="ilw-breadcrumbs" aria-label="Breadcrumbs">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/academics">Academics</a></li>
    <li><span aria-current="page">Degree programs</span></li>
  </ol>
</nav>
```

```svelte
<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Academics', href: '/academics' }]} current="Degree programs" />
```

- The current page is last, unlinked, with `aria-current="page"` (the toolkit
  leaves it as a bare `span`).
- The `>` separators are generated with empty alternative text, so screen
  readers don't read them (the toolkit's are read in some).
- A theme class on the `nav` restyles it (`class="ilw-theme-blue-1"` is the
  toolkit's `theme="blue"`, with orange separators). Props: `label` (default
  "Breadcrumbs"), `width`, `class`.
- `width` (`full`, `auto`, `page`) adds the matching
  [width class](#widths-and-ilw-container) to the `nav`. At `auto` the trail
  keeps the page margin; the toolkit's goes to the edge.

### Page title (`PageTitle`)

```html
<div class="ilw-page-title">  <!-- + ilw-page-title--blue | --orange | --white, ilw-page-title--fade -->
  <img class="ilw-page-title-background" src="…" alt="">
  <div class="ilw-page-title-inner">
    <div class="ilw-page-title-text"><h1>Graduate Programs</h1></div>
  </div>
</div>
```

```svelte
<PageTitle theme="blue" image="/img/quad.jpg">Graduate Programs</PageTitle>
```

- The `<h1>` is the page's heading. The image is decorative (`alt=""`); the
  text sits on a colour plate (85 % over the image, solid with `fade`), as
  upstream.
- Props: `theme` (`'blue' | 'orange' | 'white'`; unset is white on the heading
  colour), `fade`, `image` (URL), `width`, `class`.
- `width="full"` adds `ilw-width-full`: the box spans the page. `auto` and
  `page` both add `ilw-width-auto` (the toolkit treats them alike): the box
  spans the page and the text keeps the page margin.

### Section nav (`SectionNav`)

```html
<nav class="ilw-section-nav" aria-labelledby="ilw-section-nav-label">
  <details class="ilw-section-nav-collapse">  <!-- open: start open at narrow widths -->
    <summary id="ilw-section-nav-label">Pages In This Section<svg aria-hidden="true">…</svg></summary>
    <ul>
      <li><a class="ilw-section-nav--root" href="/programs">Programs of Study</a></li>
      <li class="ilw-section-nav-branch">
        <a href="/programs/ug">Undergraduate Degrees</a>
        <details open>  <!-- open on the current page's ancestors -->
          <summary><span class="ilw-visually-hidden">Subpages of Undergraduate Degrees</span><svg aria-hidden="true">…</svg></summary>
          <ul>
            <li><a href="/programs/ug/pre-vet" aria-current="page">Pre-Veterinary and Medical</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </details>
</nav>
```

```svelte
<SectionNav
  items={[
    { label: 'Programs of Study', href: '/programs' },
    { label: 'Undergraduate Degrees', href: '/programs/ug', children: [
      { label: 'Pre-Veterinary and Medical', href: '/programs/ug/pre-vet', current: true },
    ] },
  ]}
/>
```

- No script: every disclosure is a `<details>`. A branch is a link and, beside
  it, a separate toggle (a `summary` holding only "Subpages of …" and a
  chevron), never a link inside a `summary`. Tab reaches the link, then its
  toggle, then (open) the children; Enter or Space toggles.
- The server opens the current page's branch: `SectionNav` sets `open` on
  every ancestor of the `current` item and `aria-current="page"` on it.
- At 700 px and narrower the list hides behind "Pages In This Section" (the
  outer `details`), as upstream. Wider, that `summary` is hidden and the list
  always shows, open or not, where `::details-content` is supported; elsewhere
  the toggle stays.
- Props: `items` (`SectionNavItem[]`: `{ label, href, current?, children? }`),
  `label` (default "Pages In This Section": the nav's name and the narrow
  toggle's text), `open` (the narrow toggle starts open), `expanded` (every
  branch starts open), `root` (default true: the first item gets
  `ilw-section-nav--root`), `id`, `class`. The toolkit's
  `--ilw-section-nav--*` properties apply.
- Differs from `<ilw-section-nav>`: branches collapse (upstream always shows
  every level and has no branch toggles); the toggles are `summary`s, not
  scripted buttons; no `collapse="true|false"` attribute (no forced or
  prevented collapse) and no full-viewport-width breakout at narrow widths
  (that waits for the A5 width utilities).

### Back to top (`BackToTop`)

```html
<a class="ilw-back-to-top" href="#top">
  <svg aria-hidden="true">…</svg><span class="ilw-visually-hidden">Back to top</span>
</a>
```

```svelte
<Page backToTop>…</Page>      <!-- or <BackToTop target="top" /> last in your own shell -->
```

- A link to the shell (`.ilw-page#top`, `tabindex="-1"`), the shell's last
  child. Following it scrolls up and moves focus to the shell, so the next Tab
  is the skip link, without the toolkit's script. Smooth scrolling unless the
  user prefers reduced motion.
- Fixed at the bottom right (`--ilw-back-to-top--right`/`--bottom`, 40 px), in
  the toolkit's colours (its `--ilw-back-to-top--*` properties apply).
- Where scroll-driven animations exist it fades in over the first screen of
  scrolling; elsewhere, and on a page too short to scroll, it is always shown.
  When focused from the keyboard it is always fully shown. It is never
  `display: none` or `visibility: hidden`, so screen-reader users can reach it.
- Props: `target` (default `top`), `label` (default "Back to top").
- Differs from `<ilw-back-to-top>`: a link, not a button; no stepped scroll;
  focus goes to the shell rather than the first focusable element (the next
  Tab reaches it).

### Dark-mode toggle (`DarkModeToggle`)

The one piece of page chrome that needs script: an optional island that lets
the user override the OS colour scheme. Put the host where the toggle goes
(the header renders it with `darkModeToggle`) and mount it with `mountIslands`:

```html
<span data-ilw-island="dark-mode-toggle"></span>
```

```js
import { DarkModeToggle, mountIslands } from 'ilw-ui/svelte';

mountIslands({ 'dark-mode-toggle': DarkModeToggle });
```

It renders:

```html
<label class="ilw-dark-mode-toggle"><input type="checkbox" role="switch" class="ilw-switch"> Dark mode</label>
```

- **Without script** nothing renders, and the page follows
  `prefers-color-scheme` (see [Themes and dark mode](#themes-and-dark-mode))
  unless the server wrote `html[data-theme]`.
- **State:** on when `<html data-theme="dark">`; off for any other
  `data-theme`; with no `data-theme`, the OS preference. Until the user chooses
  (no `ilw-dark-mode` cookie) and while `<html>` has no `data-theme`, it
  follows changes to `prefers-color-scheme`. Mounting writes nothing.
- **On change** it sets `html.dataset.theme` to `dark` or `light`, writes
  `ilw-dark-mode=<true|false>; path=/; max-age=31536000; SameSite=Lax`, and
  dispatches `ilw-dark-mode-changed` with `{ detail: { enabled } }` on
  `window`. Several toggles on one page stay in step through that event.
- `role="switch"`: screen readers announce "Dark mode, switch, on/off". Space
  toggles it, as any checkbox.
- Props: `label` (default "Dark mode").
- **Styles:** the switch is A7's `input.ilw-switch` (`switch.css`; see
  [`Field`, `RadioGroup` and the form classes](#field-radiogroup-and-the-form-classes));
  `dark-mode-toggle.css` lays out the label. It uses `--ilw-color--control`
  and `--ilw-color--control-text`, so it follows themes and dark mode. In
  forced-colours mode it falls back to a native checkbox.
- Differs from the toolkit header's checkbox: a switch rather than a plain
  checkbox, "Dark mode" in sentence case, it sets `data-theme` itself
  (upstream leaves that to the page), its checked state comes from
  `data-theme` and the OS rather than the cookie alone, and the cookie lasts a
  year (upstream's ends with the browser session). The cookie name, values and
  event are upstream's, so toolkit pages and ilw-ui pages share one
  preference during migration.

**Server contract (no flash of the wrong theme):** the server reads the
`ilw-dark-mode` cookie and writes `<html data-theme="dark">` for `true`,
`data-theme="light"` for `false`, and nothing without the cookie. The island
never sets the attribute at load, so without this the page flashes or ignores
the saved choice. In Django, a context processor:

```python
# myapp/context_processors.py (add to TEMPLATES OPTIONS context_processors)
def ilw_theme(request):
    return {"ilw_theme": {"true": "dark", "false": "light"}.get(request.COOKIES.get("ilw-dark-mode"))}
```

```django
<html lang="en"{% if ilw_theme %} data-theme="{{ ilw_theme }}"{% endif %}>
```

A shared cache in front of such pages must vary on the cookie (`Vary: Cookie`;
in Django, `@vary_on_cookie` or `patch_vary_headers`). A site without dark
styles writes `data-theme="light"` always and leaves the toggle out.

## Components

### `Button` and `.ilw-button`

The toolkit's buttons, from `button.css`: the same classes, so toolkit markup
looks the same with no `toolkit.css`. Server templates use the classes;
Svelte code can use `Button`, which renders that markup.

```html
<a class="ilw-button" href="/apply">Apply now</a>
<button type="button" class="ilw-button ilw-button-large ilw-theme-blue-solid">Save</button>

<!-- disabled -->
<button type="button" class="ilw-button" disabled>Save</button>
<a class="ilw-button" role="link" aria-disabled="true">Apply now</a>

<!-- a row of buttons: ul.ilw-buttons styles its links and buttons and centres
     them; ul.ilw-buttons-left only lays them out, so its items need .ilw-button -->
<ul class="ilw-buttons">
  <li><a href="/apply">Apply</a></li>
  <li><a href="/visit">Visit</a></li>
</ul>
```

| Class                                                                      | Effect                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------- |
| `.ilw-button` on `<a>` or `<button>`                                       | outline button in `--ilw-color--control*`               |
| `.ilw-button-small`, `.ilw-button-large` (on the button or the `ul`)       | sizes; none is medium                                   |
| none, `.ilw-theme-blue`, `.ilw-theme-blue-outline`                         | blue outline                                            |
| `.ilw-theme-blue-1`, `.ilw-theme-blue-solid`                               | solid blue                                              |
| `.ilw-theme-orange`, `.ilw-theme-orange-outline`                           | orange outline                                          |
| `.ilw-theme-orange-1`, `.ilw-theme-orange-solid`                           | solid orange (white on orange: large text only, 3:1)    |
| `.ilw-width-full`                                                          | full width (on a button; on the `ul`, its items grow to fill the row) |

A theme class on an ancestor recolours the outline button too: inside
`[theme=blue]` it is white on blue. Every rule weighs one class, so a page's own
single-class rule overrides it, and prose link styles never do.

```svelte
<script>
  import { Button } from 'ilw-ui/svelte';
</script>

<Button href="/apply">Apply now</Button>
<Button theme="blue-solid" size="large" onclick={save}>Save</Button>
<Button disabled>Save</Button>
```

| Prop       | Type                                                          |                                                          |
| ---------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| `href`     | `string`                                                      | given: renders `<a>`; omitted: `<button type="button">`  |
| `size`     | `'small' \| 'medium' \| 'large'`                              | default `'medium'`                                       |
| `theme`    | `ButtonTheme`: one of the theme names above, without `ilw-theme-` | default none (blue outline)                          |
| `disabled` | `boolean`                                                     | see below                                                |
| `children` | snippet                                                       | the label                                                |

Other attributes and handlers (`onclick`, `type="submit"`, `target`, `class`, …)
pass through to the element.

DOM contract (consumers' tests select on it): exactly the markup above. A
disabled `<button>` gets `disabled`, never `aria-disabled`. A disabled link
loses its `href` (so Tab skips it and clicking does nothing), gets
`role="link"` and `aria-disabled="true"`, and drops `onclick` and `tabindex`.

**Behaviour:** native. Enter activates both forms; Space presses a button and
scrolls the page on a link, as links do. Disabled controls are out of the Tab
order.

**Differs from the toolkit:**

- **Focus** shows on `:focus-visible` (the toolkit uses `:focus`, so a mouse
  click shows it too), and adds a two-tone ring: a 2px band of
  `--ilw-color--focus--background` around the border, then a 2px
  `--ilw-color--focus--text` outline. One of the two reaches 3:1 against every
  theme surface (WCAG 1.4.11), checked by the Focus Rings stories:

  | Surface                    | Light: Blue line / Arches 90 band | Dark: white line / Blue 30 band |
  | -------------------------- | --------------------------------- | ------------------------------- |
  | white palette              | 14.5 / 1.2                        | 17.9 / 1.9                      |
  | gray                       | 13.2 / 1.1                        | 15.3 / 1.6                      |
  | blue                       | 1.0 / 11.7                        | 14.5 / 1.5                      |
  | orange                     | 4.8 / 2.5                         | 3.1 / 3.1                       |
  | Industrial (blue gradient) | 2.1 / 5.6                         | 7.0 / 1.4                       |
  | Harvest (orange gradient)  | 8.0 / 1.5                         | 1.8 / 5.3                       |

- **Disabled links** are styled like disabled buttons; the toolkit has no rule
  for them.
- **The disabled surface** is the white palette's background, so it turns
  dark in dark mode; the toolkit's is always white.
- **Size classes need `.ilw-button`** on a lone button (the toolkit also sizes a
  bare `button.ilw-button-large`).
- **No new-window icon** on `a.ilw-button[target=_blank]` yet.

### `Field`, `RadioGroup` and the form classes

The toolkit's `ilw-input` form styles, from `forms.css` and `switch.css`: the
same class names (`.ilw-input-entry*`, the radio and checkbox variants,
`-compact`, `.ilw-input-alert`, `.ilw-label-required`), so toolkit markup looks
the same once `<ilw-content>` is gone. Server templates write the markup;
Svelte code can use `Field` and `RadioGroup`, which render it and wire up the
ARIA.

```html
<p>Fields marked * are required.</p>

<!-- Text control, select or textarea; ilw-input-entry-compact puts the label in a column beside it -->
<div class="ilw-input-entry">
  <label for="email" class="ilw-label-required">Email</label>
  <input id="email" name="email" type="email" required
         aria-describedby="email-description email-error" aria-invalid="true">
  <p class="ilw-input-description" id="email-description">We only use it to reply.</p>
  <p class="ilw-input-alert" id="email-error">Enter an email address like name@illinois.edu.</p>
</div>

<!-- Checkbox (or -checkbox-compact); a switch adds role="switch" class="ilw-switch" -->
<div class="ilw-input-entry-checkbox">
  <label for="notify">Email me updates</label>
  <input id="notify" name="notify" type="checkbox">
</div>

<!-- Radio group: -radio stacks, -radio-vertical flows across; each has a -compact form.
     role="radiogroup" keeps the legend as its name and allows aria-invalid (a plain group doesn't). -->
<fieldset class="ilw-input-entry-radio" id="term" role="radiogroup"
          aria-describedby="term-description term-error" aria-invalid="true">
  <legend class="ilw-label-required">Term</legend>
  <input type="radio" id="term-0" name="term" value="fa" required><label for="term-0">Fall</label>
  <input type="radio" id="term-1" name="term" value="sp" required><label for="term-1">Spring</label>
  <p class="ilw-input-description" id="term-description">The term you will teach.</p>
  <p class="ilw-input-alert" id="term-error">Choose a term.</p>
</fieldset>

<!-- A bordered group, upstream's disclaimer box, and a form-level message -->
<fieldset class="ilw-fieldset"><legend>Contact</legend>…</fieldset>
<div class="ilw-input-disclaimer"><input type="checkbox" id="agree"><label for="agree">…</label></div>
<p class="ilw-input-alert" role="alert">2 fields need attention.</p>
```

- **Wiring:** the control lists its help text, then its error, in
  `aria-describedby` (only ids that exist). `aria-invalid="true"` is there only
  while an error message is shown, never just because a constraint fails.
- **Required:** use the native `required`; screen readers announce
  "required" from it. `.ilw-label-required` on the label adds a "*" whose
  alternative text is empty (`content: "*" / ""`), so it isn't read as "star".
  Say once, in text, what the star means. No script adds the class (upstream's
  does): the template, or `Field`, writes it next to `required`.
- **Validation:** native first. Without script the browser blocks the submit
  and shows its own message; `:user-invalid` gets the same ring as
  `aria-invalid`. The error paragraph isn't a live region: after a failed
  submit, move focus to the first invalid field (its description reads the
  error) or to a form-level `.ilw-input-alert` with `role="alert"`.
- **Widths:** `.ilw-input-long` (full width) and `.ilw-input-short` (100 px) on
  the control. Textareas are full width. `--ilw-input-form-label-width`
  (225 px) is the compact label column; `--ilw-input-form-vertical-label-width`
  (125 px) a `-radio-vertical` option's column. Under 800 px the compact forms
  stack.
- Rules apply only inside those classes: a bare `input` elsewhere is left
  alone. Each rule weighs one class.

```svelte
<script>
  import { Field } from 'ilw-ui/svelte';
</script>

<Field label="Email" description="We only use it to reply." error={errors.email} required>
  {#snippet children(attrs)}<input type="email" name="email" {...attrs} />{/snippet}
</Field>
<Field label="Show weekends" variant="checkbox">
  {#snippet children(attrs)}<input type="checkbox" role="switch" class="ilw-switch" {...attrs} />{/snippet}
</Field>
<RadioGroup legend="Term" name="term" bind:value={term} required error={errors.term}
  options={[{ value: 'fa', label: 'Fall' }, { value: 'sp', label: 'Spring' }]} />
```

| Prop            | Type                          |                                                                    |
| --------------- | ----------------------------- | ------------------------------------------------------------------ |
| `label`         | `string \| Snippet`           | the label's content                                                |
| `description`   | `string \| Snippet`           | help text, `p.ilw-input-description`                               |
| `error`         | `string \| Snippet`           | set means invalid: `p.ilw-input-alert` and `aria-invalid="true"`   |
| `required`      | `boolean`                     | `required` on the control, `.ilw-label-required` on the label      |
| `compact`       | `boolean`                     | the `-compact` entry                                               |
| `variant`       | `'entry' \| 'checkbox'`       | default `'entry'`; `'checkbox'` for a checkbox or switch           |
| `id`            | `string`                      | the control's id; default `nextId('ilw-field')`                    |
| `descriptionId`, `errorId` | `string`           | default `<id>-description`, `<id>-error`                           |
| `class`         | `string`                      | more classes on the entry                                          |
| `children`      | `Snippet<[FieldAttrs]>`       | the control; spread `attrs` on it                                  |

`attrs` (`FieldAttrs`) is `{ id, required, 'aria-describedby', 'aria-invalid' }`,
with `undefined` for what doesn't apply, so spreading it adds nothing extra.
DOM contract: exactly the entry markup above (label, control, description,
error, in that order).

`RadioGroup` renders the radio-group markup above: `fieldset[role=radiogroup]`
with the legend, then each option as `input#<id>-<i>` + `label`, then the help
text and error. `aria-invalid` isn't allowed on a plain `group` or on a
`radio`, so the fieldset takes `role="radiogroup"` (still named by its legend)
and carries `aria-invalid` and `aria-describedby`; each radio gets the native
`required`.

| Prop            | Type                          |                                                                    |
| --------------- | ----------------------------- | ------------------------------------------------------------------ |
| `legend`        | `string \| Snippet`           | the group's name                                                   |
| `name`          | `string`                      | the radios' `name`                                                 |
| `options`       | `RadioOption[]`               | `{ value, label, disabled? }`                                      |
| `value`         | `string` (bindable)           | the checked option's value; undefined for none                     |
| `onchange`      | `(value: string) => void`     | called when the user picks an option                               |
| `description`, `error`, `required`, `compact`, `class` | | as `Field`, on the group                              |
| `layout`        | `'stacked' \| 'across'`       | default `'stacked'`; `'across'` is upstream's `-radio-vertical`    |
| `id`            | `string`                      | the fieldset's id; default `nextId('ilw-radio-group')`             |
| `descriptionId`, `errorId` | `string`           | default `<id>-description`, `<id>-error`                           |

**Switch:** `input.ilw-switch` with `role="switch"` replaces
`.ilw-toggle-slider`. The input itself is the track (no wrapper or painted
spans): off is the control surface with a control-text border and thumb, on is
filled with control text, each 3:1 against the surface. Space toggles it, as
any checkbox; it announces "switch, on/off". The dark-mode toggle uses it.

**Behaviour:** native. In a radio group, Tab enters on the checked option (the
first when none is), arrow keys move and check, skipping disabled options
(Chromium wraps at the ends, WebKit doesn't), and Tab leaves the group.

**Differs from the toolkit:**

- Rules hang off the entry classes, not `<ilw-content>`.
- The field is the theme's control surface, not a fixed white: dark in dark
  mode, filled on the blue themes.
- Errors are `--ilw-color--link-hover` (Altgeld on light surfaces, orange in
  dark mode and on blue), not `#D40C0C` (not a brand colour, unreadable on the
  coloured themes), and an invalid control gets a second 1 px ring, so the
  error isn't colour alone.
- Help text is `.ilw-input-description` (a bare `<p>` still gets its look) and
  is connected to the control; in the compact forms it sits under the control,
  not under the label.
- Radio groups are `<fieldset role="radiogroup">` + `<legend>`, so the title
  names the group and the group can be marked invalid (upstream: a `<div>` and
  a `<p>`; that markup still lays out). An invalid group's radios get a ring.
- The required marker is silent to screen readers, and no script adds it.
- The select chevron is drawn with gradients in the link-hover colour, not a
  `data:` SVG (no `img-src data:` needed under a strict CSP).
- Long fields and textareas are `width: 100%` including their border (upstream's
  overflow by 2 px).
- The switch has no visible "On"/"Off" text; its thumb and fill show the
  state, and it has its own focus ring.
- Checkboxes and radios show focus on `:focus-visible`, and fall back to native
  controls in forced-colours mode.
- Not carried over: `input[type=submit].ilw-button` (use a `<button
  class="ilw-button">`) and the `button[aria-pressed]` toggle-button script.

### `ChoiceChips` and `.ilw-chips`

Choice chips, which the toolkit doesn't have: native radios (pick one) or
checkboxes (pick any) in a `fieldset` with a `legend`, each wrapped in a label
drawn as a pill, from `chips.css`. No script: the inputs stay real form
controls, so the keyboard, screen-reader output and form submission are
native. Server templates write the markup; Svelte code can use `ChoiceChips`.

```html
<h2>Filter applicants</h2>
<p>Fields marked * are required.</p>

<!-- Pick one: radios. role="radiogroup" keeps the legend as its name and allows aria-invalid. -->
<fieldset class="ilw-chips" id="country" role="radiogroup"
          aria-describedby="country-description country-error" aria-invalid="true">
  <legend class="ilw-label-required">Country</legend>
  <label class="ilw-chip"><input type="radio" name="country" value="us" required>United States</label>
  <label class="ilw-chip"><input type="radio" name="country" value="ca" required>Canada</label>
  <label class="ilw-chip"><input type="radio" name="country" value="kr" required disabled>South Korea</label>
  <p class="ilw-input-description" id="country-description">Applicants are counted by home country.</p>
  <p class="ilw-input-alert" id="country-error">Choose a country.</p>
</fieldset>

<!-- Pick any: checkboxes. A plain group can't take aria-invalid, so each checkbox does. -->
<fieldset class="ilw-chips" id="schemas" aria-describedby="schemas-description">
  <legend>Tables to export</legend>
  <label class="ilw-chip"><input type="checkbox" name="schemas" value="course" checked>Courses</label>
  <label class="ilw-chip"><input type="checkbox" name="schemas" value="section">Sections</label>
  <p class="ilw-input-description" id="schemas-description">Each table is a separate CSV file.</p>
</fieldset>
```

- **Wiring** follows `RadioGroup`: the fieldset lists its help text, then its
  error, in `aria-describedby`; `aria-invalid="true"` only while an error is
  shown, on the `radiogroup` or on each checkbox. Each input's name is its
  label's text.
- **Required:** native `required` on each radio, and `.ilw-label-required` on
  the legend. A checkbox group has no native "at least one": the legend gets
  the marker and the app validates.
- **States are never colour alone.** The input stays visible as the chip's
  indicator (a circle for a radio, a square for a checkbox) and fills with a
  dot or a tick when checked; the checked chip also inverts to the control
  text colour, as the switch does. Focus is a 3 px ring around the chip; an
  invalid group's chips get a 2 px ring. Colours are `--ilw-color--control*`,
  `--ilw-color--focus--*` and `--ilw-color--link-hover`, so themes and dark
  mode follow. The label type is the button's (700, 19 px): large text, so the
  orange theme's white on orange still passes. A disabled chip is dimmed.
- **Focus ring:** radios ring on `:focus`, checkboxes on `:focus-visible`:
  WebKit stops matching `:focus-visible` once an arrow key moves focus within
  a radio group. So in Chromium a clicked radio chip shows the ring too.
- **Forced colours:** the native input comes back inside the chip's border.
- **Behaviour:** native. Radios are one tab stop (the checked chip, the first
  when none is); arrow keys move and check, skipping disabled chips (Chromium
  wraps at the ends, WebKit doesn't). Each checkbox is a tab stop; Space
  toggles it.

```svelte
<script>
  import { ChoiceChips } from 'ilw-ui/svelte';
  let country = $state();
  let schemas = $state(['course']);
</script>

<ChoiceChips legend="Country" name="country" bind:value={country} required error={errors.country}
  options={[{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }]} />
<ChoiceChips legend="Tables to export" name="schemas" multiple bind:value={schemas}
  options={[{ value: 'course', label: 'Courses' }, { value: 'section', label: 'Sections' }]} />
```

DOM contract: exactly the markup above: `fieldset.ilw-chips` (with
`role="radiogroup"` unless `multiple`) holding the `legend`, then one
`label.ilw-chip > input` per option (the label's text after the input, no ids),
then `p.ilw-input-description` and `p.ilw-input-alert`.

| Prop            | Type                          |                                                                    |
| --------------- | ----------------------------- | ------------------------------------------------------------------ |
| `legend`        | `string \| Snippet`           | the group's name                                                   |
| `name`          | `string`                      | the inputs' `name`                                                 |
| `options`       | `ChipOption[]`                | `{ value, label, disabled? }`                                      |
| `multiple`      | `boolean`                     | checkboxes instead of radios                                       |
| `value`         | `string \| string[]` (bindable) | the checked value (radios; undefined for none) or values (checkboxes) |
| `onchange`      | `(value: string \| string[]) => void` | called with the new value when the user changes it          |
| `description`, `error`, `class` | | as `RadioGroup`                                                                      |
| `required`      | `boolean`                     | the legend's marker; native `required` on radios only              |
| `id`            | `string`                      | the fieldset's id; default `nextId('ilw-chips')`                   |
| `descriptionId`, `errorId` | `string`           | default `<id>-description`, `<id>-error`                           |

### `Icon` and `.ilw-icon`

The replacement for `<ilw-icon>`: a [Phosphor](https://phosphoricons.com) icon
(MIT) as inline SVG. Like the toolkit's icon font, it is 1em and
`currentColor`, so it follows the text's size and colour.

```svelte
<script>
  import { Icon } from 'ilw-ui/svelte';
  import Student from 'phosphor-svelte/lib/Student';
</script>

<a href="/admissions"><Icon icon={Student} /> Admissions</a>
<Icon icon={Student} type="line" alt="Admissions records" />
```

```html
<!-- Decorative -->
<svg class="ilw-icon" aria-hidden="true" viewBox="0 0 256 256" width="1em" height="1em" fill="currentColor">…</svg>
<!-- Labelled -->
<svg class="ilw-icon" role="img" aria-label="Admissions records" viewBox="0 0 256 256" width="1em" height="1em" fill="currentColor">…</svg>

<div class="ilw-icon-row">
  <svg class="ilw-icon" aria-hidden="true" …>…</svg>
  <p>Email the department office.</p>
</div>
```

- Props, as the toolkit's attributes: `icon` (a Phosphor component), `type`
  (`'solid'`, the default, is Phosphor's fill weight; `'line'` is its regular
  weight), `alt`, `size` (a CSS length; unset is 1em), `class`.
- **Import each icon by its own path** (`phosphor-svelte/lib/Calendar`), not
  from `phosphor-svelte`: the package index holds all ~6,000 icon components,
  and your Vite would compile every one of them in dev.
- Without `alt` the icon is decorative: `aria-hidden="true"` and no role.
  With `alt` it is `role="img"` named by `alt`. Phosphor's own components set
  `role="img"` with no name, which axe flags; `Icon` replaces it.
- Server templates: paste the SVG for the icon's weight from
  [`@phosphor-icons/core`](https://github.com/phosphor-icons/core) with the
  `ilw-icon` class, as above.
- **Toolkit names:** the **Parity/Icon** story maps every name in the
  toolkit's font to a Phosphor icon (`stories/parity/icons.ts`). Most match
  closely. Phosphor has no Bluesky, Substack, Weibo, Yelp or Flickr logo, and
  no campus glyphs (admissions, alumni, donor, program of study, …); those map
  to the nearest idea, so check them by eye. Google+ maps to the Google logo.
- `.ilw-icon-row`'s `align-items` default is `flex-start`; upstream's is
  `top`, which isn't a value, so its rows stretch.

### `SortableTh`

A sortable column heading: a `<th>` holding a button.

| Prop     | Type                            |                                 |
| -------- | ------------------------------- | ------------------------------- |
| `key`    | `string`                        | Column key, also `data-sort`    |
| `label`  | `string`                        | Visible heading text            |
| `sort`   | `{ key: string, dir: 1 \| -1 }` | The table's current sort        |
| `onsort` | `(key: string) => void`         | Called on click / Enter / Space |

Use `nextSort(sort, key)` from `ilw-ui/core` in `onsort`: the same key flips the
direction, another key starts ascending.

```svelte
<SortableTh key="name" label="Name" {sort} onsort={(k) => (sort = nextSort(sort, k))} />
```

DOM contract (consumers' tests select on it). The heading sits in a
`<table class="ilw-table">` (or any table in `.ilw-format`), which colours it:

```html
<th scope="col" aria-sort="ascending">
  <button type="button" class="th-sort on" data-sort="name">Name<span aria-hidden="true">&nbsp;↑</span></button>
</th>
```

`aria-sort` and class `on` appear only on the sorted column; the arrow (`↑`
ascending, `↓` descending, after a non-breaking space) only there too. Focus
stays on the button after sorting.

### `openModal`, `alert`, `confirm`, `Modal` and `.ilw-modal`

The replacement for `<ilw-modal>`: a native `<dialog>` opened with
`showModal()`, styled by `modal.css` to look like the toolkit's. Each call
mounts a fresh modal on `document.body` and removes it once closed.

```js
const choice = await openModal({
  title: 'Unsaved changes',       // optional; the <h2> that names the dialog
  message: 'Save before leaving?', // plain text, rendered as a <p>: the dialog's description
  // or body: someSnippet,         // a Svelte snippet for rich content
  // label: 'Preferences',         // the name when there is no title or message
  buttons: [                       // default: [{ label: 'Got it', value: true }]
    { label: 'Discard', value: 'discard' },
    { label: 'Keep editing', value: 'keep', autofocus: true },
    { label: 'Save', value: 'save' },
  ],
  size: 'small',                   // 'small' | 'medium' | 'large' | 'full'; default 'small'
  returnFocusEl: someButton,       // default: what had focus at open
});
// 'discard' | 'keep' | 'save', or null if dismissed (Escape, ×, backdrop)

await alert({ title: 'Saved', message: 'Your preferences were saved.' });
const ok = await confirm({ title: 'Delete?', message: 'This cannot be undone.', confirmLabel: 'Delete' });
// true only for the confirm button; Cancel takes focus so a stray Enter never confirms
```

DOM contract (`openModal` ids are `app-modal-N`):

```html
<dialog id="app-modal-1" class="ilw-modal ilw-modal--small" aria-labelledby="app-modal-1-title"
        aria-describedby="app-modal-1-message" open>
  <h2 class="ilw-modal-title" id="app-modal-1-title">Delete?</h2>
  <div class="ilw-modal-body"><p id="app-modal-1-message">This cannot be undone.</p></div>
  <form method="dialog" class="ilw-modal-buttons">
    <button class="ilw-button" value="0" autofocus>Cancel</button>
    <button class="ilw-button" value="1">Delete</button>
  </form>
  <button type="button" class="ilw-modal-close" aria-label="Close"><svg aria-hidden="true" …>…</svg></button>
</dialog>
```

Select an open one with `dialog.ilw-modal[open]` or by role
(`getByRole('dialog', { name })`).

- **Naming:** `aria-labelledby` the title. Without a title, the message names
  the dialog instead; without either, `label` (default `'Dialog'`).
  `aria-describedby` points at the message only when there is also a title. A
  snippet body is never the description, so its controls aren't read twice.
- **Focus:** on open, the first `[autofocus]` element (a button's `autofocus`,
  or one in the body), else the first focusable element. Tab and Shift+Tab
  wrap inside the dialog, over the elements present at each key press, so
  content added while it is open is in the cycle. The × button is last. On
  close, focus goes to `returnFocusEl`.
- **The page behind** is inert while it is open (`showModal()`), and it doesn't
  scroll (`html:has(.ilw-modal:modal)`).
- **Closing:** a choice button submits the `method="dialog"` form, so
  `returnValue` is its index. Escape, × and a click on the backdrop leave it
  empty: dismissed. A drag that starts inside the dialog and ends on the
  backdrop doesn't close it.

`Modal` (the component `openModal` mounts) is exported too. It takes `id`
(default `ilw-modal-N`), `title`, `label`, `size`, `body`/`message`, `buttons`
and `onclose(reason: 'button' | 'dismiss', value)`, and opens on mount.
Unmounting it while open removes it without calling `onclose`.

**Without Svelte:** write the markup above (without `open`) in a server
template and open it with `dialog.showModal()` or an invoker button,
`<button commandfor="m" command="show-modal">`; `command="close"` on the ×
button closes it. The form buttons, Escape and the page's inertness work
without any script. Backdrop clicks and Tab wrapping (the browser lets Tab
reach its own toolbar) need `Modal`.

**Differences from `<ilw-modal>`:**

- It fires `close`, honours `autofocus` anywhere inside, lets clicks
  propagate, keeps the native `id`, and tracks the Tab cycle live: the gaps in
  [docs/upstream-issues/ilw-modal.md](docs/upstream-issues/ilw-modal.md).
- Initial focus goes to a control (APG), not the dialog box.
- The title is `--ilw-color--heading` (Illinois blue in the default theme).
  Upstream names `---ilw-color--heading` (three dashes), so its title takes
  the inherited text colour.
- Above 600px, small and medium never drop under 20rem. Below 600px every size
  is full width, as upstream.
- The × button is named "Close", not "Close modal", and its focus style is on
  `:focus-visible`, with the `.ilw-button` ring.
- Not carried over: the `image` slot and `align="center"` (with C8
  `ImageGallery`), and `data-modal-target` triggers (use invoker commands).

**Migrating from the `<ilw-modal>` wrapper:** `ilw-modal[open]` becomes
`dialog.ilw-modal[open]`; `.modal-buttons` becomes `.ilw-modal-buttons` (a
`<form>`, with `.ilw-modal-body` before it); `h2[slot=title]` becomes
`h2.ilw-modal-title`; the × button's name is "Close". The page no longer has
`inert` set on `<body>`'s children: check inertness with `dialog:modal`.

### `Combobox`

A single-select filtering combobox on the [Zag](https://zagjs.com/) combobox
machine: a text input that filters a listbox of options, for picking one of many
(people, courses). Free text that matches nothing stays in the input.

```svelte
<label id="fac-label" for="fac-cb">Faculty</label>
<Combobox id="fac-cb" labelId="fac-label" {items} {value} onchange={(v) => (value = v)} />
```

| Prop                              | Type                    | Default       |                                                                     |
| --------------------------------- | ----------------------- | ------------- | ------------------------------------------------------------------- |
| `id`                              | `string`                | required      | The input's id                                                      |
| `popupId`                         | `string`                | `${id}-popup` | The listbox's id                                                    |
| `items`                           | `ComboboxItem[]`        | `[]`          | `{ value, label, search?, group? }`; `search` defaults to `label`. With `source`, the known items (labels a preselected value) |
| `source`                          | `AsyncSource`           |               | `(query, signal) => Promise<ComboboxItem[]>`: searches in place of filtering `items` (see [Async sources](#async-sources)) |
| `debounce`                        | `number`                | `250`         | With `source`: ms after the last keystroke before searching         |
| `loadingText`, `errorText`        | `string`                | `Loading…`, `Couldn't load results` | With `source`: the list's row and status message      |
| `value`                           | `string \| null`        | `null`        | The selection (controlled: update it in `onchange`)                 |
| `name`                            | `string`                |               | Adds `<input type="hidden" name value>` with the selection (`''` when none) |
| `onchange`                        | `(value, item) => void` | required      | On each commit; `value`/`item` are `null` when text matches nothing |
| `labelId`                         | `string`                |               | The `<label>`'s id; also labels the listbox                         |
| `placeholder`                     | `string`                | `''`          | Also the listbox's `aria-label` when there is no `labelId`          |
| `minChars`                        | `number`                | `2`           | Typing opens the list at this length                                |
| `max`                             | `number`                | `200`         | Options shown before the "…N more" row                              |
| `block`                           | `boolean`               | `false`       | Adds `cb-block` (full-width)                                        |
| `disabled`, `invalid`, `required` | `boolean`               | `false`       |                                                                     |

Matching (`filterItems` in `ilw-ui/core`) is a trimmed, case-insensitive
substring search over each item's `search` text. Groups keep first-seen order.
On blur (`blurMatch`), the combobox commits an exact label or value match, else
the only match, else `null`. Switching windows or tabs isn't a blur: the input
keeps focus, so nothing is committed and the list stays as it was.

The text input has no `name` (Zag would submit the label text). With `name`,
a hidden input inside the root carries the selected value for a plain form
POST; without it, keep the value in your own field (ta-manager keeps a hidden
`<select>`).

Keyboard:

| Key                 | Action                                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Typing              | Filters; opens the list at `minChars` characters, closes it below. A lone match is highlighted.                       |
| ArrowDown / ArrowUp | Open the list (on the current text, or every item when the text is the selection), then move the highlight, wrapping. |
| Alt+ArrowDown       | Opens the list without highlighting.                                                                                  |
| Enter               | Commits the highlighted option and closes. With nothing highlighted, does nothing (the form isn't submitted).         |
| Escape              | Closes; focus stays in the input.                                                                                     |
| Tab / blur          | Commits an exact label/value match or the only match; otherwise the text stays and the value becomes `null`.          |

These differ from the APG combobox pattern, following Zag:

- While the list is open, Home and End move the highlight, not the caret.
- Keys with Ctrl or Shift held are ignored.
- Tab doesn't accept the highlighted option; only the blur match applies.
- With the list closed, Enter is the input's own: it submits a surrounding form.

DOM contract (consumers' tests select on it):

```html
<span class="combobox" data-scope="combobox" data-part="root">
  <input id="fac-cb" class="combobox-input" role="combobox" aria-autocomplete="list"
         aria-expanded="true" aria-controls="fac-cb-popup"
         aria-activedescendant="fac-cb-popup-opt-aadams" autocomplete="off" />
  <div id="fac-cb-popup" class="combobox-popup" role="listbox" aria-labelledby="fac-label">
    <div id="fac-cb-popup-group-Faculty" role="group" aria-labelledby="fac-cb-popup-group-Faculty-label">
      <div id="fac-cb-popup-group-Faculty-label" class="combobox-group-label" role="presentation">Faculty</div>
      <div id="fac-cb-popup-opt-aadams" role="option" data-value="aadams" data-highlighted>Avery Adams</div>
    </div>
    <div class="combobox-more" role="option" aria-disabled="true" aria-selected="false">…12 more — keep typing to narrow</div>
  </div>
</span>
```

- With `block`, the root's class is `combobox cb-block`.
- The listbox is `hidden` while closed.
- Option ids are `${popupId}-opt-${encodeURIComponent(value)}`.
- Only the selected option has `aria-selected="true"`.
- `aria-activedescendant` is set only while the list is open and the highlighted option is rendered.
- With no matches, the list shows a disabled `.combobox-empty` "No matches" row in place of the "more" row.
- The popup is placed with CSS, with no inline `style`, so it runs under `style-src-attr 'none'`.
- While the list is open on macOS and iOS, Zag adds a visually hidden `span[role=alert][data-live-announcer]` that re-announces the highlight for VoiceOver. Zag appends it to `<body>`; the component moves it into its root `span`, so it stays inside the page's landmarks and outside `inert` (see Known issues).
- With `name`, the root ends with `<input type="hidden" name="…" value="aadams">`.
- With `source`, the root also holds `<span class="ilw-visually-hidden" role="status">` (see [Async sources](#async-sources)), and the list shows a disabled `.combobox-loading` row while a search runs and a `.combobox-error` row when it fails, each in place of the options. Without `source` neither is rendered.

### `Autocomplete`

A free-text input with suggestions, on the same Zag combobox machine: the text
is the value, and choosing a suggestion writes its text into the input. Use it
where any text is allowed (a professor's name, a course number) and the list
only helps; use `Combobox` to pick one of a fixed set.

```svelte
<label id="prof-label" for="prof">Professor</label>
<Autocomplete id="prof" labelId="prof-label" {items} bind:value onselect={(item) => (netid = item.value)} />
```

| Prop                              | Type                   | Default       |                                                                              |
| --------------------------------- | ---------------------- | ------------- | ---------------------------------------------------------------------------- |
| `id`                              | `string`               | required      | The input's id                                                               |
| `popupId`                         | `string`               | `${id}-popup` | The listbox's id                                                             |
| `items`                           | `AutocompleteItem[]`   | `[]`          | `{ value, label, text?, search? }`: `label` is listed, `text` is written     |
| `source`                          | `AsyncSource`          |               | `(query, signal) => Promise<AutocompleteItem[]>` in place of `items` ([Async sources](#async-sources)) |
| `debounce`                        | `number`               | `250`         | With `source`: ms after the last keystroke before searching                  |
| `loadingText`, `errorText`        | `string`               | `Loading…`, `Couldn't load suggestions` | With `source`: the list's row and status message      |
| `value`                           | `string`               | `''`          | The input's text (`bind:value`)                                              |
| `oninput`                         | `(text) => void`       |               | On each keystroke                                                            |
| `onselect`                        | `(item) => void`       |               | When a suggestion is chosen, after its `text` (or `label`) is written        |
| `labelId`                         | `string`               |               | The `<label>`'s id; also labels the listbox                                  |
| `placeholder`                     | `string`               | `''`          | Also the listbox's `aria-label` when there is no `labelId`                   |
| `minChars`                        | `number`               | `1`           | Typing opens the list at this length                                         |
| `max`                             | `number`               | `10`          | Suggestions shown at most                                                    |
| `emptyText`                       | `string`               |               | Shown as a disabled option when nothing matches; without it the list closes  |
| `block`                           | `boolean`              | `false`       | Adds `ac-block` (full-width)                                                 |
| `disabled`, `invalid`, `required` | `boolean`              | `false`       |                                                                              |
| `class`, other input attributes   |                        |               | Added to the input (`name`, `size`, `data-*`, `onchange`, …)                 |

Matching is `filterItems`: a trimmed, case-insensitive substring search over
each item's `search` text (or `label`), in item order.

Keyboard:

| Key                 | Action                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Typing              | Filters; opens the list at `minChars` characters. Nothing is highlighted, so the text stays. |
| ArrowDown / ArrowUp | Open the list on the current text, then move the highlight, wrapping.                     |
| Enter               | Writes the highlighted suggestion and closes. With nothing highlighted, it is the input's own (submits a form). |
| Escape              | Closes; focus and the text stay.                                                          |
| Tab / blur          | Writes the highlighted suggestion, if any, and moves on. Otherwise the text stays.         |
| Window switch       | Nothing: the input keeps focus, so the list, highlight and text stay as they were.        |

DOM contract:

```html
<span class="autocomplete" data-scope="combobox" data-part="root">
  <input id="prof" class="autocomplete-input" role="combobox" aria-autocomplete="list"
         aria-expanded="true" aria-controls="prof-popup"
         aria-activedescendant="prof-popup-opt-aadams" autocomplete="off" />
  <div id="prof-popup" class="autocomplete-popup" role="listbox" aria-labelledby="prof-label">
    <div id="prof-popup-opt-aadams" role="option" data-value="aadams" data-highlighted>A. Adams — Avery Adams (aadams)</div>
  </div>
</span>
```

- With `block`, the root's class is `autocomplete ac-block`; `class` is added after `autocomplete-input`.
- The listbox is `hidden` while closed. Option ids are `${popupId}-opt-${encodeURIComponent(value)}`.
- No option is ever `aria-selected`: the text, not a selection, is the value.
- Choosing a suggestion fires a bubbling `change` on the input, after its text is written, as a native input would on a new value. (Blurring after typing fires the input's own `change` as usual.)
- With `emptyText` and no matches, the list shows one disabled `.autocomplete-empty` option.
- `aria-activedescendant`, the caret and Zag's VoiceOver live region behave as in `Combobox`.
- With `source`: a `role="status"` span in the root and `.autocomplete-loading` / `.autocomplete-error` rows, as in `Combobox`. While a search runs the list is open on "Loading…"; a search with no results shows `emptyText`, or closes the list without it.

### `MultiCombobox`

A multi-select `Combobox` (E3): chosen options become removable tokens above the
input, and `name` adds one hidden input per value, so a plain form POST sends
`mentors=aadams&mentors=cclark` (Django's `getlist`; the replacement for
Select2's `ModelSelect2Multiple`). A component of its own, so `Combobox` keeps
its single-value API and markup.

```svelte
<label id="mentors-label" for="mentors-cb">Faculty mentors</label>
<MultiCombobox id="mentors-cb" labelId="mentors-label" name="mentors" {source} items={initial}
               {value} onchange={(v) => (value = v)} required />
```

| Prop                              | Type                      | Default       |                                                                   |
| --------------------------------- | ------------------------- | ------------- | ----------------------------------------------------------------- |
| `id`, `popupId`, `labelId`        | `string`                  |               | As in `Combobox`; `labelId` also names the tokens list            |
| `items`, `source`, `debounce`     |                           |               | As in `Combobox` (`items` labels the preselected values with `source`) |
| `value`                           | `string[]`                | `[]`          | The selection, in the order chosen (controlled)                   |
| `onchange`                        | `(values, items) => void` | required      | On each add or removal                                            |
| `name`                            | `string`                  |               | One `<input type="hidden" name value>` per selected value         |
| `required`                        | `boolean`                 | `false`       | Blocks submit with nothing selected (`requiredText` is the message) |
| `requiredText`                    | `string`                  | `Select at least one option.` |                                                   |
| `removeLabel`                     | `(label) => string`       | `Remove ${label}` | The remove buttons' accessible names                          |
| `placeholder`, `minChars`, `max`, `block`, `disabled`, `invalid`, `loadingText`, `errorText` | | | As in `Combobox` |

Choosing an option adds it (choosing a selected one removes it); the text clears
and the list closes, with focus left in the input. Typed text is never added on
blur. The status region announces "Added …" and "Removed …".

Keyboard (the input's keys are `Combobox`'s, except as noted):

| Key                         | Where       | Action                                                                                   |
| --------------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| Enter                       | input       | Adds (or removes) the highlighted option; with nothing highlighted, does nothing          |
| Backspace                   | empty input | Focuses the last token's remove button (removes nothing)                                 |
| Tab / Shift+Tab             | anywhere    | The remove buttons are in the tab order, before the input                                |
| Enter, Space, Backspace, Delete | token   | Removes it; focus goes to the next token, else the previous one, else the input           |
| ArrowLeft / ArrowRight      | token       | Previous / next token; ArrowRight on the last returns to the input                       |

DOM contract:

```html
<span class="combobox combobox-multi" data-scope="combobox" data-part="root">
  <ul class="combobox-tokens" aria-labelledby="mentors-label">
    <li class="combobox-token" data-value="aadams">
      <span class="combobox-token-label">Avery Adams</span>
      <button type="button" class="combobox-token-remove" aria-label="Remove Avery Adams"><span aria-hidden="true">×</span></button>
    </li>
  </ul>
  <input id="mentors-cb" class="combobox-input" role="combobox" aria-required="true" … />
  <div id="mentors-cb-popup" class="combobox-popup" role="listbox" aria-multiselectable="true" aria-labelledby="mentors-label">…</div>
  <span class="ilw-visually-hidden" role="status">Added Avery Adams</span>
  <input type="hidden" name="mentors" value="aadams" />
</span>
```

- The tokens list is rendered only while something is selected. With `block`, the root is `combobox combobox-multi cb-block`.
- The listbox, options, groups, "more"/"No matches"/loading/error rows and option ids are `Combobox`'s; every selected option has `aria-selected="true"`.
- The text input never has `name` or `required`: `required` sets `aria-required` and a custom validity message (`setCustomValidity`) while nothing is selected.
- With `disabled`, the remove buttons are disabled too.

### Async sources

`Combobox`, `MultiCombobox` and `Autocomplete` take a `source` in place of
`items`: a function from the typed text to a promise of items. The server does
the matching; the component shows what comes back, capped at `max`.

```ts
import type { AsyncSource } from 'ilw-ui/svelte';

const source: AsyncSource<ComboboxItem> = async (query, signal) => {
  const response = await fetch(`/people/search?q=${encodeURIComponent(query)}`, { signal });
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
};
```

- Typing searches `debounce` ms (250) after the last keystroke, once the text reaches `minChars`; below it the search is cancelled and the list closes. ArrowDown/ArrowUp on a closed list search at once (with the text as it stands, `''` included) and highlight the first/last result when it arrives.
- Each new search aborts the one before it through its `AbortSignal` (pass it to `fetch`). An answer for an aborted search is dropped even if the source ignored the signal. Leaving the field aborts too.
- While a search runs the list shows a disabled "Loading…" row; a rejected promise shows the error row. Typing again retries.
- A visually hidden `role="status"` inside the component's root says "Loading…", "N results", the empty text or the error, so screen readers hear the outcome of a search without leaving the input. It sits in the root (not `<body>`) so it works inside a modal.
- With `Combobox`, a lone result for the typed text is highlighted when it arrives, as with `items`. On blur, the text commits an exact label/value match among the results or known items, else the only result for exactly that text, else `null`.

### `enhanceSelect`, `enhanceSelects`

Progressive enhancement for a server-rendered `<select>`: a `Combobox` is
inserted right after it, and the select stays in the DOM, hidden, as the value
source. Forms submit it, and page code and tests keep reading and setting
`select.value`. Options come from the select's `<option>`s (`data-search` adds
search text; `<optgroup>`s become groups), and are re-read when page code
changes them.

```js
import { enhanceSelect, enhanceSelects } from 'ilw-ui/svelte';
import 'ilw-ui/styles.css';

enhanceSelects(); // every select[data-combobox] in the document not yet enhanced
enhanceSelects(tbody, 'select.pick'); // under a root, with another selector
```

```svelte
<!-- One select a Svelte component renders; the cleanup removes the combobox. -->
<select data-combobox {@attach enhanceSelect}>…</select>
```

`enhanceSelects` also removes the comboboxes of selects that have left the
document, so it is safe to call after every re-render.

Behavior:

- Choosing an option sets `select.value` and fires one bubbling `change` on the select (only when the value changed).
- Text that matches nothing stays in the input; on blur the select's value becomes `''`, without an event.
- When page code sets `select.value` and fires `change`, the input shows the new option at once (unless the input has focus).
- Matching, keyboard and the "…N more" row are `Combobox`'s, with `minChars` 2 and `max` 200.

DOM contract:

```html
<label id="person-label" for="person-cb">Person</label>          <!-- re-pointed; given an id if it has none -->
<select id="person" data-combobox data-comboboxed="1" style="display: none">…</select>
<span class="combobox cb-block" data-scope="combobox" data-part="root">
  <input id="person-cb" class="combobox-input" role="combobox" placeholder="(the empty option's text)" … />
  <div id="person-popup" class="combobox-popup" role="listbox" aria-labelledby="person-label">…</div>
</span>
```

- The input's id is `<select id>-cb` and the listbox's `<select id>-popup`; a select without an id gets `combobox-N`.
- The placeholder is the text of the select's empty-value option (default "Type to search...").
- `data-comboboxed="1"` marks an enhanced select; enhancing it again is a no-op.

### `createDataTable`, `DataTable`, `DataRows`, `TableSortTh`, `Pager`

A client-side table on TanStack Table 9: filter, then sort, then (optionally)
page, using the page's own comparators and predicates. Pages never import
`@tanstack/*`.

```svelte
<script lang="ts">
  import { rowColumn } from 'ilw-ui/core';
  import { createDataTable, DataTable, Pager, setTableFilter, TableSortTh } from 'ilw-ui/svelte';

  let { courses } = $props();
  const table = createDataTable({
    get data() {
      return courses; // a getter, so new data reaches the table
    },
    columns: [
      rowColumn('code', { compare: (a, b) => a.code.localeCompare(b.code), filter: (row, q) => !q || row.code.includes(q) }),
      rowColumn('hours', { compare: (a, b) => a.hours - b.hours }),
    ],
    getRowId: (row) => row.id,
    sorting: [{ id: 'code', desc: false }],
    pageSize: 25, // omit for an unpaged table
  });
</script>

<input type="search" oninput={(e) => setTableFilter(table, 'code', e.currentTarget.value)} />
<Pager {table} emptyLabel="No courses" />
<DataTable {table} class="ilw-table">
  {#snippet header()}<tr><TableSortTh {table} id="code" label="Course" /><TableSortTh {table} id="hours" label="Hours" /></tr>{/snippet}
  {#snippet row(course)}<tr><td>{course.code}</td><td>{course.hours}</td></tr>{/snippet}
  {#snippet empty()}<tr><td colspan="2">No courses.</td></tr>{/snippet}
</DataTable>
```

- **`rowColumn(id, { compare?, filter? })`** (`ilw-ui/core`) builds a column over
  the whole row. `compare` is the ascending `(a, b) => number` comparator:
  TanStack negates it for descending and breaks ties by input order, so ties
  keep the order a stable sort gives them in both directions. `filter` is a
  `(row, value) => boolean` predicate. A filter is removed only when its value
  is `undefined`; `''`, `null` and `false` reach the predicate, which decides.
- **`createDataTable(options)`** returns a `PagedDataTableInstance` with
  `pageSize`, else a `DataTableInstance` without the pagination APIs. One column
  sorts at a time and never goes back to unsorted. Call it while a component
  initialises.
- **The page index is reset explicitly**, not by TanStack (its reset runs
  lazily, during a render). `TableSortTh` goes back to page 1 after a sort, and
  `setTableFilter(table, id, value)` after a filter. If you call TanStack's
  `setFilterValue` yourself, call `table.setPageIndex(0)` too.
- **`DataTable`** renders a native `<table>` (attributes pass through), a
  `<thead>` from `header`, and a `<tbody>` from `row` (keyed by `getRowId`) or
  `empty`. It adds no classes or styles: give it `class="ilw-table"` for the
  [table styles](#tables) (ta-manager's toolkit pages style the same markup
  through `toolkit.css`). **`DataRows`** is just the rows, for a
  `<table>` already in the page's HTML: mount it into the `<tbody>`.
- **`TableSortTh`** (`table`, `id`, `label`) renders a `SortableTh` with the
  same DOM contract, driven by the table's sort: the sorted column flips and
  another column starts ascending. Focus stays on the button, even if the page
  re-renders the header.
- **`Pager`** (`table`, `emptyLabel`, `label?`, `legacy?`, `classes?`,
  `onpage?`) takes a paged table only. A page may render two pagers over one
  table; they stay in step. After paging by keyboard, focus stays on the pressed
  button, or on the current page's button when the pressed one becomes
  disabled. `classes` overrides the class names part by part (`root`, `label`,
  `button`, `current` (added to the current page's button), `ellipsis`,
  `count`) over `ilwPagerClasses`, the `.ilw-pager*` styles in
  `ilw-ui/styles.css`, or over `legacyPagerClasses` with `legacy`.

`pageWindow(page, totalPages)` (`ilw-ui/core`) is the pager's page list: the
first, the last, and two either side of `page`, with `null` for each gap.

**`Pager` DOM contract** (page 1 of 6). The root is a `<nav>` labelled by
`label` (default `"Pages"`; give two pagers distinct labels), the buttons have
`type="button"`, previous and next are named, and the current page has
`aria-current="page"`:

```html
<nav class="ilw-pager" aria-label="Pages">
  <span class="ilw-pager-label">Page:</span>
  <button type="button" class="ilw-pager-btn" data-page="0" disabled aria-label="Previous page">‹</button>
  <button type="button" class="ilw-pager-btn on" data-page="1" aria-current="page">1</button>
  <button type="button" class="ilw-pager-btn" data-page="2">2</button>
  <button type="button" class="ilw-pager-btn" data-page="3">3</button>
  <span class="ilw-pager-ellipsis">…</span>
  <button type="button" class="ilw-pager-btn" data-page="6">6</button>
  <button type="button" class="ilw-pager-btn" data-page="2" aria-label="Next page">›</button>
  <span class="ilw-pager-count">1–25 of 131</span>
</nav>
```

(The real output has no whitespace between elements; it's added here to make
the example readable.)

**`legacy` renders ta-manager's legacy unranked-courses pager instead**, byte
for byte: a `div`, `picker-*` classes, no `type` on the buttons, no ARIA and no
whitespace between elements. It exists for 1:1 ports whose aria snapshots must
not change yet. Consumers should drop it and move to the default markup
(ta-manager: in its Phase 13).

```html
<div class="picker-ctrl-row"><span class="picker-sort-lbl">Page:</span><button class="picker-tog picker-pg-btn" data-page="0" disabled>‹</button><button class="picker-tog picker-pg-btn picker-tog-on" data-page="1">1</button><button class="picker-tog picker-pg-btn" data-page="2">2</button><button class="picker-tog picker-pg-btn" data-page="3">3</button><span class="picker-pg-ellipsis">…</span><button class="picker-tog picker-pg-btn" data-page="6">6</button><button class="picker-tog picker-pg-btn" data-page="2">›</button><span class="picker-count">1–25 of 131</span></div>
```

The count isn't a live region: with two pagers it would be announced twice.
Focus staying on the pressed button is what tells a screen-reader user the page
changed.

### `Pagination` and `.ilw-pagination`

Links to the pages of a server-rendered list, replacing `<ilw-pagination>`.
Each page has its own URL, so a page can be bookmarked and works without
script. For a list paged in the browser, use `Pager` (above).

```svelte
<Pagination page={6} pages={12} url="/courses?term=fa26" />
<!-- 0-based or path-based pages: build the links yourself -->
<Pagination page={6} pages={12} href={(p) => `/courses/page/${p}`} />
```

**DOM contract** (page 6 of 12, `url="?term=fa26"`). Server templates render
the same markup with `pagination.css` and no script:

```html
<nav class="ilw-pagination" aria-label="Pages">
  <ul>
    <li class="ilw-pagination-previous"><a href="?term=fa26&page=5" aria-label="Previous page">Previous</a></li>
    <li><a href="?term=fa26&page=1" aria-label="Page 1">1</a></li>
    <li class="ilw-pagination-ellipsis"><span>…</span></li>
    <li><a href="?term=fa26&page=4" aria-label="Page 4">4</a></li>
    <li><a href="?term=fa26&page=5" aria-label="Page 5">5</a></li>
    <li><a href="?term=fa26&page=6" aria-label="Page 6" aria-current="page">6</a></li>
    <li><a href="?term=fa26&page=7" aria-label="Page 7">7</a></li>
    <li><a href="?term=fa26&page=8" aria-label="Page 8">8</a></li>
    <li class="ilw-pagination-ellipsis"><span>…</span></li>
    <li><a href="?term=fa26&page=12" aria-label="Page 12">12</a></li>
    <li class="ilw-pagination-next"><a href="?term=fa26&page=7" aria-label="Next page">Next</a></li>
  </ul>
  <span class="ilw-pagination-count">Page 6 of 12</span>
</nav>
```

- On the first page Previous is `<span>Previous</span>` instead of a link, and
  on the last page Next is `<span>Next</span>`, so the row doesn't shift.
- The page list is `Pager`'s: `pageWindow(page, pages)`, the first, the last
  and two either side of the current page.
- Props: `page` (1-based, clamped to `1…pages`), `pages`, `url` (default `''`:
  links are just a query, relative to the current page), `parameter` (default
  `"page"`), `href` (a function from the 1-based page to its link; replaces
  `url` and `parameter`), `label` (default `"Pages"`; give two paginations on
  one page distinct labels), `hidePageCount`, `class` (e.g. a theme class).
- `pageHref(url, page, parameter = 'page')` (`ilw-ui/core`) builds each link:
  it sets `parameter` in `url`'s query and keeps the other values and the
  fragment. Server code can do the same.
- Differs from `<ilw-pagination>`: no First and Last links (the first and last
  page numbers are always shown instead); the current page stays a link with
  `aria-current="page"` (the toolkit puts `aria-current` on an unlinked `li`);
  focus is the two-tone ring of `.ilw-button`, not just a colour change; the
  count is after the list, not an item in it. For the toolkit's `zerostart`,
  pass `href={(p) => pageHref(url, p - 1)}`.
- Not yet: the toolkit's `width` and `padding`; they come with the layout
  utilities (A5).

### `mountIslands`

Mounts Svelte components on a server-rendered page (Django and similar), one
island per host element.

```html
<div data-ilw-island="course-picker" data-props='{"term": "fa26"}'></div>

<!-- or Django's json_script: -->
{{ picker_props|json_script:"picker-props" }}
<div data-ilw-island="course-picker" data-props-id="picker-props"></div>
```

```js
import { mountIslands } from 'ilw-ui/svelte';
import CoursePicker from './CoursePicker.svelte';

const unmount = mountIslands({ 'course-picker': CoursePicker }); // root defaults to document
```

- `mountIslands(registry, root?)` finds every `[data-ilw-island]` under `root`
  and calls `mount(registry[name], { target, props })`.
- Props come from `data-props` (a JSON string) or from `data-props-id`, the id
  of a `<script type="application/json">`. Both are parsed with `JSON.parse`
  only and must be a JSON object; no attribute means no props.
- A host with bad JSON, an unknown name or a component that throws while
  mounting is logged with `console.error` (once per element) and skipped. The
  call never throws.
- Mounted hosts get `data-ilw-mounted`. Calling `mountIslands` again (after a
  fragment swap) mounts only hosts without it.
- It returns a function that unmounts what that call mounted and removes
  `data-ilw-mounted`. On `pagehide` it unmounts by itself, unless
  `event.persisted` is true: a page going into the bfcache comes back as it
  was, islands included.

### `announce`

Speaks a short message to screen-reader users without moving focus, through
two shared live regions. Components use it to report changes (copied, row
added, item moved); apps can call it too.

```ts
announce(message: string, opts?: { politeness?: 'polite' | 'assertive' }): void
```

```js
import { announce } from 'ilw-ui/core';

announce('3 results');                                    // waits for the reader to finish
announce('Could not save', { politeness: 'assertive' }); // interrupts
```

- The first call appends two regions to `<body>` and later calls reuse them
  (they are recreated if `<body>` is replaced). Importing the module touches
  no DOM, so it is safe on the server and in islands.
- The region is emptied at once and the text set on the next animation frame,
  so repeating a message announces it again. A second call before that frame
  replaces the first message; polite and assertive messages don't affect each
  other.
- Use `assertive` only for errors the user must hear now.
- The regions are hidden with `.ilw-visually-hidden` from `styles.css`, which
  must be loaded; the class is also available for any screen-reader-only text.

DOM contract:

```html
<div role="status" aria-atomic="true" class="ilw-visually-hidden" data-ilw-announce="polite">3 results</div>
<div role="alert" aria-atomic="true" class="ilw-visually-hidden" data-ilw-announce="assertive"></div>
```

### `CopyButton` and `copyText`

Copies a value, or the text of an element, and says so through
[`announce`](#announce). No toolkit equivalent.

```svelte
<script>
  import { CopyButton } from 'ilw-ui/svelte';
</script>

<!-- An input's value, or an element's text, by id -->
<label for="share-link">Course link</label>
<input id="share-link" readonly value="https://tam.cs.illinois.edu/courses/cs-225/fa26" />
<CopyButton target="share-link" label="Copy link" />

<!-- A literal, icon only (the label is still the button's name) -->
{row.netid} <CopyButton value={row.netid} label="Copy netid of {row.name}" hideLabel size="small" />

<!-- Built when clicked, from the rows as they are then -->
<CopyButton value={() => confirmed.map((r) => r.netid).join(', ')} label="Copy netids of confirmed students" />
```

```js
import { copyText } from 'ilw-ui/core';

// For a button you render yourself: announces "Copied" or the error, resolves true or false.
if (!(await copyText(tsv))) showFallback();
```

- Props: `value` (a string, or a function called on each click) or `target`
  (an element id: an `<input>` or `<textarea>` gives its value, anything else
  its trimmed `textContent`); `label` ("Copy"), `copiedLabel` ("Copied"),
  `failedLabel` ("Copy failed"), `failedMessage` ("Could not copy to the
  clipboard"), `hideLabel`, `resetAfter` (ms, 1500), `oncopy(text)`,
  `onfail()`, `Button`'s `size`, `theme`, `disabled` and `class`, and any
  other `<button>` attribute.
- After a click the icon becomes a check and the label `copiedLabel`, and
  `copiedLabel` is announced in the polite `role="status"` region; after
  `resetAfter` the button goes back. A refusal (permission denied, no
  `navigator.clipboard` on a plain-http page, a `value` function that throws,
  a missing `target`) shows a warning icon and `failedLabel`, and announces
  `failedMessage` in the assertive `role="alert"` region. Focus stays on the
  button throughout.
- The label swap is for sighted users; the announcement is what a screen
  reader hears, since a focused button's changed name is not reliably read.
- `copyText(text, { copied?, failed? })` is the same write and announcement
  without the button. `text` may be a function.
- Needs JavaScript: there is no script-free form. On a server-rendered page,
  mount it as an island.

DOM contract (`data-state` is `idle`, `copied` or `failed`):

```html
<button type="button" class="ilw-button ilw-copy-button" data-state="idle">
  <svg class="ilw-icon" aria-hidden="true" …>…</svg>
  <span class="ilw-copy-button-label">Copy link</span>
</button>

<!-- hideLabel -->
<button type="button" class="ilw-button ilw-button-small ilw-copy-button" data-state="copied">
  <svg class="ilw-icon" aria-hidden="true" …>…</svg>
  <span class="ilw-visually-hidden">Copied</span>
</button>
```

## Tests

Accessibility is proven by tests. Each component has three layers, all driven by
its Storybook stories, on Chromium and WebKit:

1. **DOM contract + ARIA:** story `play` functions, run as Vitest browser tests by
   `@storybook/addon-vitest`.
2. **Keyboard + focus (APG):** Playwright specs in `tests/e2e/` press real keys in
   the static Storybook build and assert after every step that focus never falls
   to `<body>`. They use stories with no `play` function, since Storybook runs
   `play` whenever a story loads.
3. **axe:** `@storybook/addon-a11y` with `test: 'error'` (WCAG 2.0/2.1 A and AA)
   scans every story, including an "Open" story per component so the open
   popup or modal is scanned.

A node Vitest project also covers `core/` and the guard below, and
`tests/unit/tokens.test.ts` checks `tokens.css` against the vendored
`toolkit.css`: every palette colour and every theme rule.

**Story descriptions.** Every story has a comment above it, shown as its
description on the Docs page: a one-line summary, **Why:** (what is under test:
what the play function checks, or which spec the story backs) and **Review:**
(what a reviewer should see and try by hand). Every component story renders
with `styles.css` only, inside the page shell, with the context it will have on
a real page (labels and neighbouring fields, surrounding prose, realistic data),
so it shows how the component will look.

**Parity stories.** Each story picks its stylesheets with `parameters.styles`:
`'toolkit'` (`toolkit.css` only, inside `<ilw-page class="ilw-format">`),
`'ilw-ui'` (`styles.css` only, inside `<Page format>`: skip link, then
`<main id="main-content">`, with `.ilw-format` as on the toolkit side) or
`'both'` (the default). An `'ilw-ui'` story sets `parameters.format: false` to
drop `.ilw-format`: the **Unformatted** stories render each presentational
component that way and check its text is still in Source Sans, so a component
that leans on the prose styles for its font fails. A story that renders a
whole page (its own shell or footer) sets `parameters.shell: false` to skip
the wrapper. A replacement gets `stories/parity/<Name>.parity.stories.svelte` with
a `Toolkit` story (axe off: it documents upstream), an `IlwUi` story, and a
`Side By Side` story that shows each in its own iframe, one row per variant.
The **Theme** toolbar sets `html[data-theme]` (Light by default, Dark, or
System, which removes it).

```bash
pnpm install
pnpm check            # svelte-check, fails on warnings
pnpm test             # unit + story tests (layers 1 and 3)
pnpm build-storybook
pnpm test:e2e         # layer 2, against storybook-static/
```

`mise run test` runs the last three in order. `pnpm storybook` starts the
workbench on <http://localhost:6006>.

Every push publishes Storybook to [Chromatic](https://www.chromatic.com/) for
visual review (`.github/workflows/chromatic.yml`, the official
`chromaui/action`; settings in `chromatic.config.json`). It needs the
`CHROMATIC_PROJECT_TOKEN` repository secret. Visual changes don't fail CI; they
are accepted or denied in Chromatic, and pushes to `main` are auto-accepted as
the new baselines. To publish from your machine:
`CHROMATIC_PROJECT_TOKEN=… pnpm chromatic`.

Screen-reader checks can't be automated: [docs/at-smoke.md](docs/at-smoke.md)
has the NVDA + Firefox and VoiceOver + Safari checklist. **Running it is a human
task**; log each run there.

The toolkit is vendored in `vendor/illinois-toolkit/` because its CDN
CAPTCHA-blocks automated browsers. See the README there to refresh it.

## Following upstream

Two things are copied from upstream: the toolkit bundle
(`vendor/illinois-toolkit/`, the parity stories' reference) and the campus
footer content (`src/core/campus-footer.ts`, from Brand's API). Every Monday
`.github/workflows/upstream.yml` refetches both (`scripts/vendor-toolkit.sh`,
`scripts/vendor-footer.mjs`, also `mise run vendor:toolkit` and
`mise run vendor:footer`). If anything but the fetch dates changed, it
force-pushes `upstream/refresh`, opens a pull request if none is open, and runs
CI and Chromatic on it. Review the parity stories in Chromatic: a toolkit
change shows on the **Toolkit** side, and the ilw-ui side needs the matching
change before merging. It can also be run by hand from the Actions tab.

## The import rule

`src/` imports only `svelte`, `@zag-js/*`, `@tanstack/table-core`,
`@tanstack/svelte-table` and `phosphor-svelte/lib/*` (each family pinned
exactly, in lockstep; `phosphor-svelte` itself for types only) and its own
files, and uses no HTML sinks
(`{@html}`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`,
`eval`, `new Function`). `tests/unit/guard.test.ts` enforces this and reports
each violation as file:line.

## Known issues

Upstream Zag (`@zag-js/combobox` 1.44.0) gaps. Each is worked around once,
inside `Combobox` (and `MultiCombobox` and `Autocomplete`, which share the
workarounds in `src/svelte/zag-input.ts`). None is filed upstream yet. Draft issues are in
[docs/upstream-issues/zag.md](docs/upstream-issues/zag.md).

- **`openOnChange` as a function sees the text from before the keystroke,** so
  `length >= 2` opens on the third character. `Combobox` sets
  `openOnChange: false` and opens the list from `onInputValueChange`.
- **Zag rewrites the input text when the value changes** (reason `'script'`),
  which wiped free text after an unmatched blur. `Combobox` controls
  `inputValue` and accepts only `'input-change'` and `'item-select'`.
- **`mergeProps` runs handlers in reverse order:** the last argument's handler
  runs first. `Combobox` passes its own handlers last.
- **`aria-activedescendant` can point at an option that isn't rendered.** Zag
  sets it from the highlighted value even while the list is closed or the option
  is filtered out, which axe flags as an invalid IDREF. `Combobox` overrides the
  attribute in its markup.
- **Zag moves the caret to the end after nearly every state change** (opening,
  closing, a keystroke that reopens the list), so typing mid-text jumps to the
  end. `Combobox` drops Zag's caret-to-end `setSelectionRange` calls on its
  input; a real text change already puts the caret at the end.
- **With `allowCustomValue`, Enter with nothing highlighted closes the list and
  submits the form.** `Combobox` prevents it while the list is open.
- **An outside click within a frame of opening can leave the list open,** and
  Zag's deferred open focus can then pull focus back to the input. `Combobox`
  closes the list on blur itself (`LAYER.INTERACT_OUTSIDE`,
  `restoreFocus: false`). The focus pull is a single-frame race and isn't worked
  around.
- **On Apple platforms Zag adds an `aria-live` region to `document.body`** while
  the list is open, to announce the highlighted option (VoiceOver doesn't read
  `aria-activedescendant` reliably). The machine passes `@zag-js/live-region` no
  `root`, so it lands outside `<ilw-page>`, and is silenced by `inert` when the
  component sits in a modal. While focus is in the component, `Combobox`,
  `MultiCombobox` and `Autocomplete` move it into their root `span` (`keepLiveRegionIn`); Zag finds
  it by id and still announces and removes it.

## License

MIT
