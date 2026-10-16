<script lang="ts">
  import { alert, confirm, openModal } from '../src/svelte/modal.ts';

  let { kind }: { kind: 'alert' | 'confirm' | 'custom' | 'rich' } = $props();

  const labels = {
    alert: 'Save preferences',
    confirm: 'Delete assignment',
    custom: 'Leave page',
    rich: 'Show import summary',
  };
  let result = $state('');

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
    } else {
      result = String(await openModal({ title: 'Import summary', body: summary, size: 'medium' }));
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

<button type="button" class="ilw-button" onclick={open}>{labels[kind]}</button>
<p>Result: <output>{result}</output></p>
