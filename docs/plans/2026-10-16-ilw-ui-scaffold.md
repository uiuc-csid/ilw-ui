# `ilw-ui`: Illinois Web Toolkit–compatible Svelte component library

_Standalone repository. Starting brief for an agent with no access to the consuming app's history. Everything needed is in this document; references to **ta-manager** (GitHub `uiuc-csid/ta-manager`) are for context and for the contracts the first consumer depends on._

## Context

ta-manager (a Django app for UIUC TA assignment) is moving its frontend from hand-written, string-built ES modules to **Svelte 5 islands** mounted in server-rendered pages. Its UI follows the University of Illinois brand through the **Illinois Web Toolkit** (`ilw-*` Lit web components, https://builder3.toolkit.illinois.edu/). The toolkit has no combobox, select, table, chips or toggle group, and its modal lacks events and focus restore, so ta-manager needs a small library of accessible widgets that look and behave like the toolkit.

That library is **`ilw-ui`**, built as its own repository so other campus projects can use it. Its design, decided in ta-manager's migration plan:

- **Layering:** Illinois toolkit first, native HTML second, `ilw-ui` third. Never re-implement what the toolkit already does well (page chrome, accordion).
- **Headless state machines:** **Zag.js** (`@zag-js/svelte`) for composite widgets (combobox, etc.) and **TanStack Table v9** for tables. We write the markup and spread their props on it, so DOM contracts can be matched exactly. Neither is needed for this first deliverable.
- **Structure:** framework-agnostic `core/`, a `svelte/` adapter, and `styles.css` using brand tokens. React/Vue adapters may come later on the same `core/`.
- **Accessibility is proven by tests, not assumed:** every component gets (1) DOM-contract/ARIA-state tests, (2) APG keyboard/focus tests, (3) axe scans with the popup/modal open, plus a manual screen-reader checklist.
- **Storybook is the workbench and the test fixture host.** Every component state that matters is a story; the same stories drive all three test layers.

**This deliverable:** repository scaffold, Storybook, the three-layer test harness, CI, and the two lowest-risk components: **`SortableTh`** and **`Modal`** (+ `alert()`/`confirm()`). Combobox, Autocomplete, Pager and DataTable come later, built on this harness.

## Rules

- Source in `src/` imports only `svelte` and its own files (later also `@zag-js/*`, `@tanstack/*`). A guard test enforces it.
- No `{@html}`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` anywhere in `src/`. Rich content is passed as Svelte snippets.
- **Brand colors and fonts only.** Use the brand palette's `--il-*` custom properties (from `https://cdn.brand.illinois.edu/illinois.css`) with fallbacks; never hard-coded hex. No rules on bare `th`/`td` (consumers using `<ilw-page class="ilw-format">` restyle them with high-specificity selectors).
- Read each toolkit component's docs (`https://builder3.toolkit.illinois.edu/component/<name>/index.html`) and source (`https://github.com/web-illinois/<name>`) before wrapping it. The prose docs lag the code; follow the code.
- Pin `@zag-js/*` and `@tanstack/*` exactly (lockstep) when they're added. Pin all `storybook`/`@storybook/*` to one exact version.
- Simplicity first: no components, props or options a consumer hasn't asked for.
- License MIT (matches the toolkit) unless told otherwise; package `private: true` until the name is settled.

## Tooling

- **Node 24.22.0** (`.node-version`), **pnpm** (version via `packageManager`), **mise** for tool versions and tasks (`mise.toml`: `idiomatic_version_file_enable_tools = ['pnpm', 'node']`).
- **Svelte ^5.57**, **Vite 8**, TypeScript ^5.9, `svelte-check`.
- **Vitest** (browser mode, Playwright provider), **@playwright/test**, **Storybook** (current major; confirm Vite 8 + Svelte 5 support before pinning and record the version here). **Pinned: Storybook 10.6.2** (`@storybook/svelte-vite` peers `vite ^8`, `svelte ^5`), `@storybook/addon-svelte-csf` 5.1.5, Vitest 5.0.5, Playwright 1.64.1.
- GitHub Actions, actions pinned by commit SHA with a version comment.

## Layout

```
.node-version  mise.toml  package.json  pnpm-lock.yaml  LICENSE  README.md
tsconfig.json  svelte.config.js  vite.config.ts  vitest.config.ts  playwright.config.ts
.storybook/
  main.ts            @storybook/svelte-vite; addons; staticDirs (vendor/illinois-toolkit → /toolkit)
  preview.ts         imports ../src/styles.css; a11y params; ilw-page decorator
  preview-head.html  toolkit css/js + brand css
  vitest.setup.ts    setProjectAnnotations
vendor/illinois-toolkit/   toolkit.js, toolkit.css, README (source URL, date, how to refresh)
src/
  core/index.ts      framework-agnostic helpers (nextSort, ids)
  svelte/index.ts    component exports
  svelte/SortableTh.svelte
  svelte/Modal.svelte, svelte/modal.ts (alert/confirm)
  styles.css
stories/  SortableTh.stories.svelte  Modal.stories.svelte
tests/
  unit/*.test.ts     core helpers + import/sink guard
  e2e/*.spec.ts      Playwright keyboard/focus specs + focus helper
docs/plans/          plans (completed ones move to docs/old-plans/)
docs/at-smoke.md     manual NVDA+Firefox / VoiceOver+Safari checklist + dated results log
.github/workflows/ci.yml
```

`package.json` `exports`: `"./core"`, `"./svelte"`, `"./styles.css"`, each with `types`. Peer dependency `svelte ^5.57`. Ship source (`.svelte`/`.ts`); consumers' Vite compiles it. No build step yet.

## Steps

Each step ends with a check; don't move on until it passes.

### 1. Scaffold
- Commit this plan (`docs/plans/`) with the scaffold; add `mise.toml`, `.node-version`, `package.json` (scripts: `check`, `test`, `test:e2e`, `storybook`, `build-storybook`), `tsconfig.json` (extends `@tsconfig/svelte`), `svelte.config.js` (`vitePreprocess`), `.gitignore` (`node_modules`, `storybook-static`, `test-results`, `playwright-report`), `LICENSE`, README stub.
- **Check:** `pnpm install` and `pnpm check` pass.

### 2. Vendor the toolkit
- The toolkit CDN (`https://cdn.toolkit.illinois.edu/3/toolkit.js` and `toolkit.css`) sits behind a WAF that **CAPTCHA-blocks automated browsers**, so tests must never load it. Add a mise task `vendor:toolkit` that downloads both into `vendor/illinois-toolkit/` and rewrites `url(../svg/` → `url(https://cdn.toolkit.illinois.edu/svg/` in the CSS (ta-manager's `mise.toml` has the same task, and its repo holds a current vendored pair). Commit the vendored files. First check whether the toolkit is published on npm; if a pinned npm package exists, prefer it and say so in the README.
- **Check:** files committed; README in `vendor/` records source and date.

### 3. Storybook
- `@storybook/svelte-vite`, `@storybook/addon-svelte-csf` (stories in Svelte CSF), `@storybook/addon-a11y`, `@storybook/addon-vitest`, `@storybook/addon-docs`.
- `preview-head.html` loads `/toolkit/toolkit.css`, `/toolkit/toolkit.js` (`type="module"`) and the brand stylesheet. Tests must pass even if the brand CSS fails to load (token fallbacks).
- Global decorator wraps each story in `<ilw-page class="ilw-format"><main>…</main></ilw-page>` so toolkit styling (including its table restyling) applies as in real pages.
- **Check:** `pnpm storybook` renders an `<ilw-modal>` with toolkit styling; `pnpm build-storybook` produces `storybook-static/`.

### 4. Test harness — the three layers
1. **DOM contract + ARIA** — story `play` functions (`storybook/test`: `expect`, `within`, `userEvent`) run as Vitest browser tests by `@storybook/addon-vitest`, on **Chromium and WebKit**, headless.
2. **APG keyboard + focus** — `@playwright/test` specs load `storybook-static/iframe.html?id=<story-id>&viewMode=story` (Playwright `webServer` serving the static build, e.g. `vite preview --outDir storybook-static`). Use real `page.keyboard`. A shared helper asserts after every step that `document.activeElement` is never `<body>`.
3. **axe with the popup open** — `@storybook/addon-a11y` with `parameters.a11y.test = 'error'` globally, run tags `wcag2a, wcag2aa, wcag21a, wcag21aa`. Every component has an "open" story so its open state is scanned. Disabling a rule on a story needs a comment with the reason and an issue link.

Plus a node-environment `unit` Vitest project for `core/` and the guard.
- `vitest.config.ts` projects: `unit`, `storybook` (`storybookTest()` plugin, `browser.provider: playwright`, instances chromium + webkit).
- **Check:** a throwaway `Example` story with a deliberate axe violation (e.g. a button with no name) fails the run, then passes once fixed; a Playwright spec opens it. Delete it afterwards.

### 5. `SortableTh`
A sortable column heading. Contract (matches ta-manager's current `sortableTh()` so its tests keep passing after the switch):
- Markup: `<th scope="col" aria-sort="ascending|descending"><button type="button" class="th-sort on" data-sort="{key}">{label}<span aria-hidden="true">&nbsp;↑</span></button></th>`.
  - `aria-sort` only on the sorted column; class `on` only there; arrow `↑` ascending / `↓` descending, preceded by a **non-breaking space**, `aria-hidden`; unsorted columns have no arrow span.
- Props: `key`, `label`, `sort: { key: string, dir: 1 | -1 }`, `onsort(key)`.
- `core` exports `nextSort(sort, key)`: same key → `{ key, dir: -dir }`; another key → `{ key, dir: 1 }`.
- After a sort, focus stays on the clicked button (keyed rendering; the legacy code re-focused a replacement).
- Stories: unsorted, ascending, descending, and a small three-column table whose rows sort on click.
- Tests: play asserts exact attributes/classes/text and that `aria-sort` flips; Playwright: Tab to a heading, Enter and Space toggle, focus remains on the button; unit: `nextSort`.

### 6. `Modal`, `alert()`, `confirm()`
Wraps the toolkit's `<ilw-modal>` (https://github.com/web-illinois/ilw-modal); not a separate dialog implementation, which would add a second focus trap. Contract (matches ta-manager's `openModal`/`alertModal`/`confirmModal`, which its e2e helpers select on):
- One `<ilw-modal id="app-modal-N" size="small|…">` per open (N from a module counter), appended to `document.body`, opened with `.open = true`, **removed from the DOM** when closed.
- Content: `<h2 slot="title">` when a title is given; the body from a **Svelte snippet** (for `alert`/`confirm`: a `<p>` with the plain-text message); then `<div class="modal-buttons">` holding `<button type="button" class="ilw-button">` per button, in the given order. Default buttons: one, `'Got it'` → `true`.
- Resolution: a button click resolves its `value`; Escape, the × button and a backdrop click resolve `null`. `ilw-modal` fires no close event, so close is detected by **one `MutationObserver` on the reflected `open` attribute**, inside the component, which also emits `onclose(reason)` (`'button' | 'dismiss'`).
- `confirm({ title, message, confirmLabel })` → buttons `[Cancel (false, autofocus), confirmLabel (true)]`; resolves `true` only for the confirm button. `alert({ title, message })` resolves when dismissed.
- Autofocus: `ilw-modal` honours `autofocus` only on direct slotted children, so focus the `[autofocus]` button after `modal.updateComplete`.
- Focus returns to `returnFocusEl` on close (default: `document.activeElement` at open).
- **Modality (new):** set `inert` on the other children of `body` while open; restore exactly the prior state on close.
- Wait for `customElements.whenDefined('ilw-modal')` before opening. README: the host page must load the toolkit.
- Stories: alert, confirm, custom buttons, rich snippet body, "open" (for axe), trigger button (for focus return).
- Tests: play — structure, id increments, button order, autofocus target, resolve values for each close path, `inert` set and cleared, element removed; Playwright — Tab stays inside the modal, Escape closes, focus returns to the trigger, never on `<body>`; axe on the open story.
- Known upstream `ilw-modal` gaps: no open/close events, Tab order snapshotted at open, `aria-describedby` covers the buttons. If axe or the keyboard specs hit one, list it under **Known issues** in the README with an upstream issue link instead of patching around it in markup.

### 7. Guards, styles, docs
- `tests/unit/guard.test.ts`: scan `src/**` for disallowed imports and the banned HTML sinks; fail with file:line. Verify once by adding a forbidden import.
- `styles.css`: only what these two components need (e.g. `.th-sort` as an unstyled-looking heading button; `.modal-buttons` layout), brand tokens with fallbacks.
- `docs/at-smoke.md`: per-component checklist for NVDA+Firefox and VoiceOver+Safari, and an empty dated results log. Running it is a human task; say so in the README.
- README: what the library is, install/usage, toolkit requirement, tokens, components and their props, the three test layers and how to run them, the import rule, Known issues.

### 8. CI and tasks
- `mise.toml` tasks: `storybook`, `test` (`pnpm test && pnpm build-storybook && pnpm test:e2e`), `vendor:toolkit`.
- `.github/workflows/ci.yml` on push/PR: `pnpm/action-setup` + `actions/setup-node` (`node-version-file: .node-version`, `cache: pnpm`) → `pnpm install --frozen-lockfile` → `pnpm exec playwright install --with-deps chromium webkit` → `pnpm check` → `pnpm test` (JUnit) → `pnpm build-storybook` → `pnpm test:e2e` (JUnit) → publish JUnit reports → upload `storybook-static` as an artifact.

## Consumption by ta-manager (for later; not this deliverable)

- ta-manager will depend on this repo — during development via a pnpm `link:` to a local checkout, later a pinned git dependency — and import `ilw-ui/svelte`, `ilw-ui/core`, `ilw-ui/styles.css`. Its pages already load the toolkit and brand CSS, and wrap content in `<ilw-page class="ilw-format">`.
- Its CSP allows only same-origin scripts and no `eval`: nothing in this library may use `eval`, `new Function`, or inline `<script>`/`style` attributes injected at runtime beyond what Svelte emits.
- Its e2e tests select `ilw-modal[open] .ilw-button`, buttons by exact accessible name, the modal body via `ilw-modal p`, and wait for the modal to be `detached` on close — hence the Modal contract above.
- Next components, in order: `Combobox` (Zag), `Autocomplete` (Zag), `SortableTh`-driven `DataTable` + `Pager` (TanStack). Each follows steps 4–7.

## Done when

- `pnpm check`, `pnpm test` (unit + stories on Chromium and WebKit) and `pnpm test:e2e` pass locally and in CI.
- Every story passes axe with `test: 'error'`.
- Every contract bullet for `SortableTh` and `Modal` is asserted by a test.
- README, `docs/at-smoke.md` and the vendored toolkit README are written.

## Verification

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build-storybook
pnpm test:e2e
```

Then `pnpm storybook`: check both components visually and open the a11y panel on each story.

## Out of scope

Combobox, Autocomplete, Pager, DataTable, Zag/TanStack dependencies, publishing to npm or hosting Storybook, React/Vue adapters, visual-regression snapshots, any change to ta-manager.

## Open questions (non-blocking)

1. Final package name and npm scope; who owns the repo.
2. Host the built Storybook (e.g. GitHub Pages) for reviewers?
3. Is the toolkit available as a pinned npm package (replacing the vendored copy)?
