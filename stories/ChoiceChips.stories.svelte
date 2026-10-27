<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, userEvent } from 'storybook/test';

  import ChoiceChipsDemo from './ChoiceChipsDemo.svelte';

  // No `component`: the stories render ChoiceChipsDemo, which binds the value.
  const { Story } = defineMeta({
    title: 'Forms/ChoiceChips',
    parameters: { styles: 'ilw-ui' },
  });

  const ALTGELD = 'rgb(200, 65, 19)';
  const ORANGE = 'rgb(255, 95, 5)';
  const BLUE = 'rgb(19, 41, 75)';
  const WHITE = 'rgb(255, 255, 255)';
  const SHOWN = 'matrix(1, 0, 0, 1, 0, 0)';
  const HIDDEN = 'matrix(0, 0, 0, 0, 0, 0)';

  // ngpa's pickers: where a program's students come from, which tables to export.
  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
    { value: 'in', label: 'India' },
    { value: 'cn', label: 'China' },
    { value: 'kr', label: 'South Korea', disabled: true },
  ];
  const schemas = [
    { value: 'course', label: 'Courses' },
    { value: 'section', label: 'Sections' },
    { value: 'instructor', label: 'Instructors' },
    { value: 'enrollment', label: 'Enrollments' },
    { value: 'grade', label: 'Grades', disabled: true },
  ];

  const chip = (input: HTMLElement) => input.closest('label')!;
  const mark = (input: HTMLElement) => getComputedStyle(input, '::before').transform;
</script>

<!--
  A pick-one country picker (radios) with help text and a preselected value, in a filter form.

  **Why:** the play function checks the contract: `fieldset.ilw-chips` with `role="radiogroup"`, named by its `<legend>`, each radio inside its own `label.ilw-chip` (its name is the label text) sharing `name`, the help text in the fieldset's `aria-describedby`, no `aria-invalid` and no `required`. Checked isn't colour alone: the checked chip is filled with the control text colour **and** its indicator shows a dot, the others are white with an empty circle. Clicking a chip checks its radio, updates the bound value and calls `onchange`; the disabled chip can't be chosen.

  **Review:** "Country" over six pills, United States filled dark blue with a dot, South Korea dimmed. Hover a chip: light blue. Click another: the fill and dot move.
-->
<Story
  name="Default"
  play={async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Country' });
    await expect(group.tagName).toBe('FIELDSET');
    await expect(group).toHaveClass('ilw-chips');
    await expect(group.id).toMatch(/^ilw-chips-\d+$/);
    await expect(group).not.toHaveAttribute('aria-invalid');
    await expect(group).toHaveAttribute('aria-describedby', `${group.id}-description`);
    await expect(group).toHaveAccessibleDescription('Students whose home country is any of these are counted.');
    await expect(group.querySelector('legend')).not.toHaveClass('ilw-label-required');
    const radios = canvas.getAllByRole('radio');
    await expect(radios).toHaveLength(6);
    for (const radio of radios) {
      await expect(chip(radio)).toHaveClass('ilw-chip');
      await expect(chip(radio).parentElement).toBe(group);
      await expect(radio).toHaveAttribute('name', 'country');
      await expect(radio).not.toHaveAttribute('aria-describedby');
      await expect(radio).not.toBeRequired();
    }
    const us = canvas.getByRole('radio', { name: 'United States' });
    const ca = canvas.getByRole('radio', { name: 'Canada' });
    await expect(us).toBeChecked();
    await expect(getComputedStyle(chip(us)).backgroundColor).toBe(BLUE);
    await expect(getComputedStyle(chip(us)).color).toBe(WHITE);
    await expect(mark(us)).toBe(SHOWN);
    await expect(getComputedStyle(chip(ca)).backgroundColor).toBe(WHITE);
    await expect(mark(ca)).toBe(HIDDEN);
    await expect(getComputedStyle(us).borderRadius).toBe('50%');
    await expect(canvas.getByRole('radio', { name: 'South Korea' })).toBeDisabled();

    await userEvent.click(canvas.getByText('Canada'));
    await expect(ca).toBeChecked();
    await expect(us).not.toBeChecked();
    await expect(mark(ca)).toBe(SHOWN);
    await expect(mark(us)).toBe(HIDDEN);
    await expect(canvas.getByTestId('chosen')).toHaveTextContent('ca');
    await expect(canvas.getByTestId('changes')).toHaveTextContent('ca');
  }}
>
  <h2>Filter applicants</h2>
  <p>Narrow the applicant list to one home country. The list updates when you choose.</p>
  <ChoiceChipsDemo
    legend="Country"
    name="country"
    options={countries}
    value="us"
    description="Students whose home country is any of these are counted."
  />
</Story>

