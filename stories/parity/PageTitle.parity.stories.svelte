<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import PageTitle from '../../src/svelte/PageTitle.svelte';
  import * as plays from '../plays/page-title.ts';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/PageTitle' });

  // A local image, so the tests don't depend on the network: diagonal stripes.
  const image =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300"><defs><pattern id="p" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="30" height="60" fill="#e84a27"/><rect x="30" width="30" height="60" fill="#5e6669"/></pattern></defs><rect width="1200" height="300" fill="url(#p)"/></svg>',
    );

  const themes = [undefined, 'blue', 'orange', 'white'] as const;
</script>

<!--
  `<ilw-page-title>` in each theme, then with a background image, with and without `fade`, styled by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  {#each themes as theme (theme ?? 'default')}
    <ilw-page-title {theme}><h1>Graduate Programs ({theme ?? 'default'})</h1></ilw-page-title>
  {/each}
  <ilw-page-title><img src={image} alt="" slot="background" /><h1>With an image</h1></ilw-page-title>
  <ilw-page-title fade><img src={image} alt="" slot="background" /><h1>With an image, fade</h1></ilw-page-title>
</Story>

<!--
  `PageTitle` with the same variants, styled by ilw-ui's `page-title.css` only.

  **Why:** the play function checks the markup (an `<h1>`, a decorative image) and each theme's text and plate colours. axe checks the contrast where there is no image.

  **Review:** matches **Toolkit**: the default is white on Illinois Blue; blue is the same; orange is blue-on-orange; white is blue on white. With an image, the plate is translucent; with fade it is solid and the image fades out downwards. Narrow the window: the title shrinks at 800 px and 600 px.
-->
<Story name="IlwUi" parameters={{ styles: 'ilw-ui' }} play={plays.parity}>
  {#each themes as theme (theme ?? 'default')}
    <PageTitle {theme}>Graduate Programs ({theme ?? 'default'})</PageTitle>
  {/each}
  <PageTitle {image}>With an image</PageTitle>
  <PageTitle {image} fade>With an image, fade</PageTitle>
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same six titles on both sides. Under the Dark toolbar setting only the ilw-ui default and white variants change.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-pagetitle" theme={String(context.globals.theme ?? 'light')} height={1400} />
  {/snippet}
</Story>
