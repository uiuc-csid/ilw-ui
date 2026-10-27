# E5: choice chips

Roadmap item E5 ([toolkit replacement](2026-10-20-toolkit-replacement.md), uiuc-csid/ilw-ui#9). The toolkit has no
equivalent. First consumer: ngpa's country and schema pickers.

## Design

Native radios (pick one) or checkboxes (pick any) in a `fieldset` with a `legend`, each wrapped in a label styled as a
pill. No script, no ARIA widget pattern: the inputs stay real form controls in the accessibility tree, so the keyboard
is native (Tab to the group, arrows move and check within radios, Space toggles a checkbox) and the values submit with
the form.

```html
<fieldset class="ilw-chips" id="country" role="radiogroup" aria-describedby="country-description">
  <legend>Country</legend>
  <label class="ilw-chip"><input type="radio" name="country" value="us"> United States</label>
  <label class="ilw-chip"><input type="radio" name="country" value="ca"> Canada</label>
  <p class="ilw-input-description" id="country-description">…</p>
  <p class="ilw-input-alert" id="country-error">…</p>
</fieldset>
```

- **Labels, help text, errors** match `RadioGroup` (A7): `.ilw-label-required` on the legend, `p.ilw-input-description`
  and `p.ilw-input-alert` after the options, listed in the fieldset's `aria-describedby`.
- **Invalid:** radios: `role="radiogroup"` on the fieldset, which allows `aria-invalid` (as `RadioGroup`). Checkboxes:
  the fieldset stays a plain `group` (which doesn't allow `aria-invalid`), so each checkbox carries `aria-invalid`.
  Every chip of an invalid group gets the 2 px ring forms.css gives invalid radios, so the error isn't colour alone.
- **Required:** native `required` on each radio. A checkbox group has no native "at least one", so for checkboxes
  `required` only adds the legend's marker; the app validates.
- **Not colour alone:** each chip keeps a visible indicator, the native input restyled (a circle for a radio, a square
  for a checkbox) that fills with a dot or tick when checked; the checked chip also inverts (control text fill, like
  the switch). Focus is a 3 px outline around the whole chip (`:has(:focus-visible)`), offset from the 2 px invalid
  ring. Colours come from `--ilw-color--control*`, `--ilw-color--focus--*` and `--ilw-color--link-hover`, so themes
  and dark mode follow. Forced colours: the native input comes back (`appearance: auto`).
- **CSS** in a new partial, `src/styles/chips.css`, imported by `styles.css`, as each component has its own partial.

## Svelte

`ChoiceChips`: `legend`, `name`, `options` (`{ value, label, disabled? }`), `multiple` (checkboxes), bindable `value`
(`string` for radios, `string[]` for checkboxes), `onchange`, `description`, `error`, `required`, `id`,
`descriptionId`, `errorId`, `class`. No bind:group: `checked` and an `onchange` handler, so the one `value` prop can be
either shape.

## Tests

- Stories (`Forms/ChoiceChips`): radio form with help text, checkbox form, error (radio and checkbox), dark, themes,
  an open-free fixture for the keyboard spec; plus `Unformatted → ChoiceChips`.
- Play functions: DOM contract, ARIA wiring, checked styles (fill + indicator), focus ring, invalid ring.
- `tests/e2e/choice-chips.spec.ts`: Tab into radios, arrows move and check, disabled skipped, Tab out; checkboxes are
  one tab stop each, Space toggles.
- README: partial row, markup example, DOM contract, props.
