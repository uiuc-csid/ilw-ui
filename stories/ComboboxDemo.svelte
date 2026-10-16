<script lang="ts">
  // Story-only wrapper: a <label for>, the Combobox between two plain fields
  // (Tab targets for the keyboard specs), and the committed value, as
  // ta-manager's ComboboxSelect adapter will render it.
  import type { ComboboxItem } from '../src/core/index.ts';
  import Combobox from '../src/svelte/Combobox.svelte';

  let {
    items,
    value = null,
    ...rest
  }: {
    items: ComboboxItem[];
    value?: string | null;
    placeholder?: string;
    max?: number;
    block?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
  } = $props();

  let selected = $state<string | null>(null);
  let changes = $state(0);
  $effect.pre(() => {
    selected = value;
  });
</script>

<p><label>Before <input type="text" name="before" /></label></p>
<p>
  <label id="person-label" for="person-cb">Person</label>
  <Combobox
    id="person-cb"
    popupId="person-popup"
    labelId="person-label"
    {items}
    value={selected}
    onchange={(v) => {
      selected = v;
      changes++;
    }}
    {...rest}
  />
</p>
<p><label>After <input type="text" name="after" /></label></p>
<p>Selected: <output data-testid="selected">{selected ?? ''}</output> (<span data-testid="changes">{changes}</span> changes)</p>
