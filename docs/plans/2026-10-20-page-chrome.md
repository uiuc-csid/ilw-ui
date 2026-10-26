# Phase 4: Page chrome (B1–B7)

_Phase 4 of [the toolkit-replacement plan](2026-10-20-toolkit-replacement.md) (tracking: [uiuc-csid/ilw-ui#9](https://github.com/uiuc-csid/ilw-ui/issues/9)). Covers the page shell, header and menus, footer, breadcrumbs, page title, section nav and back-to-top, under the roadmap's "CSS before JS for page chrome" decision. After this phase a page can drop `toolkit.js` and `toolkit.css`._

## Sources read

Each item below was checked against its toolkit source (`github.com/web-illinois/ilw-<name>`, default branch on 2026-10-20) and its Builder page (`builder3.toolkit.illinois.edu/component/ilw-<name>/`, which is a live preview plus the `builder/*.json` in each repo). Where the prose README and the code disagree, the code wins.

| Item | Repos |
| ---- | ----- |
| B1 | `ilw-page` (`ilw-page.ts`, `ilw-page.css`, `ilw-page.styles.css`, `dark-mode.css`, `samples/index.html`); `ilw-header` (`DARKMODE.md`, the dark-mode checkbox in `ilw-header.ts`) |
| B2 | `ilw-header`, `ilw-header-menu` (`HeaderMenu.ts`, `HeaderMenuSection.ts`), `ilw-header-megamenu` (`MegaMenu.ts`, `MegaMenuSection.ts`) |
| B3 | `ilw-footer` (`ilw-footer.ts`, both CSS files, `models/campus-footer-data.ts`, `wordmark.svg.ts`) |
| B4 | `ilw-breadcrumbs` (`ilw-breadcrumbs.ts`, `.styles.ts`, `.css`) |
| B5 | `ilw-page-title` (`ilw-page-title.ts`, `.styles.ts`, `.css`, `samples/variations.html`) |
| B6 | `ilw-section-nav` (`ilw-section-nav.ts`, README automatic and manual modes) |
| B7 | `ilw-back-to-top` (`ilw-back-to-top.ts`) |

What they do today, in short:

- **`ilw-page`** is a grid (header, main, footer) in shadow DOM, with `ilw-font`/`ilw-format`/`ilw-margin` classes and an `expanded` attribute that adds top and bottom margin to the main area. It has **no skip link** and doesn't touch `<body>`. Dark mode is a page-level script in the sample, not in the component: it reads the `ilw-dark-mode` cookie (else `prefers-color-scheme`) into `html[data-theme]` and listens for `ilw-dark-mode-changed` from the header.
- **`ilw-header`** owns the dark-mode checkbox (`dark-mode-visible`), writes `ilw-dark-mode=true|false; path=/`, and dispatches `ilw-dark-mode-changed` on `window`. It switches to a compact layout under 990 px with a "Menu" button (`aria-expanded`, `aria-controls`).
- **`ilw-header-menu`** and **`ilw-header-megamenu`** are disclosure navigation with arrow-key handling, Escape, and close-on-focusout, all in script. A "linked" section is a link plus a separate arrow-only toggle (`aria-label="<link text> submenu"`).
- **`ilw-footer`** fetches `https://api.brand.illinois.edu/footer` on every page load for the campus links and legal links, adds UTM parameters, and injects the OneTrust cookie script and an "About Cookies" button unless the page supplies one.
- **`ilw-breadcrumbs`** wraps each light-DOM child in `<li>` inside `<nav aria-label="Breadcrumbs"><ol>`. The current page is a bare `<span>` (no `aria-current`); the `>` separator is CSS-generated text.
- **`ilw-page-title`** is a box with an optional background `<img>`, a translucent colour plate behind the `<h1>`, `theme` (default/blue/orange/white), `fade` and `width`.
- **`ilw-section-nav`** builds nested lists, collapses below 700 px behind an "In This Section" toggle, and gives each branch a toggle beside its link.
- **`ilw-back-to-top`** is a fixed `<button aria-label>` that appears after scrolling a screen, scrolls up in steps, and then focuses the first focusable element.

## Decisions

- **Classes, not custom elements.** Without script, `<ilw-page-title>` is an unknown inline element and its shadow-DOM wrappers don't exist. Each item becomes a class named after the toolkit element (`.ilw-page`, `.ilw-footer`, `.ilw-breadcrumbs`, `.ilw-page-title`, `.ilw-header`, `.ilw-section-nav`, `.ilw-back-to-top`) on real HTML elements, with the shadow parts as light-DOM children (`.ilw-page-title-text`, `.ilw-footer-campus`, …). A toolkit attribute becomes a modifier class (`theme="blue"` on `ilw-page-title` → `.ilw-page-title--blue`; `expanded` on `ilw-page` → `.ilw-page--expanded`). Toolkit class names that already exist (`ilw-format`, `ilw-font`, `ilw-margin`, `ilw-footer-menu`, `ilw-section-nav--root`) are kept as they are.
- **One partial per item** in `src/styles/` (`page.css`, `header.css`, `footer.css`, `breadcrumbs.css`, `page-title.css`, `section-nav.css`, `back-to-top.css`), imported by `src/styles.css`, so a server page can take only `tokens.css` + the chrome it uses. Colours come from the A1 `--ilw-color--*` properties, so dark mode and themes follow without per-component dark rules.
- **The Svelte component renders exactly the documented markup.** Content is passed as snippets (site name, address, extra links); lists of plain links are props. No `{@html}`.
- **Behaviour follows the APG where the toolkit differs**, and the README says so: a skip link, `aria-current="page"` on the current breadcrumb, separators hidden from assistive technology, link-plus-toggle kept apart, back-to-top as a link.
- **Widths come with A5.** The toolkit's `width="full|page|auto"` (100vw breakout) on breadcrumbs and page title waits for the A5 layout utilities (`.ilw-width-*`), so the breakout is written once.

## B1: page shell

### Markup contract

```html
<html lang="en" data-theme="light">        <!-- data-theme optional: see dark mode -->
<body>
  <div class="ilw-page ilw-format" id="top" tabindex="-1">
    <a class="ilw-skip-link" href="#main-content">Skip to main content</a>
    <header class="ilw-header">…</header>    <!-- B2, optional -->
    <main id="main-content" tabindex="-1">…</main>
    <footer class="ilw-footer">…</footer>    <!-- B3, optional -->
    <a class="ilw-back-to-top" href="#top">…</a>  <!-- B7, optional -->
  </div>
</body>
```

- `.ilw-page` is a one-column grid (`auto 1fr auto`) like the toolkit's `.page`, and sets `background` and `color` from `--ilw-color--background`/`--ilw-color--text` so the A1 dark values show (the toolkit left these commented out). The header row gets `position: relative; z-index: 300`, as upstream, so menus overlay the main area.
- Modifiers: `.ilw-margin` (side margins `--ilw-margin--side` on `main`), `.ilw-page--expanded` (top and bottom margin on `main`), and the A2 classes `.ilw-format`/`.ilw-font`, which this stylesheet doesn't define.
- **Skip link.** The first focusable element; visually hidden until focused, then shown at the top left in the focus colours (`--ilw-color--focus--*`). Its target is `<main id="main-content" tabindex="-1">`: the `tabindex` makes focus move into `main` (not just the scroll position) in every browser, so the next Tab continues from the main content. `main:focus` has no outline (only programmatic focus lands on it). The id and the text are the contract; both are props in Svelte.
- **`id="top"`** on `.ilw-page` is the target of B7. **`tabindex="-1"`** on it (added in PR 4) makes following B7 move focus to the shell: without it, Chrome and Safari both drop focus to `<body>` when the fragment target isn't focusable. `.ilw-page:focus` has no outline, like `main:focus`.
- Landmarks: one `banner` (the header, a direct child of the shell, not inside `main`), one `main`, one `contentinfo` (the footer, same rule). Nothing else in the shell adds roles.

### Svelte

`Page`: props `skipLinkText` (default "Skip to main content"), `mainId` (default `main-content`), `format`, `margin`, `expanded` (booleans for the classes), `class`; snippets `header`, `children` (the content of `main`) and `footer`.

### Storybook

`PlainMain.svelte` (the `styles: 'ilw-ui'` wrapper) is replaced by a decorator that renders `Page` with the story in `main`, so every ilw-ui story gets the skip link and landmarks. Stories that render a whole page (the B1 and B3 stories, and their toolkit sides) set `parameters.shell: false` to opt out of both wrappers.

### Dark-mode toggle island

The one piece of script in the phase. It sits in the header (B2) but shipped before it, in its own component so a page without the header can still mount it.

- **Without script:** nothing renders, and the page follows `prefers-color-scheme` through A1, unless the server writes `html[data-theme]`. A site without dark styles sets `data-theme="light"` (the toolkit's `data-dark-mode-supported="false"` has no CSS effect in ours, so it isn't read).
- **Server contract (no flash):** the server reads the `ilw-dark-mode` cookie and writes `<html data-theme="dark|light">`. The README gives a Django snippet. The island never writes the attribute at load, only on change.
- **Markup:** `<span data-ilw-island="dark-mode-toggle"></span>` in the header, mounted by `mountIslands`. It renders `<label class="ilw-dark-mode-toggle"><input type="checkbox" role="switch"> Dark mode</label>` (A7's switch styling, the toolkit's label text). `role="switch"` announces "Dark mode, switch, off/on", which says what the control does better than a checkbox.
- **State:** checked = `html[data-theme] === 'dark'`, else the OS preference. While the user hasn't chosen (no cookie), it follows `matchMedia('(prefers-color-scheme: dark)')` changes.
- **On change:** set `html.dataset.theme`, write `ilw-dark-mode=<bool>; path=/; max-age=31536000; SameSite=Lax` (the toolkit's name and values, plus an expiry, so it outlives the session), and dispatch `ilw-dark-mode-changed` with `{ detail: { enabled } }` on `window`, so toolkit pages and ilw-ui pages share one preference during migration.
- **Not in scope:** a third "system" state. The toolkit has none; it can come later as a radio group.

## B2: header and menus

### Markup contract

```html
<header class="ilw-header">
  <div class="ilw-header-main">
    <a class="ilw-header-wordmark" href="https://illinois.edu/?utm_source=…&utm_medium=web&utm_campaign=Header"
       aria-label="University of Illinois Urbana-Champaign"><svg aria-hidden="true">…</svg></a>
    <div class="ilw-header-identity">
      <a class="ilw-header-parent-unit" href="…">Parent Unit</a>  <!-- optional -->
      <a class="ilw-header-site-name" href="/">Site Name</a>      <!-- or <h1><a>, or a <div> -->
    </div>
    <button class="ilw-header-toggle" type="button" popovertarget="ilw-header-menu">Menu</button>
  </div>
  <div class="ilw-header-menu" id="ilw-header-menu" popover>
    <nav class="ilw-header-links" aria-label="Utility">…</nav>       <!-- the toolkit's "links" slot -->
    <form class="ilw-header-search" role="search" method="get" action="/search">
      <input type="search" name="q" aria-labelledby="ilw-header-search-button">
      <button type="submit" id="ilw-header-search-button">Search</button>
    </form>
    <nav class="ilw-header-nav" aria-label="Main">
      <ul>
        <li><a href="/about">About</a></li>
        <li><details name="ilw-header-nav">                         <!-- section with a label -->
          <summary>Start Here</summary>
          <ul>…</ul>
        </details></li>
        <li class="ilw-header-nav-linked">                          <!-- linked section -->
          <a href="/info">Information</a>
          <details name="ilw-header-nav">
            <summary><span class="ilw-visually-hidden">Subpages of Information</span><svg aria-hidden="true">…</svg></summary>
            <ul>…</ul>
          </details>
        </li>
      </ul>
    </nav>
    <span data-ilw-island="dark-mode-toggle"></span>                 <!-- optional, B1 -->
  </div>
</header>
```

The search form keeps the toolkit's contract (`role="search"`, `type="search"`, labelled by its submit button).

### How the menus work without script

- **Menu sections are `<details name="ilw-header-nav">`.** The shared `name` makes them an exclusive group: opening one closes the others (Chrome 120, Safari 17.2, Firefox 130). On wide screens the panel (`details > ul`) is absolutely positioned under its `li`; in the mobile menu it is in flow and pushes the rest down, which a popover can't do. Nested sections use their own `name` (the parent's name plus a suffix), so opening a nested one doesn't close its parent.
- **The megamenu uses popovers.** Each top-level item is `<button popovertarget="mega-1">` with `<div class="ilw-header-megamenu-panel" id="mega-1" popover>`. `popover="auto"` gives one-open-at-a-time, Escape and light dismiss for free. The panel is positioned under the header with anchor positioning (`position-anchor` on the invoker's implicit anchor, `top: anchor(bottom)`), full width up to the toolkit's 1270 px. Where anchor positioning isn't supported it falls back to the UA's centred popover, which still works, just in a different place.
- **The mobile toggle uses a popover.** `.ilw-header-menu` is `popover`; below 990 px (the toolkit's breakpoint) the "Menu" button shows and opens it as a panel under the header. At 990 px and up the button is hidden and `.ilw-header-menu[popover]` is overridden to `display: contents`, so the links, search and nav sit in the header layout. Overriding the UA `display: none` is enough: an unopened popover isn't in the top layer and has no other effect, so its contents are rendered and exposed.

### Focus order

DOM order is reading order is focus order, at every width:

1. skip link (B1), 2. wordmark, 3. parent unit, 4. site name, 5. "Menu" (narrow only), 6. utility links, 7. search field, 8. Search button, 9. each top-level nav item: a link, or a `summary`, or a link then its `summary`, 10. the dark-mode switch, then `main`.

- Opening a `details` puts its links next in the Tab order, straight after its `summary`.
- A popover invoked by `popovertarget` is next in the Tab order after its invoker, wherever it renders (the HTML popover focus-navigation rule). Escape or light dismiss closes it, and focus returns to the invoker if it was inside.
- **Gaps against the APG disclosure-navigation example**, recorded in the README: no arrow-key movement between top-level items (optional in the APG); an open `details` dropdown doesn't close on Escape or when focus leaves it (it closes when another one opens or its `summary` is pressed). These need script; if testing with users shows the open dropdown gets in the way, the fallback is a small optional island that closes `details[name="ilw-header-nav"]` on Escape and focusout, with no change to the markup.

### Screen-reader output

- Landmarks: "banner"; "Utility, navigation"; "search"; "Main, navigation".
- A `summary` is announced as a button with its state: "Start Here, button, collapsed" (NVDA + Firefox), "Start Here, collapsed, disclosure triangle" or "summary" (VoiceOver + Safari, varies by version). The linked section's toggle reads "Subpages of Information, button, collapsed", right after the "Information, link".
- The "Menu" and megamenu buttons get an implicit `aria-expanded` from `popovertarget` in all three engines: "Menu, button, collapsed/expanded".
- The current section: `aria-current="page"` on the current link; for a section whose page is the current one, `aria-current="true"` on its `summary` (the toolkit's `current` attribute).
- Each line above goes into `docs/at-smoke.md` as a checklist item.

### Svelte

`Header`: props `siteName`, `siteHref`, `parentUnit` (`{ label, href }`), `source` (UTM, default `Illinois_App`), `search` (`{ action, name, method }` or false), `links` and `nav` (a tree of `{ label, href?, current?, children? }`; an item with both `href` and `children` renders as a linked section), `megamenu` (boolean: render top-level sections as popovers), `darkModeToggle` (boolean: render the island host). Snippets for `siteName` when it needs to be an `<h1>`.

## B3: footer

### Markup contract

```html
<footer class="ilw-footer">
  <div class="ilw-footer-site">                     <!-- add ilw-footer-site--no-actions when there are none -->
    <p class="ilw-footer-site-name"><a href="/">Site Name</a></p>
    <div class="ilw-footer-contact">
      <nav class="ilw-footer-social" aria-label="Social media"><ul><li><a href="…">…</a></li></ul></nav>
      <address class="ilw-footer-address">…</address>
      <p class="ilw-footer-primary-unit"><a href="…">Primary Unit</a></p>
    </div>
    <div class="ilw-footer-actions"><a href="/give">Give</a></div>
    <div class="ilw-footer-content">
      <nav class="ilw-footer-menu" aria-labelledby="footer-menu-1"><h2 id="footer-menu-1">…</h2><ul>…</ul></nav>
    </div>
  </div>
  <div class="ilw-footer-campus">
    <h2 class="ilw-footer-logo"><a href="https://illinois.edu/?utm_source=…" aria-label="University of Illinois Urbana-Champaign"><svg aria-hidden="true">…</svg></a></h2>
    <div class="ilw-footer-sections">
      <div class="ilw-footer-section"><h3>Explore Campus</h3><ul><li><a href="…">…</a></li></ul></div>
      …
    </div>
  </div>
  <div class="ilw-footer-legal">
    <ul>
      <li><button id="ot-sdk-btn" class="ot-sdk-show-settings">About Cookies</button></li>  <!-- optional -->
      <li><a href="…">Privacy Policy</a></li>
      <li><a href="…">Copyright</a></li>
      <li><a href="…">Extra legal link</a></li>        <!-- optional, before Accessibility as upstream -->
      <li><a href="…">Accessibility</a></li>
    </ul>
  </div>
</footer>
```

- Same three bands, colours, borders, grid areas and container breakpoints (650/960/1200 px) as the toolkit's shadow CSS, with `container-type: inline-size` on `.ilw-footer`.
- The legal links become a list (upstream: bare links in a flex row); the look is unchanged.
- The wordmark is inline SVG with `aria-hidden="true"`, and the link carries the name, as upstream does with `aria-label` (upstream also gives the SVG `role="img"` and a "Illinois" title, which double-announces).
- **Cookies:** the toolkit injects OneTrust (`onetrust.techservices.illinois.edu`) into `<head>` and adds the button. Ours can't: no script, and consumers run a same-origin-scripts CSP. A site that needs the consent banner adds the OneTrust script itself and the button above; the class `ot-sdk-show-settings` is what OneTrust binds to. The README documents both.

### Footer content source

The toolkit fetches `https://api.brand.illinois.edu/footer` on every page view. Ours ships the content:

- `src/core/campus-footer.ts` holds that JSON as a typed constant (`campusFooter`: three sections of four links, plus privacy, copyright and accessibility), with the fetch date in a comment, and `campusLink(href, source)`, which appends `utm_source=<source>&utm_medium=web&utm_campaign=Footer` the way upstream does. Exported from `ilw-ui/core`, so non-Svelte servers can render it too.
- **Why not fetch at runtime:** it needs script and a `connect-src` exception, it would leave the footer empty on server-rendered and no-JS pages, and it would make the tests depend on the network.
- **Keeping it in step:** `mise run vendor:footer` refetches the JSON and rewrites the constant; the diff shows any change. Running it on a schedule joins the roadmap's "following upstream" open question (the toolkit refresh job). Brand owns the content (the roadmap's "footer content" question); the README points at the API as the source of truth.

### Svelte

`Footer`: props `source` (default `Illinois_App`), `legalLinks` (`{ label, href }[]`), `cookiesButton` (boolean: render the OneTrust button); snippets `siteName`, `primaryUnit`, `address`, `social` (the `<li>`s; the component writes the `nav` and `ul`), `actions`, and `children` (the content area: footer menus or free HTML).

## B4: breadcrumbs

### Markup contract

```html
<nav class="ilw-breadcrumbs" aria-label="Breadcrumbs">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/academics">Academics</a></li>
    <li><span aria-current="page">Degree programs</span></li>
  </ol>
</nav>
```

- The current page stays unlinked, as the toolkit recommends, and gets `aria-current="page"` (upstream: no state).
- The separator is `li + li::before { content: ">" / ""; }`: the empty alternative text keeps screen readers from reading "greater than" between items. The rule is preceded by a plain `content: ">"` for engines without alt text.
- Colours from `--ilw-color--link`, `--ilw-color--text`, `--ilw-color--focus--*`, so an A1 theme class on the `nav` (`ilw-theme-blue`) restyles it. Separator: `--ilw-breadcrumbs--separator-color` (Altgeld; the toolkit's blue variant uses orange, set under the blue theme class).

### Svelte

`Breadcrumbs`: props `items` (`{ label, href }[]`, the trail, all linked), `current` (the current page's label), `label` (default "Breadcrumbs"), `class`.

## B5: page title

### Markup contract

```html
<div class="ilw-page-title">                <!-- + ilw-page-title--blue | --orange | --white, ilw-page-title--fade -->
  <img class="ilw-page-title-background" src="…" alt="">  <!-- optional, decorative -->
  <div class="ilw-page-title-inner">
    <div class="ilw-page-title-text">
      <h1>Graduate Programs</h1>
    </div>
  </div>
</div>
```

- The toolkit's shadow structure, flattened: background image covering the box, the text block at the bottom left on a colour plate at 85 % opacity (100 % with `--fade`, where the image fades out instead), `min-height: 12.5rem`, font steps at 1200/800/600 px.
- Default colours: text `--ilw-color--background` on `--ilw-color--heading` (the toolkit's inverted default). The theme modifiers read the palette properties exactly as upstream's `[theme=…]` rules do.
- The image is always decorative (`alt=""`); the heading is the content. Contrast: the plate, not the image, carries the text, as upstream.

### Svelte

`PageTitle`: props `theme` (`'blue' | 'orange' | 'white'`), `fade`, `image` (src), `class`; `children` is the heading text, rendered inside the `<h1>`.

## B6: section nav

### Markup contract

```html
<nav class="ilw-section-nav" aria-labelledby="ilw-section-nav-label">
  <details class="ilw-section-nav-collapse" open>
    <summary id="ilw-section-nav-label">Pages In This Section</summary>
    <ul>
      <li><a class="ilw-section-nav--root" href="/programs">Programs of Study</a></li>
      <li class="ilw-section-nav-branch">
        <a href="/programs/ug">Undergraduate Degrees</a>
        <details open>                                   <!-- server sets open on the current branch -->
          <summary><span class="ilw-visually-hidden">Subpages of Undergraduate Degrees</span><svg aria-hidden="true">…</svg></summary>
          <ul>
            <li><a href="…" aria-current="page">Pre-Veterinary and Medical</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </details>
</nav>
```

### Toggle beside the link

The link and its toggle are siblings, never nested (no interactive content inside `summary`). The `li.ilw-section-nav-branch` is `position: relative`; its `summary` is absolutely positioned at the top right, level with the link, and the link has matching `padding-inline-end` so its text never runs under the toggle. The `details` itself is in flow under the link, so when it opens the child list appears beneath the link with the toolkit's indent; closed, it takes no space. The toggle is a 44 × 44 px target (WCAG 2.5.8) with the chevron rotated by `details[open]`.

Focus order: the link, then its toggle, then (when open) the children. Screen readers hear "Undergraduate Degrees, link" then "Subpages of Undergraduate Degrees, button, expanded".

### Mobile collapse

The toolkit collapses the whole nav under 700 px. Ours wraps the list in `details.ilw-section-nav-collapse`, `open` from the server. At 700 px and up its `summary` is hidden and `::details-content` is forced visible, so the list always shows; below, it is a normal disclosure. **To check first** (it decides the design): that a closed `details` whose content is forced visible exposes that content to assistive technology in Chrome, Safari and Firefox. If one doesn't, the fallback drops the outer `details` and the list is always expanded.

**Checked (PR 4):** in Chromium the real accessibility tree (CDP `Accessibility.getFullAXTree`) exposes every link inside the closed, forced-visible `details`, so the design stays. WebKit and Firefox have no scriptable AX tree here; their check is in `docs/at-smoke.md`. Where `::details-content` isn't supported, the narrow-width toggle shows at every width, so the list is never out of reach.

### Svelte

`SectionNav`: props `items` (a tree of `{ label, href, current?, children? }`), `label` (default "Pages In This Section"). It sets `open` on every ancestor of the current item and `aria-current="page"` on it.

## B7: back to top

### Markup contract

```html
<a class="ilw-back-to-top" href="#top">
  <svg aria-hidden="true">…</svg><span class="ilw-visually-hidden">Back to top</span>
</a>
```

The last child of `.ilw-page`, so it is last in the focus order.

- **A link, not a button.** `#top` is the shell (`.ilw-page#top`, B1). Following it scrolls to the top and moves the sequential-focus starting point there, so the next Tab reaches the skip link, without the toolkit's "focus the first focusable element" script. `scroll-behavior: smooth` on `html` only under `prefers-reduced-motion: no-preference`.
- **Reveal.** `position: fixed` at the bottom right (`--ilw-back-to-top--right`/`--bottom`, as upstream). Inside `@supports (animation-timeline: scroll())`, a scroll-driven animation fades it in over the first viewport height of scrolling (`animation-timeline: scroll(root); animation-range: 0 100vh`), with `pointer-events` following opacity.
- **Fallback:** without scroll-driven animations it is always visible, as the roadmap says. With them, it is still focusable at the top of the page; `:focus-visible { animation: none; }` drops the animation, so a focused link is always fully visible (WCAG 2.4.7). It is never `visibility: hidden` or `display: none`, so screen-reader users can always reach it.

### Svelte

`BackToTop`: props `target` (default `top`), `label` (default "Back to top").

## Resolved while building B6 and B7 (PR 4)

- **Section nav `open` default.** The outer `details` is closed unless `open` is passed, matching upstream's closed toggle at narrow widths; wider than 700 px the list shows anyway.
- **Branches collapse.** Upstream always shows every level. Ours opens the current page's ancestors only (the plan's server-set `open`); `expanded` opens every branch for the upstream look (the parity story uses it).
- **Extra `SectionNav` props:** `open`, `expanded`, `root` (upstream's `ilw-section-nav--root` on the first item, on by default), `id` (prefix for the label's id), `class`. Not ported: `collapse="true|false"` and `mode="manual"` (the markup contract is the manual form) and the narrow-width 100vw breakout (A5).
- **Colours.** Upstream's root plate (Storm 95) and toggle background (`#E8E9EB`, not a brand colour) become `--ilw-color--gray--background`, so they turn dark with the theme.
- **`Page`'s `backToTop` prop** renders `BackToTop` as the shell's last child, targeting the shell's `id`.
- **Back-to-top reveal on short pages.** A page that doesn't scroll has an inactive scroll timeline, so the animation has no effect and the link shows (upstream hides it at the top). It is reachable either way.
- **Back-to-top focus colours.** Upstream's focused icon keeps the button's background colour as its fill; ours uses `--ilw-color--focus--text` for the icon and border on the focus background, so the icon has contrast on the focus plate.

## Tests (every item)

- **DOM contract and ARIA:** play functions check the documented markup (classes, landmarks, `aria-current`, `aria-label`, the skip link's `href` matching `main`'s `id`).
- **Keyboard and focus** (`tests/e2e/page-chrome.spec.ts`, against fixture stories without play functions): Tab from the top reaches the skip link first and Enter moves focus into `main`; Tab order through the header at wide and narrow widths; `details` toggles with Enter and Space; popovers open from their buttons, Escape closes them and focus returns; back-to-top moves focus to the top so the next Tab is the skip link. Focus never falls to `<body>`.
- **axe:** every story, plus an "open" story per disclosure (a `details` with `open`, a popover shown from its play function).
- **Parity pairs** per item (`stories/parity/<Name>.parity.stories.svelte`): the toolkit element against our markup, in each theme variant. Toolkit sides that need the network (`ilw-footer` fetches the campus links) render whatever arrives; the footer's toolkit side supplies its own cookies button, so the toolkit never injects the OneTrust script into the test run.
- **AT smoke:** a section per item in `docs/at-smoke.md`, with the announcements listed above.

## Order

```text
PR 1  this plan
PR 2  B1 shell (no toggle), B3, B4, B5; Storybook's ilw-ui wrapper becomes B1
PR 3  B2 header + menus                                       (needs PR 2)
PR 4  B6 section nav, B7 back to top                          (needs PR 2; independent of PR 3)
```

The B1 dark-mode toggle island shipped on its own, ahead of PR 3 (it was planned with the header); PR 3 puts its host in the header.

PR 2 needs only A1 (merged). Its stories use `.ilw-format` where a real page would, so they look complete once A2 (#18) lands; nothing in PR 2 depends on A2's rules.

## Done when

- PRs 1–4 are merged and B1–B7 are ticked on #9.
- A page built from `ilw-ui/styles.css`, the brand stylesheet and this markup, with no script, looks like the toolkit page (parity stories) in light and dark, and passes axe and the keyboard specs; the dark-mode toggle is the only island.
- `IlwPage.svelte` is used only by `toolkit`/`both` stories.
- This plan moves to `docs/old-plans/`.
