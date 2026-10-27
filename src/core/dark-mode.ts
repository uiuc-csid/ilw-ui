// The dark-mode switch (B1) without a framework. It shares its state with the
// toolkit header: `html[data-theme]`, the `ilw-dark-mode` cookie, and the
// `ilw-dark-mode-changed` event on window.

/** The cookie holding the user's choice (`true` or `false`), the toolkit header's own. */
export const DARK_MODE_COOKIE = 'ilw-dark-mode';

/** How long the choice is kept: a year, in seconds. */
export const DARK_MODE_MAX_AGE = 60 * 60 * 24 * 365;

/** The window event announcing a change; `detail.enabled` is the new state. */
export const DARK_MODE_EVENT = 'ilw-dark-mode-changed';

function hasCookie(): boolean {
  return document.cookie.split('; ').some((row) => row.startsWith(`${DARK_MODE_COOKIE}=`));
}

/**
 * Whether dark mode is on when the switch mounts. The server writes
 * `data-theme` from the cookie; without it, the OS decides (`scheme` is
 * `matchMedia('(prefers-color-scheme: dark)')`).
 */
export function initialDarkMode(scheme: { matches: boolean }): boolean {
  const theme = document.documentElement.dataset.theme;
  return theme ? theme === 'dark' : scheme.matches;
}

/**
 * Whether a change of the OS scheme moves the switch: only until the user
 * chooses, and not on a page that pins `data-theme` (a site without dark
 * styles sets "light").
 */
export function followsScheme(): boolean {
  return !hasCookie() && !document.documentElement.dataset.theme;
}

/** The state an `ilw-dark-mode-changed` event carries, or undefined if it carries none. */
export function darkModeChange(event: Event): boolean | undefined {
  const detail = (event as CustomEvent<{ enabled?: unknown }>).detail;
  return typeof detail?.enabled === 'boolean' ? detail.enabled : undefined;
}

/** Turns dark mode on or off: sets `html[data-theme]`, saves the choice in the cookie and dispatches `ilw-dark-mode-changed`. */
export function applyDarkMode(on: boolean): void {
  document.documentElement.dataset.theme = on ? 'dark' : 'light';
  document.cookie = `${DARK_MODE_COOKIE}=${on}; path=/; max-age=${DARK_MODE_MAX_AGE}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(DARK_MODE_EVENT, { detail: { enabled: on } }));
}
