# React components

_A plan for shipping every ilw-ui component in React 19 as well as Svelte, held to the same rules. It extends the [toolkit-replacement roadmap](2026-10-20-toolkit-replacement.md). Tracking: [uiuc-csid/ilw-ui#9](https://github.com/uiuc-csid/ilw-ui/issues/9)._

## Context

ilw-ui replaces the Illinois Web Toolkit for Svelte apps. React apps on campus need the same thing, and the scaffold plan expected it: "React/Vue adapters may come later on the same `core/`" (`docs/old-plans/2026-10-16-ilw-ui-scaffold.md`).

"The same constraints" means every rule in AGENTS.md applies to React unchanged:

- A React component renders **the same documented markup** as its Svelte twin.
- It uses the same `styles.css`, so a React page and a Svelte page look identical.
- It is island-safe.
- It imports only what the guard allows and uses no HTML sinks.
- It passes the same three test layers on Chromium and WebKit.

To check this, the existing play assertions and Playwright specs run unchanged against both builds, and a checked-in DOM snapshot per story must match for both.

No React app is waiting on this, so the order follows dependencies, not a consumer's needs.

## Decisions

### Scope and packaging

- **React 19 only.** 19.3.1 is current and already in the lockfile, through Storybook. React 19 gives us `ref` as a prop, `popover`/`popoverTarget`, boolean `inert` and `<details name>`, with no workarounds.
- **One package, three entry points.**
  - `exports` gains `./react` (`types`/`default` → `src/react/index.ts`), beside `./svelte`. Both share `./core` and the styles.
  - Sources live in `src/react/`. A top-level `react/` folder would break the shadow rule in `tests/unit/guard.test.ts`.
  - The package keeps shipping source. A React consumer compiles the `.tsx` files with Vite and `@vitejs/plugin-react`; Vite 8's oxc transform covers `.tsx` inside `node_modules`.
  - The README adds a note for Next.js (`transpilePackages`).
- **Both frameworks in lockstep.**
  - Once the React toolchain (R0d) merges, every new component ships in both frameworks in the same PR.
  - From then on, a roadmap row counts as done only when both versions pass.
  - Components that already exist are ported by R1–R8 below.
- **Adapters become optional peers.**
  - Headless engines stay in `dependencies`: `@zag-js/combobox` and `@tanstack/table-core`.
  - These move to optional peers (`peerDependenciesMeta`): `svelte`, `@zag-js/svelte`, `@tanstack/svelte-table`, `phosphor-svelte`, `react`, `react-dom`, `@zag-js/react`, `@tanstack/react-table`, `@phosphor-icons/react`. pnpm's `autoInstallPeers` installs non-optional peers, so otherwise a React app would get Svelte, and the other way round.
  - Peer versions:

    | Package | Peer version |
    | ------- | ------------ |
    | `@zag-js/*` | 1.46.0, exact |
    | `@tanstack/*` | 9.3.1, exact |
    | `phosphor-svelte` | 3.1.1, exact |
    | `@phosphor-icons/react` | 2.1.10, exact |
    | `react`, `react-dom` | `^19.3` |
    | `svelte` | `^5.57` |

  - The pinning rule keeps working through three checks:
    - `devDependencies` pin the same versions exactly;
    - a unit test asserts each adapter peer equals its devDependency;
    - Renovate uses `rangeStrategy: 'bump'` for peers, so it doesn't widen them.
  - This is breaking for ta-manager, which must add `@zag-js/svelte`, `@tanstack/svelte-table` and `phosphor-svelte` itself. It ships as v0.2.0, with a release note on the GitHub release and a coordinated ta-manager PR.

### Shared core

Framework-neutral logic now in `src/svelte/` moves to `src/core/` before any React component exists, so both adapters are thin views over one implementation.

- The moved modules are **internal**: the `ilw-ui/core` barrel doesn't export them. This keeps runtime table-core code out of `ilw-ui/core`.
- `src/svelte/index.ts` still exports everything it does today.
- Svelte behaviour doesn't change, and the existing tests prove it.

| From | To core |
| ---- | ------- |
| `islands.ts` | `parseProps`, `readProps`, `report`, the scan loop and the pagehide teardown, as `mountIslandsWith(registry, root, mountFn)`. Each adapter supplies only `mountFn`. |
| `zag-input.ts` | All four helpers (`keepCaret`, `keepLiveRegionIn`, `focusStaysPut`, `focusLeft`). They work around the core Zag machine, so React needs them too. `focusLeft` takes any `FocusEvent`-like value. |
| `async-search.svelte.ts` | The debounce, abort and status logic of `AsyncSearch`, as a plain class that notifies subscribers, plus `statusText` and the `AsyncSource` type. Svelte wraps it in `$state`; React reads it with `useSyncExternalStore`. |
| `TabList.svelte`, `tabs.ts` | Reading the tabs from server markup (`.ilw-tabs-panel[id]`, `.ilw-tabs-heading`, the `data-*` options), the panel attributes it sets and restores, and the hash and key handling that doesn't need component state. |
| `data-table.ts` | The features, the options builder (everything but the `createTable` call), `PagerClasses` and both class maps, `isPaged`, `setTableFilter`, and the types. |
| `Pager.svelte`, `Pagination.svelte` | `pagerModel()` (page, count, window) and `paginationModel()` (clamping, links). |
| `SortableTh.svelte`, `TableSortTh.svelte` | The `aria-sort`, class and arrow mapping, and the toggle-then-reset-page step. |
| `modal.ts`, `Modal.svelte` | `CloseReason`, `ModalSize`, `ModalButton`, the options minus `body`, tab wrap, the backdrop hit test, initial-focus resolution, and the default and confirm buttons. |
| `DarkModeToggle.svelte` | The cookie name and lifetime, the initial-state rule, and `applyDarkMode(on)` (sets `data-theme`, writes the cookie, dispatches `ilw-dark-mode-changed`). |
| `layout.ts` | Whole. |
| (new) | `classNames()`: joins classes in order. There is no `clsx` (it isn't on the allow-list), and tests assert exact `className` strings such as `'ilw-button ilw-theme-blue-solid'`. |

### React API conventions

The README documents each component's React API next to the Svelte one.

#### Names and props

- Components and props keep their names, camelCased for React: `class` → `className`, `onsort` → `onSort`, `onclose` → `onClose`, `onpage` → `onPage`.
- **Snippets** become `ReactNode`. Snippets that take arguments become render props: `Field`'s `children: (attrs: FieldAttrs) => ReactNode`, and `DataTable`'s `row: (row, i) => ReactNode`.
- **`$bindable` props** become a controlled `value` plus a change callback. No uncontrolled mode until a consumer asks for one.

#### Callbacks that clash with DOM events

- A callback that would clash with a DOM event on the element receiving rest props gets its own name.
- The known case is `Autocomplete`, whose rest props go on its `<input>`:
  - `oninput` → `onTextChange`;
  - `onselect` → `onItemSelect`.
- Its bubbling native `change` event stays. React has no prop for the native event, so the README documents it as `addEventListener('change')`.

#### Ids

- Ids with a documented format (`ilw-field-N`, `ilw-radio-group-N`, `ilw-modal-N`, `combobox-N`, `app-modal-N`) keep `nextId`, through a `useNextId(prefix)` hook (a `useState` initializer).
- StrictMode runs that initializer twice in development, so numbers can skip. The format still holds, and every existing assertion is a regex.
- `$props.id()` becomes `useId`.
- A consumer that server-renders and hydrates passes explicit ids.

#### Refs and attributes

- `ref` is a plain prop; no `forwardRef`.
- Attributes the contract spells empty are passed as `""`: `popover=""`, `data-ilw-mounted=""`. React drops `popover={true}` silently, and renders `data-*={true}` as `"true"`.

#### Island-safe

- No DOM access at module top level or during render; DOM work happens in effects and handlers.
- No `'use client'` directives until a Server Components consumer asks.

### Islands

`mountIslands` from `ilw-ui/react` behaves like the Svelte one, including on the same Django template.

- **Mounting.** Each island renders as `createPortal(<C {...props} />, host)` from a root on a detached element. A portal appends to the host, as Svelte's `mount` does. `createRoot(host)` would first clear the host and lose any server-rendered fallback inside it.
- **Synchronous.** The render runs inside `flushSync`, so the DOM is in place when `mountIslands` returns. The stories assert this.
- **Errors are logged and skipped, as today.**
  - React reports a render error through `onUncaughtError` during the commit. That happens before the shared loop sets `data-ilw-mounted`.
  - So the adapter's `onUncaughtError` only records the error.
  - After `flushSync` returns, a recorded error unmounts the root and is thrown.
  - The shared loop's existing `catch` then reports the island and skips it.
- **Where it works.** `flushSync` does nothing inside a React render, commit or effect. The synchronous guarantee therefore holds for plain scripts, event handlers and play functions, which is where islands are mounted. The README says so.

### Hard parts, per component

Each is settled in its port PR. They are listed here so nobody has to rediscover them.

#### `Modal`, `openModal`, `alert`, `confirm`

- The dialog must be a child of `<body>`, so `openModal` renders `createPortal(<Modal />, document.body)` from a root on a detached element, and unmounts that root on close.
- The `body` option is a `ReactNode` rendered in that root, so it can't see the caller's context. The demo's live-updating form body becomes a small stateful component.
- Under StrictMode, `showModal()` is guarded by `!dialog.open`, and effect cleanup never calls `close()`: that would report a `'dismiss'`.
- React never writes the `autofocus` attribute. It focuses during commit, before `showModal()`, so that focus is lost. The shared initial-focus helper therefore honours `[autofocus], [data-autofocus]`, and the README tells React users to put `data-autofocus` on the field that should get focus.
- A new story puts that field somewhere other than the first tabbable element.
- The modal's own buttons get `autofocus` set after insertion, as the Svelte one does.

#### `enhanceSelect`, `enhanceSelects`

- The contract has no wrapper: `select.nextElementSibling` is the `span.combobox` itself.
- The React version creates that span, inserts it after the `<select>`, renders the combobox into it, and applies Zag's root props to it through a ref.
- It is synchronous only when called from outside React. React apps use `<Combobox>` directly, so there is no `ref={enhanceSelect}` form.
- The React demo calls `enhanceSelects` from its play function, not from an effect.

#### `Tabs`, `enhanceTabs`, `enhanceAllTabs`

- `enhanceTabs` mounts the tab list into the server markup, just before the first panel, with no wrapper. As with `enhanceSelect`, the React version creates the `role="tablist"` element, inserts it there and renders into it. A portal would append it after the panels.
- `enhanceTabs` is synchronous only when called from outside React, so the Svelte attachment form (`{@attach enhanceTabs}`) has no React twin. React apps use `<Tabs>`.
- Unmounting must put the sections back exactly as they were (roles, names, `tabindex`, `hidden`, `.ilw-tabs--ready`), including under StrictMode's mount, unmount, mount.

#### `Combobox`, `Autocomplete`, `MultiCombobox`

- The input stays uncontrolled: Zag writes `input.value` itself.
- `filterItems` runs inline in `onInputValueChange`, because React state read there is a render behind.
- The machine is created once (`useState(() => focusStaysPut(...))`).
- `keepCaret` and `keepLiveRegionIn` are installed in `useLayoutEffect`.
- `value` arrays are memoized or module constants.
- No inline `style`, for the CSP spec.
- The Autocomplete demo records picks with `addEventListener('change')`, since React's form `onChange` fires on every keystroke.
- Async sources go through the shared `AsyncSearch` core. Its in-flight request is aborted on unmount, which StrictMode exercises in development.

#### `DataTable`, `DataRows`, `TableSortTh`, `Pager`

- `createDataTable` becomes a `useDataTable(options)` hook wrapping `@tanstack/react-table`'s `useTable`.
- The parts re-render from the table state they read.
- `DataRows` portals into a server-rendered `<tbody>` from the component that owns the table.
- Rows render as `<Fragment key={row.id}>`, so the "Keyed rows" story still sees the same `<tr>`.

#### `Icon`

- Icons come one at a time from Phosphor's server entry, `@phosphor-icons/react/dist/ssr/<Name>`, which has no hooks or context. R1 confirms the exact path.
- `Icon` sets `role`, `aria-label` and `aria-hidden` as the Svelte `Icon` does, and never passes Phosphor's `alt` (that renders a `<title>`).
- It passes a `<rect width="256" height="256" fill="none"/>` child, so the SVG matches phosphor-svelte's output: the rect, then the paths.

#### `Header`

- `{' '}` before "Search" (JSX drops the leading space Svelte keeps).
- `popoverTarget`, `<details name>`, and `popover=""` spelled out.
- It renders the React `DarkModeToggle` in the pre-mounted island host.

### Storybook and tests

The bar doesn't move: every React component gets the three layers in AGENTS.md, driven by its stories.

#### A second Storybook

- One Storybook can't host two frameworks, so `.storybook-react/` sets up `@storybook/react-vite` 10.6.4.
  - `react()` from `@vitejs/plugin-react` is added in `viteFinal`; the preset doesn't add it.
  - It uses the same addons and `staticDirs`, with stories in `stories/react/**/*.stories.tsx`.
- The theme global, `initialGlobals`, a11y parameters and styles loader move to `.storybook/shared.ts`, used by both previews. `styles.ts` already has no framework code.
- The React shell decorator mirrors the Svelte one, using the React `Page`, inside `<StrictMode>`.
- Chromatic stays one project, on the Svelte build.

#### Twin stories

Each React story file is the twin of a Svelte one:

- **Ids.** It uses the same `title`, the Svelte build's `exportName` as its export, and the Svelte story's name as an explicit `name:`. Story ids therefore match, for example `page-chrome-header--fixture-megamenu`, and every spec and AT checklist entry works for both.
- **Descriptions.** The description is the same text as the Svelte HTML comment, as a `/** … */` block with a ` * ` gutter directly above the export. Addon-docs reads only `/**` blocks and strips the gutter. The meta sets `tags: ['autodocs']`.
- **Play functions.** `play:` keys are written literally, not spread, so Storybook tags the story `play-fn` correctly.
- **Demos.** React demos (`stories/react/*Demo.tsx`) reproduce the Svelte demos' ids, test ids, `<output>`s and page context, and start with the same "which page this stands in for" comment. Sample data (`table-data.ts`, `header-sample.ts`, `section-nav-data.ts`, `parity/*.ts`) is imported, not copied.
- **Styles.** Story helpers with a `<style>` block move it to a plain `.css` file that both frameworks import. Svelte's scoped `svelte-xxxx` classes would otherwise differ between the twins.

#### Shared play functions

- Play bodies and their helpers move to `stories/plays/<name>.ts`, typed `PlayFunctionContext<WebRenderer>`, and both story files import them.
- Framework-specific steps (`flushSync`, `mountIslands`) are passed in. Shared plays never call `ctx.mount`.
- They move one component at a time, in that component's port PR. The moved Svelte stories are proven stable with `--repeats 10` like new ones.

**DOM contract snapshots.** This is what makes "DOM contracts are API" hold across frameworks.

How it works:

- A Vitest setup file, shared by both `storybook-*` projects, adds an `afterEach` that runs after every story's render and play.
- It finds the story by `task.meta.storyId`.
- It normalizes the story's DOM: the canvas plus any `dialog`, `[popover]` or live region the story added to `<body>`.
- It checks the result with `toMatchFileSnapshot('stories/contracts/<story-id>.html')`.

Both frameworks and both browsers compare against the **same file**. That covers open, post-play and dialog states, with no job that needs both builds at once. The files are the checked-in contract: changing one is a contract change, with a README update and a release note.

The normalizer:

- **Text.** Remove comments, then `Node.normalize()`. Collapse runs of `[ \t\n\r\f]` only (not `\s`, which would hide a lost `&nbsp;`). Drop whitespace-only text only between block-level neighbours (by computed `display`), so a missing space between inline elements still shows.
- **Attributes.** Sort them, and compare `style` as parsed declarations.
- **Classes.** Strip `svelte-[a-z0-9]+`.
- **Form state.** Drop `value`, `checked` and `selected` attributes, and record the `.value`, `.checked` and `.selected` properties instead. Svelte sets only the properties; React also writes default-value attributes.
- **Ids.** Map generated ids to placeholders in order of first appearance, with their suffixed forms (`-label`, `-popup`, `-<i>`). That covers `nextId` numbers, React's `_r_N_` and Svelte's `cN`. References are rewritten to match (`for`, `aria-*`, `href="#…"`, `popovertarget`).
- **Timing.** Snapshot after two animation frames have settled.

A story can opt out with `parameters.contract = false`, which needs a comment with the reason and an issue link, like turning off axe. R0b proves the mechanism on the Svelte build. If the `afterEach` can't see the story's DOM, the fallback is a Playwright spec that loads each story from both builds and compares them after Storybook's `STORY_FINISHED`.

#### Twins check: `tests/unit/twins.test.ts`

- Every `*.stories.svelte` has a React twin with the same title, story names, tags and descriptions. Svelte comments are read with a regex, React ones with `loadCsf` from `storybook/internal/csf-tools`.
- The check skips:
  - stories tagged `framework-neutral` (CSS- or core-only: Announce, Themes, Format, and the Table, Format, Themes and Width parity stories);
  - parity `Toolkit` and `Side By Side` stories.
- A `twins-pending` allow-list holds stories not yet ported, and shrinks with each port.
- It also compares the export names of `src/svelte/index.ts` and `src/react/index.ts`, type exports included, using the TypeScript compiler API and a rename map (`createDataTable` → `useDataTable`).
- After both builds, CI compares the two `index.json` id sets.

#### Parity

- The `Toolkit` and `Side By Side` stories, and Chromatic, stay in the Svelte build.
- The React build carries the `IlwUi` side of every parity pair. Its contract snapshot is the same file as the Svelte one, so a React replacement matches the toolkit exactly when its Svelte twin does: same markup, same stylesheet.
- R0d writes this into AGENTS.md ("Visual parity") and into this roadmap's "Visual parity, better behaviour" decision.

#### Keyboard and focus

- `playwright.config.ts` gets four projects: `svelte-chromium`, `svelte-webkit`, `react-chromium`, `react-webkit`.
- Its `webServer` list comes from `ILW_FW=svelte|react|both` (default `both`). Playwright starts every server before it filters projects, so a run without the React build would otherwise fail.
- Spec files don't change.
- A test that applies to one framework only uses `test.skip` with a reason and an issue link.

#### axe

- `a11y.test: 'error'` is in the shared preview parameters, so every React story is scanned too, "open" stories included.

#### Unit tests

- `islands.test.ts` runs over both adapters.
- A new `react-ssr.test.ts`:
  - imports `src/react/index.ts` and `src/svelte/index.ts` in node, which fails on DOM access at any module's top level;
  - renders each presentational React component with `renderToStaticMarkup`.
- The node project gets the JSX transform.

#### Static checks

- `tsconfig.react.json` sets `jsx: react-jsx` and covers `src/core`, `src/react`, `stories/react`, `stories/plays` and `.storybook-react`. The base `tsconfig.json` excludes the React paths.
- `pnpm check` runs `svelte-check`, `tsc -p tsconfig.react.json` and `eslint --max-warnings 0`.
- ESLint is new and runs on the React paths only:
  - flat config, ESLint 9 (`eslint-plugin-jsx-a11y` 6.10.2 supports up to 9);
  - `eslint-plugin-react-hooks` 7.1.1 and `eslint-plugin-jsx-a11y`, both on their recommended configs.

  It is the React counterpart of the a11y warnings `svelte-check` fails on.

#### Guard

- It scans `.tsx` and `.jsx` too.
- Each subtree gets its own allow-list:

  | Subtree | Allowed imports |
  | ------- | --------------- |
  | `src/core` | `@tanstack/table-core` and its own files |
  | `src/svelte` | today's list |
  | `src/react` | `react`, `react/jsx-runtime`, `react-dom`, `react-dom/client`, `@zag-js/*`, `@tanstack/table-core`, `@tanstack/react-table`, `@phosphor-icons/react/dist/ssr/<Icon>`, and `@phosphor-icons/react` for `import type` only |

- Relative imports stay inside the file's own subtree, `src/core` or `src/styles`.
- `dangerouslySetInnerHTML` joins the banned sinks, with matching cases in "flags what it should".

#### No flaky tests

- The rules apply unchanged.
- Every new or moved story is proven with `pnpm test --repeats 10` on both projects.
- Every new spec project is proven with `--repeat-each 20`.

#### AT smoke

- `docs/at-smoke.md`'s results log gets a Framework column.
- Each port PR runs its component's checklist on the React build.

### Tooling and CI

**CI** stays one job, with no artifacts passed between jobs. This adds about 90 seconds; a matrix can come later if run time matters. Steps, in order:

1. install
2. `pnpm check`
3. Vitest projects `unit`, `storybook-svelte` and `storybook-react`
4. both Storybook builds
5. Playwright, all four projects
6. the `index.json` comparison

#### Other changes

- New scripts `storybook:react` and `build-storybook:react` (output `storybook-static-react/`, ignored by git). `build-storybook` stays the Svelte build, which Chromatic runs.
- The mise `test` task covers both builds.
- `.claude/launch.json` and `.mcp.json` get entries for the React Storybook.
- AGENTS.md's single-spec example (`--project chromium`) is updated to the new project names.

## Order

Each row is one PR. R0a–R0d run in order. After R0d, the ports can run in parallel, except that:

- R5 needs R1 (`TableSortTh` renders `SortableTh`);
- R7 needs R6 (`SelectCombobox` renders `Combobox`).

R2, R3, R4 and R8 are independent: `Header` imports only `DarkModeToggle`, `Modal` draws its own icon, and `Tabs` uses nothing but `layout.ts`. `CopyButton` renders `Button` and `Icon`, so it comes last in R1.

| # | PR | Contents |
| - | -- | -------- |
| R0a | Shared core | Move the logic in [Shared core](#shared-core) into internal `src/core` modules; Svelte unchanged. Update docs that name the moved files: AGENTS.md "Source Layout", README "Known issues", `docs/upstream-issues/zag.md`. Fix two stale README facts: Zag is pinned at 1.46.0, not 1.44.0, and `focusStaysPut` now works around the focus pull. |
| R0b | Svelte test plumbing | No behaviour change. `.storybook/shared.ts`. Rename the Vitest project to `storybook-svelte` and the Playwright projects to `svelte-*`. The per-subtree guard. The contract normalizer and snapshots for every existing Svelte story. Story-helper styles into `.css` files. AGENTS.md test commands. |
| R0c | Packaging (v0.2.0) | Optional exact peers, the peer = devDependency test, Renovate rules, README "Install and use", the release note, and the ta-manager PR. |
| R0d | React toolchain | React dependencies and the `./react` export. `tsconfig.react.json`, ESLint, `.storybook-react/`, the `storybook-react` Vitest project, the `react-*` Playwright projects and `ILW_FW`, CI, scripts, launch and MCP entries, the twins check, `react-ssr.test.ts`. React `Page` and `BackToTop` (the shell needs them); their stories stay on `twins-pending` until R1, because they use R1's components. AGENTS.md: intro, Tech Stack, Source Layout, and the rules on Imports, Islands and static pages, No HTML sinks, Visual parity, Stories (the React description form), Tests and lockstep. This roadmap's "for Svelte apps" wording. **Lockstep starts when this merges.** |
| R1 | Presentational | `Button`, `Icon`, `Columns`, `Content`, `Grid`, `Spacer`, `Breadcrumbs`, `PageTitle`, `SectionNav`, `Footer`, `Pagination`, `SortableTh`, then `CopyButton`, with their Unformatted, Layout and parity `IlwUi` twins. May split into layout, Button, Icon and `CopyButton`, then page chrome. |
| R2 | Forms | `Field`, `RadioGroup`, `ChoiceChips`. |
| R3 | Islands and header | React `mountIslands`, `DarkModeToggle`, `Header`, and the Islands stories. |
| R4 | Modal | `Modal`, `openModal`, `alert`, `confirm`, and the `data-autofocus` story. |
| R5 | Data | `useDataTable`, `DataTable`, `DataRows`, `TableSortTh`, `Pager`. Re-exports `isPaged`, `setTableFilter` and both pager class maps. |
| R6 | Zag | The `AsyncSearch` adapter, `Combobox`, `Autocomplete`, `MultiCombobox`. Then the twin of Format's "Components inside" story, which needs R5 and R6. |
| R7 | Select enhancement | `SelectCombobox`, `enhanceSelect`, `enhanceSelects`. |
| R8 | Tabs | `Tabs`, `enhanceTabs`, `enhanceAllTabs` (the React tab list). |

Every port PR includes:

- the components in `src/react/`;
- twin stories, with descriptions and page context;
- that component's plays moved to `stories/plays/`;
- both builds green on all three layers, with the contract snapshots matching;
- the README's React API for the component;
- an at-smoke log row;
- its stories removed from `twins-pending`.

## The rest of the roadmap

- Under the lockstep rule, every row of the [toolkit-replacement roadmap](2026-10-20-toolkit-replacement.md) still open when R0d merges needs both frameworks to be done. Rows merged before then, such as C3 `Tabs`, E3 `MultiCombobox`, E5 `ChoiceChips` and E6 `CopyButton`, are ported in R1–R8.
- Component plans written from now on have a React section: the API mapping and the hard parts.
- The pending `page-chrome`, `form-styles` and `layout` plans describe components that already exist. Once they're checked off, they move to `docs/old-plans/`. Their components are ported in R1–R3, so lockstep doesn't apply to them.

## Done when

- The twins check passes with an empty `twins-pending`, and `ilw-ui/react` has a counterpart for every `ilw-ui/svelte` export.
- Both builds pass all three test layers on Chromium and WebKit, against the same contract snapshots.
- The README documents the React API of every component.
- This plan moves to `docs/old-plans/`.
