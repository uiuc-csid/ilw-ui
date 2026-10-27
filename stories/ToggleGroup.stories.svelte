<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, userEvent } from 'storybook/test';

  import { Content, ToggleGroup } from '../src/svelte/index.ts';
  import ToggleGroupDemo from './ToggleGroupDemo.svelte';

  const { Story } = defineMeta({
    title: 'Components/ToggleGroup',
    parameters: { styles: 'ilw-ui' },
  });

  let degree = $state<string | undefined>();

  const degrees = [
    { value: 'phd', label: 'PhD' },
    { value: 'ms', label: 'MS' },
  ];

  /** Checks the pressed look: the unpressed colours swapped, plus a check mark that screen readers skip. */
  async function expectPressedLook(on: HTMLElement, off: HTMLElement) {
    const a = getComputedStyle(on);
    const b = getComputedStyle(off);
    await expect(a.backgroundColor).toBe(b.color);
    await expect(a.color).toBe(b.backgroundColor);
    await expect(getComputedStyle(on, '::before').content).toMatch(/✓/);
    await expect(getComputedStyle(off, '::before').content).toBe('none');
    await expect(on).toHaveAccessibleName(on.textContent!.trim());
  }
</script>

<!--
  A course list filtered by two toggle groups: Level (single-select, "All" pressed) and Offered (multi-select, Fall and Spring pressed, Winter disabled).

  **Why:** the play function checks the DOM contract: `div.ilw-toggle-group` with `role="group"`, named by its visible `span.ilw-toggle-group-label` through `aria-labelledby="<id>-label"`; each option a `button type="button"` with `.ilw-button.ilw-button-small`, `aria-pressed` and `data-value`. Single mode: clicking moves the press, clicking the pressed button does nothing and calls no `onchange`. Multiple mode: each button toggles on its own and the value stays in option order. The disabled option can't be pressed. The pressed look is a fill plus a check mark, not colour alone.

  **Review:** "Level" with All filled and ticked; "Offered" with Fall and Spring ticked. Click 300–499 and Summer, watch the table and the count change; hover an unpressed button: only an underline. Try dark mode.
-->
<Story
  name="Default"
  play={async ({ canvas }) => {
    const level = canvas.getByRole('group', { name: 'Level' });
    await expect(level).toHaveClass('ilw-toggle-group');
    await expect(level).toHaveAttribute('id', 'courses-level');
    await expect(level).toHaveAttribute('aria-labelledby', 'courses-level-label');
    await expect(document.getElementById('courses-level-label')).toHaveClass('ilw-toggle-group-label');
    const buttons = [...level.querySelectorAll('button')];
    await expect(buttons.map((b) => b.dataset.value)).toEqual(['all', '100', '300', '500']);
    for (const b of buttons) {
      await expect(b).toHaveAttribute('type', 'button');
      await expect(b).toHaveClass('ilw-button', 'ilw-button-small');
    }
    const button = (group: HTMLElement, name: string) =>
      [...group.querySelectorAll('button')].find((b) => b.textContent === name)!;
    await expect(button(level, 'All')).toHaveAttribute('aria-pressed', 'true');
    await expect(button(level, '100–299')).toHaveAttribute('aria-pressed', 'false');
    await expectPressedLook(button(level, 'All'), button(level, '100–299'));
    await expect(canvas.getByTestId('count')).toHaveTextContent('Showing 9 of 9 courses');

    // Single: the press moves; pressing the pressed button changes nothing.
    await userEvent.click(button(level, '300–499'));
    await expect(button(level, '300–499')).toHaveAttribute('aria-pressed', 'true');
    await expect(button(level, 'All')).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByTestId('level')).toHaveTextContent('300');
    await expect(canvas.getByTestId('count')).toHaveTextContent('Showing 4 of 9 courses');
    await userEvent.click(button(level, '300–499'));
    await expect(button(level, '300–499')).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByTestId('level-changes')).toHaveTextContent(/^300$/);

    // Multiple: each toggles on its own; the value keeps option order.
    const offered = canvas.getByRole('group', { name: 'Offered' });
    await expect(button(offered, 'Winter')).toBeDisabled();
    await userEvent.click(button(offered, 'Fall'));
    await expect(button(offered, 'Fall')).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByTestId('terms')).toHaveTextContent(/^sp$/);
    await userEvent.click(button(offered, 'Fall'));
    await expect(canvas.getByTestId('terms')).toHaveTextContent(/^fa, sp$/);
    await expect(canvas.getByTestId('term-changes')).toHaveTextContent('2');
    await userEvent.click(button(offered, 'Spring'));
    await userEvent.click(button(offered, 'Fall'));
    await expect(canvas.getByTestId('terms')).toHaveTextContent(/^$/);
    await expect(canvas.getByTestId('count')).toHaveTextContent('Showing 0 of 9 courses');
  }}
