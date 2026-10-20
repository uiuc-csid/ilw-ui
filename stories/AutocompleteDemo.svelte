<script lang="ts">
  // Story-only wrapper: a <label for>, the Autocomplete between two plain
  // fields (Tab targets for the keyboard specs) in a form, its text and the
  // last suggestion chosen.
  import type { AutocompleteItem } from '../src/core/index.ts';
  import Autocomplete from '../src/svelte/Autocomplete.svelte';

  let {
    items,
    value = '',
    ...rest
  }: {
    items: AutocompleteItem[];
    value?: string;
    placeholder?: string;
    minChars?: number;
    max?: number;
    emptyText?: string;
    block?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
    class?: string;
  } = $props();

  let text = $state('');
  let chosen = $state('');
  let selects = $state(0);
  let submits = $state(0);
  $effect.pre(() => {
    text = value;
  });
</script>

<form
  onsubmit={(event) => {
    event.preventDefault();
    submits++;
  }}
>
  <p><label>Before <input type="text" name="before" /></label></p>
  <p>
    <label id="prof-label" for="prof">Professor</label>
    <Autocomplete
      id="prof"
      popupId="prof-popup"
      labelId="prof-label"
      {items}
      bind:value={text}
      onselect={(item) => {
        chosen = item.value;
        selects++;
      }}
      {...rest}
    />
  </p>
  <p><label>After <input type="text" name="after" /></label></p>
  <p><button type="submit">Submit</button></p>
</form>
<p>
  Text: <output data-testid="text">{text}</output>; chosen: <output data-testid="chosen">{chosen}</output>
  (<span data-testid="selects">{selects}</span> selects, <span data-testid="submits">{submits}</span> submits)
</p>
