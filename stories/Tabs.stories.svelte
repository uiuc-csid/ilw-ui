<script module lang="ts">
  import { defineMeta } from '@storybook/svelte-vite';
  import { expect, userEvent, waitFor } from 'storybook/test';

  import TabPanelAloneDemo from './TabPanelAloneDemo.svelte';
  import TabsDemo from './TabsDemo.svelte';
  import TabsMarkupDemo from './TabsMarkupDemo.svelte';
  import TabsPanelContextDemo from './TabsPanelContextDemo.svelte';

  // No `component`: the stories render TabsDemo, which binds the selection.
  const { Story } = defineMeta({
    title: 'Tabs',
    parameters: { styles: 'ilw-ui' },
  });

  const LABELS = ['Degree Programs', 'Non-degree Programs', 'Classroom Experience', 'Undergraduate Research'];
  const IDS = ['programs-degree', 'programs-non-degree', 'programs-classroom', 'programs-research'];

  const SHEETS = ['run-assignments', 'run-validation', 'run-warnings'];

  /** Puts the story's URL back as it was (the Hash stories change its fragment). */
  function restoreUrl(url: string): void {
    history.replaceState(history.state, '', url);
  }
</script>

<!--
  `Tabs` in the default layout (tab list in a column at the left), manual activation. No play function: the keyboard spec (`tests/e2e/tabs.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for the APG keys: arrows move focus (wrapping), Home and End, Enter and Space select, Tab leaves the list for the panel.

  **Review:** four tabs at the left, "Degree Programs" orange. Click a tab, or Tab into the list and use the arrows: focus moves without selecting until Enter or Space. Narrower than 800 px the tabs stack above the panel.
-->
<Story name="Fixture">
  <TabsDemo />
</Story>

<!--
  `Tabs` with `automatic` and `horizontal`: the toolkit's activation, tabs in a row. No play function: the keyboard spec drives it.

  **Why:** the fixture for automatic activation: each arrow selects the tab it reaches.

  **Review:** the tabs sit in a row over the panel with a rule under them; arrows change the panel at once.
-->
<Story name="Automatic Fixture">
  <TabsDemo automatic horizontal />
</Story>

<!--
  The default `Tabs`, checked by its play function.

  **Why:** the DOM contract and ARIA: `.ilw-tabs.ilw-tabs--ready > .ilw-tabs-container` holding a `tablist` (named by the heading through `aria-labelledby`, `aria-orientation="vertical"`) of `button[role=tab]` with ids `<panel id>-tab`, `aria-controls`, `aria-selected` and a roving `tabindex`, then one `section.ilw-tabs-panel[role=tabpanel]` per tab, named by its tab, `tabindex="0"`, all but the selected one `hidden`, each with its heading visually hidden. A click selects, calls `onchange` and updates the bound `selected`; clicking the selected tab again changes nothing.

  **Review:** as **Fixture**.
-->
<Story
  name="Default"
  play={async ({ canvas, canvasElement }) => {
    const list = canvas.getByRole('tablist', { name: 'Programs' });
    await expect(list).toHaveClass('ilw-tabs-list');
    await expect(list).toHaveAttribute('aria-orientation', 'vertical');
    const box = canvasElement.querySelector('.ilw-tabs')!;
    await expect(box).toHaveClass('ilw-tabs--ready');
    await expect(list.parentElement).toHaveClass('ilw-tabs-container');
    await expect(list.parentElement!.parentElement).toBe(box);

    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(LABELS);
    for (const [i, tab] of tabs.entries()) {
      await expect(tab.tagName).toBe('BUTTON');
      await expect(tab).toHaveAttribute('type', 'button');
      await expect(tab).toHaveClass('ilw-tabs-tab');
      await expect(tab.id).toBe(`${IDS[i]}-tab`);
      await expect(tab).toHaveAttribute('aria-controls', IDS[i]);
      await expect(tab).toHaveAttribute('aria-selected', String(i === 0));
      await expect(tab).toHaveAttribute('tabindex', i === 0 ? '0' : '-1');
    }

    const panels = [...canvasElement.querySelectorAll<HTMLElement>('section.ilw-tabs-panel')];
    await expect(panels.map((p) => p.id)).toEqual(IDS);
    for (const [i, panel] of panels.entries()) {
      await expect(panel).toHaveAttribute('role', 'tabpanel');
      await expect(panel).toHaveAttribute('aria-labelledby', `${IDS[i]}-tab`);
      await expect(panel).toHaveAttribute('tabindex', '0');
      await expect(panel.hidden).toBe(i !== 0);
      const heading = panel.querySelector('h3.ilw-tabs-heading')!;
      await expect(heading).toHaveTextContent(LABELS[i]);
      // Visually hidden, still in the outline.
      await expect(heading.getBoundingClientRect().height).toBeLessThanOrEqual(1);
    }
    await expect(canvas.getByRole('tabpanel')).toHaveAccessibleName('Degree Programs');

    await userEvent.click(tabs[2]);
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(tabs[2]).toHaveAttribute('tabindex', '0');
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    await expect(tabs[0]).toHaveAttribute('tabindex', '-1');
    await expect(canvas.getByRole('tabpanel')).toHaveAccessibleName('Classroom Experience');
    await expect(panels[0].hidden).toBe(true);
    await expect(canvas.getByTestId('selected')).toHaveTextContent('programs-classroom');
    await userEvent.click(tabs[2]);
    await expect(canvas.getByTestId('changes')).toHaveTextContent(/^programs-classroom$/);
  }}
>
  <TabsDemo />
</Story>

<!--
  `selected` set to the third tab, with `level={2}` headings.

  **Why:** the play function checks the named tab starts selected (the others hidden) and the panels' headings are `h2`s. An unknown `selected` would fall back to the first tab.

  **Review:** "Classroom Experience" is orange and its panel shows.
-->
<Story
  name="Selected"
  play={async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('tab', { selected: true })).toHaveTextContent('Classroom Experience');
    await expect(canvas.getByRole('tabpanel')).toHaveAttribute('id', 'programs-classroom');
    await expect(canvasElement.querySelectorAll('.ilw-tabs-panel > h2.ilw-tabs-heading')).toHaveLength(4);
  }}
>
  <TabsDemo selected="programs-classroom" level={2} />
</Story>

<!--
  `horizontal`: the tabs in a row over the panel.

  **Why:** the play function checks `aria-orientation="horizontal"`, that the tabs share one row and the panel sits under the list, and the toolkit's 2px rule under the list.

  **Review:** a row of four tabs, ruled underneath, the panel below.
-->
<Story
  name="Horizontal"
  play={async ({ canvas }) => {
    const list = canvas.getByRole('tablist');
    await expect(list).toHaveAttribute('aria-orientation', 'horizontal');
    const tops = canvas.getAllByRole('tab').map((t) => t.getBoundingClientRect().top);
    await expect(new Set(tops).size).toBe(1);
    await expect(canvas.getByRole('tabpanel').getBoundingClientRect().top).toBeGreaterThanOrEqual(list.getBoundingClientRect().bottom);
    await expect(getComputedStyle(list).borderBottomWidth).toBe('2px');
  }}
>
  <TabsDemo horizontal />
</Story>

<!--
  The default layout in a 600px-wide column.

  **Why:** under 800px (a container query, as upstream) the tabs stack full width above the panel. The play function checks the tabs are as wide as the list and the panel is under it.

  **Review:** four full-width tabs, ruled between, the panel underneath.
-->
<Story
  name="Narrow"
  play={async ({ canvas }) => {
    const list = canvas.getByRole('tablist');
    const width = list.getBoundingClientRect().width;
    for (const tab of canvas.getAllByRole('tab')) await expect(tab.getBoundingClientRect().width).toBe(width);
    await expect(canvas.getByRole('tabpanel').getBoundingClientRect().top).toBeGreaterThanOrEqual(list.getBoundingClientRect().bottom);
  }}
>
  <div style:width="600px">
    <TabsDemo />
  </div>
</Story>

<!--
  `TabPanel`s are children of `Tabs`; here one sits inside an `{#if}`, toggled by the "Include online programs" button above the box.

  **Why:** the tab list follows the panels' document order, not the order they registered in. The play function shows the panel and checks its tab lands between "Classroom Experience" and "Undergraduate Research" and selects its panel; hiding it again drops the tab and falls back to the first.

  **Review:** press the button: an "Online Programs" tab appears fourth. Select it, then press the button again: the tab goes and "Degree Programs" shows.
-->
<Story
  name="Conditional Panel"
  play={async ({ canvas }) => {
    const toggle = canvas.getByRole('button', { name: 'Include online programs' });
    await expect(canvas.getAllByRole('tab')).toHaveLength(4);

    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getAllByRole('tab')).toHaveLength(5));
    await expect(canvas.getAllByRole('tab').map((t) => t.textContent)).toEqual([
      ...LABELS.slice(0, 3),
      'Online Programs',
      LABELS[3],
    ]);
    const online = canvas.getByRole('tab', { name: 'Online Programs' });
    await expect(online).toHaveAttribute('aria-controls', 'programs-online');
    await userEvent.click(online);
    await expect(canvas.getByRole('tabpanel')).toHaveAccessibleName('Online Programs');
    await expect(canvas.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');

    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getAllByRole('tab')).toHaveLength(4));
    await expect(canvas.getByRole('tab', { selected: true })).toHaveTextContent('Degree Programs');
    await expect(canvas.getByRole('tabpanel')).toHaveAttribute('id', 'programs-degree');
  }}