>
  <ToggleGroupDemo />
</Story>

<!--
  A single-select group with `allowNone`, named by `aria-label` (no visible label), above the paragraph it filters.

  **Why:** the play function checks the name comes from `aria-label` (no label span, no `aria-labelledby`), that pressing the pressed button releases it with `allowNone` (value `undefined`, every button `aria-pressed="false"`), and the `size` and `theme` classes.

  **Review:** two medium orange buttons; click MS twice: it presses, then releases.
-->
<Story
  name="Allow None"
  play={async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Degree' });
    await expect(group).not.toHaveAttribute('aria-labelledby');
    await expect(group.querySelector('.ilw-toggle-group-label')).toBeNull();
    const ms = canvas.getByRole('button', { name: 'MS' });
    await expect(ms).toHaveClass('ilw-button', 'ilw-theme-orange');
    await expect(ms).not.toHaveClass('ilw-button-small');
    await userEvent.click(ms);
    await expect(ms).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(ms);
    for (const b of canvas.getAllByRole('button')) await expect(b).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByTestId('degree')).toHaveTextContent('any');
  }}
>
  <h2>Unranked students</h2>
  <ToggleGroup aria-label="Degree" options={degrees} size="medium" theme="orange" allowNone bind:value={degree} />
  <p>Showing students of <output data-testid="degree">{degree ?? 'any'}</output> degree.</p>
</Story>

<!--
  The course list in dark mode.

  **Why:** axe checks the dark colours; the play function checks the pressed look holds in dark mode.

  **Review:** light-on-dark outline buttons; pressed ones filled light with a check mark.
-->
<Story
  name="Dark"
  globals={{ theme: 'dark' }}
  play={async ({ canvas }) => {
    const level = canvas.getByRole('group', { name: 'Level' });
    const [all, low] = level.querySelectorAll('button');
    await expectPressedLook(all, low);
  }}
>
  <ToggleGroupDemo id="dark" />
</Story>

<!--
  Groups on the blue and gray surfaces (`[theme]` on an ancestor) and with `theme="blue-solid"` on white.

  **Why:** the colours come from `--ilw-color--control*`, so a theme on an ancestor or the `theme` prop recolours the buttons and their label; the play function checks the pressed look on each, and axe checks contrast.

  **Review:** each row reads clearly, pressed buttons filled and ticked; compare with **Button → Sizes And Themes**.
-->
<Story
  name="Themes"
  play={async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll<HTMLElement>('.ilw-toggle-group');
    await expect(groups).toHaveLength(3);
    for (const g of groups) {
      const [on, off] = g.querySelectorAll('button');
      await expectPressedLook(on, off);
    }
  }}
>
  <Content theme="blue">
    <ToggleGroup label="Degree" options={degrees} value="phd" />
  </Content>
  <Content theme="gray">
    <ToggleGroup label="Degree" options={degrees} value="phd" />
  </Content>
  <Content>
    <ToggleGroup label="Degree" options={degrees} value="phd" theme="blue-solid" />
  </Content>
</Story>

<!--
  The course list with nothing pressed in Offered. No play function: the keyboard spec (`tests/e2e/toggle-group.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for the keyboard: every enabled button is its own Tab stop (the disabled Winter is skipped), Space and Enter toggle the focused button and keep focus on it, Shift+Tab goes back.

  **Review:** Tab through both rows; press Space and Enter.
-->
<Story name="Fixture">
  <ToggleGroupDemo id="fixture" terms={[]} />
</Story>
