# ilw-ui

Accessible Svelte 5 components that look and behave like the **Illinois Web Toolkit** (`ilw-*` Lit web components, <https://builder3.toolkit.illinois.edu/>). The goal is a full replacement for the toolkit in Svelte apps (same look, no `toolkit.js`/`toolkit.css`), plus the components the toolkit lacks (sortable headings, combobox, autocomplete, data table, pager, …). The roadmap is [docs/plans/2026-10-20-toolkit-replacement.md](docs/plans/2026-10-20-toolkit-replacement.md), tracked in uiuc-csid/ilw-ui#9. First consumer: ta-manager (`uiuc-csid/ta-manager`). [docs/old-plans/2026-10-16-ilw-ui-scaffold.md](docs/old-plans/2026-10-16-ilw-ui-scaffold.md) holds the design and the contracts that consumer depends on.

## Tech Stack

- **Node** (version in `.node-version`), **pnpm** (version in `package.json` `packageManager`), **mise** for tool versions and tasks
- **Svelte 5** (runes), **Vite 8**, **TypeScript**, `svelte-check`
- **Storybook 10** (`@storybook/svelte-vite`, Svelte CSF stories) — the workbench and the test fixture host
- **Vitest** (browser mode, Playwright provider) and **@playwright/test**
- **MCP servers** (`.mcp.json`): `svelte` (local `@sveltejs/mcp`: Svelte docs + autofixer), `storybook` (`@storybook/addon-mcp`, live only while `pnpm storybook` runs on :6006), `playwright` (drive stories in a real browser)

## Source Layout

```text
src/
  core/        framework-agnostic helpers (nextSort, nextId)
  svelte/      Svelte components + index.ts exports (zag-input.ts: Zag workarounds shared by Combobox and Autocomplete)
  styles.css   index: @imports src/styles/*.css (brand tokens only)
  styles/      tokens.css (--ilw-color--*, theme classes, dark mode), components.css
stories/       *.stories.svelte (Svelte CSF) + story-only helper components
  parity/      <Name>.parity.stories.svelte: Toolkit / IlwUi / Side By Side pairs
tests/
  unit/        node Vitest: core helpers, import/sink guard, tokens.css vs the vendored toolkit.css
  e2e/         Playwright keyboard/focus specs against the static Storybook build
vendor/illinois-toolkit/   pinned toolkit.js/.css, served by Storybook at /toolkit
scripts/       vendor-footer.mjs (mise run vendor:footer: refresh src/core/campus-footer.ts from the brand API)
.storybook/    Storybook config; styles.ts adds toolkit.css and/or styles.css per story from parameters.styles
               ('toolkit' | 'ilw-ui' | 'both', default 'both'); IlwPage.svelte wraps 'toolkit'/'both' stories in
               <ilw-page class="ilw-format"><main>, IlwUiPage.svelte wraps 'ilw-ui' ones in the Page shell (B1:
               skip link + <main id="main-content">); parameters.shell = false skips both (whole-page stories)
```

The package ships source (`.svelte`/`.ts`); consumers' Vite compiles it. `exports`: `./core`, `./svelte`, `./styles.css`, `./styles/*`.

## Rules

- **Layering:** native HTML first, `ilw-ui` second. The toolkit is the visual reference, not a runtime dependency: new components never require `toolkit.js` or `toolkit.css`. Components that still wrap a toolkit element (today: the modal helpers on `<ilw-modal>`) keep working until their replacement lands.
- **Visual parity, APG behaviour:** a component that replaces a toolkit one matches its look (themes, dark mode) and gets a parity story rendering both side by side. Behaviour follows the WAI-ARIA APG, not the toolkit; the README records where they differ.
- **Islands and static pages:** every component mounts with `mount()` on a server-rendered element, with no SvelteKit imports and no DOM access at module top level. Presentational components also ship as documented markup plus classes in `styles.css`, usable from a server template without JavaScript.
- **Imports:** `src/` imports only `svelte`, `@zag-js/*`, `@tanstack/table-core`, `@tanstack/svelte-table` and its own files. Pin each library family exactly, in lockstep. `tests/unit/guard.test.ts` enforces it.
- **No HTML sinks:** no `{@html}`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function` in `src/`. Rich content is passed as Svelte snippets. Consumers run a strict CSP (same-origin scripts, no `eval`).
- **Brand colors and fonts only:** `--il-*` custom properties (from `https://cdn.brand.illinois.edu/illinois.css`) with fallbacks; never hard-coded hex. No rules on bare `th`/`td` (`<ilw-page class="ilw-format">` restyles them with high-specificity selectors).
- **Read the toolkit component's docs and source before replacing or wrapping it:** `https://builder3.toolkit.illinois.edu/component/<name>/index.html` and `https://github.com/web-illinois/<name>`. The prose docs lag the code; follow the code. While a component still wraps a toolkit element, upstream gaps go under **Known issues** in the README with an issue link, not patched around in markup.
- **DOM contracts are API.** ta-manager's tests select on the exact markup documented in the README; change it only deliberately.
- Pin every `storybook`/`@storybook/*` package to one exact version.
- **Sources stay under `src/`.** No top-level file or folder may share a dependency's name: Vite (root = this repo) resolved the bare `svelte` import to a top-level `svelte/` folder in the ta-manager spikes. `tests/unit/guard.test.ts` checks it; don't add an alias or `optimizeDeps.exclude` instead.

## Tests

Accessibility is proven by tests. Every component gets three layers, all driven by its stories:

1. **DOM contract + ARIA** — story `play` functions, run by `@storybook/addon-vitest` as Vitest browser tests on Chromium and WebKit: `pnpm test`.
2. **APG keyboard + focus** — `tests/e2e/*.spec.ts`, real `page.keyboard` against `storybook-static/`; every step asserts focus never falls to `<body>` (`tests/e2e/focus.ts`). Needs `pnpm build-storybook` first, then `pnpm test:e2e`.
3. **axe** — `@storybook/addon-a11y` with `a11y.test = 'error'` (WCAG 2.0/2.1 A/AA) on every story. Every component has an "open" story so its open state is scanned. Disabling a rule on a story needs a comment with the reason and an issue link.

- **Parity pairs:** the `Toolkit` story of a pair sets `a11y: { test: 'off' }` with a comment: it documents upstream, it isn't our code. `Side By Side` stories are tagged `!test` (iframes of other stories, for people).
- Storybook runs a story's `play` function whenever the story loads, including in the static build. Playwright specs therefore use stories **without** a `play` function (the "fixture" stories), so their state is untouched when the spec starts.
- Run one Playwright spec: `pnpm exec playwright test tests/e2e/modal.spec.ts --project chromium`.
- `mise run test` runs everything: `pnpm test && pnpm build-storybook && pnpm test:e2e`. Also run `pnpm check` (svelte-check, fails on warnings).
- The toolkit CDN CAPTCHA-blocks automated browsers: tests load only the vendored copy. Refresh it with `mise run vendor:toolkit`.
- Manual screen-reader checks live in `docs/at-smoke.md`; running them is a human task.

## Plans

- Write plans as `docs/plans/YYYY-MM-DD-<topic>.md`. Pending and in-progress plans live in `docs/plans/`.
- When a plan is completed, move it (`git mv`) to `docs/old-plans/`, keeping its filename.
