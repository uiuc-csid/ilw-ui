<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import DarkModeToggle from '../../src/svelte/DarkModeToggle.svelte';

  import './DarkModeToggle.parity.stories.css';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Dark-mode toggle' });
</script>

<!--
  `<ilw-header dark-mode-visible>`, styled by the vendored toolkit only. Its checkbox sits in the header's shadow DOM and shows only in the full (990 px and wider) layout.

  **Why:** the reference for the ilw-ui side. Upstream's checkbox writes the `ilw-dark-mode` cookie (session-only) and dispatches `ilw-dark-mode-changed`, but doesn't set `data-theme`: it leaves that to the page. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi**: the same label ("Dark Mode" upstream, sentence case here) beside a plain checkbox, where ours is a switch.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <ilw-header dark-mode-visible>
    <a slot="site-name" href="#home">Sample Site</a>
  </ilw-header>
</Story>

<!--
  `DarkModeToggle`, styled by ilw-ui's `dark-mode-toggle.css` only.

  **Why:** the same control and label, as a switch (`role="switch"`), which says what it does better than a checkbox. Unlike upstream it also sets `html[data-theme]` and keeps the cookie for a year.

  **Review:** a switch labelled "Dark mode"; under the Dark toolbar setting it is on and light on dark.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  }}
>
  <DarkModeToggle />
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves. Upstream hides its checkbox below the header's 990 px breakpoint, so the frames are stacked, each full width, rather than side by side.

  **Review:** the toolkit header with its checkbox under the site name, then ours. Widen the window past 990 px if the toolkit frame shows no checkbox.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    {@const globals = `theme:${String(context.globals.theme ?? 'light')}`}
    <div class="dark-mode-stacked">
      {#each [['Toolkit', 'toolkit', 220], ['ilw-ui', 'ilw-ui', 80]] as const as [label, side, height] (side)}
        <div class="dark-mode-stacked-head">{label}</div>
        <iframe
          title="Dark-mode toggle, {side}"
          src="iframe.html?{new URLSearchParams({ id: `parity-dark-mode-toggle--${side}`, viewMode: 'story', globals })}"
          {height}
        ></iframe>
      {/each}
    </div>
  {/snippet}
</Story>
