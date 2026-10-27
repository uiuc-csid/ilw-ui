<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import Accordion from '../../src/svelte/Accordion.svelte';
  import AccordionPanel from '../../src/svelte/AccordionPanel.svelte';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Accordion' });

  // The toolkit README's FAQ, shortened.
  const faq = [
    { q: 'What are the admission requirements?', a: 'A high school diploma or equivalent, and a minimum GPA that varies by program.' },
    { q: 'How do I submit my application?', a: "Applications are submitted online through the university's admissions portal." },
    { q: 'When is the application deadline?', a: 'Deadlines vary by program, so check the dates for yours.' },
  ];
</script>

<!--
  `<ilw-accordion buttons>` with the first of three panels open, styled and scripted by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <h2>Enrollment FAQ</h2>
  <ilw-accordion buttons>
    {#each faq as item, i (i)}
      <ilw-accordion-panel open={i === 0}>
        <h3 slot="summary">{item.q}</h3>
        <p>{item.a}</p>
      </ilw-accordion-panel>
    {/each}
  </ilw-accordion>
</Story>

<!--
  `Accordion` with `buttons` and the same panels, styled by ilw-ui's `accordion.css` only.

  **Why:** the play function checks the computed look against upstream's values: header padding, background and accent line, the heading's font and colour, the chevron's size and turn, the body's padding, the gaps between panels and the buttons' padding.

  **Review:** matches **Toolkit**: Expand All and Collapse All, then grey headers with a blue line, the first open with its chevron down. ilw-ui adds an outline inside a focused header.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ canvas, canvasElement }) => {
    await document.fonts.ready;
    const [first, second] = [...canvasElement.querySelectorAll('details')];
    const summary = getComputedStyle(first.querySelector('summary')!);
    await expect([summary.paddingTop, summary.paddingRight, summary.paddingBottom, summary.paddingLeft]).toEqual(['30px', '24px', '30px', '24px']);
    await expect(summary.backgroundColor).toBe('rgb(244, 244, 244)');
    await expect([summary.borderLeftWidth, summary.borderLeftColor]).toEqual(['6px', 'rgb(19, 41, 75)']);
    await expect(summary.columnGap).toBe('20px');

    const heading = getComputedStyle(canvas.getByRole('heading', { level: 3, name: faq[0].q }));
    await expect([heading.fontSize, heading.fontWeight, heading.lineHeight, heading.color]).toEqual(['22px', '600', '30px', 'rgb(19, 41, 75)']);
    await expect(heading.fontFamily).toMatch(/^"?Source Sans/);
    await expect(heading.marginTop).toBe('0px');

    const icon = (d: Element) => d.querySelector('svg')!;
    await expect(icon(first).getBoundingClientRect().width).toBeCloseTo(20, 0);
    await expect(getComputedStyle(icon(second)).transform).not.toBe(getComputedStyle(icon(first)).transform);

    const body = getComputedStyle(first.querySelector('.ilw-accordion-body')!);
    await expect([body.paddingTop, body.paddingRight, body.paddingBottom, body.paddingLeft]).toEqual(['5px', '10px', '20px', '65px']);
    await expect(getComputedStyle(first).marginBottom).toBe('10px');
    await expect(getComputedStyle(second).marginBottom).toBe('20px');

    const expand = getComputedStyle(canvas.getByRole('button', { name: /^Expand All/ }));
    await expect([expand.paddingTop, expand.paddingLeft, expand.fontWeight]).toEqual(['12px', '20px', '700']);
  }}
>
  <h2>Enrollment FAQ</h2>
  <Accordion buttons label="Enrollment FAQ">
    {#each faq as item, i (i)}
      <AccordionPanel heading={item.q} open={i === 0}>
        <p>{item.a}</p>
      </AccordionPanel>
    {/each}
  </Accordion>
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share variable names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same buttons, headers, accent line, chevrons and spacing on both sides, in light and dark.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-accordion" theme={String(context.globals.theme ?? 'light')} height={560} />
  {/snippet}
</Story>