<!--
  A pick-any schema picker (checkboxes, `multiple`) with help text, in an export form.

  **Why:** with `multiple` the inputs are checkboxes and the fieldset is a plain `group` (no `role`), still named by its legend and described by the help text. The play function checks the bound value is an array in check order, unchecking removes a value, each checkbox's indicator is a square with a tick, and `required` is absent.

  **Review:** "Tables to export" over five pills, Courses checked with a tick, Grades dimmed. Click Sections, then Courses: the chosen line reads "section".
-->
<Story
  name="Multiple"
  play={async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Tables to export' });
    await expect(group.tagName).toBe('FIELDSET');
    await expect(group).not.toHaveAttribute('role');
    await expect(group).toHaveClass('ilw-chips');
    await expect(group).toHaveAccessibleDescription('Each table is a separate CSV file in the download.');
    const boxes = canvas.getAllByRole('checkbox');
    await expect(boxes).toHaveLength(5);
    for (const box of boxes) {
      await expect(chip(box)).toHaveClass('ilw-chip');
      await expect(box).toHaveAttribute('name', 'schemas');
      await expect(box).not.toBeRequired();
      await expect(box).not.toHaveAttribute('aria-invalid');
      await expect(getComputedStyle(box).borderRadius).toBe('0px');
    }
    const course = canvas.getByRole('checkbox', { name: 'Courses' });
    const section = canvas.getByRole('checkbox', { name: 'Sections' });
    await expect(course).toBeChecked();
    await expect(mark(course)).toBe(SHOWN);
    await expect(getComputedStyle(chip(course)).backgroundColor).toBe(BLUE);

    await userEvent.click(canvas.getByText('Sections'));
    await expect(section).toBeChecked();
    await expect(course).toBeChecked();
    await expect(canvas.getByTestId('chosen')).toHaveTextContent('course, section');
    await userEvent.click(canvas.getByText('Courses'));
    await expect(course).not.toBeChecked();
    await expect(mark(course)).toBe(HIDDEN);
    await expect(getComputedStyle(chip(course)).backgroundColor).toBe(WHITE);
    await expect(canvas.getByTestId('chosen')).toHaveTextContent('section');
    await expect(canvas.getByTestId('changes')).toHaveTextContent('[course section], [section]');
    await userEvent.click(canvas.getByText('Grades'));
    await expect(canvas.getByRole('checkbox', { name: 'Grades' })).not.toBeChecked();
  }}
>
  <h2>Export data</h2>
  <p>Download the term's records as a zip of CSV files.</p>
  <ChoiceChipsDemo
    legend="Tables to export"
    name="schemas"
    multiple
    options={schemas}
    value={['course']}
    description="Each table is a separate CSV file in the download."
  />
</Story>

<!--
  A required radio group and a checkbox group, each showing an error under its help text.

  **Why:** radios: the `radiogroup` carries `aria-invalid="true"` and lists the help text, then the error, in `aria-describedby`; `required` goes on every radio and the marker on the legend. Checkboxes: a plain `group` doesn't allow `aria-invalid`, so each checkbox carries it, and `required` only adds the marker (there's no native "at least one"). Every chip of an invalid group gets a 2 px ring, so the error isn't colour alone. The play function checks the wiring, the ring and the error's colour.

  **Review:** "Country *" and "Tables to export *", each chip ringed in orange-red, then the help text and the dashed-underlined error.
-->
<Story
  name="Error"
  play={async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Country' });
    await expect(group).toHaveAttribute('aria-invalid', 'true');
    await expect(group).toHaveAttribute('aria-describedby', `${group.id}-description ${group.id}-error`);
    await expect(group).toHaveAccessibleDescription('Applicants are counted by home country. Choose a country.');
    await expect(group.querySelector('legend')).toHaveClass('ilw-label-required');
    for (const radio of canvas.getAllByRole('radio')) {
      await expect(radio).toBeRequired();
      await expect(radio).not.toHaveAttribute('aria-invalid');
      await expect(getComputedStyle(chip(radio)).outlineColor).toBe(ALTGELD);
      await expect(getComputedStyle(chip(radio)).outlineWidth).toBe('2px');
    }
    const alert = document.getElementById(`${group.id}-error`)!;
    await expect(alert).toHaveClass('ilw-input-alert');
    await expect(getComputedStyle(alert).color).toBe(ALTGELD);

    const boxes = canvas.getByRole('group', { name: 'Tables to export' });
    await expect(boxes).not.toHaveAttribute('aria-invalid');
    await expect(boxes).toHaveAccessibleDescription('Each table is a separate CSV file. Choose at least one table.');
    await expect(boxes.querySelector('legend')).toHaveClass('ilw-label-required');
    for (const box of canvas.getAllByRole('checkbox')) {
      await expect(box).toHaveAttribute('aria-invalid', 'true');
      await expect(box).not.toBeRequired();
      await expect(getComputedStyle(chip(box)).outlineColor).toBe(ALTGELD);
    }
  }}
