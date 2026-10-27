<script lang="ts">
  // Story-only wrapper: the opportunities app's "post a research opportunity"
  // form, where faculty mentors are picked from the campus directory (today a
  // Select2 ModelSelect2Multiple). Title before and notes after are Tab
  // targets for the keyboard specs; Submit serialises the form as the browser
  // would POST it.
  import type { ComboboxItem } from '../src/core/index.ts';
  import MultiCombobox from '../src/svelte/MultiCombobox.svelte';
  import StubServerPanel from './StubServerPanel.svelte';
  import type { StubServer } from './stub-source.svelte.ts';

  let {
    items = [],
    server,
    value = [],
    ...rest
  }: {
    items?: ComboboxItem[];
    /** Async stories: the stub search endpoint; its `source` is passed on, and its panel shown. */
    server?: StubServer<ComboboxItem>;
    value?: string[];
    debounce?: number;
    placeholder?: string;
    minChars?: number;
    max?: number;
    block?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
  } = $props();

  let selected = $state<string[]>([]);
  let changes = $state(0);
  let posted = $state('');
  $effect.pre(() => {
    selected = value;
  });
</script>

<h2>Post a research opportunity</h2>
<p>Undergraduates see the opportunity with its mentors' names. Add every faculty member who will supervise.</p>
<form
  onsubmit={(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    posted = new URLSearchParams(data as unknown as Record<string, string>).toString();
  }}
>
  <p><label>Title <input type="text" name="title" value="Soil microbiome survey" /></label></p>
  <p>
    <label id="mentors-label" for="mentors-cb">Faculty mentors</label><br />
    <MultiCombobox
      id="mentors-cb"
      popupId="mentors-popup"
      labelId="mentors-label"
      name="mentors"
      {items}
      source={server?.source}
      value={selected}
      onchange={(v) => {
        selected = v;
        changes++;
      }}
      {...rest}
    />
  </p>
  <p><label>Notes <input type="text" name="notes" /></label></p>
  <p><button type="submit">Post opportunity</button></p>
</form>
<p>
  Selected: <output data-testid="selected">{selected.join(' ')}</output> (<span data-testid="changes">{changes}</span> changes).
  Posted: <output data-testid="posted">{posted}</output>
</p>
{#if server}
  <StubServerPanel {server} />
{/if}
