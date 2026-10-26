<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, userEvent } from 'storybook/test';

  import RadioGroupDemo from './RadioGroupDemo.svelte';

  // No `component`: the stories render RadioGroupDemo, which binds the value.
  const { Story } = defineMeta({
    title: 'Forms/RadioGroup',
    parameters: { styles: 'ilw-ui' },
  });

  const ALTGELD = 'rgb(200, 65, 19)';
  const terms = [
    { value: 'fa', label: 'Fall' },
    { value: 'sp', label: 'Spring' },
    { value: 'su', label: 'Summer', disabled: true },
  ];
  const years = ['First', 'Second', 'Third', 'Fourth'].map((label, i) => ({ value: String(i + 1), label }));
</script>

<!--
  A stacked group with help text and a preselected value.

  **Why:** the play function checks the contract: `fieldset.ilw-input-entry-radio` with `role="radiogroup"`, named by its `<legend>`, the radios sharing `name`, ids `<id>-<i>` with `<label for>`, the help text in the fieldset's `aria-describedby` (not on each radio), no `aria-invalid` and no `required`. Clicking a label checks its radio, updates the bound value and calls `onchange`; the disabled option can't be chosen.

  **Review:** "Term" over three options, Fall checked, Summer dimmed, help text under them.
-->
<Story
  name="Default"
  play={async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Term' });
    await expect(group.tagName).toBe('FIELDSET');
    await expect(group).toHaveClass('ilw-input-entry-radio');
    await expect(group.id).toMatch(/^ilw-radio-group-\d+$/);
    await expect(group).not.toHaveAttribute('aria-invalid');
    await expect(group).toHaveAttribute('aria-describedby', `${group.id}-description`);
    await expect(group).toHaveAccessibleDescription('Choose the term you will teach.');
    const radios = canvas.getAllByRole('radio');
    await expect(radios).toHaveLength(3);
    for (const [i, radio] of radios.entries()) {
      await expect(radio).toHaveAttribute('id', `${group.id}-${i}`);
      await expect(radio).toHaveAttribute('name', 'term');
      await expect(radio).not.toHaveAttribute('aria-describedby');
      await expect(radio).not.toBeRequired();
    }
    await expect(canvas.getByRole('radio', { name: 'Fall' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Summer' })).toBeDisabled();
    await expect(getComputedStyle(group.querySelector('legend')!).fontWeight).toBe('600');

    await userEvent.click(canvas.getByText('Spring'));
    await expect(canvas.getByRole('radio', { name: 'Spring' })).toBeChecked();
    await expect(canvas.getByTestId('chosen')).toHaveTextContent('sp');
    await expect(canvas.getByTestId('changes')).toHaveTextContent('sp');
  }}
>
  <RadioGroupDemo legend="Term" name="term" options={terms} value="fa" description="Choose the term you will teach." />
</Story>

<!--
  A required group showing an error, with help text.

  **Why:** `aria-invalid` isn't allowed on a plain group or on a radio, so the fieldset has `role="radiogroup"` and carries `aria-invalid="true"` while the error shows; it lists the help text, then the error, in `aria-describedby`. `required` goes on every radio (native: the group needs a choice) and the marker on the legend. The play function checks the wiring, the error's colour and the radios' ring.

  **Review:** "Campus *", two radios with an orange-red ring, then the help text and the dashed-underlined error.
-->
<Story
  name="Error"
  play={async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Campus' });
    await expect(group).toHaveAttribute('aria-describedby', `${group.id}-description ${group.id}-error`);
    await expect(group).toHaveAccessibleDescription('Where most of your classes meet. Choose a campus.');
    await expect(group).toHaveAttribute('aria-invalid', 'true');
    await expect(group.querySelector('legend')).toHaveClass('ilw-label-required');
    for (const radio of canvas.getAllByRole('radio')) {
      await expect(radio).not.toHaveAttribute('aria-invalid');
      await expect(radio).toBeRequired();
      await expect(getComputedStyle(radio).outlineColor).toBe(ALTGELD);
    }
    const alert = document.getElementById(`${group.id}-error`)!;
    await expect(alert).toHaveClass('ilw-input-alert');
    await expect(getComputedStyle(alert).color).toBe(ALTGELD);
  }}
>
  <RadioGroupDemo
    legend="Campus"
    name="campus"
    required
    options={[
      { value: 'uc', label: 'Urbana-Champaign' },
      { value: 'ch', label: 'Chicago' },
    ]}
    description="Where most of your classes meet."
    error="Choose a campus."
  />
</Story>

<!--
  The error story in dark mode.

  **Why:** axe checks the dark colours; the error and ring are orange.

  **Review:** light text on dark, orange ring and message.
-->
<Story
  name="Error Dark"
  globals={{ theme: 'dark' }}
  play={async ({ canvas }) => {
    const [radio] = canvas.getAllByRole('radio');
    await expect(getComputedStyle(radio).outlineColor).toBe('rgb(255, 95, 5)');
  }}
>
  <RadioGroupDemo
    legend="Campus"
    name="campus-dark"
    required
    options={[
      { value: 'uc', label: 'Urbana-Champaign' },
      { value: 'ch', label: 'Chicago' },
    ]}
    error="Choose a campus."
  />
</Story>

<!--
  Each layout: `across`, compact stacked, compact across.

  **Why:** `layout="across"` renders `-radio-vertical` (upstream's name for options flowing across in 125 px columns); `compact` adds `-compact`, with the legend right-aligned in the 225 px label column. The play function checks the classes and that each legend sits where it should.

  **Review:** compare with **Parity → Field**: the same three layouts.
-->
<Story
  name="Layouts"
  play={async ({ canvas }) => {
    const across = canvas.getByRole('radiogroup', { name: 'Year' });
    const compact = canvas.getByRole('radiogroup', { name: 'Term' });
    const both = canvas.getByRole('radiogroup', { name: 'Year (compact)' });
    await expect(across).toHaveClass('ilw-input-entry-radio-vertical');
    await expect(compact).toHaveClass('ilw-input-entry-radio-compact');
    await expect(both).toHaveClass('ilw-input-entry-radio-vertical-compact');
    const box = (el: Element) => el.getBoundingClientRect();
    const [a, b] = across.querySelectorAll('input');
    await expect(box(a).top).toBe(box(b).top);
    for (const g of [compact, both]) {
      await expect(box(g.querySelector('legend')!).right).toBeLessThanOrEqual(box(g.querySelector('input')!).left);
    }
    // The help text lines up with the options, not the legend.
    const help = compact.querySelector('.ilw-input-description')!;
    await expect(box(help).left).toBeCloseTo(box(compact.querySelector('input')!).left, 0);
  }}
>
  <RadioGroupDemo legend="Year" name="year" options={years} layout="across" />
  <RadioGroupDemo legend="Term" name="term-c" options={terms} compact description="Choose the term you will teach." />
  <RadioGroupDemo legend="Year (compact)" name="year-c" options={years} layout="across" compact />
</Story>

<!--
  A stacked group with no value, then a text field. No play function: the keyboard spec (`tests/e2e/radio-group.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for the radio group's keyboard: Tab enters on the first option when none is checked, Space checks it, arrows move and check, the disabled option is skipped, Tab leaves the group.

  **Review:** Tab in, press Space, then the arrow keys.
-->
<Story name="Fixture">
  <RadioGroupDemo legend="Term" name="term" options={[...terms, { value: 'wi', label: 'Winter' }]} id="fixture-term" />
  <div class="ilw-input-entry">
    <label for="fixture-after">Course</label>
    <input id="fixture-after" type="text" name="course" />
  </div>
</Story>
