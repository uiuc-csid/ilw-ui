<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import { Breadcrumbs, Columns, Content, Page, PageTitle } from '../../src/svelte/index.ts';
  import { attrs } from './attrs.ts';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets. Both sides are whole pages with
  // side margins (`ilw-margin`), so neither gets the Storybook page wrapper.
  const { Story } = defineMeta({ title: 'Parity/Width', parameters: { shell: false, layout: 'fullscreen' } });

  const trail = [{ label: 'Home', href: '#home' }];
  const widths = ['full', 'auto'] as const;
</script>

<!--
  `width="full"` and `"auto"` on `<ilw-breadcrumbs>`, `<ilw-page-title>`, `<ilw-content>` and `<ilw-columns>` in `<ilw-page class="ilw-format ilw-margin">`, styled by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi**. Known difference: the toolkit's breadcrumbs at `auto` are the same as `full`, the trail at the edge; ours keep the trail at the side margin, as the toolkit's docs describe `auto`.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <ilw-page class="ilw-format ilw-margin">
    <main>
      <p>A paragraph at the side margin, for comparison.</p>
      {#each widths as width (width)}
        <ilw-breadcrumbs {width}><a href="#home">Home</a><span>{width}</span></ilw-breadcrumbs>
      {/each}
      {#each widths as width (width)}
        <ilw-page-title {width}><h1>Page title, {width}</h1></ilw-page-title>
      {/each}
      <ilw-content width="full" {@attach attrs({ theme: 'gray' })}><p>Content, full: the text goes to the edge.</p></ilw-content>
      <ilw-content width="auto" {@attach attrs({ theme: 'blue' })}><p>Content, auto: the text keeps the margin.</p></ilw-content>
      <ilw-columns width="auto" gap="20px" padding="0" {@attach attrs({ theme: 'gray' })}>
        <div><p>Columns, auto</p></div>
        <div><p>keep the margin</p></div>
      </ilw-columns>
    </main>
  </ilw-page>
</Story>

<!--
  The same widths on `Breadcrumbs`, `PageTitle`, `Content` and `Columns` in `Page format margin`, styled by ilw-ui only.

  **Why:** the play function checks each component renders the width class, every breakout spans the page, and the page doesn't scroll sideways. The geometry in detail is tested in **Layout → Widths**.

  **Review:** matches **Toolkit**, except as noted there.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ canvasElement }) => {
    const page = canvasElement.querySelector<HTMLElement>('.ilw-page')!;
    await expect(canvasElement.querySelectorAll('.ilw-breadcrumbs.ilw-width-full, .ilw-page-title.ilw-width-full')).toHaveLength(2);
    await expect(canvasElement.querySelectorAll('.ilw-breadcrumbs.ilw-width-auto, .ilw-page-title.ilw-width-auto')).toHaveLength(2);
    for (const el of canvasElement.querySelectorAll<HTMLElement>('.ilw-width-full, .ilw-width-auto')) {
      await expect(el.getBoundingClientRect().width, el.className).toBeCloseTo(page.clientWidth, 0);
    }
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  }}
>
  <Page format margin>
    <p>A paragraph at the side margin, for comparison.</p>
    {#each widths as width (width)}
      <Breadcrumbs items={trail} current={width} {width} label="Breadcrumbs, {width}" />
    {/each}
    {#each widths as width (width)}
      <PageTitle {width}>Page title, {width}</PageTitle>
    {/each}
    <Content theme="gray" width="full"><p>Content, full: the text goes to the edge.</p></Content>
    <Content theme="blue" width="auto"><p>Content, auto: the text keeps the margin.</p></Content>
    <Columns theme="gray" width="auto">
      <div><p>Columns, auto</p></div>
      <div><p>keep the margin</p></div>
    </Columns>
  </Page>
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same blocks on both sides, each edge to edge in its frame.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-width" theme={String(context.globals.theme ?? 'light')} height={1000} />
  {/snippet}
</Story>
