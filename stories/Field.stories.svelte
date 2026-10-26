<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, userEvent } from 'storybook/test';

  import Field from '../src/svelte/Field.svelte';

  // No `component`: every story renders its own Fields, and Storybook would
  // otherwise render a bare Field (with no `children`) from the args.
  const { Story } = defineMeta({
    title: 'Forms/Field',
    parameters: { styles: 'ilw-ui' },
  });

  const ALTGELD = 'rgb(200, 65, 19)';
  const ORANGE = 'rgb(255, 95, 5)';

  /** The ids `aria-describedby` lists, each checked to exist. */
  function describedBy(el: Element): string[] {
    const ids = el.getAttribute('aria-describedby')?.split(' ') ?? [];
    for (const id of ids) if (!document.getElementById(id)) throw new Error(`aria-describedby names a missing id: ${id}`);
    return ids;
  }
</script>

<!--
  A text field with help text.

  **Why:** the play function checks the contract: `div.ilw-input-entry` holding the `<label for>`, the control (from the `children` snippet, with `attrs` spread on it) and `p.ilw-input-description`, which the control lists in `aria-describedby`. Not required, not invalid: neither attribute is there. Sizes and colours are upstream's: a 200 px field with 10 px padding, a thin text-colour border, 1 rem Source Sans, the label at 500 1.25 rem.

  **Review:** "Email" over a 220 px field with the help text under it. Hover or focus the field: it turns light blue with an orange outline.
-->
<Story
  name="Default"
  play={async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    const entry = canvasElement.querySelector('.ilw-input-entry')!;
    await expect(entry).toContainElement(input);
    const label = entry.querySelector('label')!;
    await expect(label).toHaveAttribute('for', input.id);
    await expect(input.id).toMatch(/^ilw-field-\d+$/);
    await expect(label).not.toHaveClass('ilw-label-required');
    await expect(describedBy(input)).toEqual([`${input.id}-description`]);
    await expect(input).toHaveAccessibleDescription('We only use it to reply.');
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(input).not.toBeRequired();
    await expect(entry.querySelector('.ilw-input-alert')).toBeNull();

    const field = getComputedStyle(input);
    await expect(field.width).toBe('200px');
    await expect(field.paddingLeft).toBe('10px');
    await expect(field.borderTopWidth).toBe('1px');
    await expect(field.borderTopColor).toBe('rgb(37, 37, 37)');
    await expect(field.backgroundColor).toBe('rgb(255, 255, 255)');
    await expect(field.fontSize).toBe('16px');
    await expect(field.fontFamily).toMatch(/^"?Source Sans/);
    const type = getComputedStyle(label);
    await expect(type.fontSize).toBe('20px');
    await expect(type.fontWeight).toBe('500');
    await expect(getComputedStyle(entry.querySelector('.ilw-input-description')!).fontSize).toBe('16px');

    input.focus();
    await expect(getComputedStyle(input).outlineColor).toBe(ALTGELD);
    await expect(getComputedStyle(input).backgroundColor).toBe('rgb(199, 237, 248)');
  }}
