<script lang="ts">
  // Story-only wrapper: a <label for>, the Autocomplete between two plain
  // fields (Tab targets for the keyboard specs) in a form, its text and the
  // last suggestion chosen.
  import type { AutocompleteItem } from '../src/core/index.ts';
  import Autocomplete from '../src/svelte/Autocomplete.svelte';
  import StubServerPanel from './StubServerPanel.svelte';
  import type { StubServer } from './stub-source.svelte.ts';

  let {
    items = [],
    server,
    value = '',
    ...rest
  }: {
    items?: AutocompleteItem[];
    /** Async stories: the stub search endpoint; its `source` is passed on, and its panel shown. */
    server?: StubServer<AutocompleteItem>;
    debounce?: number;
    loadingText?: string;
    errorText?: string;
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
  // The input's change events while focus is still in it (a choice), as "text".
  let picks = $state<string[]>([]);
  $effect.pre(() => {
    text = value;
  });
</script>

<form
  onchange={(event) => {
    const el = event.target as HTMLInputElement;
    if (el.id === 'prof' && document.activeElement === el) picks = [...picks, el.value];
  }}
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
      source={server?.source}
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
  (<span data-testid="selects">{selects}</span> selects, <span data-testid="submits">{submits}</span> submits; change on pick:
  <output data-testid="picks">{picks.join(' | ')}</output>)
</p>
{#if server}
  <StubServerPanel {server} />
{/if}
