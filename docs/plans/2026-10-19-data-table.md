# `DataTable`, `Pager` and `TableSortTh` on TanStack Table 9

_Ports ta-manager's phase 5c spike (ta-manager branch `claude/ilw-ui-phase-5c-table-spike`, commit `fb17fc8`, `packages/ilw-ui/`) onto this repo's harness. The spike's results are in ta-manager `docs/plans/2026-10-16-frontend-svelte-islands-migration.md`, "Phase 5 spike results"._

## Context

ta-manager's tables sort with page-local comparators (`(a, b) => number`), filter with page-local predicates, and page with the unranked-courses "picker" pager. It has decided on TanStack Table v9 as the engine (exact pin 9.3.1), driven through ilw-ui so pages never import `@tanstack/*` themselves.

## Decisions

- **TanStack Table 9.3.1**, pinned exactly in lockstep: `@tanstack/table-core` and `@tanstack/svelte-table`, as `dependencies`. `@tanstack/store` / `@tanstack/svelte-store` come in with caret ranges; the lockfile pins them. The guard allows `^@tanstack/(table-core|svelte-table)`.
- **`SortableTh` stays as it is.** Its props (`key`, `label`, `sort`, `onsort`) and DOM contract don't change. The TanStack-driven heading is a new `TableSortTh` (`table`, `id`, `label`) that renders `SortableTh`, so the markup is the same by construction.
- **Explicit page reset.** TanStack's `autoResetPageIndex` runs lazily, the next time the row model is read (during a render), so it's off. `TableSortTh` goes back to page 1 after a sort. For filters, `setTableFilter(table, id, value)` sets the filter and goes back to page 1.
- **Filters are removed only for `undefined`.** `predicateFilterFn` sets `autoRemove` to `value === undefined`, so the predicate decides what `''`, `null` and `false` mean.
- **Two table types.** `createDataTable` returns `PagedDataTable<T>` when `pageSize` is given and `DataTable<T>` otherwise. Only the paged type has the pagination APIs, and `Pager` accepts only it.
- **`Pager` classes are props** (`classes`). Its defaults are ilw-ui's own (`ilw-pager`, …), styled with brand tokens. ta-manager passes its `picker-*` names.
- **`Pager` accessibility beyond the legacy markup:** the root is `<nav aria-label>`, previous and next have `aria-label`s, the current page has `aria-current="page"`, and the count isn't live (two pagers would announce twice). Focus stays in the pager after paging by keyboard.
- **No `.svelte.ts` files** (a `.svelte.ts` broke Vite's dependency optimisation in ta-manager). Plain `.ts` plus `.svelte`.
- **`DataTable` renders a native `<table>`** (attributes pass through) from `header`, `row` and `empty` snippets, with rows keyed by `getRowId`. **`DataRows`** is the same rows without the `<table>`, for a server-rendered `<tbody>`.

## Steps

1. **Deps and guard.** Add the two pinned packages and widen the guard (and its "flags what it should" cases). Update the import rule in AGENTS.md.
2. **`core/table.ts`.** Add `comparatorSortFn`, `predicateFilterFn`, `rowColumn` and `pageWindow`, exported from `ilw-ui/core`. Port the spike's node tests to `tests/unit/table.test.ts`: both sort directions match a stable legacy sort including ties, filter then sort, `''` stays in state, and `pageWindow` matches the legacy code for 1–30 pages.
3. **`svelte/data-table.ts` and the components.** Add `createDataTable` (overloaded), `setTableFilter`, `DataTable`, `DataRows`, `TableSortTh` and `Pager`, all exported from `ilw-ui/svelte`.
4. **Styles.** Add `.ilw-pager*` rules using brand tokens only.
5. **Stories.** Add `DataTable.stories.svelte` over a story-only harness. Play functions cover the DOM contract (`TableSortTh` markup equals `SortableTh`'s), sorting with stable ties, keyed rows, the filter plus empty snippet, the `Pager` markup and ARIA, two pagers staying in step, and sort or filter going back to page 1. Add fixture stories without a play function, and an open (paged) story for axe.
6. **Playwright.** Add `tests/e2e/data-table.spec.ts`. Enter and Space on a heading sort and keep focus on the button. Enter on next pages through to the last page, then focus moves to the current page's button. Focus never falls to `<body>`.
7. **Docs.** Add README sections (API, DOM contracts, keyboard notes), an at-smoke checklist, and the `exports` list.

**Status (2026-10-19):** steps 1–7 done on branch `data-table`. `pnpm check`, `pnpm test` (80) and `pnpm test:e2e` (24, and 72/72 with `--repeat-each 3`) pass locally. Still open: CI, and the human at-smoke run.

## Done when

- `pnpm check`, `pnpm test` and `pnpm test:e2e` pass locally and in CI.
- `SortableTh`'s existing stories and spec pass unchanged.
- The README and at-smoke are updated, and this plan is moved to `docs/old-plans/`.

## Out of scope

Server-side sorting, filtering or paging; column visibility, resizing and virtualisation; multi-sort; the ta-manager page ports.