>
  <Field label="Email" description="We only use it to reply.">
    {#snippet children(attrs)}<input type="email" name="email" {...attrs} />{/snippet}
  </Field>
</Story>

<!--
  A required field.

  **Why:** `required` puts the native `required` on the control (screen readers say "required") and `ilw-label-required` on the label. The marker's `*` has empty alternative text (`content: "*" / ""`), so it isn't read as "star". The play function checks both and the marker's colour (Altgeld on white). Nothing is invalid until the user interacts: the browser's `:user-invalid` then gives the same ring as an error.

  **Review:** "Name *" with an orange-red star. Type something, clear it and tab away: the field gets the error ring (no message: that is the app's job).
-->
<Story
  name="Required"
  play={async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await expect(input).toBeRequired();
    await expect(input).not.toHaveAttribute('aria-invalid');
    const label = document.querySelector(`label[for="${input.id}"]`)!;
    await expect(label).toHaveClass('ilw-label-required');
    const marker = getComputedStyle(label, '::after');
    await expect(marker.content).toBe('"*" / ""');
    await expect(marker.color).toBe(ALTGELD);
    await expect(input).not.toHaveAttribute('aria-describedby');
  }}
>
  <p>Fields marked * are required.</p>
  <Field label="Name" required>
    {#snippet children(attrs)}<input type="text" name="name" autocomplete="name" {...attrs} />{/snippet}
  </Field>
</Story>

<!--
  A required field showing an error, with help text.

  **Why:** `error` set means invalid: the control gets `aria-invalid="true"` and lists the help text, then the error, in `aria-describedby`; the error is `p.ilw-input-alert` (no live region: the app moves focus to the first invalid field). The play function checks the wiring and the colours: the message and the extra ring in `--ilw-color--link-hover` (Altgeld), with upstream's dashed underline.

  **Review:** the field with an orange-red double border, the help text, then the message with a dashed underline.
-->
<Story
  name="Error"
  play={async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await expect(input).toBeRequired();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toBeInvalid();
    await expect(describedBy(input)).toEqual([`${input.id}-description`, `${input.id}-error`]);
    await expect(input).toHaveAccessibleDescription('We only use it to reply. Enter an email address like name@illinois.edu.');
    const alert = document.getElementById(`${input.id}-error`)!;
    await expect(alert).toHaveClass('ilw-input-alert');
    await expect(alert).not.toHaveAttribute('role');
    const message = getComputedStyle(alert);
    await expect(message.color).toBe(ALTGELD);
    await expect(message.borderBottomStyle).toBe('dashed');
    const field = getComputedStyle(input);
    await expect(field.borderTopColor).toBe(ALTGELD);
    await expect(field.boxShadow).toContain('rgb(200, 65, 19) 0px 0px 0px 1px');
  }}
>
  <Field label="Email" description="We only use it to reply." error="Enter an email address like name@illinois.edu." required>
    {#snippet children(attrs)}<input type="email" name="email" value="netid" {...attrs} />{/snippet}
  </Field>
</Story>

<!--
  The error story in dark mode.

  **Why:** axe checks the dark colours; the play function checks the field is dark mode's control surface and the error is orange.

  **Review:** a dark field, light text, an orange message and ring.
-->
<Story
  name="Error Dark"
  globals={{ theme: 'dark' }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await expect(getComputedStyle(input).backgroundColor).toBe('rgb(17, 24, 29)');
    await expect(getComputedStyle(input).color).toBe('rgb(244, 244, 244)');
    await expect(getComputedStyle(document.getElementById(`${input.id}-error`)!).color).toBe(ORANGE);
  }}
>
  <Field label="Email" description="We only use it to reply." error="Enter an email address like name@illinois.edu." required>
    {#snippet children(attrs)}<input type="email" name="email" value="netid" {...attrs} />{/snippet}
  </Field>
</Story>

<!--
  Compact fields: a text field with an error, a select, and a checkbox.

  **Why:** `compact` renders `ilw-input-entry-compact` (`-checkbox-compact` for a checkbox): the label right-aligned in a 225 px column (`--ilw-input-form-label-width`), the control, help text and error in the second column. Under 800 px each is a block again (`tests/e2e/field.spec.ts` checks that). The play function checks the grid and the alignment.

  **Review:** labels right-aligned in a column, controls beside them, the error under its field. Narrow the window below 800 px: the labels move above.
-->
<Story
  name="Compact"
  play={async ({ canvas, canvasElement }) => {
    const entries = canvasElement.querySelectorAll<HTMLElement>('.ilw-input-entry-compact, .ilw-input-entry-checkbox-compact');
    await expect(entries).toHaveLength(3);
    await expect(entries[2]).toHaveClass('ilw-input-entry-checkbox-compact');
    const first = getComputedStyle(entries[0]);
    await expect(first.display).toBe('grid');
    await expect(first.gridTemplateColumns).toMatch(/^225px /);
    await expect(getComputedStyle(entries[0].querySelector('label')!).textAlign).toBe('right');
    const input = canvas.getByRole('textbox', { name: 'Course' });
    const alert = document.getElementById(`${input.id}-error`)!;
    // The error sits under the control, in the second column.
    await expect(alert.getBoundingClientRect().left).toBeCloseTo(input.getBoundingClientRect().left, 0);
    await expect(canvas.getByRole('combobox', { name: 'Term' })).toHaveAccessibleDescription('');
    await expect(canvas.getByRole('checkbox', { name: 'Notify me' })).not.toBeChecked();
  }}
>
  <Field label="Course" compact error="Enter a course like CS 124." required>
    {#snippet children(attrs)}<input type="text" name="course" value="CS" {...attrs} />{/snippet}
  </Field>
  <Field label="Term" compact>
    {#snippet children(attrs)}
      <select name="term" {...attrs}>
        <option>Fall 2026</option>
        <option>Spring 2027</option>
      </select>
    {/snippet}
  </Field>
  <Field label="Notify me" compact variant="checkbox">
    {#snippet children(attrs)}<input type="checkbox" name="notify" {...attrs} />{/snippet}
  </Field>
</Story>

<!--
  A checkbox and a switch, each in `variant="checkbox"`.

  **Why:** the checkbox is upstream's painted 18 px box (a clip-path tick); the switch is `input.ilw-switch` with `role="switch"`, the dark-mode toggle's switch, replacing upstream's `.ilw-toggle-slider`. The play function checks the roles, the box's size, the switch's colours off and on (the track fills with the control text colour), and that clicking the label toggles each.

  **Review:** a box and a switch, each left of its label. Click either label.
-->
<Story
  name="Checkbox And Switch"
  play={async ({ canvas }) => {
    const box = canvas.getByRole('checkbox', { name: 'Email me updates' });
    await expect(box.closest('div')).toHaveClass('ilw-input-entry-checkbox');
    await expect(box.getBoundingClientRect().width).toBe(18);
    await expect(box).toHaveAccessibleDescription('At most one a week.');
    await userEvent.click(canvas.getByText('Email me updates'));
    await expect(box).toBeChecked();
    await expect(getComputedStyle(box, '::before').transform).not.toBe('matrix(0, 0, 0, 0, 0, 0)');

    const toggle = canvas.getByRole('switch', { name: 'Show weekends' });
    await expect(toggle).toHaveAttribute('type', 'checkbox');
    await expect(toggle).toHaveClass('ilw-switch');
    await expect(getComputedStyle(toggle).backgroundColor).toBe('rgb(255, 255, 255)');
    await expect(getComputedStyle(toggle).borderTopColor).toBe('rgb(19, 41, 75)');
    await userEvent.click(canvas.getByText('Show weekends'));
    await expect(toggle).toBeChecked();
    await expect(getComputedStyle(toggle).backgroundColor).toBe('rgb(19, 41, 75)');
  }}
>
  <Field label="Email me updates" description="At most one a week." variant="checkbox">
    {#snippet children(attrs)}<input type="checkbox" name="updates" {...attrs} />{/snippet}
  </Field>
  <Field label="Show weekends" variant="checkbox">
    {#snippet children(attrs)}<input type="checkbox" role="switch" class="ilw-switch" name="weekends" {...attrs} />{/snippet}
  </Field>
</Story>

<!--
  A select, a textarea with a snippet label, and ids set by the caller.

  **Why:** `id`, `descriptionId` and `errorId` override the generated ones (a server-rendered page, or a test, may need fixed ids); `label`, `description` and `error` take snippets for rich content. The textarea is full width, as upstream (border included, where upstream's overflows by 2 px). The play function checks the ids and the wiring.

  **Review:** a select with an orange chevron; a full-width textarea whose label has emphasis.
-->
<Story
  name="Select Textarea And Ids"
  play={async ({ canvas }) => {
    const select = canvas.getByRole('combobox', { name: 'Department' });
    await expect(select).toHaveAttribute('id', 'dept');
    await expect(select).toHaveAttribute('aria-describedby', 'dept-help dept-problem');
    await expect(select).toHaveAttribute('aria-invalid', 'true');
    await expect(document.getElementById('dept-help')).toHaveClass('ilw-input-description');
    await expect(document.getElementById('dept-problem')).toHaveClass('ilw-input-alert');
    await expect(getComputedStyle(select).backgroundImage).toContain('linear-gradient');

    const area = canvas.getByRole('textbox', { name: 'Notes (optional)' });
    await expect(area.tagName).toBe('TEXTAREA');
    await expect(area.getBoundingClientRect().width).toBeCloseTo(area.parentElement!.getBoundingClientRect().width, 0);
  }}
>
  <Field label="Department" id="dept" descriptionId="dept-help" errorId="dept-problem" description="Your home department." error="Choose a department.">
    {#snippet children(attrs)}
      <select name="dept" {...attrs}>
        <option value="">Choose one</option>
        <option>Computer Science</option>
        <option>Mathematics</option>
      </select>
    {/snippet}
  </Field>
  <Field>
    {#snippet label()}Notes <em>(optional)</em>{/snippet}
    {#snippet children(attrs)}<textarea name="notes" {...attrs}></textarea>{/snippet}
  </Field>
</Story>

<!--
  Server-template markup with no `Field`: a long and a short text field, radio groups in each layout, a bordered fieldset, a disclaimer and a form-level alert.

  **Why:** the classes work without script, from any template. Radio groups are a `<fieldset>` whose `<legend>` is the title, so it names the group. The play function checks the group names, that the legend sits above the options (beside them in the compact forms), and the radio's size and shape.

  **Review:** compare with **Parity → Field → Toolkit**: the same layouts, with the group titles as legends.
-->
<Story
  name="Markup"
  play={async ({ canvas, canvasElement }) => {
    const stacked = canvas.getByRole('group', { name: 'Term' });
    const across = canvas.getByRole('group', { name: 'Year' });
    const compact = canvas.getByRole('group', { name: 'Campus' });
    const legend = (g: HTMLElement) => g.querySelector('legend')!.getBoundingClientRect();
    const firstRadio = (g: HTMLElement) => g.querySelector('input')!.getBoundingClientRect();
    await expect(legend(stacked).bottom).toBeLessThanOrEqual(firstRadio(stacked).top + 1);
    await expect(legend(across).bottom).toBeLessThanOrEqual(firstRadio(across).top + 1);
    // Across: the options share a row.
    const [a, b] = across.querySelectorAll('input');
    await expect(a.getBoundingClientRect().top).toBe(b.getBoundingClientRect().top);
    // Compact: the legend is in the label column, left of the options.
    await expect(legend(compact).right).toBeLessThanOrEqual(firstRadio(compact).left);
    await expect(legend(compact).width).toBe(225);
    const radio = canvas.getByRole('radio', { name: 'Fall' });
    await expect(radio.getBoundingClientRect().width).toBe(18);
    await expect(getComputedStyle(radio).borderTopLeftRadius).toBe('50%');
    await expect(canvas.getByRole('alert')).toHaveClass('ilw-input-alert');
    await expect(canvasElement.querySelector('#short')!.getBoundingClientRect().width).toBe(122);
  }}
>
  <form>
    <p class="ilw-input-alert" role="alert">1 field needs attention.</p>
    <fieldset class="ilw-fieldset">
      <legend>Contact</legend>
      <div class="ilw-input-entry">
        <label for="long">Mailing address</label>
        <input id="long" name="address" type="text" class="ilw-input-long" autocomplete="street-address" />
      </div>
      <div class="ilw-input-entry">
        <label for="short">Zip</label>
        <input id="short" name="zip" type="text" class="ilw-input-short" autocomplete="postal-code" />
      </div>
    </fieldset>
    <fieldset class="ilw-input-entry-radio">
      <legend>Term</legend>
      <input type="radio" id="term-fa" name="term" value="fa" checked /><label for="term-fa">Fall</label>
      <input type="radio" id="term-sp" name="term" value="sp" /><label for="term-sp">Spring</label>
    </fieldset>
    <fieldset class="ilw-input-entry-radio-vertical">
      <legend>Year</legend>
      <input type="radio" id="year-1" name="year" value="1" /><label for="year-1">First</label>
      <input type="radio" id="year-2" name="year" value="2" /><label for="year-2">Second</label>
      <input type="radio" id="year-3" name="year" value="3" /><label for="year-3">Third</label>
    </fieldset>
    <fieldset class="ilw-input-entry-radio-compact">
      <legend>Campus</legend>
      <input type="radio" id="campus-uc" name="campus" value="uc" /><label for="campus-uc">Urbana-Champaign</label>
      <input type="radio" id="campus-ch" name="campus" value="ch" /><label for="campus-ch">Chicago</label>
    </fieldset>
    <fieldset class="ilw-input-entry-radio-vertical-compact">
      <legend>Format</legend>
      <input type="radio" id="format-on" name="format" value="on" /><label for="format-on">Online</label>
      <input type="radio" id="format-in" name="format" value="in" /><label for="format-in">In person</label>
    </fieldset>
    <div class="ilw-input-disclaimer">
      <input type="checkbox" id="agree" name="agree" />
      <label for="agree">I have read the course policies.</label>
    </div>
  </form>
</Story>

<!--
  A small form: a required text field, a checkbox, a switch and a radio group. No play function: the keyboard spec (`tests/e2e/field.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for Tab order, Space on the checkbox and the switch, and arrow keys in the radio group.

  **Review:** Tab through: the field, the checkbox, the switch, then the checked radio. Space toggles; arrows move the radio.
-->
<Story name="Fixture">
  <form>
    <Field label="Name" id="fixture-name" required>
      {#snippet children(attrs)}<input type="text" name="name" autocomplete="name" {...attrs} />{/snippet}
    </Field>
    <Field label="Email me updates" id="fixture-updates" variant="checkbox">
      {#snippet children(attrs)}<input type="checkbox" name="updates" {...attrs} />{/snippet}
    </Field>
    <Field label="Show weekends" id="fixture-weekends" variant="checkbox">
      {#snippet children(attrs)}<input type="checkbox" role="switch" class="ilw-switch" name="weekends" {...attrs} />{/snippet}
    </Field>
    <fieldset class="ilw-input-entry-radio">
      <legend>Term</legend>
      <input type="radio" id="fixture-fa" name="term" value="fa" checked /><label for="fixture-fa">Fall</label>
      <input type="radio" id="fixture-sp" name="term" value="sp" /><label for="fixture-sp">Spring</label>
      <input type="radio" id="fixture-su" name="term" value="su" /><label for="fixture-su">Summer</label>
    </fieldset>
    <Field label="Course" id="fixture-course" compact>
      {#snippet children(attrs)}<input type="text" name="course" {...attrs} />{/snippet}
    </Field>
  </form>
</Story>
