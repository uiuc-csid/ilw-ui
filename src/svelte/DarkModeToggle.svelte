<!--
  The dark-mode toggle island (B1): a switch that sets html[data-theme], saves
  the choice in the toolkit header's `ilw-dark-mode` cookie and announces it
  with the header's `ilw-dark-mode-changed` event. Mount it on
  `<span data-ilw-island="dark-mode-toggle"></span>` with mountIslands.
  Without script (or on a server render) it renders nothing. Styled by
  dark-mode-toggle.css.
-->
<script lang="ts">
  let {
    label = 'Dark mode',
  }: {
    /** The switch's visible label. */
    label?: string;
  } = $props();

  const COOKIE = 'ilw-dark-mode';
  const ONE_YEAR = 60 * 60 * 24 * 365;

  // undefined until mounted: nothing renders before there is a document to read.
  let enabled = $state<boolean | undefined>();

  function hasCookie(): boolean {
    return document.cookie.split('; ').some((row) => row.startsWith(`${COOKIE}=`));
  }

  $effect(() => {
    const html = document.documentElement;
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    // The server writes data-theme from the cookie; without it, the OS decides.
    enabled = html.dataset.theme ? html.dataset.theme === 'dark' : scheme.matches;

    // Follow the OS until the user chooses. A page that pins data-theme
    // (a site without dark styles sets "light") doesn't follow it.
    const onScheme = (event: MediaQueryListEvent) => {
      if (!hasCookie() && !html.dataset.theme) enabled = event.matches;
    };
    // Another toggle on the page (or the toolkit header) changed it.
    const onChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ enabled?: unknown }>).detail;
      if (typeof detail?.enabled === 'boolean') enabled = detail.enabled;
    };
    scheme.addEventListener('change', onScheme);
    window.addEventListener('ilw-dark-mode-changed', onChanged);
    return () => {
      scheme.removeEventListener('change', onScheme);
      window.removeEventListener('ilw-dark-mode-changed', onChanged);
    };
  });

  function onchange(event: Event & { currentTarget: HTMLInputElement }) {
    const on = event.currentTarget.checked;
    enabled = on;
    document.documentElement.dataset.theme = on ? 'dark' : 'light';
    document.cookie = `${COOKIE}=${on}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent('ilw-dark-mode-changed', { detail: { enabled: on } }));
  }
</script>

{#if enabled !== undefined}
  <label class="ilw-dark-mode-toggle"><input type="checkbox" role="switch" checked={enabled} {onchange} /> {label}</label>
{/if}
