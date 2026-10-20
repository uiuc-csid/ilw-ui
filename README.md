# ilw-ui

Accessible Svelte 5 components that look like the
[Illinois Web Toolkit](https://builder3.toolkit.illinois.edu/) and follow the
WAI-ARIA Authoring Practices. The goal is a full replacement for the toolkit in
Svelte apps: the same look without `toolkit.js` or `toolkit.css`, plus what the
toolkit lacks. So far: a sortable table heading, a modal with close events,
focus return and a promise API, a filtering combobox, a free-text autocomplete,
and a client-side sortable, filterable, paged table. The roadmap is
[docs/plans/2026-10-20-toolkit-replacement.md](docs/plans/2026-10-20-toolkit-replacement.md),
tracked in [#9](https://github.com/uiuc-csid/ilw-ui/issues/9).

Layering: native HTML first, `ilw-ui` second. The toolkit is the visual
reference, not a runtime dependency of new components.

Status: pre-release (`private: true`), first consumer
[ta-manager](https://github.com/uiuc-csid/ta-manager).

## Install and use

The package ships source (`.svelte`/`.ts`); your Vite + Svelte build compiles it.
Peer dependency: `svelte ^5.57`. Dependencies, pinned exactly: `@zag-js/combobox`
and `@zag-js/svelte` (1.44.0), and `@tanstack/table-core` and
`@tanstack/svelte-table` (9.3.1).

```js
import { Autocomplete, Combobox, SortableTh, openModal, alert, confirm } from 'ilw-ui/svelte';
import { createDataTable, DataTable, DataRows, TableSortTh, Pager, setTableFilter } from 'ilw-ui/svelte';
import { nextSort, filterItems, blurMatch, rowColumn, pageWindow, announce } from 'ilw-ui/core';
import 'ilw-ui/styles.css';
```

Every page needs the brand stylesheet
(`https://cdn.brand.illinois.edu/illinois.css`). **Until the replacements land,
the host page still loads the toolkit** (`toolkit.js` as a module and
`toolkit.css`): `Modal` wraps `<ilw-modal>`. This paragraph shrinks as each
replacement lands.

**Tokens:** `styles.css` uses only the brand palette's `--il-*` custom
properties, each with its brand value as a fallback in case the brand
stylesheet fails to load. It has no rules on bare `th`/`td`.

**Partials:** `styles.css` is an index that `@import`s `src/styles/*.css`.
Each partial is exported too, so a page can take only what it needs, e.g.
`import 'ilw-ui/styles/tokens.css'` for the theme properties alone.

| Partial          | Holds                                                     |
| ---------------- | --------------------------------------------------------- |
| `tokens.css`     | `--ilw-color--*` defaults, theme classes, dark mode       |
| `button.css`     | `.ilw-button`, `ul.ilw-buttons`, `ul.ilw-buttons-left`    |
| `table.css`      | `table.ilw-table`, tables in `.ilw-format`, stripes, `.ilw-table-responsive`, `.ilw-theme-table-*` |
| `components.css` | `.ilw-visually-hidden`, SortableTh, Modal, Combobox, Autocomplete, Pager |

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
attribute the toolkit header's dark-mode toggle sets, so the header drives it.
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

### `openModal`, `alert`, `confirm`

Promise wrappers around the toolkit's `<ilw-modal>`. Each call mounts a fresh
modal on `document.body` and removes it once closed.

```js
const choice = await openModal({
  title: 'Unsaved changes',       // optional; rendered as <h2 slot="title">
  message: 'Save before leaving?', // plain text, rendered as a <p>
  // or body: someSnippet,         // a Svelte snippet for rich content
  buttons: [                       // default: [{ label: 'Got it', value: true }]
    { label: 'Discard', value: 'discard' },
    { label: 'Keep editing', value: 'keep', autofocus: true },
    { label: 'Save', value: 'save' },
  ],
  size: 'small',                   // ilw-modal size; default 'small'
  returnFocusEl: someButton,       // default: what had focus at open
});
// 'discard' | 'keep' | 'save', or null if dismissed (Escape, ×, backdrop)

await alert({ title: 'Saved', message: 'Your preferences were saved.' });
const ok = await confirm({ title: 'Delete?', message: 'This cannot be undone.', confirmLabel: 'Delete' });
// true only for the confirm button; Cancel takes focus so a stray Enter never confirms
```

While open, every other child of `<body>` is `inert`; their previous `inert`
state is restored on close, before focus returns.

DOM contract:

```html
<ilw-modal id="app-modal-1" size="small" open>
  <h2 slot="title">Delete?</h2>
  <p>This cannot be undone.</p>
  <div class="modal-buttons">
    <button type="button" class="ilw-button" autofocus>Cancel</button>
    <button type="button" class="ilw-button">Delete</button>
  </div>
</ilw-modal>
```

`Modal` (the component `openModal` mounts) is exported too. It takes `id`,
`title`, `size`, `body`/`message`, `buttons` and
`onclose(reason: 'button' | 'dismiss', value)`, and opens on mount.

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
| `items`                           | `ComboboxItem[]`        | required      | `{ value, label, search?, group? }`; `search` defaults to `label`   |
| `value`                           | `string \| null`        | `null`        | The selection (controlled: update it in `onchange`)                 |
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
the only match, else `null`.

There is no `name` or hidden form input: Zag would submit the label text. Keep
the value in your own field (ta-manager keeps a hidden `<select>`).

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
| `items`                           | `AutocompleteItem[]`   | required      | `{ value, label, text?, search? }`: `label` is listed, `text` is written     |
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
- With `emptyText` and no matches, the list shows one disabled `.autocomplete-empty` option.
- `aria-activedescendant`, the caret and Zag's VoiceOver live region behave as in `Combobox`.

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

**Parity stories.** Each story picks its stylesheets with `parameters.styles`:
`'toolkit'` (`toolkit.css` only, inside `<ilw-page class="ilw-format">`),
`'ilw-ui'` (`styles.css` only, inside a plain `<main>`) or `'both'` (the
default). A replacement gets `stories/parity/<Name>.parity.stories.svelte` with
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

## The import rule

`src/` imports only `svelte`, `@zag-js/*`, `@tanstack/table-core` and
`@tanstack/svelte-table` (each family pinned exactly, in lockstep) and its own
files, and uses no HTML sinks
(`{@html}`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`,
`eval`, `new Function`). `tests/unit/guard.test.ts` enforces this and reports
each violation as file:line.

## Known issues

Upstream `<ilw-modal>` (1.2.1) gaps. Each is worked around once, inside `Modal`,
where a workaround is possible. None is filed upstream yet. Draft issues are in
[docs/upstream-issues/ilw-modal.md](docs/upstream-issues/ilw-modal.md).

- **No open/close events.** `Modal` watches the reflected `open` attribute with a
  `MutationObserver`.
- **`autofocus` works only on direct slotted children.** `Modal` focuses the
  `[autofocus]` button itself after `updateComplete`.
- **Clicks inside the dialog stop propagating.** Svelte's delegated `onclick`
  listens at the mount root and would never fire, so the buttons get direct
  listeners.
- **`id` and `size` don't reflect, and `id` overrides the native property.**
  Svelte would set them as properties and the attributes would be missing, so
  `Modal` sets them with `setAttribute`.
- **Tab order is captured at open.** Content added to an open modal isn't in its
  focus trap.
- **`aria-describedby` points at the whole body slot,** so the buttons are read
  as part of the description.

Upstream Zag (`@zag-js/combobox` 1.44.0) gaps. Each is worked around once,
inside `Combobox` (and `Autocomplete`, which shares the workarounds in
`src/svelte/zag-input.ts`). None is filed upstream yet. Draft issues are in
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
  component sits in a modal. While focus is in the component, `Combobox` and
  `Autocomplete` move it into their root `span` (`keepLiveRegionIn`); Zag finds
  it by id and still announces and removes it.

## License

MIT
