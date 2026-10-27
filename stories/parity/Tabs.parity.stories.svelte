<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import TabsDemo from '../TabsDemo.svelte';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Tabs' });
</script>

<!--
  `<ilw-tabs>` with the README's markup and the same four programs, styled and scripted by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code (its panels have no `tabpanel` role or name).

  **Review:** compare with **IlwUi** or **Side By Side**. Upstream selects on every arrow key and doesn't wrap.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <h2 id="tk-heading">Programs</h2>
  <p>Find the program that fits where you want to go. Each tab covers one way to study with us.</p>
  <ilw-tabs aria-labelledby="tk-heading">
    <div slot="tabs" role="tablist">
      <button role="tab" aria-controls="tk-degree" id="tk-degree-tab">Degree Programs</button>
      <button role="tab" aria-controls="tk-non-degree" id="tk-non-degree-tab">Non-degree Programs</button>
      <button role="tab" aria-controls="tk-classroom" id="tk-classroom-tab">Classroom Experience</button>
      <button role="tab" aria-controls="tk-research" id="tk-research-tab">Undergraduate Research</button>
    </div>
    <div id="tk-degree">
      <p>
        Choose from more than 150 undergraduate majors and 100 graduate and professional programs. Every program pairs
        coursework with research, internships and study abroad.
      </p>
      <p><a href="#tk-majors">Browse all majors</a></p>
    </div>
    <div id="tk-non-degree"><p>Certificates, summer sessions and courses for visiting students, on campus and online.</p></div>
    <div id="tk-classroom"><p>Small discussion sections, hands-on labs and faculty who know your name.</p></div>
    <div id="tk-research"><p>Undergraduates join faculty labs from their first year, with paid positions in every college.</p></div>
  </ilw-tabs>
</Story>

<!--
  `Tabs` with the same content, styled by ilw-ui's `tabs.css` only.

  **Why:** the play function checks the computed look against upstream's values: the 350px tab list, the box's 60/30/75px padding and 60px gap, the tabs' 19px bold type, `.75em 1em` padding and 2px rules, the selected tab's orange and the unselected tabs' white on blue text.

  **Review:** matches **Toolkit**. The panel keeps its own heading in the outline (visually hidden), where upstream's README duplicates it visibly.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ canvas, canvasElement }) => {
    await document.fonts.ready;
    const container = canvasElement.querySelector('.ilw-tabs-container')!;
    const box = getComputedStyle(container);
    await expect([box.paddingTop, box.paddingRight, box.paddingBottom, box.paddingLeft]).toEqual(['60px', '30px', '75px', '30px']);
    await expect(box.columnGap).toBe('60px');
    await expect(canvas.getByRole('tablist').getBoundingClientRect().width).toBe(350);

    const [selected, other] = canvas.getAllByRole('tab').map((t) => getComputedStyle(t));
    await expect(selected.fontSize).toBe('19px');
    await expect(selected.fontWeight).toBe('700');
    await expect([selected.paddingTop, selected.paddingLeft]).toEqual(['14.25px', '19px']);
    await expect(selected.borderTopWidth).toBe('2px');
    await expect(selected.borderBottomWidth).toBe('2px');
    await expect(other.borderTopWidth).toBe('0px');
    await expect(selected.backgroundColor).toBe('rgb(255, 95, 5)');
    await expect(selected.color).toBe('rgb(255, 255, 255)');
    await expect(other.backgroundColor).toBe('rgb(255, 255, 255)');
    await expect(other.color).toBe('rgb(19, 41, 75)');
  }}
>
  <TabsDemo />
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share no class names here, but each side needs its own document to load only its own styles. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same tabs, colours and rules on both sides. The frames are narrower than 800px, so both stack the tabs above the panel.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-tabs" theme={String(context.globals.theme ?? 'light')} height={520} />
  {/snippet}
</Story>
