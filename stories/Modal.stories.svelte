<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { mount, unmount } from 'svelte';
  import { expect, fn, waitFor, within } from 'storybook/test';

  import Modal from '../src/svelte/Modal.svelte';
  import ModalDemo from './ModalDemo.svelte';

  type IlwModal = HTMLElement & { open: boolean };

  const { Story } = defineMeta({
    title: 'Modal',
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
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

<!--
  `alert()`: one "Got it" button, `size="small"`, rendered into an `ilw-modal` on `<body>`.

  **Why:** the toolkit's `ilw-modal` supplies the dialog itself; this wrapper adds a promise-based API, unique ids and focus return. Its slotted markup (`h2` title, `p`, `.modal-buttons`) is the documented DOM contract.

  **Review:** click "Save preferences". The dialog's title is "Saved". "Got it" closes it, the result reads `dismissed`, and focus is back on the trigger.
-->
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

<!--
  `confirm()`: Cancel and Delete, resolving `true` or `false`.

  **Why:** a destructive action has to start on the safe choice, so Cancel gets `autofocus`. The page behind the dialog must be `inert` while it is open, and an element that was already inert must stay inert after it closes.

  **Review:** focus starts on Cancel, not Delete. While it is open, you can't click or tab to the page behind it. Delete gives `true`; Cancel and Escape give `false`. Each opening gets a new `app-modal-N` id, and focus always comes back to the trigger.
-->
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

<!--
  `openModal()` with three buttons, one of which has `autofocus`, plus every way of dismissing it.

  **Why:** consumers choose the buttons and which one gets focus. Every dismissal (Escape, the × button, a backdrop click) must resolve `null`, so callers can tell it apart from any button.

  **Review:** focus starts on "Keep editing". Save gives `save`. Escape, ×, and a click on the backdrop each give `null`, and each returns focus to the trigger.
-->
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

<!--
  `openModal()` with a Svelte snippet as the body and `size: 'medium'`.

  **Why:** rich content is passed as a snippet, never as an HTML string (the project bans HTML sinks, and consumers run a strict CSP).

  **Review:** the dialog is wider than the alert and shows a paragraph and a two-item list between the title and the button.
-->
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

<!--
  Mounts `Modal` directly and checks the `onclose` callback's reason: `button` with the button's value, or `dismiss` with `null`.

  **Why:** ta-manager uses `Modal` as a component as well as through the promise helpers, and needs to know how it was closed.

  **Review:** nothing to see on the canvas: the modals are opened and closed by the test. Check the Interactions panel.
-->
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

<!--
  The confirm dialog left open, so axe checks the open modal.

  **Why:** axe only checks what is rendered, and every other story closes its modal.

  **Review:** the a11y panel should show no violations. The title, message and buttons are readable against the backdrop.
-->
<Story
  name="Open"
  args={{ kind: 'confirm' }}
  play={async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Delete assignment' }));
    await openedModal();
  }}
/>

<!--
  Has no `play` function: it is the starting page for `tests/e2e/modal.spec.ts`.

  **Review:** open the dialog by keyboard. Focus starts on Cancel, and Tab cycles Cancel → Delete → × and back to Cancel without leaving the dialog. Escape closes it, Enter on Delete confirms, and focus always returns to the trigger.
-->
<Story name="Trigger" args={{ kind: 'confirm' }} />