>
  <p>Fields marked * are required.</p>
  <ChoiceChipsDemo
    legend="Country"
    name="country-error"
    required
    options={countries.slice(0, 3)}
    description="Applicants are counted by home country."
    error="Choose a country."
  />
  <ChoiceChipsDemo
    legend="Tables to export"
    name="schemas-error"
    multiple
    required
    options={schemas.slice(0, 3)}
    description="Each table is a separate CSV file."
    error="Choose at least one table."
  />
</Story>

<!--
  The pick-one and error groups in dark mode.

  **Why:** axe checks the dark colours. The play function checks the checked chip inverts to the dark mode's light control text, the indicator still shows, and the error ring is orange.

  **Review:** dark pills with light text; the checked one is light with dark text and a dot; the invalid group's chips have an orange ring.
-->
<Story
  name="Dark"
  globals={{ theme: 'dark' }}
  play={async ({ canvas }) => {
    const us = canvas.getByRole('radio', { name: 'United States' });
    const ca = canvas.getByRole('radio', { name: 'Canada' });
    await expect(getComputedStyle(chip(us)).backgroundColor).toBe(getComputedStyle(chip(ca)).color);
    await expect(getComputedStyle(chip(us)).color).toBe(getComputedStyle(chip(ca)).backgroundColor);
    await expect(getComputedStyle(chip(ca)).backgroundColor).not.toBe(WHITE);
    await expect(mark(us)).toBe(SHOWN);
    const [invalid] = canvas.getAllByRole('checkbox');
    await expect(getComputedStyle(chip(invalid)).outlineColor).toBe(ORANGE);
  }}
>
  <ChoiceChipsDemo legend="Country" name="country-dark" options={countries} value="us" description="Students whose home country is any of these are counted." />
  <ChoiceChipsDemo legend="Tables to export" name="schemas-dark" multiple options={schemas.slice(0, 3)} error="Choose at least one table." />
</Story>

<!--
  One group on each flat theme surface (white, gray, blue, orange), Canada checked.

  **Why:** the chips take `--ilw-color--control*`, so they follow the surface's theme; axe checks the text contrast of checked and unchecked chips on each. The play function checks that on every surface the checked chip's fill is the unchecked chip's text colour and the reverse.

  **Review:** four panels; on blue and orange the chips follow the theme's control colours, and the checked chip is always the inverse of the others.
-->
<Story
  name="Themes"
  play={async ({ canvasElement }) => {
    const surfaces = canvasElement.querySelectorAll<HTMLElement>('[theme]');
    await expect(surfaces).toHaveLength(4);
    for (const surface of surfaces) {
      const [on, off] = [surface.querySelector('input:checked')!, surface.querySelector('input:not(:checked)')!].map((i) =>
        getComputedStyle(i.closest('label')!),
      );
      await expect(on.backgroundColor, surface.getAttribute('theme')!).toBe(off.color);
      await expect(on.color, surface.getAttribute('theme')!).toBe(off.backgroundColor);
    }
  }}
>
  <div class="surfaces">
    {#each ['white', 'gray', 'blue', 'orange'] as surface (surface)}
      <!-- `theme` isn't a typed HTML attribute; the theme rules select on it. -->
      <section class="surface" {...{ theme: surface }} aria-label="{surface} surface">
        <ChoiceChipsDemo legend="Country ({surface})" name="country-{surface}" options={countries.slice(0, 3)} value="ca" />
      </section>
    {/each}
  </div>
</Story>

<!--
  A pick-one group with no value, a pick-any group, then a text field. No play function: the keyboard spec (`tests/e2e/choice-chips.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for the chips' keyboard, which is native: Tab enters the radios on the first chip, Space checks it, arrows move and check, skipping the disabled chip, Tab leaves; each checkbox is its own tab stop and Space toggles it. The spec also checks the focus ring is drawn around the focused chip.

  **Review:** Tab in, press Space, then the arrow keys; Tab to the checkboxes and press Space. The focused chip has a thick orange-red ring.
-->
<Story name="Fixture">
  <ChoiceChipsDemo legend="Country" name="country" options={countries} id="fixture-country" />
  <ChoiceChipsDemo legend="Tables to export" name="schemas" multiple options={schemas.slice(0, 3)} id="fixture-schemas" />
  <div class="ilw-input-entry">
    <label for="fixture-after">File name</label>
    <input id="fixture-after" type="text" name="filename" />
  </div>
</Story>

<style>
  .surfaces {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  /* The theme only sets properties; paint the surface so the chips sit on it. */
  .surface {
    padding: 0 1.5rem;
    background: var(--ilw-color--background);
    color: var(--ilw-color--text);
  }
</style>
