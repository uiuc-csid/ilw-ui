<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { flushSync } from 'svelte';
  import { expect, spyOn, userEvent } from 'storybook/test';

  import DarkModeToggle from '../src/svelte/DarkModeToggle.svelte';
  import { mountIslands } from '../src/svelte/islands.ts';

  // The toggle changes html[data-theme] and the page's cookie, so each play
  // function clears the cookie when it ends; the next story's render resets
  // data-theme from the toolbar.
  const { Story } = defineMeta({
    title: 'Page Chrome/Dark-mode toggle',
    component: DarkModeToggle,
    parameters: { styles: 'ilw-ui' },
  });

  const clearCookie = () => (document.cookie = 'ilw-dark-mode=; path=/; max-age=0');
  const cookie = () => document.cookie.match(/(?:^|; )ilw-dark-mode=([^;]*)/)?.[1];
  const theme = () => document.documentElement.dataset.theme;

  /** Records the `enabled` of every `ilw-dark-mode-changed` until stopped. */
  function recordEvents() {
    const seen: unknown[] = [];
    const listener = (e: Event) => seen.push((e as CustomEvent).detail);
    window.addEventListener('ilw-dark-mode-changed', listener);
    return { seen, stop: () => window.removeEventListener('ilw-dark-mode-changed', listener) };
  }

  /** A stand-in MediaQueryList whose `change` the play function fires. */
  function fakeScheme(matches: boolean) {
    const media = '(prefers-color-scheme: dark)';
    const mql = Object.assign(new EventTarget(), { matches, media, onchange: null });
    const fire = (dark: boolean) => {
      mql.matches = dark;
      mql.dispatchEvent(new MediaQueryListEvent('change', { matches: dark, media }));
      flushSync();
    };
    return { mql: mql as unknown as MediaQueryList, fire };
  }
</script>

<!--
  The toggle on a light page (`html[data-theme="light"]`, from the toolbar).

  **Why:** the play function checks the contract: a switch named "Dark mode" inside `label.ilw-dark-mode-toggle`, off because `data-theme` isn't `dark`. Turning it on sets `data-theme="dark"`, writes `ilw-dark-mode=true` and dispatches `ilw-dark-mode-changed` with `{ enabled: true }` on `window`; turning it off does the same with `false`.

  **Review:** "Dark mode" beside an off switch. Click it: the page turns dark and the switch fills. Click again to go back.
-->
<Story
  name="Default"
  play={async ({ canvas, canvasElement }) => {
    clearCookie();
    const events = recordEvents();
    try {
      const toggle = canvas.getByRole('switch', { name: 'Dark mode' });
      await expect(toggle).toHaveAttribute('type', 'checkbox');
      await expect(toggle.closest('label')).toHaveClass('ilw-dark-mode-toggle');
      await expect(canvasElement.querySelector('label.ilw-dark-mode-toggle > input[role="switch"]')).toBe(toggle);
      await expect(toggle).not.toBeChecked();
      await expect(theme()).toBe('light');
      // Nothing written at load.
      await expect(cookie()).toBeUndefined();
      await expect(events.seen).toEqual([]);

      await userEvent.click(toggle);
      await expect(toggle).toBeChecked();
      await expect(theme()).toBe('dark');
      await expect(cookie()).toBe('true');
      await expect(events.seen).toEqual([{ enabled: true }]);
      // The theme follows (tokens.css): the filled track is dark mode's control text.
      await expect(getComputedStyle(toggle).backgroundColor).toBe('rgb(202, 217, 239)');

      await userEvent.click(canvas.getByText('Dark mode'));
      await expect(toggle).not.toBeChecked();
      await expect(theme()).toBe('light');
      await expect(cookie()).toBe('false');
      await expect(events.seen).toEqual([{ enabled: true }, { enabled: false }]);
    } finally {
      events.stop();
      clearCookie();
    }
  }}
/>

<!--
  The toggle on a page the server rendered dark (`html[data-theme="dark"]`).

  **Why:** the switch starts on because `data-theme` is `dark`, whatever the OS prefers, and mounting writes nothing. axe checks the switch's dark colours.

  **Review:** a dark page with the switch on.
-->
<Story
  name="Dark"
  globals={{ theme: 'dark' }}
  play={async ({ canvas }) => {
    clearCookie();
    const toggle = canvas.getByRole('switch', { name: 'Dark mode' });
    await expect(toggle).toBeChecked();
    await expect(cookie()).toBeUndefined();
    const track = getComputedStyle(toggle);
    await expect(track.borderTopColor).toBe('rgb(202, 217, 239)');
    await expect(track.backgroundColor).toBe('rgb(202, 217, 239)');
  }}
/>

<!--
  Two server-rendered `<span data-ilw-island="dark-mode-toggle">` hosts on a page with no `data-theme` (toolbar: System), mounted by `mountIslands`. The OS preference is a stand-in the play function controls.

  **Why:** with no `data-theme`, the switch shows the OS preference and follows its changes until the user chooses (the cookie is set); after that the OS no longer moves it. Both toggles stay in step through `ilw-dark-mode-changed`.

  **Review:** two switches showing the same state; clicking either moves both.
-->
<Story
  name="Island"
  globals={{ theme: 'system' }}
  play={async ({ canvas, canvasElement }) => {
    clearCookie();
    const scheme = fakeScheme(false);
    const matchMedia = spyOn(window, 'matchMedia').mockReturnValue(scheme.mql);
    try {
      mountIslands({ 'dark-mode-toggle': DarkModeToggle }, canvasElement);
      flushSync(); // run the islands' effects now, not after the next tick
      await expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      const [first, second] = canvas.getAllByRole('switch', { name: 'Dark mode' });
      await expect(first).not.toBeChecked();
      await expect(theme()).toBeUndefined();

      // No choice yet: the OS preference moves both, and nothing is written.
      scheme.fire(true);
      await expect(first).toBeChecked();
      await expect(second).toBeChecked();
      await expect(theme()).toBeUndefined();
      await expect(cookie()).toBeUndefined();

      // The user chooses light on one; the other follows the event.
      await userEvent.click(second);
      flushSync();
      await expect(second).not.toBeChecked();
      await expect(first).not.toBeChecked();
      await expect(theme()).toBe('light');
      await expect(cookie()).toBe('false');

      // Chosen: the OS no longer moves it.
      scheme.fire(false);
      scheme.fire(true);
      await expect(first).not.toBeChecked();
      await expect(theme()).toBe('light');
    } finally {
      matchMedia.mockRestore();
      clearCookie();
    }
  }}
>
  {#snippet template()}
    <p>Header: <span data-ilw-island="dark-mode-toggle"></span></p>
    <p>Settings: <span data-ilw-island="dark-mode-toggle"></span></p>
  {/snippet}
</Story>

<!--
  The toggle on a page with no `data-theme` (toolbar: System). No play function: the keyboard spec (`tests/e2e/dark-mode-toggle.spec.ts`) drives this one from a fresh load and sets the OS preference itself.

  **Why:** the fixture for Space toggling the switch, the cookie's attributes and following the OS preference.

  **Review:** the switch matches your OS setting. Tab to it and press Space.
-->
<Story name="Fixture" globals={{ theme: 'system' }} />
