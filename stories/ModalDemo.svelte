<script lang="ts">
  import { alert, confirm, openModal } from '../src/svelte/modal.ts';

  let { kind }: { kind: 'alert' | 'confirm' | 'custom' | 'rich' | 'form' } = $props();

  const labels = {
    alert: 'Save preferences',
    confirm: 'Delete assignment',
    custom: 'Leave page',
    rich: 'Show import summary',
    form: 'Rename section',
  };
  let result = $state('');
  let name = $state('');

  async function open() {
    result = '';
    if (kind === 'alert') {
      await alert({ title: 'Saved', message: 'Your preferences were saved.' });
      result = 'dismissed';
    } else if (kind === 'confirm') {
      const ok = await confirm({
        title: 'Delete assignment?',
        message: 'This removes the TA from CS 225.',
        confirmLabel: 'Delete',
      });
      result = String(ok);
    } else if (kind === 'custom') {
      const choice = await openModal({
        title: 'Unsaved changes',
        message: 'Save before leaving?',
        buttons: [
          { label: 'Discard', value: 'discard' },
          { label: 'Keep editing', value: 'keep', autofocus: true },
          { label: 'Save', value: 'save' },
        ],
      });
      result = String(choice);
    } else if (kind === 'rich') {
      result = String(await openModal({ title: 'Import summary', body: summary, size: 'medium' }));
    } else {
      name = '';
      const choice = await openModal({
        title: 'Rename section',
        body: rename,
        buttons: [
          { label: 'Cancel', value: 'cancel' },
          { label: 'Rename', value: 'rename' },
        ],
      });
      result = choice === 'rename' ? `rename:${name}` : String(choice);
    }
  }
</script>

{#snippet summary()}
  <p>3 rows imported.</p>
  <ul>
    <li>2 students added</li>
    <li>1 course updated</li>
  </ul>
{/snippet}

<!-- The link appears only once there is a name: content that joins the Tab cycle while the modal is open. -->
{#snippet rename()}
  <!-- svelte-ignore a11y_autofocus (it renders inside the dialog, where the first field should take focus) -->
  <p><label>New name <input bind:value={name} autofocus /></label></p>
  {#if name}<p><a href="#preview">Preview “{name}”</a></p>{/if}
{/snippet}

<button type="button" class="ilw-button" onclick={open}>{labels[kind]}</button>
<p>Result: <output>{result}</output></p>
