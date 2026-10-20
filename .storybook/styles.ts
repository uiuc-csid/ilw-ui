// Per-story stylesheets. ilw-ui reuses the toolkit's class names and
// --ilw-color--* properties, so a document styled by both can't show either
// look on its own. Each story says which it wants in `parameters.styles`:
//   'toolkit'  toolkit.css only (the upstream side of a parity pair)
//   'ilw-ui'   src/styles.css only (our side)
//   'both'     both, toolkit first (the default, as before this switch)
// toolkit.js stays in preview-head.html: it only upgrades ilw-* elements, which
// 'ilw-ui' stories don't render.

import ilwUiHref from '../src/styles.css?url';

export type StylesMode = 'toolkit' | 'ilw-ui' | 'both';
type Sheet = 'toolkit' | 'ilw-ui';

// Document order matters for 'both': toolkit.css first, ours after, as before.
const SHEETS: [Sheet, string][] = [
  ['toolkit', '/toolkit/toolkit.css'],
  ['ilw-ui', ilwUiHref],
];

function loaded(link: HTMLLinkElement): Promise<void> {
  return new Promise((resolve) => {
    link.addEventListener('load', () => resolve(), { once: true });
    // A missing sheet shows up as unstyled stories; don't hang the story on it.
    link.addEventListener('error', () => resolve(), { once: true });
  });
}

/** Adds and removes the managed `<link>`s; resolves once the wanted ones have loaded. */
export async function applyStyles(mode: StylesMode = 'both'): Promise<void> {
  const pending: Promise<void>[] = [];
  let next: Element | null = null;
  // Walk backwards so each wanted sheet goes in before the one after it.
  for (const [name, href] of [...SHEETS].reverse()) {
    const want = mode === 'both' || mode === name;
    let link = document.head.querySelector<HTMLLinkElement>(`link[data-ilw-styles="${name}"]`);
    if (!want) {
      link?.remove();
      continue;
    }
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.ilwStyles = name;
      pending.push(loaded(link));
      document.head.insertBefore(link, next);
    }
    next = link;
  }
  await Promise.all(pending);
}

export type ThemeGlobal = 'light' | 'dark' | 'system';

/** Sets `html[data-theme]` the way the toolkit header's dark-mode toggle does; 'system' removes it. */
export function applyTheme(theme: ThemeGlobal = 'light'): void {
  const html = document.documentElement;
  if (theme === 'system') delete html.dataset.theme;
  else html.dataset.theme = theme;
}
