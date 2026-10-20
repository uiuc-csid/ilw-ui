<script lang="ts">
  // Story-only page: a server-rendered-style <select data-combobox> with a
  // <label for> and optgroups, between two plain fields (Tab targets), enhanced
  // in place by enhanceSelects() as a page would after load. A second select
  // with no id stands in for one rendered without (ta-manager's /course rows).
  import { onMount } from 'svelte';

  import { enhanceSelects } from '../src/svelte/enhance-select.ts';

  let form: HTMLFormElement;
  let changes = $state<string[]>([]);
  onMount(() => enhanceSelects(form));
</script>

<form
  bind:this={form}
  onchange={(event) => {
    const el = event.target as HTMLElement;
    if (el instanceof HTMLSelectElement) changes = [...changes, `${el.id || el.className}=${el.value}`];
  }}
  onsubmit={(event) => event.preventDefault()}
>
  <p><label>Before <input type="text" name="before" /></label></p>
  <p>
    <label for="person">Person</label>
    <select id="person" data-combobox>
      <option value="">— Select a person or type a NetID —</option>
      <optgroup label="Faculty">
        <option value="aadams" data-search="Avery Adams aadams">Avery Adams (aadams)</option>
        <option value="bbrown" data-search="Blake Brown bbrown">Blake Brown (bbrown)</option>
      </optgroup>
      <optgroup label="Students">
        <option value="cclark" data-search="Casey Clark cclark">Casey Clark (cclark)</option>
        <option value="dadams" data-search="Drew Adams dadams">Drew Adams (dadams)</option>
      </optgroup>
    </select>
  </p>
  <p><label>After <input type="text" name="after" /></label></p>
  <p>
    <select class="row-add" data-combobox>
      <option value="">+ add…</option>
      <option value="7">Prof X (px)</option>
    </select>
  </p>
  <p><button type="button">Add</button></p>
</form>
<p>Changes: <output data-testid="changes">{changes.join(' ')}</output></p>
