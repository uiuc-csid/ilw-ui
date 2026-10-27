# Changelog

Releases are tags on `main` (`vX.Y.Z`); see [Install and use](README.md#install-and-use). Each entry lists what changed since the previous release, breaking changes first.

## v0.2.0 (2026-10-27)

The first tagged release. Until now consumers pinned a commit. ta-manager pins `ab396de` (#26), so this entry covers everything merged since that commit.

### Breaking

- **Each framework's packages are optional peer dependencies** (#67). Svelte apps add them to their own dependencies, at exactly these versions (`svelte` ^5.57 as before):

  ```sh
  pnpm add @zag-js/svelte@1.46.0 @tanstack/svelte-table@9.3.1 phosphor-svelte@3.1.1
  ```

  This is needed even if the app imports none of them: `ilw-ui/svelte`'s index imports components that do, so Vite must resolve them. A Svelte app never installs React, and a React app never installs Svelte. The headless engines (`@zag-js/combobox`, `@tanstack/table-core`) stay ilw-ui's own dependencies.
- **`Modal` is a native `<dialog>`** in place of the `ilw-modal` wrapper (C1, #31). Same `openModal`/`alert`/`confirm` API; the DOM contract changes:

  | Before | After |
  | ------ | ----- |
  | `ilw-modal[open]` | `dialog.ilw-modal[open]` / `getByRole('dialog')` |
  | `.modal-buttons` | `form.ilw-modal-buttons` |
  | `h2[slot=title]` | `h2.ilw-modal-title` |
  | × "Close modal" | × "Close" |
  | `inert` on `<body>`'s children | `dialog:modal` |

- **`Page`'s shell is `<div class="ilw-page" id="top" tabindex="-1">`** (#40), so following `#top` moves focus to the shell instead of dropping it to `<body>`.

### Added

- **`ilw-ui/react`**, the start of React 19 versions of every component (#72): `Page` and `BackToTop` so far, with the same markup and `styles.css` as their Svelte twins. Install the React peers listed in [Install and use](README.md#install-and-use). From now on every new component ships in both frameworks; the [React plan](docs/plans/2026-10-27-react-components.md) ports the rest.
- Layout: `Content`, `Columns`, `Grid`, `Spacer` and the width classes (A5, #42).
- `Icon`: Phosphor icons in place of `ilw-icon` (A6, #27).
- Form styles: `forms.css`, `switch.css`, `Field` and `RadioGroup` (A7, #41).
- Page chrome: `Header` and its menus (B2, #45), `DarkModeToggle` (B1, #29), `SectionNav` and `BackToTop` (B6, B7, #40).
- `Accordion` and `AccordionPanel` (C2, #59), `Tabs` (C3, #61), `Tooltip` (C4, #63), `Pagination` for server-rendered lists (C5, #38).
- `Alert` (E1, #62), `MultiCombobox` and async sources for `Combobox` and `Autocomplete` (E3, #64), `ToggleGroup` (E4, #58), `ChoiceChips` (E5, #57), `CopyButton` (E6, #60).

### Changed

- Zag 1.46.0 (#50).
- Framework-neutral logic moved into internal `src/core/` modules, ready for `ilw-ui/react` (#67). `ilw-ui/core` and `ilw-ui/svelte` export the same names, and every component renders the same markup.
- Every story's DOM is checked in under `stories/contracts/` and compared on every test run, for both frameworks (#71, #72). A change to a DOM contract now shows up as a diff to those files.

### Fixed

- `Combobox`, `Autocomplete`: a window switch no longer counts as a blur (#39).
- `Combobox`, `Autocomplete`, `MultiCombobox`: ArrowDown and ArrowUp set their highlight at once, not a frame later. Keys typed in that frame could lose a lone-match highlight, or get a guess highlighted that Enter or Tab would take (#75).
