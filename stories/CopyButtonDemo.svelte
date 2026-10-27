<!--
  Stands in for the ta-manager pages that copy: a course page's share link (an
  input's value, by id), a new API token (an element's text, by id), and a
  roster with a per-row netid button (icon only, a literal value) and a
  "Copy netids" button whose text is built from the rows at click time.
-->
<script lang="ts">
  import { CopyButton } from '../src/svelte/index.ts';

  import './CopyButtonDemo.css';

  let { resetAfter = 1500 }: { resetAfter?: number } = $props();

  let roster = $state([
    { netid: 'aturing2', name: 'Alan Turing', confirmed: true },
    { netid: 'ghopper3', name: 'Grace Hopper', confirmed: true },
    { netid: 'kjohnson', name: 'Katherine Johnson', confirmed: false },
  ]);
  const confirmed = $derived(roster.filter((r) => r.confirmed));
</script>

<h2>Share this course</h2>
<p>Anyone with the link can see the posting while applications are open.</p>
<p class="ilw-copy-demo-row">
  <label for="share-link">Course link</label>
  <input id="share-link" class="ilw-copy-demo-input" readonly value="https://tam.cs.illinois.edu/courses/cs-225/fa26" />
  <CopyButton target="share-link" label="Copy link" {resetAfter} />
</p>

<h2>New API token</h2>
<p>Copy the token now: it is shown only once.</p>
<p class="ilw-copy-demo-row">
  <code id="new-token">tam_7Qx2dH9kLm4Rv8Zp</code>
  <CopyButton target="new-token" label="Copy token" theme="blue-solid" size="small" {resetAfter} />
</p>

<h2>CS 225 teaching assistants</h2>
<table>
  <caption>Applicants for Fall 2026</caption>
  <thead>
    <tr><th scope="col">Name</th><th scope="col">NetID</th><th scope="col">Status</th></tr>
  </thead>
  <tbody>
    {#each roster as row (row.netid)}
      <tr>
        <td>{row.name}</td>
        <td>
          {row.netid}
          <CopyButton value={row.netid} label="Copy netid of {row.name}" hideLabel size="small" {resetAfter} />
        </td>
        <td>
          <label><input type="checkbox" bind:checked={row.confirmed} /> Confirmed<span class="ilw-visually-hidden">: {row.name}</span></label>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<p>
  <CopyButton
    value={() => confirmed.map((r) => r.netid).join(', ')}
    label="Copy netids of confirmed students"
    {resetAfter}
  />
</p>
