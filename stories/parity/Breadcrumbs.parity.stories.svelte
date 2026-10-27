<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Breadcrumbs from '../../src/svelte/Breadcrumbs.svelte';
  import * as plays from '../plays/breadcrumbs.ts';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Breadcrumbs' });

  const trail = [
    { label: 'Home', href: '#home' },
    { label: 'Academics', href: '#academics' },
    { label: 'Undergraduate programs', href: '#undergraduate' },
  ];
</script>

<!--
  `<ilw-breadcrumbs>`, default and `theme="blue"`, styled by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**. In this toolkit build `theme="blue"` doesn't change the look, so the blue row matches the default; ilw-ui's blue row shows the theme as the toolkit's source intends it.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <ilw-breadcrumbs>
    {#each trail as c (c.href)}<a href={c.href}>{c.label}</a>{/each}
    <span>Degree programs</span>
  </ilw-breadcrumbs>
  <ilw-breadcrumbs theme="blue" label="Breadcrumbs, blue">
    {#each trail as c (c.href)}<a href={c.href}>{c.label}</a>{/each}
    <span>Degree programs</span>
  </ilw-breadcrumbs>
</Story>

<!--
  `Breadcrumbs`, default and with the blue theme class, styled by ilw-ui's `breadcrumbs.css` only.

  **Why:** the play function checks the contract: a named nav, an ordered list, the current page unlinked with `aria-current="page"`, and separators that screen readers skip.

  **Review:** matches **Toolkit**: small links separated by `>` (Altgeld; orange on blue). Tab to a link: it gets the focus colours and a bottom border.
-->
<Story name="IlwUi" parameters={{ styles: 'ilw-ui' }} play={plays.parity}>
  <Breadcrumbs items={trail} current="Degree programs" />
  <Breadcrumbs items={trail} current="Degree programs" label="Breadcrumbs, blue" class="ilw-theme-blue-1" />
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same links, separators and blue variant on both sides.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-breadcrumbs" theme={String(context.globals.theme ?? 'light')} height={160} />
  {/snippet}
</Story>
