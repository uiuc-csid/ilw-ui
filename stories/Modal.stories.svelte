<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { mount, unmount } from 'svelte';
  import { expect, fn, waitFor, within } from 'storybook/test';

  import Modal from '../src/svelte/Modal.svelte';
  import ModalDemo from './ModalDemo.svelte';

  type IlwModal = HTMLElement & { open: boolean };

  const { Story } = defineMeta({
    title: 'Modal',
    component: ModalDemo,
    // A story that leaves its modal open must not leak it (and the inert page) into the next.
    beforeEach: () => () => {
      for (const m of document.querySelectorAll<IlwModal>('ilw-modal[open]')) m.open = false;
    },
  });

  const page = within(document.body);

  async function openedModal(): Promise<IlwModal> {
    return waitFor(() => {
      const m = document.querySelector<IlwModal>('ilw-modal[open]');
      expect(m).not.toBeNull();
      return m!;
    });
  }

  async function closed() {
    await waitFor(() => expect(document.querySelector('ilw-modal')).toBeNull());
  }

  const shadow = (m: IlwModal, sel: string) => m.shadowRoot!.querySelector<HTMLElement>(sel)!;
  const idNumber = (m: IlwModal) => Number(/^app-modal-(\d+)$/.exec(m.getAttribute('id')!)![1]);
</script>

<Story
  name="Alert"
  args={{ kind: 'alert' }}
  play={async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Save preferences' });
    await userEvent.click(trigger);
    const m = await openedModal();

    await expect(m.parentElement).toBe(document.body);
    await expect(m).toHaveAttribute('size', 'small');
    await expect(m.getAttribute('id')).toMatch(/^app-modal-\d+$/);
    const children = [...m.children];
    await expect(children.map((c) => c.tagName)).toEqual(['H2', 'P', 'DIV']);
    await expect(children[0]).toHaveAttribute('slot', 'title');
    await expect(children[0].textContent).toBe('Saved');
    await expect(children[1].textContent).toBe('Your preferences were saved.');
    await expect(children[2].className).toBe('modal-buttons');
    const buttons = [...children[2].children] as HTMLButtonElement[];
    await expect(buttons.map((b) => b.textContent)).toEqual(['Got it']);
    await expect(buttons[0]).toHaveAttribute('type', 'button');
    await expect(buttons[0].className).toBe('ilw-button');

    await userEvent.click(page.getByRole('button', { name: 'Got it' }));
    await closed();
    await expect(canvas.getByRole('status')).toHaveTextContent('dismissed');
    await expect(trigger).toHaveFocus();
  }}
/>

<Story
  name="Confirm"
  args={{ kind: 'confirm' }}
  play={async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete assignment' });
    let root = canvasElement;
    while (root.parentElement !== document.body) root = root.parentElement!;
    const alreadyInert = document.body.appendChild(document.createElement('div'));
    alreadyInert.inert = true;

    await userEvent.click(trigger);
    let m = await openedModal();
    const firstId = idNumber(m);
    const buttons = [...m.querySelectorAll('.modal-buttons button')];
    await expect(buttons.map((b) => b.textContent)).toEqual(['Cancel', 'Delete']);
    await expect(buttons[0]).toHaveAttribute('autofocus');
    await expect(buttons[1]).not.toHaveAttribute('autofocus');
    await waitFor(() => expect(buttons[0]).toHaveFocus());
    await expect(root.inert).toBe(true);
    await expect(alreadyInert.inert).toBe(true);
    await expect(m.inert).toBe(false);

    await userEvent.click(page.getByRole('button', { name: 'Delete' }));
    await closed();
    await expect(canvas.getByRole('status')).toHaveTextContent('true');
    await expect(root.inert).toBe(false);
    await expect(alreadyInert.inert).toBe(true);
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    m = await openedModal();
    await expect(idNumber(m)).toBe(firstId + 1);
    await userEvent.click(page.getByRole('button', { name: 'Cancel' }));
    await closed();
    await expect(canvas.getByRole('status')).toHaveTextContent('false');

    await userEvent.click(trigger);
    await openedModal();
    await userEvent.keyboard('{Escape}');
    await closed();
    await expect(canvas.getByRole('status')).toHaveTextContent('false');
    alreadyInert.remove();
  }}
/>

<Story
  name="Custom buttons"
  args={{ kind: 'custom' }}
  play={async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Leave page' });
    const result = canvas.getByRole('status');

    await userEvent.click(trigger);
    let m = await openedModal();
    const labels = [...m.querySelectorAll('.modal-buttons button')].map((b) => b.textContent);
    await expect(labels).toEqual(['Discard', 'Keep editing', 'Save']);
    await waitFor(() => expect(page.getByRole('button', { name: 'Keep editing' })).toHaveFocus());
    await userEvent.click(page.getByRole('button', { name: 'Save' }));
    await closed();
    await expect(result).toHaveTextContent('save');

    // Every dismissal resolves null: Escape, the × button, the backdrop.
    await userEvent.click(trigger);
    await openedModal();
    await userEvent.keyboard('{Escape}');
    await closed();
    await expect(result).toHaveTextContent('null');
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    m = await openedModal();
    await userEvent.click(shadow(m, '.close-btn'));
    await closed();
    await expect(result).toHaveTextContent('null');
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    m = await openedModal();
    shadow(m, '.backdrop').click();
    await closed();
    await expect(result).toHaveTextContent('null');
    await expect(trigger).toHaveFocus();
  }}
/>

<Story
  name="Rich body"
  args={{ kind: 'rich' }}
  play={async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show import summary' }));
    const m = await openedModal();
    await expect(m).toHaveAttribute('size', 'medium');
    await expect([...m.children].map((c) => c.tagName)).toEqual(['H2', 'P', 'UL', 'DIV']);
    await expect(within(m).getAllByRole('listitem')).toHaveLength(2);
    await userEvent.click(page.getByRole('button', { name: 'Got it' }));
    await closed();
    await expect(canvas.getByRole('status')).toHaveTextContent('true');
  }}
/>

<Story
  name="Close reasons"
  args={{ kind: 'alert' }}
  play={async ({ userEvent }) => {
    const reasons: [string, unknown][] = [];
    for (const close of ['button', 'escape'] as const) {
      const onclose = fn();
      const c = mount(Modal<string>, {
        target: document.body,
        props: { id: 'reason-test', message: 'Hi', buttons: [{ label: 'OK', value: 'ok' }], onclose },
      });
      await openedModal();
      if (close === 'button') await userEvent.click(page.getByRole('button', { name: 'OK' }));
      else await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(onclose).toHaveBeenCalledOnce());
      reasons.push(onclose.mock.calls[0] as [string, unknown]);
      unmount(c);
    }
    await expect(reasons).toEqual([
      ['button', 'ok'],
      ['dismiss', null],
    ]);
  }}
/>

<!-- Left open so axe scans the open modal. -->
<Story
  name="Open"
  args={{ kind: 'confirm' }}
  play={async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Delete assignment' }));
    await openedModal();
  }}
/>

<!-- Fixture for the Playwright keyboard spec: no play function. -->
<Story name="Trigger" args={{ kind: 'confirm' }} />
