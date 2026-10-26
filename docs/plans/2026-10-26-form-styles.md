# A7: Form styles

_Item A7 of [the toolkit-replacement plan](2026-10-20-toolkit-replacement.md) (tracking: [uiuc-csid/ilw-ui#9](https://github.com/uiuc-csid/ilw-ui/issues/9)). Replaces `ilw-input`: the `.ilw-input-entry*` layouts, the radio and checkbox variants, `-compact`, `.ilw-input-alert`, `.ilw-label-required` and `.ilw-toggle-slider`. Delivery: the `forms.css` and `switch.css` partials plus a Svelte `Field`._

**Status:** implemented on `claude/a7-form-styles-4e71a1`.

## Sources read

- `web-illinois/ilw-input` (default branch on 2026-10-26): `src/ilw-input.css`, `src/ilw-input.ts`, `samples/variations.html`, `README.md`. The Builder page (`builder3.toolkit.illinois.edu/component/ilw-input/`) is a live preview of `samples/` plus the README, which is two examples long; the code is the reference.
- The vendored `vendor/illinois-toolkit/toolkit.css`, whose `ilw-input` rules match `src/ilw-input.css` except the newer `input[type=submit].ilw-button` and `ilw-content label { cursor: pointer }` rules.

What upstream does, in short:

- **Every rule is scoped to `<ilw-content>`** (`ilw-content input`, `ilw-content label`, …) except `.ilw-label-required` and the compact grids. Inside `ilw-content`, every `input`, `select` and `textarea` is restyled, in an entry or not.
- **Text controls:** 200 px wide (content box, 10 px padding), 5 px radius, `thin` border in the theme's text colour, white background, `1rem/1.125rem` Source Sans. `.ilw-input-long` is `calc(100% - 20px)` (textareas always are), `.ilw-input-short` 100 px. Hover and focus paint `--ilw-color--focus--background`; focus adds a 3 px `--ilw-color--link-hover` outline. A `select` gets an orange chevron from a `data:` SVG.
- **Labels** (and `legend`, `.ilw-input-alert`): block, `500 1.25rem/1.5rem`, 5 px under. A `<p>` after the control is the help text (`1rem/1.125rem`, 10 px above). Nothing connects it to the control.
- **Compact** (`.ilw-input-entry-compact`, `-checkbox-compact`): a grid with the label right-aligned in a 225 px column (`--ilw-input-form-label-width`); a block again under 800 px.
- **Checkbox and radio:** `appearance: none`, 18 px boxes with a 10 px mark (a clip-path tick, a dot). `.ilw-input-entry-checkbox` is a `20px auto` grid, box then label. The radio variants are a `<div>` whose `<p>` is the group's title: `-radio` stacks the options, `-radio-vertical` flows them across in 125 px columns, and each has a `-compact` form with the title in the label column. There is no `fieldset`, so the title isn't the group's name.
- **`.ilw-label-required`:** `::after { content: "*" }` in `--ilw-color--link-hover`. `ilw-input.ts` adds the class to the label of every `:required[id]` control on load. Screen readers read the generated "star".
- **`.ilw-input-alert`:** the label's font with a dashed underline, `#D40C0C` (not a brand colour) on the default, white and gray themes, the theme's text colour otherwise. Upstream uses it as a form-level message; it has no role and isn't tied to a field.
- **`.ilw-toggle-slider`:** a wrapper around an invisible `<input type="checkbox" role="switch">` and a 60 × 34 px painted track (`--ilw-color--border-light` off, `--ilw-color--control-text` on; a white thumb), with aria-hidden "On"/"Off" text beside it. The focus ring is drawn on the painted span.
- Also in the file, carried over: `fieldset` and `.ilw-input-disclaimer` (a bordered box, `--ilw-color--control-accent`), `.ilw-input-long`/`-short`. Not carried over: `input[type=submit].ilw-button` (A3's `.ilw-button` covers buttons) and the `button[aria-pressed]` toggle-button script (a different control; it can come with a later item).

## Decisions

- **Classes, not `<ilw-content>`.** Our rules hang off the toolkit's own class names: the entry classes (`.ilw-input-entry`, `-compact`, `-checkbox`, `-checkbox-compact`, the four radio classes) style the label, controls, help text and error inside them. A bare `input` elsewhere on the page (a pager's `select`, a table filter) is left alone. Toolkit markup that used those classes works unchanged once `ilw-content` is dropped.
- **Two partials, `src/styles/forms.css` and `src/styles/switch.css`,** imported by `src/styles.css` after `format.css`. The switch has its own partial so the dark-mode toggle can take it without the rest. Every selector weighs one class: the entry class in `:is()`, the rest in `:where()`, as in `button.css`, so a page's own single-class rule wins and the prose rules (zero specificity) never do.
- **Colours from tokens, so themes and dark mode follow.** Field background `--ilw-color--control`, text and border `--ilw-color--text`, hover and focus `--ilw-color--focus--background`/`--text`, focus outline `--ilw-color--link-hover`. Upstream's fixed white field becomes the theme's control surface (white on the white and gray themes; blue or orange on those themes; dark in dark mode).
- **Errors use `--ilw-color--link-hover`,** the colour upstream already gives the required marker. On light surfaces that is Altgeld (4.9:1 on white); in dark mode and on the blue themes it is orange; on the orange themes black. Upstream's `#D40C0C` isn't in the brand palette, and a fixed red fails on the coloured themes. The error is never colour alone: the message text, the dashed underline (upstream's), and a second 1 px ring on the invalid control.
- **Native validation first.** Required fields use the native `required` attribute; types (`email`, `url`, …) and `pattern` do the rest. Without script the browser blocks the submit and shows its own message, and `:user-invalid` gets the same ring as `aria-invalid="true"`. `aria-invalid="true"` is set only while the field shows an error message (server-rendered or from the app), never just because a constraint fails.
- **The required marker is hidden from assistive technology.** `.ilw-label-required::after { content: "*" / "" }`: the empty alternative text keeps screen readers from reading "star", since `required` already makes them say "required". A plain `content: "*"` rule comes first for engines without alternative text. A form with required fields should say once, in text, "Fields marked * are required". No script adds the class: the server (or `Field`) writes it next to `required`.
- **Help text and errors are connected.** Help text is `<p class="ilw-input-description" id="…-description">`, the error `<p class="ilw-input-alert" id="…-error">`, and the control lists both in `aria-describedby` (help first, then error). The error isn't a live region: one `role="alert"` per field would interrupt for every field at once. After a failed submit the app moves focus to the first invalid field (or to a form-level summary, which may use `.ilw-input-alert` with `role="alert"`); its description then reads the error.
- **Radio groups are `<fieldset>` + `<legend>`.** The radio classes go on a `fieldset`, and its `legend` takes the title `<p>`'s place and look, so the title names the group. The legend stays the rendered legend above the options; the compact forms position it absolutely in a label column made of the fieldset's left padding (a floated legend isn't a grid item in WebKit, which the first attempt found). Upstream's `<div>` form still lays out. A plain `fieldset` keeps upstream's bordered box under `.ilw-fieldset`.
- **The switch is a native checkbox with `role="switch"`, styled directly.** `input.ilw-switch` paints the track and thumb on the input itself (no wrapper, no hidden input, no painted spans), so its focus ring, hit area and forced-colours fallback are the input's own. It is the dark-mode toggle's switch (B1), moved to `switch.css`: `DarkModeToggle` adds `class="ilw-switch"` to its input (an addition to its contract; its existing selectors and tests still match), and `dark-mode-toggle.css` keeps only the label layout. Off is the control surface with a control-text border and thumb, on is filled with control-text: each reaches 3:1 against the surface (WCAG 1.4.11), where upstream's white thumb on Storm 80 doesn't. Upstream's visible "On"/"Off" text isn't carried over: the switch announces its state, and the thumb's position and the fill show it.
- **The select chevron is drawn with gradients** in `--ilw-color--link-hover`, not a `data:` SVG, so it follows the theme, reaches 3:1, and needs no `img-src data:` in a strict CSP.
- **Checkbox and radio fall back to native controls in forced-colours mode,** since the painted mark is a background.
- **Long fields and textareas are `width: 100%` with `box-sizing: border-box`** (upstream's `calc(100% - 20px)` content box overflows by its 2 px border); the textarea keeps upstream's 122 px outer height and the select upstream's 222 px outer width.
- **`Field` takes no `component` meta in its stories:** Storybook would render a bare `Field` from args, with no `children`.

## Markup contract

```html
<!-- Text control, select or textarea -->
<div class="ilw-input-entry">                      <!-- or ilw-input-entry-compact -->
  <label for="email" class="ilw-label-required">Email</label>
  <input id="email" name="email" type="email" required
         aria-describedby="email-description email-error" aria-invalid="true">
  <p class="ilw-input-description" id="email-description">We only use it to reply.</p>
  <p class="ilw-input-alert" id="email-error">Enter an email address like name@illinois.edu.</p>
</div>

<!-- Checkbox, or a switch -->
<div class="ilw-input-entry-checkbox">             <!-- or ilw-input-entry-checkbox-compact -->
  <label for="notify">Email me updates</label>
  <input id="notify" name="notify" type="checkbox">  <!-- switch: role="switch" class="ilw-switch" -->
</div>

<!-- Radio group -->
<fieldset class="ilw-input-entry-radio">           <!-- or -radio-vertical, -radio-compact, -radio-vertical-compact -->
  <legend>Term</legend>
  <input type="radio" id="term-fa" name="term" value="fa"><label for="term-fa">Fall</label>
  <input type="radio" id="term-sp" name="term" value="sp"><label for="term-sp">Spring</label>
</fieldset>

<!-- Bordered group; form-level message -->
<fieldset class="ilw-fieldset"><legend>Contact</legend>…</fieldset>
<div class="ilw-input-disclaimer"><input type="checkbox" id="d"><label for="d">…</label></div>
<p class="ilw-input-alert" role="alert">2 fields need attention.</p>
```

- `aria-describedby` lists only ids that exist; `aria-invalid` is present only with an error message.
- Width modifiers on the control: `.ilw-input-long`, `.ilw-input-short`. The label column of the compact forms is `--ilw-input-form-label-width` (225 px), the radio column `--ilw-input-form-vertical-label-width` (125 px), upstream's names.
- Upstream's bare `<p>` help text still gets the help look inside an entry; `.ilw-input-description` is the documented form.

### Svelte

`Field` renders the entry with the label, help text and error, and hands the control's attributes to its `children` snippet:

```svelte
<Field label="Email" description="We only use it to reply." error={errors.email} required>
  {#snippet children(attrs)}<input type="email" name="email" {...attrs} />{/snippet}
</Field>
```

- `attrs` is `{ id, required, 'aria-describedby', 'aria-invalid' }`, with `undefined` for what doesn't apply, so spreading it adds nothing extra.
- Props: `label`, `description`, `error` (each a string or a snippet; `error` set means invalid), `required`, `compact`, `variant` (`'entry'` default, `'checkbox'` for a checkbox or switch), `id` (default `nextId('ilw-field')`), `descriptionId` and `errorId` (default `<id>-description`, `<id>-error`), `class`.
- Radio groups stay markup: `aria-invalid` isn't allowed on a `group`, so a group component (with the error on the `fieldset`'s description and the first radio) is left for later.

## Tests

- **Play functions** (`stories/Field.stories.svelte`): the ARIA wiring (label `for`, `aria-describedby` order and targets, `aria-invalid` only with an error, `required` and the marker class, overridden ids), the marker's empty alternative text, computed sizes and colours against upstream's values, the compact grid, the radio legend placement in Chromium and WebKit, and the switch colours on and off.
- **Keyboard (`tests/e2e/field.spec.ts`):** Tab reaches the controls in order, Space toggles the checkbox and the switch, arrow keys move within the radio group, the compact layout stacks under 800 px, and focus never falls to `<body>`. The dark-mode toggle's spec keeps passing unchanged.
- **axe** on every story, including the error state, in light and dark.
- **Parity pair** `stories/parity/Field.parity.stories.svelte`: upstream's `variations.html` sample inside `<ilw-content>` against ours.
- **Unformatted:** a `Field` outside `.ilw-format` keeps Source Sans.
- **AT smoke:** a `Field` section in `docs/at-smoke.md`.
