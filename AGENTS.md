## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

# This project is "ilw-ui"

Accessible Svelte 5 components that look and behave like the **Illinois Web Toolkit** (`ilw-*` Lit web components, https://builder3.toolkit.illinois.edu/), filling gaps the toolkit leaves (sortable headings, modal with events/focus restore; later combobox, autocomplete, data table, pager). First consumer: ta-manager (`uiuc-csid/ta-manager`). [docs/plans/2026-10-16-ilw-ui-scaffold.md](docs/plans/2026-10-16-ilw-ui-scaffold.md) holds the design and the contracts that consumer depends on.

## Tech Stack

- **Node** (version in `.node-version`), **pnpm** (version in `package.json` `packageManager`), **mise** for tool versions and tasks
- **Svelte 5** (runes), **Vite 8**, **TypeScript**, `svelte-check`
- **Storybook 10** (`@storybook/svelte-vite`, Svelte CSF stories) — the workbench and the test fixture host
- **Vitest** (browser mode, Playwright provider) and **@playwright/test**

## Source Layout

```
src/
  core/        framework-agnostic helpers (nextSort, nextId)
  svelte/      Svelte components + index.ts exports
  styles.css   component styles (brand tokens only)
stories/       *.stories.svelte (Svelte CSF) + story-only helper components
tests/
  unit/        node Vitest: core helpers + import/sink guard
  e2e/         Playwright keyboard/focus specs against the static Storybook build
vendor/illinois-toolkit/   pinned toolkit.js/.css, served by Storybook at /toolkit
.storybook/    Storybook config; IlwPage.svelte wraps every story in <ilw-page class="ilw-format"><main>
```

The package ships source (`.svelte`/`.ts`); consumers' Vite compiles it. `exports`: `./core`, `./svelte`, `./styles.css`.

## Rules

- **Layering:** Illinois toolkit first, native HTML second, `ilw-ui` third. Never re-implement what the toolkit does well (page chrome, accordion, the modal dialog itself).
- **Imports:** `src/` imports only `svelte` and its own files (later also `@zag-js/*`, `@tanstack/*`, pinned exactly in lockstep). `tests/unit/guard.test.ts` enforces it.
- **No HTML sinks:** no `{@html}`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function` in `src/`. Rich content is passed as Svelte snippets. Consumers run a strict CSP (same-origin scripts, no `eval`).
- **Brand colors and fonts only:** `--il-*` custom properties (from `https://cdn.brand.illinois.edu/illinois.css`) with fallbacks; never hard-coded hex. No rules on bare `th`/`td` (`<ilw-page class="ilw-format">` restyles them with high-specificity selectors).
- **Read the toolkit component's docs and source before wrapping it:** `https://builder3.toolkit.illinois.edu/component/<name>/index.html` and `https://github.com/web-illinois/<name>`. The prose docs lag the code; follow the code. Upstream gaps go under **Known issues** in the README with an issue link, not patched around in markup.
- **DOM contracts are API.** ta-manager's tests select on the exact markup documented in the README; change it only deliberately.
- Pin every `storybook`/`@storybook/*` package to one exact version.

## Tests

Accessibility is proven by tests. Every component gets three layers, all driven by its stories:

1. **DOM contract + ARIA** — story `play` functions, run by `@storybook/addon-vitest` as Vitest browser tests on Chromium and WebKit: `pnpm test`.
2. **APG keyboard + focus** — `tests/e2e/*.spec.ts`, real `page.keyboard` against `storybook-static/`; every step asserts focus never falls to `<body>` (`tests/e2e/focus.ts`). Needs `pnpm build-storybook` first, then `pnpm test:e2e`.
3. **axe** — `@storybook/addon-a11y` with `a11y.test = 'error'` (WCAG 2.0/2.1 A/AA) on every story. Every component has an "open" story so its open state is scanned. Disabling a rule on a story needs a comment with the reason and an issue link.

- Storybook runs a story's `play` function whenever the story loads, including in the static build. Playwright specs therefore use stories **without** a `play` function (the "fixture" stories), so their state is untouched when the spec starts.
- Run one Playwright spec: `pnpm exec playwright test tests/e2e/modal.spec.ts --project chromium`.
- `mise run test` runs everything: `pnpm test && pnpm build-storybook && pnpm test:e2e`. Also run `pnpm check` (svelte-check, fails on warnings).
- The toolkit CDN CAPTCHA-blocks automated browsers: tests load only the vendored copy. Refresh it with `mise run vendor:toolkit`.
- Manual screen-reader checks live in `docs/at-smoke.md`; running them is a human task.

## Plans

- Write plans as `docs/plans/YYYY-MM-DD-<topic>.md`. Pending and in-progress plans live in `docs/plans/`.
- When a plan is completed, move it (`git mv`) to `docs/old-plans/`, keeping its filename.
