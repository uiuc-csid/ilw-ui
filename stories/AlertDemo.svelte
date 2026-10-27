<!--
  Stands in for ta-manager's course settings page after a save: the page
  heading and intro, the save banner (an error with "Try again" and "Log in
  again", or the "Saved" status), then the form. "Save" fails the first time
  and "Try again" succeeds, so both banners can be reached by keyboard.
  "Try again" removes the error it sits in, so it moves focus to "Save" itself.
-->
<script lang="ts">
  import { tick } from 'svelte';

  import { Alert, Button, Field } from '../src/svelte/index.ts';

  let { initial = 'error' }: { initial?: 'error' | 'saved' | 'none' } = $props();

  // svelte-ignore state_referenced_locally
  let status = $state(initial);
  let save = $state<HTMLButtonElement>();

  async function retry() {
    status = 'saved';
    await tick();
    save!.focus();
  }

  function submit(e: SubmitEvent) {
    e.preventDefault();
    status = 'error';
  }
</script>

<h1>Course settings</h1>
<p>Settings for CS 124, Fall 2026. Changes apply to every section of the course.</p>

{#if status === 'error'}
  <Alert variant="error" title="Your changes weren't saved" dismissible ondismiss={() => (status = 'none')}>
    <p>The server didn't answer. Your edits are still in the form below.</p>
    {#snippet actions()}
      <Button onclick={retry}>Try again</Button>
      <Button href="#login">Log in again</Button>
    {/snippet}
  </Alert>
{:else if status === 'saved'}
  <Alert variant="success" dismissible ondismiss={() => (status = 'none')}>
    <p>Settings saved.</p>
  </Alert>
{/if}

<form onsubmit={submit}>
  <Field label="Course title" required>
    {#snippet children(attrs)}<input type="text" name="title" value="Introduction to Computer Science" {...attrs} />{/snippet}
  </Field>
  <Field label="Enrollment cap" description="Across all sections.">
    {#snippet children(attrs)}<input type="number" name="cap" value="900" {...attrs} />{/snippet}
  </Field>
  <p><button type="submit" class="ilw-button" bind:this={save}>Save</button></p>
</form>