>
  <TabsDemo online />
</Story>

<!--
  `hash`: choosing a tab writes `#<panel id>` to the URL, and a link to a panel's id selects it.

  **Why:** the play function clicks a tab and checks the fragment (replaced, not pushed: the history length doesn't change), then sets the fragment as the closing paragraph's in-page link would and checks its tab is selected (a `hashchange`). It puts the URL back when done.

  **Review:** click a tab and watch the iframe's URL; the "undergraduate research" link under the box opens that tab.
-->
<Story
  name="Hash"
  play={async ({ canvas }) => {
    const url = location.href;
    const length = history.length;
    try {
      await userEvent.click(canvas.getByRole('tab', { name: 'Non-degree Programs' }));
      await expect(location.hash).toBe('#programs-non-degree');
      await expect(history.length).toBe(length);

      // What following the in-page link does. (Clicking it would leave the
      // test runner's page, whose <base> points elsewhere.)
      await expect(canvas.getByRole('link', { name: 'undergraduate research' })).toHaveAttribute('href', '#programs-research');
      location.hash = 'programs-research';
      await waitFor(() => expect(canvas.getByRole('tab', { name: 'Undergraduate Research' })).toHaveAttribute('aria-selected', 'true'));
      await expect(canvas.getByRole('tabpanel')).toHaveAttribute('id', 'programs-research');
      await expect(canvas.getByTestId('changes')).toHaveTextContent('programs-non-degree, programs-research');
    } finally {
      restoreUrl(url);
    }
  }}
>
  <TabsDemo hash />
</Story>

<!--
  `hash` without a play function, for the spec that loads the story with `#programs-research` in its URL.

  **Why:** the fixture for following a fragment on load (`tests/e2e/tabs.spec.ts`).

  **Review:** open the story with `#programs-research` after its URL: "Undergraduate Research" starts selected.
-->
<Story name="Hash Fixture">
  <TabsDemo hash />
</Story>

<!--
  Server markup (the README's) enhanced in place by `enhanceTabs`, as a page script would with `enhanceAllTabs()`.

  **Why:** the play function checks the enhancer reads the panels' ids and headings, the tab list is named by `data-labelledby` and inserted before the first panel, a click fires a bubbling `ilw-tabs-change` with the panel id, and enhancing again is a no-op. Its cleanup (run by unmounting the story) restores the sections.

  **Review:** the same tabs as **Fixture**, three of them.
-->
<Story
  name="Enhanced Markup"
  play={async ({ canvas, canvasElement }) => {
    const { enhanceTabs } = await import('../src/svelte/tabs.ts');
    const list = canvas.getByRole('tablist', { name: 'Programs' });
    await expect(list.nextElementSibling).toHaveAttribute('id', 'markup-degree');
    await expect(canvas.getAllByRole('tab').map((t) => t.textContent)).toEqual(LABELS.slice(0, 3));

    await userEvent.click(canvas.getByRole('tab', { name: 'Non-degree Programs' }));
    await expect(canvas.getByRole('tabpanel')).toHaveAttribute('id', 'markup-non-degree');
    await expect(canvas.getByTestId('changes')).toHaveTextContent('markup-non-degree');

    const host = canvasElement.querySelector<HTMLElement>('.ilw-tabs')!;
    enhanceTabs(host)();
    await expect(canvas.getAllByRole('tablist')).toHaveLength(1);
  }}
>
  <TabsMarkupDemo />
</Story>

<!--
  The same markup enhanced, then cleaned up: what a page gets back when it unmounts the tabs.

  **Why:** the play function enhances the box, runs the cleanup and checks the sections are exactly as served: no tab list, no `.ilw-tabs--ready`, no `role`, `aria-labelledby`, `tabindex` or `hidden` on the panels.

  **Review:** three headed sections, as **No Script**.
-->
<Story
  name="Enhanced Then Restored"
  play={async ({ canvasElement }) => {
    const { enhanceTabs } = await import('../src/svelte/tabs.ts');
    const host = canvasElement.querySelector<HTMLElement>('.ilw-tabs')!;
    const before = host.outerHTML;
    const cleanup = enhanceTabs(host);
    await expect(host.querySelector('[role=tablist]')).not.toBeNull();
    await expect(host.querySelectorAll('.ilw-tabs-panel[hidden]')).toHaveLength(2);
    cleanup();
    await expect(host.outerHTML).toBe(before);
  }}
>
  <TabsMarkupDemo enhance={false} />
</Story>

<!--
  The README's markup with no script: what a browser without JavaScript, or a server render before it loads, shows.

  **Why:** the no-JS form is headed sections. The play function checks there is no tab list, every section and heading shows, and the sections are spaced apart.

  **Review:** "Degree Programs", "Non-degree Programs" and "Classroom Experience" as headed sections, one after another, in the themed box.
-->
<Story
  name="No Script"
  play={async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('tablist')).toBeNull();
    await expect(canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(LABELS.slice(0, 3));
    for (const heading of canvas.getAllByRole('heading', { level: 3 })) await expect(heading).toBeVisible();
    const [, second] = canvasElement.querySelectorAll('.ilw-tabs-panel');
    await expect(getComputedStyle(second).marginTop).toBe('40px');
  }}
>
  <TabsMarkupDemo enhance={false} />
</Story>

<!--
  Panel content reading its panel with `getTabPanel()`: a matcher run's sheets, each showing its panel's id, label and `active`, and loading the first time its panel shows.

  **Why:** the play function checks that only the shown panel reports `active`, and that it moves with the selection: the first panel in document order with no `selected` (an "Overview" panel shown in an `{#if}` before the others takes over), a click, Enter after the arrows, a URL fragment (`hashchange`; the URL is put back) and the page setting the bound `selected`. Adding a warning updates the Warnings panel's `label`. Each sheet loads once, when first shown; the probe after the box, outside every `TabPanel`, gets `undefined`.

  **Review:** "Assignments" reads `active: true` and `loads: 1`, the others `false` and `0`. Open a tab: its sheet loads, and `active` follows. Press the buttons above the box; the probe under the box says `none`.
-->
<Story
  name="Panel Context"
  play={async ({ canvas }) => {
    const url = location.href;
    const active = (id: string) => canvas.getByTestId(`${id}-active`);
    const loads = (id: string) => canvas.getByTestId(`${id}-loads`);
    /** Only `id`'s panel reports active. */
    const onlyActive = async (id: string, ids: string[]) => {
      for (const other of ids) await expect(active(other)).toHaveTextContent(String(other === id));
    };
    try {
      await waitFor(() => expect(canvas.getByRole('tablist')).toBeVisible());
      await onlyActive('run-assignments', SHEETS);
      await expect(canvas.getByTestId('run-assignments-id')).toHaveTextContent('run-assignments');
      await expect(canvas.getByTestId('run-validation-label')).toHaveTextContent('Validation');
      await expect(SHEETS.map((id) => loads(id).textContent)).toEqual(['1', '0', '0']);
      await expect(canvas.getByTestId('outside-id')).toHaveTextContent('none');
      await expect(canvas.getByTestId('outside-active')).toHaveTextContent('none');

      // No `selected`: the first panel in document order, even one that appears later.
      await userEvent.click(canvas.getByRole('button', { name: 'Show overview' }));
      await waitFor(() => expect(canvas.getAllByRole('tab')[0]).toHaveTextContent('Overview'));
      await onlyActive('run-overview', ['run-overview', ...SHEETS]);
      await expect(loads('run-overview')).toHaveTextContent('1');
      await userEvent.click(canvas.getByRole('button', { name: 'Show overview' }));
      await waitFor(() => expect(canvas.getAllByRole('tab')).toHaveLength(3));
      await onlyActive('run-assignments', SHEETS);

      await userEvent.click(canvas.getByRole('tab', { name: 'Validation' }));
      await onlyActive('run-validation', SHEETS);
      await expect(loads('run-validation')).toHaveTextContent('1');

      // Arrow to Warnings: focus moves, the selection doesn't until Enter.
      await userEvent.keyboard('{ArrowDown}');
      await expect(canvas.getByRole('tab', { name: 'Warnings (2)' })).toHaveFocus();
      await onlyActive('run-validation', SHEETS);
      await userEvent.keyboard('{Enter}');
      await onlyActive('run-warnings', SHEETS);

      // What following the "validation sheet" link does.
      location.hash = 'run-assignments';
      await waitFor(() => expect(active('run-assignments')).toHaveTextContent('true'));
      await onlyActive('run-assignments', SHEETS);

      await userEvent.click(canvas.getByRole('button', { name: 'Go to warnings' }));
      await onlyActive('run-warnings', SHEETS);
      await expect(canvas.getByTestId('selected')).toHaveTextContent('run-warnings');

      await userEvent.click(canvas.getByRole('button', { name: 'Add a warning' }));
      await expect(canvas.getByTestId('run-warnings-label')).toHaveTextContent('Warnings (3)');
      await expect(canvas.getByRole('tab', { selected: true })).toHaveTextContent('Warnings (3)');

      // Each sheet loaded once, however often it was shown.
      await expect(SHEETS.map((id) => loads(id).textContent)).toEqual(['1', '1', '1']);
    } finally {
      restoreUrl(url);
    }
  }}
>
  <TabsPanelContextDemo />
</Story>

<!--
  The **Panel Context** page without a play function.

  **Why:** the fixture for the spec that checks lazy panel content loads once, when its tab is first chosen, and not before (`tests/e2e/tabs.spec.ts`).

  **Review:** as **Panel Context**.
-->
<Story name="Panel Context Fixture">
  <TabsPanelContextDemo />
</Story>

<!--
  A `TabPanel` on its own, without a `Tabs`: a headed section whose content reads `getTabPanel()`.

  **Why:** the play function checks the content gets the panel's id and label, and `active` is true (the section shows, so content waiting for `active` loads).

  **Review:** a "Notes" heading over `active: true` and `loads: 1`.
-->
<Story
  name="Panel Without Tabs"
  play={async ({ canvas }) => {
    await expect(canvas.queryByRole('tablist')).toBeNull();
    await expect(canvas.getByTestId('run-notes-id')).toHaveTextContent('run-notes');
    await expect(canvas.getByTestId('run-notes-label')).toHaveTextContent('Notes');
    await expect(canvas.getByTestId('run-notes-active')).toHaveTextContent('true');
    await expect(canvas.getByTestId('run-notes-loads')).toHaveTextContent('1');
  }}
>
  <TabPanelAloneDemo />
</Story>

<!--
  The default tabs with `html[data-theme="dark"]`.

  **Why:** the colours come from the theme properties, so dark mode follows without per-component rules. axe checks the dark contrast of the tabs and the selected tab.

  **Review:** the tabs on the dark surface, the selected one orange.
-->
<Story name="Dark" globals={{ theme: 'dark' }}>
  <TabsDemo />
</Story>

<!--
  `theme="blue"`, horizontal: the blue palette's controls.

  **Why:** the theme attribute sets the box's background and the tab colours (`control`, `control-text`, `control-accent`). The play function checks the selected tab is orange on the blue box. axe checks the contrast.

  **Review:** a blue box; blue tabs with white text, the selected one orange.
-->
<Story
  name="Blue Theme"
  play={async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByRole('tab', { selected: true })).backgroundColor).toBe('rgb(255, 95, 5)');
  }}
>
  <TabsDemo theme="blue" horizontal />
</Story>
