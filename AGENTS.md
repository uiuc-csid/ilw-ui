# ilw-ui

Accessible Svelte 5 components that look and behave like the **Illinois Web Toolkit** (`ilw-*` Lit web components, <https://builder3.toolkit.illinois.edu/>). The goal is a full replacement for the toolkit in Svelte apps (same look, no `toolkit.js`/`toolkit.css`), plus the components the toolkit lacks (sortable headings, combobox, autocomplete, data table, pager, …). The roadmap is [docs/plans/2026-10-20-toolkit-replacement.md](docs/plans/2026-10-20-toolkit-replacement.md), tracked in uiuc-csid/ilw-ui#9. First consumer: ta-manager (`uiuc-csid/ta-manager`). [docs/old-plans/2026-10-16-ilw-ui-scaffold.md](docs/old-plans/2026-10-16-ilw-ui-scaffold.md) holds the design and the contracts that consumer depends on.

## Tech Stack

- **Node** (version in `.node-version`), **pnpm** (version in `package.json` `packageManager`), **mise** for tool versions and tasks
- **Svelte 5** (runes), **Vite 8**, **TypeScript**, `svelte-check`
- **Storybook 10** (`@storybook/svelte-vite`, Svelte CSF stories) — the workbench and the test fixture host
- **Vitest** (browser mode, Playwright provider) and **@playwright/test**
- **MCP servers** (`.mcp.json`): `svelte` (local `@sveltejs/mcp`: Svelte docs + autofixer), `storybook` (`@storybook/addon-mcp`, live only while `pnpm storybook` runs on :6006), `playwright` (drive stories in a real browser)
- **Agent skills** live in `.agents/skills/`; each is symlinked into `.claude/skills/` (`ln -s ../../.agents/skills/<name> .claude/skills/<name>`). `playwright-cli`: browser automation via `playwright cli`, from the pinned `playwright`. Refresh it after a Playwright bump with `pnpm exec playwright cli install --skills=agents`

## Source Layout

```text
src/
  core/        framework-agnostic code. index.ts is the public `ilw-ui/core` (nextSort, nextId, …); the modules it
               doesn't re-export are internal logic every framework's components share (islands, zag-input: the Zag
               workarounds, async-search, tabs, data-table, pager, sort, modal, dark-mode, layout, class-names)
  svelte/      Svelte components + index.ts exports: thin views over core/
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
               <ilw-page class="ilw-format"><main>, IlwUiPage.svelte wraps 'ilw-ui' ones in <Page format> (B1:
               skip link + <main id="main-content">, .ilw-format like the toolkit side); parameters.format = false
               drops .ilw-format (stories/Unformatted.stories.svelte: one per presentational component);
               parameters.shell = false skips both (whole-page stories)
```

The package ships source (`.svelte`/`.ts`); consumers' Vite compiles it. `exports`: `./core`, `./svelte`, `./styles.css`, `./styles/*`.

## Rules

- **Layering:** native HTML first, `ilw-ui` second. The toolkit is the visual reference, not a runtime dependency: no component may require `toolkit.js` or `toolkit.css` (since C1, none does).
- **Visual parity, APG behaviour:** a component that replaces a toolkit one matches its look (themes, dark mode) and gets a parity story rendering both side by side. Behaviour follows the WAI-ARIA APG, not the toolkit; the README records where they differ.
- **Islands and static pages:** every component mounts with `mount()` on a server-rendered element, with no SvelteKit imports and no DOM access at module top level. Presentational components also ship as documented markup plus classes in `styles.css`, usable from a server template without JavaScript.
- **Imports:** `src/` imports only `svelte`, `@zag-js/*`, `@tanstack/table-core`, `@tanstack/svelte-table`, `phosphor-svelte/lib/<Icon>` (one icon per import; the package index only for types) and its own files. Pin each library family exactly, in lockstep. `tests/unit/guard.test.ts` enforces it.
- **No HTML sinks:** no `{@html}`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function` in `src/`. Rich content is passed as Svelte snippets. Consumers run a strict CSP (same-origin scripts, no `eval`).
- **Brand colors and fonts only:** `--il-*` custom properties (from `https://cdn.brand.illinois.edu/illinois.css`) with fallbacks; never hard-coded hex. No rules on bare `th`/`td` (`<ilw-page class="ilw-format">` restyles them with high-specificity selectors).
- **Read the toolkit component's docs and source before replacing or wrapping it:** `https://builder3.toolkit.illinois.edu/component/<name>/index.html` and `https://github.com/web-illinois/<name>`. The prose docs lag the code; follow the code. While a component still wraps a toolkit element, upstream gaps go under **Known issues** in the README with an issue link, not patched around in markup.
- **DOM contracts are API.** ta-manager's tests select on the exact markup documented in the README; change it only deliberately.
- Pin every `storybook`/`@storybook/*` package to one exact version.
- **Sources stay under `src/`.** No top-level file or folder may share a dependency's name: Vite (root = this repo) resolved the bare `svelte` import to a top-level `svelte/` folder in the ta-manager spikes. `tests/unit/guard.test.ts` checks it; don't add an alias or `optimizeDeps.exclude` instead.

## Stories

Stories are the workbench, the review surface and the test fixtures, so each one must explain itself and look like the real thing.

- **Every story says what it tests and what to look for**, in an HTML comment directly above its `<Story>` (addon-svelte-csf turns it into the story's description on the Docs page):

  ```svelte
  <!--
    One line: what the story renders.

    **Why:** what is under test and how: what the play function checks, which spec the story backs, or why the story exists.

    **Review:** what a person should see, and what to try by hand (keys, clicks, light and dark).
  -->
  ```

  No story goes without one: fixture stories name their spec, parity `Toolkit` and `Side By Side` stories say what to compare. Change the comment when the story or its checks change.
- **Every story shows the component as it will look on a page.** Non-parity stories set `parameters.styles: 'ilw-ui'` (only our stylesheet, as a consumer loads it) and render inside the default shell (`<Page format>`: skip link, `<main>`, `.ilw-format`). Only whole-page stories opt out with `shell: false`, and only the Unformatted checks with `format: false`.
- **Give the component its page context**: the label, help text and neighbouring fields of a form, the heading and prose around a table or button row, enough rows to page, a realistic width. Not a bare widget on an empty canvas. Story-only wrappers (`stories/*Demo.svelte`, `parity/*Sample.svelte`) hold that context and say in a top comment what page they stand in for. The same goes for the markup examples in the README.
- **Story styles go in plain `.css` files**, imported by the story or helper (`stories/TooltipDemo.css`), never in a `<style>` block: Svelte's scoped `svelte-xxxx` classes would make its markup differ from the React twin's. Class names are global there, so prefix them with the helper's name (`.tooltip-demo-toolbar`). `tests/unit/stories.test.ts` checks it.

## Tests

Accessibility is proven by tests. Every component gets three layers, all driven by its stories:

1. **DOM contract + ARIA** — story `play` functions, run by `@storybook/addon-vitest` as Vitest browser tests on Chromium and WebKit (Vitest project `storybook-svelte`): `pnpm test`. After each story, `tests/contracts/setup.ts` normalizes its DOM and compares it with `stories/contracts/<story-id>.html` (see **DOM contract snapshots** below).
2. **APG keyboard + focus** — `tests/e2e/*.spec.ts`, real `page.keyboard` against `storybook-static/`; every step asserts focus never falls to `<body>` (`tests/e2e/focus.ts`). Needs `pnpm build-storybook` first, then `pnpm test:e2e`.
3. **axe** — `@storybook/addon-a11y` with `a11y.test = 'error'` (WCAG 2.0/2.1 A/AA) on every story. Every component has an "open" story so its open state is scanned. Disabling a rule on a story needs a comment with the reason and an issue link.

- **Parity pairs:** the `Toolkit` story of a pair sets `a11y: { test: 'off' }` with a comment: it documents upstream, it isn't our code. `Side By Side` stories are tagged `!test` (iframes of other stories, for people).
- Storybook runs a story's `play` function whenever the story loads, including in the static build. Playwright specs therefore use stories **without** a `play` function (the "fixture" stories), so their state is untouched when the spec starts.
- Run one Playwright spec: `pnpm exec playwright test tests/e2e/modal.spec.ts --project svelte-chromium` (projects `svelte-chromium` and `svelte-webkit`). Run one story file's tests: `pnpm vitest run --project storybook-svelte stories/Modal.stories.svelte`; add `--project unit` for the node tests.
- The specs' preview server listens on port 6007; set `ILW_E2E_PORT` to another port to run e2e in two worktrees at once, e.g. `ILW_E2E_PORT=6107 pnpm test:e2e`.
- `mise run test` runs everything: `pnpm test && pnpm build-storybook && pnpm test:e2e`. Also run `pnpm check` (svelte-check, fails on warnings).
- The toolkit CDN CAPTCHA-blocks automated browsers: tests load only the vendored copy. Refresh it with `mise run vendor:toolkit`.
- Manual screen-reader checks live in `docs/at-smoke.md`; running them is a human task.

### DOM contract snapshots

`stories/contracts/<story-id>.html` is each story's DOM after its render and `play`: the canvas, plus any modal, popover or live region it added to `<body>`. They are the checked-in DOM contract, and every browser (and, from R0d, the React build) compares against the same file.

- `tests/contracts/normalize.ts` makes them comparable: comments dropped, whitespace collapsed and dropped beside block-level boxes, attributes and `style` declarations sorted, Svelte's `svelte-xxxx` classes stripped, form state read from `.value`/`.checked`/`.selected`, and generated ids (`nextId`, `$props.id()`, `useId`) numbered in order of appearance (`ilw-field-{1}`, `{2}-label`). Zag's announcer (`[data-live-announcer]`) is left out: Zag adds it only on Apple platforms, and CI runs on Linux. If two browsers (or macOS and CI) disagree, fix the normalizer; never keep one file per browser.
- A new story writes its file on the first local run; commit it. CI never writes: a missing or different file fails the story. After a deliberate markup change, rewrite them with `pnpm vitest run --project storybook-svelte -u`, then run again without `-u` (both browsers write the same file, so the second run proves they agree), review the diff, and treat it as a contract change (README, release note).
- Parity `Toolkit` stories are skipped (upstream markup). Another story opts out with `parameters: { contract: false }`, which needs a comment with the reason and an issue link, like disabling an axe rule.

### No flaky tests

A test that sometimes fails is a bug in the test (or the component), never noise. These rules keep the suite deterministic:

- **Wait on a condition, never on the clock.** Use `waitFor`/`expect.poll` in play functions and Playwright's auto-waiting locators and `expect`. No `setTimeout` sleeps, `waitForTimeout` or fixed delays. To let a known frame or task pass (e.g. Zag's deferred focus), await `requestAnimationFrame` or a zero-delay task and say why in a comment.
- **No retries.** Vitest and Playwright run with `retries: 0`; don't raise it, and don't wrap assertions in loops that swallow failures.
- **Deterministic inputs.** Fixed sample data and ids (no `Math.random`, no `Date.now()` in what is asserted), the Light theme unless the story sets `globals.theme`, a fixed viewport where layout matters, `await document.fonts.ready` before measuring text, and `behavior: 'instant'` for scrolling. A `mouse.wheel` stays short of the page's end: WebKit can rubber-band past it, and hit tests then miss everything. No network: only the vendored toolkit and local assets.
- **Every story and spec stands alone.** It must pass when run alone, in any order and on both Chromium and WebKit. Anything mounted outside the canvas (modals, live regions, listeners on `window`) is removed by the test that made it.
- **Assert outcomes, not timing or incidental details.** Check roles, names, states, focus and computed styles; don't count renders or depend on animation progress.
- **Prove a new or changed test is stable** before merging: `pnpm exec playwright test <spec> --repeat-each 20`, and `pnpm vitest run --project storybook-svelte --repeats 10 stories/<Name>.stories.svelte` for its stories (repeats also prove its contract snapshot doesn't depend on what ran before).
- **A flake found in CI gets fixed, not rerun away.** If it can't be fixed in the PR that found it, skip the test with a comment linking an issue that names the failure, and fix it before the next release.

## Plans

- Write plans as `docs/plans/YYYY-MM-DD-<topic>.md`. Pending and in-progress plans live in `docs/plans/`.
- When a plan is completed, move it (`git mv`) to `docs/old-plans/`, keeping its filename.
