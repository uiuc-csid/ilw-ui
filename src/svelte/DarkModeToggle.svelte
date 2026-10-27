<!--
  The dark-mode toggle island (B1): a switch that sets html[data-theme], saves
  the choice in the toolkit header's `ilw-dark-mode` cookie and announces it
  with the header's `ilw-dark-mode-changed` event. Mount it on
  `<span data-ilw-island="dark-mode-toggle"></span>` with mountIslands.
  Without script (or on a server render) it renders nothing. Styled by
  dark-mode-toggle.css and switch.css.
-->
<script lang="ts">
  import { applyDarkMode, DARK_MODE_EVENT, darkModeChange, followsScheme, initialDarkMode } from '../core/dark-mode.ts';

  let {
    label = 'Dark mode',
  }: {
    /** The switch's visible label. */
    label?: string;
  } = $props();

  // undefined until mounted: nothing renders before there is a document to read.
  let enabled = $state<boolean | undefined>();

  $effect(() => {
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    enabled = initialDarkMode(scheme);

    // Follow the OS until the user chooses.
    const onScheme = (event: MediaQueryListEvent) => {
      if (followsScheme()) enabled = event.matches;
    };
    // Another toggle on the page (or the toolkit header) changed it.
    const onChanged = (event: Event) => {
      const on = darkModeChange(event);
      if (on !== undefined) enabled = on;
    };
    scheme.addEventListener('change', onScheme);
    window.addEventListener(DARK_MODE_EVENT, onChanged);
    return () => {
      scheme.removeEventListener('change', onScheme);
      window.removeEventListener(DARK_MODE_EVENT, onChanged);
    };
  });

  function onchange(event: Event & { currentTarget: HTMLInputElement }) {
    const on = event.currentTarget.checked;
    enabled = on;
    applyDarkMode(on);
  }
</script>

{#if enabled !== undefined}
  <label class="ilw-dark-mode-toggle"><input type="checkbox" role="switch" class="ilw-switch" checked={enabled} {onchange} /> {label}</label>
{/if}
