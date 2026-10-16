# ilw-ui

Accessible Svelte 5 components that look and behave like the
[Illinois Web Toolkit](https://builder3.toolkit.illinois.edu/). They cover what
the toolkit lacks: so far, a sortable table heading and a modal with close
events, focus return and a promise API. Where the toolkit already has a
component (page chrome, accordion, the modal dialog itself), `ilw-ui` uses it
rather than replacing it.

Status: pre-release (`private: true`), first consumer
[ta-manager](https://github.com/uiuc-csid/ta-manager).

## Install and use

The package ships source (`.svelte`/`.ts`); your Vite + Svelte build compiles it.
Peer dependency: `svelte ^5.57`.

```js
import { SortableTh, openModal, alert, confirm } from 'ilw-ui/svelte';
import { nextSort } from 'ilw-ui/core';
import 'ilw-ui/styles.css';
```

**The host page must load the toolkit** (`toolkit.js` as a module and
`toolkit.css`) and the brand stylesheet
(`https://cdn.brand.illinois.edu/illinois.css`). The components are built to sit
inside `<ilw-page class="ilw-format">`.

**Tokens:** `styles.css` uses only the brand palette's `--il-*` custom
properties, each with its brand value as a fallback in case the brand
stylesheet fails to load. It has no rules on bare `th`/`td`.

**CSP:** nothing here uses `eval`, `new Function`, `{@html}` or `innerHTML`, so
it runs under a same-origin-scripts, no-`eval` policy.

## Components

### `SortableTh`

A sortable column heading: a `<th>` holding a button.

| Prop     | Type                                | |
| -------- | ----------------------------------- | - |
| `key`    | `string`                            | Column key, also `data-sort` |
| `label`  | `string`                            | Visible heading text |
| `sort`   | `{ key: string, dir: 1 \| -1 }`     | The table's current sort |
| `onsort` | `(key: string) => void`             | Called on click / Enter / Space |

Use `nextSort(sort, key)` from `ilw-ui/core` in `onsort`: the same key flips the
direction, another key starts ascending.

```svelte
<SortableTh key="name" label="Name" {sort} onsort={(k) => (sort = nextSort(sort, k))} />
```

DOM contract (consumers' tests select on it):

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

A node Vitest project also covers `core/` and the guard below.

```bash
pnpm install
pnpm check            # svelte-check, fails on warnings
pnpm test             # unit + story tests (layers 1 and 3)
pnpm build-storybook
pnpm test:e2e         # layer 2, against storybook-static/
```

`mise run test` runs the last three in order. `pnpm storybook` starts the
workbench on http://localhost:6006.

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

`src/` imports only `svelte` and its own files, and uses no HTML sinks
(`{@html}`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`,
`eval`, `new Function`). `tests/unit/guard.test.ts` enforces this and reports
each violation as file:line.

## Known issues

Upstream `<ilw-modal>` (1.2.1) gaps. Each is worked around once, inside `Modal`,
and none has an upstream issue filed yet.

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

## License

MIT
