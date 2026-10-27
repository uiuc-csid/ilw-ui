<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { Columns, Content, Grid, Spacer } from '../../src/svelte/index.ts';
  import * as plays from '../plays/layout.ts';
  import { parityItems as items } from '../plays/layout.ts';
  import { attrs } from './attrs.ts';
  import SideBySide from './SideBySide.svelte';

  import './Layout.parity.stories.css';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Layout' });
</script>

<!--
  `<ilw-content>` in each mode, `<ilw-columns>` (2x1 and sidebar-left, blue), `<ilw-grid>` and `<ilw-spacer>`, styled by the vendored toolkit only. The columns and grid get `gap` and `padding` set to the CSS-only classes' defaults (20 px and 10 px gaps, no padding), which are ours: the elements default to no gap and 40 px of bottom padding.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <ilw-content {@attach attrs({ theme: 'gray' })}><h2>Programs</h2><p>The college offers <a href="#programs">programs of study</a>.</p></ilw-content>
  <ilw-content {@attach attrs({ mode: 'introduction' })}><p><em>Discover your path.</em></p><p>No matter what path brought you here, we're glad you're here.</p></ilw-content>
  <ilw-content decoration {@attach attrs({ mode: 'lede' })}><p>Sodium is an essential micronutrient, but the amount we need is small.</p></ilw-content>
  <ilw-content {@attach attrs({ mode: 'inset', theme: 'blue' })}><h2>Apply today</h2><p>An inset normalises its headings.</p></ilw-content>
  <ilw-spacer height="30px"></ilw-spacer>
  <ilw-columns mode="2x1" gap="20px" padding="0">
    <div class="layout-parity-sample">Two thirds</div>
    <div class="layout-parity-sample">One third</div>
  </ilw-columns>
  <ilw-spacer></ilw-spacer>
  <ilw-columns mode="sidebar-left" padding="0" {@attach attrs({ theme: 'blue' })}>
    <div><p>Sidebar</p></div>
    <div><p>Main column, white on Illinois Blue</p></div>
  </ilw-columns>
  <ilw-spacer></ilw-spacer>
  <ilw-grid innerwidth="180px" padding="0">
    {#each items as n (n)}<div class="layout-parity-sample">Item {n}</div>{/each}
  </ilw-grid>
</Story>

<!--
  `Content`, `Columns`, `Grid` and `Spacer` with the same variants, styled by ilw-ui only.

  **Why:** the play function checks the markup each renders (classes, the theme attribute, the grid's list). The details are tested in **Layout**.

  **Review:** matches **Toolkit**: the same type, colours, decoration bar, column split, 280 px sidebar and grid.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={plays.parity}
>
  <Content theme="gray"><h2>Programs</h2><p>The college offers <a href="#programs">programs of study</a>.</p></Content>
  <Content mode="introduction"><p><em>Discover your path.</em></p><p>No matter what path brought you here, we're glad you're here.</p></Content>
  <Content mode="lede" decoration><p>Sodium is an essential micronutrient, but the amount we need is small.</p></Content>
  <Content mode="inset" theme="blue"><h2>Apply today</h2><p>An inset normalises its headings.</p></Content>
  <Spacer height="30px" />
  <Columns mode="2x1">
    <div class="layout-parity-sample">Two thirds</div>
    <div class="layout-parity-sample">One third</div>
  </Columns>
  <Spacer />
  <Columns mode="sidebar-left" theme="blue">
    <div><p>Sidebar</p></div>
    <div><p>Main column, white on Illinois Blue</p></div>
  </Columns>
  <Spacer />
  <Grid itemWidth="180px">
    {#each items as n (n)}<li><div class="layout-parity-sample">Item {n}</div></li>{/each}
  </Grid>
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same blocks on both sides. The frames are narrower than 700 px, so the columns stack; open each story on its own to see them side by side.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-layout" theme={String(context.globals.theme ?? 'light')} height={1300} />
  {/snippet}
</Story>
