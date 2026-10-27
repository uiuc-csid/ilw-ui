# ilw-ui

Accessible Svelte 5 and React 19 components that look and behave like the **Illinois Web Toolkit** (`ilw-*` Lit web components, <https://builder3.toolkit.illinois.edu/>). The goal is a full replacement for the toolkit in Svelte and React apps (same look, no `toolkit.js`/`toolkit.css`), plus the components the toolkit lacks (sortable headings, combobox, autocomplete, data table, pager, …). Both frameworks render the same markup with the same `styles.css`, over a shared `core/`. The roadmap is [docs/plans/2026-10-20-toolkit-replacement.md](docs/plans/2026-10-20-toolkit-replacement.md), tracked in uiuc-csid/ilw-ui#9; the React side follows [docs/plans/2026-10-27-react-components.md](docs/plans/2026-10-27-react-components.md). First consumer: ta-manager (`uiuc-csid/ta-manager`). [docs/old-plans/2026-10-16-ilw-ui-scaffold.md](docs/old-plans/2026-10-16-ilw-ui-scaffold.md) holds the design and the contracts that consumer depends on.

## Tech Stack

- **Node** (version in `.node-version`), **pnpm** (version in `package.json` `packageManager`), **mise** for tool versions and tasks
- **Svelte 5** (runes), **React 19** (`@vitejs/plugin-react`), **Vite 8**, **TypeScript**: `svelte-check`, plus `tsc -p tsconfig.react.json` for the React side
- **ESLint 9** on the React paths only: `eslint-plugin-react-hooks` and `eslint-plugin-jsx-a11y`, recommended configs (`eslint.config.js`; jsx-a11y supports ESLint up to 9)
- **Storybook 10**, twice: `@storybook/svelte-vite` (`.storybook/`, Svelte CSF) and `@storybook/react-vite` (`.storybook-react/`, CSF 3 in `.tsx`) — the workbenches and the test fixture hosts
- **Vitest** (browser mode, Playwright provider) and **@playwright/test**
- **MCP servers** (`.mcp.json`): `svelte` (local `@sveltejs/mcp`: Svelte docs + autofixer), `storybook` and `storybook-react` (`@storybook/addon-mcp`, live only while `pnpm storybook` runs on :6006, or `pnpm storybook:react` on :6008), `playwright` (drive stories in a real browser)
- **Agent skills** live in `.agents/skills/`; each is symlinked into `.claude/skills/` (`ln -s ../../.agents/skills/<name> .claude/skills/<name>`). `playwright-cli`: browser automation via `playwright cli`, from the pinned `playwright`. Refresh it after a Playwright bump with `pnpm exec playwright cli install --skills=agents`

## Source Layout

```text
src/
  core/        framework-agnostic code. index.ts is the public `ilw-ui/core` (nextSort, nextId, …); the modules it
               doesn't re-export are internal logic every framework's components share (islands, zag-input: the Zag
               workarounds, async-search, tabs, data-table, pager, sort, modal, dark-mode, layout, class-names,
               section-nav)
  svelte/      Svelte components + index.ts exports: thin views over core/
  react/       React components (.tsx) + index.ts exports, the twins of svelte/'s under the same names; index.ts
               groups them by row of the React plan
  styles.css   index: @imports src/styles/*.css (brand tokens only)
  styles/      tokens.css (--ilw-color--*, theme classes, dark mode), components.css
stories/       *.stories.svelte (Svelte CSF) + story-only helper components
  parity/      <Name>.parity.stories.svelte: Toolkit / IlwUi / Side By Side pairs
  react/       the React twins: <Name>.stories.tsx, parity/<Name>.parity.stories.tsx (IlwUi only), *Demo.tsx
  plays/       play functions both twins import (PlayFunctionContext<WebRenderer>)
  contracts/   <story-id>.html: each story's DOM contract, shared by both frameworks
tests/
  unit/        node Vitest: core helpers, import/sink guard, tokens.css vs the vendored toolkit.css, the twins
               check, react-ssr (both adapters import in node; React presentational markup = Svelte's)
  e2e/         Playwright keyboard/focus specs against both static Storybook builds
  contracts/   the contract snapshot hook and its normalizer
  twins-pending/  <Component>.txt: Svelte stories and exports with no React twin yet; a port deletes its file
  twins.ts     what the twins check, compare-index and the e2e helper share (no-twin rule, pending lists)
vendor/illinois-toolkit/   pinned toolkit.js/.css, served by Storybook at /toolkit
scripts/       vendor-footer.mjs (mise run vendor:footer: refresh src/core/campus-footer.ts from the brand API);
               compare-index.mjs (after both builds: the React build's story ids = the Svelte build's, minus
               no-twin and pending stories)
.storybook/    Storybook config; shared.ts holds the framework-free preview annotations both Storybooks use (theme
               global, styles loader, a11y); styles.ts adds toolkit.css and/or styles.css per story from parameters.styles
               ('toolkit' | 'ilw-ui' | 'both', default 'both'); IlwPage.svelte wraps 'toolkit'/'both' stories in
               <ilw-page class="ilw-format"><main>, IlwUiPage.svelte wraps 'ilw-ui' ones in <Page format> (B1:
               skip link + <main id="main-content">, .ilw-format like the toolkit side); parameters.format = false
               drops .ilw-format (stories/Unformatted.stories.svelte: one per presentational component);
               parameters.shell = false skips both (whole-page stories)
.storybook-react/  the React Storybook: same addons, static files and <head>; preview.tsx is the same shell
               decorator with the React Page, inside <StrictMode>
```

The package ships source (`.svelte`/`.ts`/`.tsx`); consumers' Vite compiles it. `exports`: `./core`, `./svelte`, `./react`, `./styles.css`, `./styles/*`.

## Rules

- **Layering:** native HTML first, `ilw-ui` second. The toolkit is the visual reference, not a runtime dependency: no component may require `toolkit.js` or `toolkit.css` (since C1, none does).
- **Both frameworks, in lockstep:** every component ships in Svelte and React in the same PR, and a roadmap row is done only when both pass all three test layers. The React twin renders the same documented markup (its stories share the Svelte twin's contract files) with the same `styles.css`; its API follows the React plan's "React API conventions" (`className`, `onSort`, snippets → `ReactNode` or render props, `$bindable` → controlled `value` + callback). Components that predate the React toolchain are ported by the plan's rows; until then their stories and exports are listed in `tests/twins-pending/`.
- **Visual parity, APG behaviour:** a component that replaces a toolkit one matches its look (themes, dark mode) and gets a parity story rendering both side by side. The `Toolkit` and `Side By Side` stories (and Chromatic) live in the Svelte build only; the React build carries the `IlwUi` side of every pair not tagged `framework-neutral`, against the same contract file, so a React replacement matches the toolkit exactly when its Svelte twin does. Behaviour follows the WAI-ARIA APG, not the toolkit; the README records where they differ.
- **Islands and static pages:** every component mounts on a server-rendered element (Svelte's `mount()`, React's `mountIslands`), with no SvelteKit or Next.js imports, no `'use client'`, and no DOM access at module top level or (React) during render: DOM work happens in effects and handlers. Presentational components also ship as documented markup plus classes in `styles.css`, usable from a server template without JavaScript. `tests/unit/react-ssr.test.ts` imports both adapters in node and renders each React presentational component on the server.
- **Imports:** each part of `src/` has its own allow-list. `src/svelte/` imports only `svelte`, `@zag-js/*`, `@tanstack/table-core`, `@tanstack/svelte-table`, `phosphor-svelte/lib/<Icon>` (one icon per import; the package index only for types); `src/react/` only `react`, `react/jsx-runtime`, `react-dom`, `react-dom/client`, `@zag-js/*`, `@tanstack/table-core`, `@tanstack/react-table`, `@phosphor-icons/react/dist/ssr/<Icon>` (the index only for types); `src/core/` only `@tanstack/table-core`. Relative imports stay in the file's own subtree, `src/core/` or `src/styles/`. Pin each library family exactly, in lockstep. `tests/unit/guard.test.ts` enforces it.
- **No HTML sinks:** no `{@html}`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `dangerouslySetInnerHTML`, `document.write`, `eval`, `new Function` in `src/`. Rich content is passed as Svelte snippets or React children. Consumers run a strict CSP (same-origin scripts, no `eval`).
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
- **Every Svelte story has a React twin** in `stories/react/` (same path, `.stories.tsx`), unless it is tagged `framework-neutral` (it renders only markup and CSS, or calls only `core/`) or is a parity `Toolkit` or `Side By Side` story. The twin has the same `title` and meta `tags`, exports the Svelte story's `exportName` with its name as an explicit `name:` (so the ids match, e.g. `page-chrome-page--shell-only`), and carries the same description as a JSDoc block with a ` * ` gutter directly above the export (addon-docs reads only `/**` blocks):

  ```tsx
  /**
   * One line: what the story renders.
   *
   * **Why:** …
   *
   * **Review:** …
   */
  export const ShellOnly: Story = { name: 'Shell only', render: () => <Page …>…</Page> };
  ```

  Play bodies live in `stories/plays/<name>.ts`, typed `PlayFunctionContext<WebRenderer>`, and both twins import them; write `play:` literally (not spread), so Storybook tags the story `play-fn`. React demos (`stories/react/*Demo.tsx`) reproduce the Svelte demo's ids, test ids, `<output>`s, page context and top comment; sample data (`table-data.ts`, `header-sample.ts`, …) is imported, not copied. `tests/unit/twins.test.ts` checks titles, names, tags (`play-fn` included) and descriptions, and that `ilw-ui/react` exports what `ilw-ui/svelte` does (`createDataTable` → `useDataTable`). Stories and exports not ported yet are listed in `tests/twins-pending/<Component>.txt`; the port deletes its component's file, and the test fails on any line a twin has made stale.
- **Every story shows the component as it will look on a page.** Non-parity stories set `parameters.styles: 'ilw-ui'` (only our stylesheet, as a consumer loads it) and render inside the default shell (`<Page format>`: skip link, `<main>`, `.ilw-format`). Only whole-page stories opt out with `shell: false`, and only the Unformatted checks with `format: false`.
- **Give the component its page context**: the label, help text and neighbouring fields of a form, the heading and prose around a table or button row, enough rows to page, a realistic width. Not a bare widget on an empty canvas. Story-only wrappers (`stories/*Demo.svelte`, `parity/*Sample.svelte`) hold that context and say in a top comment what page they stand in for. The same goes for the markup examples in the README.
- **Story styles go in plain `.css` files**, imported by the story or helper (`stories/TooltipDemo.css`), never in a `<style>` block: Svelte's scoped `svelte-xxxx` classes would make its markup differ from the React twin's. Class names are global there, so prefix them with the helper's name (`.tooltip-demo-toolbar`). `tests/unit/stories.test.ts` checks it.

## Tests

Accessibility is proven by tests. Every component gets three layers, all driven by its stories:

1. **DOM contract + ARIA** — story `play` functions, run by `@storybook/addon-vitest` as Vitest browser tests on Chromium and WebKit (Vitest projects `storybook-svelte` and `storybook-react`; the React stories render inside `<StrictMode>`): `pnpm test`. After each story, `tests/contracts/setup.ts` normalizes its DOM and compares it with `stories/contracts/<story-id>.html`, the same file for both twins (see **DOM contract snapshots** below).
2. **APG keyboard + focus** — `tests/e2e/*.spec.ts`, real `page.keyboard` against `storybook-static/` and `storybook-static-react/` (Playwright projects `svelte-chromium`, `svelte-webkit`, `react-chromium`, `react-webkit`); every step asserts focus never falls to `<body>` (`tests/e2e/focus.ts`). Spec files are shared: the twins have the same story ids. `openStory` skips a test on `react-*` while its story is in `tests/twins-pending/`; a test that applies to one framework only uses `test.skip` with a reason and an issue link. Needs `pnpm build-storybook` and `pnpm build-storybook:react` first, then `pnpm test:e2e`.
3. **axe** — `@storybook/addon-a11y` with `a11y.test = 'error'` (WCAG 2.0/2.1 A/AA) on every story of both Storybooks (`.storybook/shared.ts`). Every component has an "open" story so its open state is scanned. Disabling a rule on a story needs a comment with the reason and an issue link.

- **Parity pairs:** the `Toolkit` story of a pair sets `a11y: { test: 'off' }` with a comment: it documents upstream, it isn't our code. `Side By Side` stories are tagged `!test` (iframes of other stories, for people).
- Storybook runs a story's `play` function whenever the story loads, including in the static build. Playwright specs therefore use stories **without** a `play` function (the "fixture" stories), so their state is untouched when the spec starts.
- Run one Playwright spec: `pnpm exec playwright test tests/e2e/modal.spec.ts --project svelte-chromium` (or `react-chromium`, `svelte-webkit`, `react-webkit`). `ILW_FW=svelte|react|both` (default `both`) picks which builds the run serves, and with them the projects, so a run needs only the builds it names. Run one story file's tests: `pnpm vitest run --project storybook-svelte stories/Modal.stories.svelte` (React: `--project storybook-react stories/react/Modal.stories.tsx`); add `--project unit` for the node tests.
- The specs' preview servers listen on port 6007 (Svelte build) and 6009 (React build); set `ILW_E2E_PORT` and `ILW_E2E_REACT_PORT` to other ports to run e2e in two worktrees at once, e.g. `ILW_E2E_PORT=6107 ILW_E2E_REACT_PORT=6109 pnpm test:e2e`. The React Storybook's dev server is `pnpm storybook:react` on :6008.
- `mise run test` runs everything: `pnpm test && pnpm build-storybook && pnpm build-storybook:react && pnpm test:e2e && pnpm compare-index` (`scripts/compare-index.mjs`: the React build's story ids are the Svelte build's, minus no-twin and pending stories). Also run `pnpm check`: svelte-check (fails on warnings), `tsc -p tsconfig.react.json` and `eslint --max-warnings 0` on the React paths.
- The toolkit CDN CAPTCHA-blocks automated browsers: tests load only the vendored copy. Refresh it with `mise run vendor:toolkit`.
- Manual screen-reader checks live in `docs/at-smoke.md`; running them is a human task.

### DOM contract snapshots

`stories/contracts/<story-id>.html` is each story's DOM after its render and `play`: the canvas, plus any modal, popover or live region it added to `<body>`. They are the checked-in DOM contract, and every browser and both frameworks compare against the same file: a React twin's story passes only with the Svelte twin's exact markup.

- `tests/contracts/normalize.ts` makes them comparable: comments dropped, whitespace collapsed and dropped beside block-level boxes, attributes and `style` declarations sorted, Svelte's `svelte-xxxx` classes stripped, form state read from `.value`/`.checked`/`.selected`, and generated ids (`nextId`, `$props.id()`, `useId`) numbered in order of appearance (`ilw-field-{1}`, `{2}-label`). Zag's announcer (`[data-live-announcer]`) is left out: Zag adds it only on Apple platforms, and CI runs on Linux. If two browsers (or macOS and CI) disagree, fix the normalizer; never keep one file per browser.
- A new story writes its file on the first local run; commit it. CI never writes: a missing or different file fails the story. Write a new pair's file from the Svelte twin, then run the React twin without `-u` (or with `CI=1`), so it is compared, not written. After a deliberate markup change, rewrite them with `pnpm vitest run --project storybook-svelte -u`, then run both projects again without `-u` (both browsers and both frameworks compare with the same file, so the second run proves they agree), review the diff, and treat it as a contract change (README, release note).
- Parity `Toolkit` stories are skipped (upstream markup). Another story opts out with `parameters: { contract: false }`, which needs a comment with the reason and an issue link, like disabling an axe rule.

### No flaky tests

A test that sometimes fails is a bug in the test (or the component), never noise. These rules keep the suite deterministic:

- **Wait on a condition, never on the clock.** Use `waitFor`/`expect.poll` in play functions and Playwright's auto-waiting locators and `expect`. No `setTimeout` sleeps, `waitForTimeout` or fixed delays. To let a known frame or task pass (e.g. Zag's deferred focus), await `requestAnimationFrame` or a zero-delay task and say why in a comment.
- **No retries.** Vitest and Playwright run with `retries: 0`; don't raise it, and don't wrap assertions in loops that swallow failures.
- **Deterministic inputs.** Fixed sample data and ids (no `Math.random`, no `Date.now()` in what is asserted), the Light theme unless the story sets `globals.theme`, a fixed viewport where layout matters, `await document.fonts.ready` before measuring text, and `behavior: 'instant'` for scrolling. A `mouse.wheel` stays short of the page's end: WebKit can rubber-band past it, and hit tests then miss everything. No network: only the vendored toolkit and local assets.
- **Every story and spec stands alone.** It must pass when run alone, in any order and on both Chromium and WebKit. Anything mounted outside the canvas (modals, live regions, listeners on `window`) is removed by the test that made it.
- **Assert outcomes, not timing or incidental details.** Check roles, names, states, focus and computed styles; don't count renders or depend on animation progress.
- **Prove a new or changed test is stable** before merging: `pnpm exec playwright test <spec> --repeat-each 20` (on the `react-*` projects too, once its stories have twins), and `pnpm vitest run --project storybook-svelte --repeats 10 stories/<Name>.stories.svelte` for its stories, with `--project storybook-react` for their twins (repeats also prove its contract snapshot doesn't depend on what ran before). Stories whose plays move to `stories/plays/` are proven the same way.
- **A flake found in CI gets fixed, not rerun away.** If it can't be fixed in the PR that found it, skip the test with a comment linking an issue that names the failure, and fix it before the next release.

## Plans

- Write plans as `docs/plans/YYYY-MM-DD-<topic>.md`. Pending and in-progress plans live in `docs/plans/`.
- When a plan is completed, move it (`git mv`) to `docs/old-plans/`, keeping its filename.
