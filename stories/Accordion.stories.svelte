<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import Accordion from '../src/svelte/Accordion.svelte';
  import AccordionPanel from '../src/svelte/AccordionPanel.svelte';
  import AccordionDemo from './AccordionDemo.svelte';

  // The accordion (C2), ilw-ui's styles only, in the page shell's main.
  const { Story } = defineMeta({
    title: 'Accordion',
    parameters: { styles: 'ilw-ui' },
  });

  const panels = (root: Element) => [...root.querySelectorAll<HTMLDetailsElement>('details.ilw-accordion-panel')];
</script>

<!--
  An FAQ with Expand All / Collapse All and every panel closed. No play function: the keyboard spec (`tests/e2e/accordion.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for Tab order, Enter and Space on a summary, and the two buttons by keyboard.

  **Review:** two outlined buttons, then four grey headers with a blue line at the left and a chevron pointing right. Tab to a header and press Enter or Space: it opens (chevron down) and its links join the Tab order. Expand All opens all four; Collapse All closes them.
-->
<Story name="Fixture">
  <AccordionDemo buttons />
</Story>

<!--
  The same FAQ in single-open mode (`single`), all closed. No play function: `tests/e2e/accordion.spec.ts` drives it.

  **Why:** the fixture for the spec's check that opening a panel by keyboard closes the open one.

  **Review:** no Expand All / Collapse All. Open one question, then another: the first closes. Works with script off too (it is the browser's exclusive `details` group).
-->
<Story name="Single fixture">
  <AccordionDemo single />
</Story>

<!--
  Every panel open, with the buttons.

  **Why:** the "open" story, so axe scans every panel's content. The play function checks the DOM contract: the wrapper, each `details.ilw-accordion-panel` with a `summary` holding only a hidden chevron and an `h3.ilw-accordion-heading`, the body, the summary's name and no `name` outside single mode.

  **Review:** four open panels, chevrons pointing down, each answer indented under its question.
-->
<Story
  name="Open"
  play={async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('.ilw-accordion')!;
    await expect(root.tagName).toBe('DIV');
    await expect(root.className).toBe('ilw-accordion');
    const all = panels(root);
    await expect(all).toHaveLength(4);
    for (const details of all) {
      await expect(details).toHaveAttribute('open');
      await expect(details).not.toHaveAttribute('name');
      await expect([...details.children].map((el) => el.tagName)).toEqual(['SUMMARY', 'DIV']);
      await expect(details.lastElementChild).toHaveClass('ilw-accordion-body');
      const summary = details.querySelector(':scope > summary')!;
      await expect([...summary.children].map((el) => el.tagName.toLowerCase())).toEqual(['svg', 'h3']);
      await expect(summary.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      await expect(summary.querySelector('h3')).toHaveClass('ilw-accordion-heading');
      await expect(summary.querySelector('a, button, input')).toBeNull();
    }
    await expect(canvas.getByRole('heading', { level: 3, name: 'How do I submit my application?' })).toBeVisible();
    await expect(all[1].querySelector('summary')).toHaveAccessibleName('How do I submit my application?');
    await expect(canvas.getByRole('link', { name: 'admissions portal' })).toBeVisible();

    // The buttons come first, named with the accordion's label.
    await expect(root.firstElementChild).toHaveClass('ilw-accordion-buttons');
    await expect(canvas.getByRole('button', { name: 'Expand All Enrollment FAQ' })).toHaveClass('ilw-button');
    await expect(canvas.getByRole('button', { name: 'Collapse All Enrollment FAQ' })).toHaveClass('ilw-button');
  }}
>
  <AccordionDemo buttons open />
</Story>

<!--
  Expand All and Collapse All, clicked by the play function.

  **Why:** the play function checks Expand All opens every panel and Collapse All closes them, that each button keeps focus, and that a panel opened by hand closes with the rest.

  **Review:** as **Fixture**; the play function leaves every panel closed.
-->
<Story
  name="Buttons"
  play={async ({ canvas, canvasElement, userEvent }) => {
    const all = panels(canvasElement);
    await expect(all.filter((d) => d.open)).toHaveLength(0);

    const expand = canvas.getByRole('button', { name: /^Expand All/ });
    await userEvent.click(expand);
    await waitFor(() => expect(all.every((d) => d.open)).toBe(true));
    await expect(expand).toHaveFocus();
    await expect(canvas.getByRole('link', { name: 'admissions portal' })).toBeVisible();

    const collapse = canvas.getByRole('button', { name: /^Collapse All/ });
    await userEvent.click(collapse);
    await waitFor(() => expect(all.some((d) => d.open)).toBe(false));
    await expect(collapse).toHaveFocus();

    // A panel opened by its summary is closed by Collapse All too.
    await userEvent.click(all[2].querySelector('summary')!);
    await waitFor(() => expect(all[2].open).toBe(true));
    await userEvent.click(collapse);
    await waitFor(() => expect(all[2].open).toBe(false));
  }}
>
  <AccordionDemo buttons />
</Story>

<!--
  Single-open mode with `buttons` also set.

  **Why:** the play function checks every panel shares one `name` (the browser's exclusive group), that the buttons aren't rendered with `single`, and that opening a second panel closes the first.

  **Review:** no buttons; only one question open at a time.
-->
<Story
  name="Single"
  play={async ({ canvas, canvasElement, userEvent }) => {
    const all = panels(canvasElement);
    const name = all[0].getAttribute('name');
    await expect(name).toBeTruthy();
    await expect(all.map((d) => d.getAttribute('name'))).toEqual([name, name, name, name]);
    await expect(canvas.queryByRole('button', { name: /Expand All/ })).toBeNull();

    await userEvent.click(all[0].querySelector('summary')!);
    await waitFor(() => expect(all[0].open).toBe(true));
    await userEvent.click(all[1].querySelector('summary')!);
    await waitFor(() => expect(all.map((d) => d.open)).toEqual([false, true, false, false]));
  }}
>
  <AccordionDemo single buttons />
</Story>

<!--
  A directory split into groups by headings inside one compact accordion, with the buttons and the second panel open.

  **Why:** the toolkit's second example (headings between panels) and its `compact` look. The play function checks the compact class (and no accent class), panel headings at `level` 4, the buttons as text links (no `.ilw-button`), and the bound `open`.

  **Review:** white rows divided by thin grey rules, no blue line, smaller headings; "Expand All | Collapse All" as underlined text at the right. "Educational Psychology" is open.
-->
<Story
  name="Compact groups"
  play={async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('.ilw-accordion')!;
    await expect(root.className).toBe('ilw-accordion ilw-accordion-compact');
    await expect(canvas.getAllByRole('heading', { level: 4 })).toHaveLength(5);
    await expect(canvas.getByRole('heading', { level: 3, name: 'Research Centers' }).parentElement).toBe(root);
    const expand = canvas.getByRole('button', { name: 'Expand All College of Education directory' });
    await expect(expand).not.toHaveClass('ilw-button');
    await expect(expand.closest('ul')).not.toHaveClass('ilw-buttons-left');
    await expect(getComputedStyle(expand).textDecorationLine).toBe('underline');
    await expect(panels(root).map((d) => d.open)).toEqual([false, true, false, false, false]);
    await expect(getComputedStyle(root.querySelector('summary')!).borderLeftStyle).toBe('none');
  }}
>
  <h2>College of Education directory</h2>
  <Accordion compact buttons label="College of Education directory">
    <h3>Academic Departments</h3>
    <AccordionPanel heading="Curriculum & Instruction" level={4}>
      <p>Education Building, room 311. <a href="#ci">Department site</a></p>
    </AccordionPanel>
    <AccordionPanel heading="Educational Psychology" level={4} open>
      <p>Education Building, room 226. <a href="#edpsy">Department site</a></p>
    </AccordionPanel>
    <AccordionPanel heading="Special Education" level={4}>
      <p>Education Building, room 288. <a href="#sped">Department site</a></p>
    </AccordionPanel>
    <h3>Research Centers</h3>
    <AccordionPanel heading="Bureau of Educational Research" level={4}>
      <p>Children's Research Center, room 100. <a href="#ber">Bureau site</a></p>
    </AccordionPanel>
    <AccordionPanel heading="Center for Education in Small Urban Communities" level={4}>
      <p>Education Building, room 140. <a href="#small-urban">Center site</a></p>
    </AccordionPanel>
  </Accordion>
</Story>

<!--
  The accent colours, one short accordion each, with a rich `summary` snippet in the first.

  **Why:** the play function checks each `accent` maps to its class and its line colour, that blue (the default) adds no class, and that a `summary` snippet replaces `heading`.

  **Review:** the left line is Blue, Orange, Arches, Industrial, Altgeld, then Black (gray and white are near-invisible on the grey header, as upstream).
-->
<Story
  name="Accents"
  play={async ({ canvasElement }) => {
    const roots = [...canvasElement.querySelectorAll('.ilw-accordion')];
    await expect(roots.map((r) => r.className)).toEqual([
      'ilw-accordion',
      'ilw-accordion ilw-accordion-accent-orange',
      'ilw-accordion ilw-accordion-accent-arches',
      'ilw-accordion ilw-accordion-accent-industrial',
      'ilw-accordion ilw-accordion-accent-altgeld',
      'ilw-accordion ilw-accordion-accent-black',
    ]);
    const line = (r: Element) => getComputedStyle(r.querySelector('summary')!).borderLeftColor;
    await expect(roots.map(line)).toEqual([
      'rgb(19, 41, 75)',
      'rgb(255, 95, 5)',
      'rgb(0, 159, 212)',
      'rgb(29, 88, 167)',
      'rgb(200, 65, 19)',
      'rgb(0, 0, 0)',
    ]);
    await expect(getComputedStyle(roots[0].querySelector('summary')!).borderLeftWidth).toBe('6px');
    const rich = roots[0].querySelector('.ilw-accordion-heading')!;
    await expect(rich.querySelector('em')).toHaveTextContent('Blue');
    await expect(rich).toHaveTextContent('The Blue accent');
  }}
>
  <h2>Accent colours</h2>
  {#each ['blue', 'orange', 'arches', 'industrial', 'altgeld', 'black'] as const as accent (accent)}
    <Accordion {accent}>
      {#if accent === 'blue'}
        <AccordionPanel>
          {#snippet summary()}The <em>Blue</em> accent{/snippet}
          <p>The default line colour.</p>
        </AccordionPanel>
      {:else}
        <AccordionPanel heading="The {accent} accent">
          <p>Set with <code>accent="{accent}"</code>.</p>
        </AccordionPanel>
      {/if}
    </Accordion>
  {/each}
</Story>

<!--
  The documented markup written out by hand, as a server template would send it: no component, no script.

  **Why:** proves `accordion.css` alone styles the README markup, and a shared `name` alone makes it single-open. The play function checks the computed header styles and that opening the second panel closes the first.

  **Review:** looks like **Fixture** without buttons; one question open at a time.
-->
<Story
  name="Plain markup"
  play={async ({ canvasElement, userEvent }) => {
    const all = panels(canvasElement);
    const summary = getComputedStyle(all[0].querySelector('summary')!);
    await expect(summary.paddingTop).toBe('30px');
    await expect(summary.paddingLeft).toBe('24px');
    await expect(summary.backgroundColor).toBe('rgb(244, 244, 244)');
    await expect(all[0].open).toBe(true);
    await userEvent.click(all[1].querySelector('summary')!);
    await waitFor(() => expect(all.map((d) => d.open)).toEqual([false, true]));
  }}
>
  <h2>Visiting campus</h2>
  <div class="ilw-accordion">
    <details class="ilw-accordion-panel" name="visit" open>
      <summary>
        <svg class="ilw-accordion-icon" aria-hidden="true" focusable="false" viewBox="0 0 40.4 23.82">
          <path
            fill="currentColor"
            d="m39.34,1.06c-1.41-1.41-3.7-1.41-5.12,0l-14.02,14.02L6.18,1.06C4.76-.35,2.47-.35,1.06,1.06s-1.41,3.7,0,5.12l16.58,16.58c1.41,1.41,3.7,1.41,5.12,0L39.34,6.18c1.41-1.41,1.41-3.7,0-5.12Z"
          />
        </svg>
        <h3 class="ilw-accordion-heading">Where do I park?</h3>
      </summary>
      <div class="ilw-accordion-body"><p>Visitor parking is in the Illini Union garage.</p></div>
    </details>
    <details class="ilw-accordion-panel" name="visit">
      <summary>
        <svg class="ilw-accordion-icon" aria-hidden="true" focusable="false" viewBox="0 0 40.4 23.82">
          <path
            fill="currentColor"
            d="m39.34,1.06c-1.41-1.41-3.7-1.41-5.12,0l-14.02,14.02L6.18,1.06C4.76-.35,2.47-.35,1.06,1.06s-1.41,3.7,0,5.12l16.58,16.58c1.41,1.41,3.7,1.41,5.12,0L39.34,6.18c1.41-1.41,1.41-3.7,0-5.12Z"
          />
        </svg>
        <h3 class="ilw-accordion-heading">Can I take a tour?</h3>
      </summary>
      <div class="ilw-accordion-body"><p>Tours leave the Visitors Center every weekday at 10 and 2.</p></div>
    </details>
  </div>
</Story>

<!--
  The open FAQ with `html[data-theme="dark"]`, and a compact one.

  **Why:** the colours come from the theme properties, so dark mode follows without per-component rules; axe checks the contrast of the headings on the dark header.

  **Review:** dark grey headers with light headings; the compact panels on the dark page surface.
-->
<Story name="Dark" globals={{ theme: 'dark' }}>
  <AccordionDemo buttons open />
  <AccordionDemo compact buttons open title="Compact FAQ" />
</Story>
