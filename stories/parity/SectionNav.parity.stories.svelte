<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import SectionNav from '../../src/svelte/SectionNav.svelte';
  import * as plays from '../plays/section-nav.ts';
  import { programs } from '../section-nav-data.ts';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/SectionNav' });
</script>

<!--
  `<ilw-section-nav>` in automatic mode, the README's example, styled and scripted by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**. Upstream always shows every level and has no branch toggles.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <div style:max-width="20rem">
    <ilw-section-nav>
      <a href="#programs" class="ilw-section-nav--root">Programs of Study</a>
      <a href="#ug">Undergraduate Degrees</a>
      <ilw-section-nav>
        <a href="#animal-sciences">Animal Sciences Major</a>
        <ilw-section-nav>
          <a href="#pre-vet" aria-current="page">Pre-Veterinary and Medical</a>
          <a href="#equine">Companion Animal Equine</a>
        </ilw-section-nav>
      </ilw-section-nav>
      <a href="#cs-animal">Computer & Animal Science</a>
      <ilw-section-nav>
        <a href="#third">Some Third Thing</a>
      </ilw-section-nav>
    </ilw-section-nav>
  </div>
</Story>

<!--
  `SectionNav` with the same tree and every branch open (`expanded`), styled by ilw-ui's `section-nav.css` only.

  **Why:** the play function checks the computed look against upstream's values: item height and indent per level, the root link's size and plate, and the current page's colour and triangle.

  **Review:** matches **Toolkit**, plus a chevron toggle at the right of each branch.
-->
<Story name="IlwUi" parameters={{ styles: 'ilw-ui' }} play={plays.parity}>
  <div style:max-width="20rem">
    <SectionNav items={programs} expanded />
  </div>
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same items, indents and current-page marker on both sides.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-sectionnav" theme={String(context.globals.theme ?? 'light')} height={340} />
  {/snippet}
</Story>
