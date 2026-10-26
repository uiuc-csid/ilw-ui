<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { mount, unmount } from 'svelte';
  import { expect, fn, waitFor, within } from 'storybook/test';

  import Modal from '../src/svelte/Modal.svelte';
  import ModalDemo from './ModalDemo.svelte';

  const { Story } = defineMeta({
    title: 'Modal',
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
    component: ModalDemo,
    // No toolkit: the modal is a native <dialog> styled by ilw-ui alone.
    parameters: { styles: 'ilw-ui' },
    // A story that leaves its modal open must not leak it (and the inert page) into the next.
    beforeEach: () => () => {
      for (const m of document.querySelectorAll<HTMLDialogElement>('dialog.ilw-modal[open]')) m.close();
    },
  });

  const page = within(document.body);

  async function openedModal(): Promise<HTMLDialogElement> {
    return waitFor(() => {
      const m = document.querySelector<HTMLDialogElement>('dialog.ilw-modal[open]');
      expect(m).not.toBeNull();
      expect(m!.matches(':modal')).toBe(true);
      return m!;
    });
  }

  async function closed() {
    await waitFor(() => expect(document.querySelector('dialog.ilw-modal')).toBeNull());
  }

  const idNumber = (m: HTMLElement) => Number(/^app-modal-(\d+)$/.exec(m.id)![1]);

  /** A click that starts on `down` and ends at (x, y) in the viewport, as a backdrop click or a drag onto it. */
  function clickAt(m: HTMLDialogElement, down: Element, x: number, y: number) {
    down.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y }));
    m.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
  }
</script>

<!--
  `alert()`: one "Got it" button, size small, in a native `<dialog>` on `<body>`.

  **Why:** the documented DOM contract: an `h2` title that names the dialog, a `<p>` message that describes it, the choice buttons in a `<form method="dialog">` (each `value` is its index), and a × button last.

  **Review:** click "Save preferences". A dialog titled "Saved" opens near the top with an orange top border over a dimmed page. "Got it" closes it, the result reads `dismissed`, and focus is back on the trigger.
-->
<Story
  name="Alert"
  args={{ kind: 'alert' }}
  play={async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Save preferences' });
    await userEvent.click(trigger);
    const m = await openedModal();

    await expect(m.parentElement).toBe(document.body);
    await expect(m.className).toBe('ilw-modal ilw-modal--small');
    await expect(m.id).toMatch(/^app-modal-\d+$/);
    await expect(page.getByRole('dialog', { name: 'Saved' })).toBe(m);
    await expect(m).toHaveAccessibleDescription('Your preferences were saved.');
    const children = [...m.children];
    await expect(children.map((c) => c.tagName)).toEqual(['H2', 'DIV', 'FORM', 'BUTTON']);
    await expect(children[0].className).toBe('ilw-modal-title');
    await expect(children[0].textContent).toBe('Saved');
    await expect(children[1].className).toBe('ilw-modal-body');
    await expect(children[1].firstElementChild!.tagName).toBe('P');
    await expect(children[1].firstElementChild!.id).toBe(`${m.id}-message`);
    await expect(children[1].textContent).toBe('Your preferences were saved.');
    await expect(children[2].className).toBe('ilw-modal-buttons');
    await expect(children[2]).toHaveAttribute('method', 'dialog');
    const buttons = [...children[2].children] as HTMLButtonElement[];
    await expect(buttons.map((b) => [b.textContent, b.type, b.value, b.className])).toEqual([
      ['Got it', 'submit', '0', 'ilw-button'],
    ]);
    await expect(children[3].className).toBe('ilw-modal-close');
    await expect(children[3]).toHaveAccessibleName('Close');
    await expect(children[3]).toHaveAttribute('type', 'button');
    await waitFor(() => expect(buttons[0]).toHaveFocus());

    await userEvent.click(page.getByRole('button', { name: 'Got it' }));
    await closed();
    await expect(canvas.getByRole('status')).toHaveTextContent('dismissed');
    await expect(trigger).toHaveFocus();
  }}
/>

<!--
  `confirm()`: Cancel and Delete, resolving `true` or `false`.

  **Why:** a destructive action has to start on the safe choice, so Cancel gets `autofocus`. While the dialog is open the page behind it is inert: `showModal()` does that, so nothing outside the dialog can be clicked or focused.

  **Review:** focus starts on Cancel, not Delete. While it is open, you can't click or tab to the page behind it, and the page doesn't scroll. Delete gives `true`; Cancel and Escape give `false`. Each opening gets a new `app-modal-N` id, and focus always comes back to the trigger.
-->
<Story
  name="Confirm"
  args={{ kind: 'confirm' }}
  play={async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete assignment' });

    await userEvent.click(trigger);
    let m = await openedModal();
    const firstId = idNumber(m);
    const buttons = [...m.querySelectorAll('.ilw-modal-buttons button')];
    await expect(buttons.map((b) => b.textContent)).toEqual(['Cancel', 'Delete']);
    await expect(buttons[0]).toHaveAttribute('autofocus');
    await expect(buttons[1]).not.toHaveAttribute('autofocus');
    await waitFor(() => expect(buttons[0]).toHaveFocus());
    // The page is inert: it can't take focus, and a click on it lands on the dialog's backdrop.
    trigger.focus();
    await expect(buttons[0]).toHaveFocus();
    const r = trigger.getBoundingClientRect();
    await expect(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)).toBe(m);
    await expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');

    await userEvent.click(page.getByRole('button', { name: 'Delete' }));
    await closed();
    await expect(canvas.getByRole('status')).toHaveTextContent('true');
    await expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden');
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    m = await openedModal();
    await expect(idNumber(m)).toBe(firstId + 1);
    await userEvent.click(page.getByRole('button', { name: 'Cancel' }));
    await closed();
    await expect(canvas.getByRole('status')).toHaveTextContent('false');
    await expect(trigger).toHaveFocus();
  }}
/>

<!--
  `openModal()` with three buttons, one of which has `autofocus`, plus every way of dismissing it.

  **Why:** consumers choose the buttons and which one gets focus. Every dismissal (Escape, the × button, a backdrop click) must resolve `null`, so callers can tell it apart from any button. A drag that starts in the dialog and ends on the backdrop (selecting text) is not a backdrop click.

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
    const labels = [...m.querySelectorAll('.ilw-modal-buttons button')].map((b) => b.textContent);
    await expect(labels).toEqual(['Discard', 'Keep editing', 'Save']);
    await waitFor(() => expect(page.getByRole('button', { name: 'Keep editing' })).toHaveFocus());
    await userEvent.click(page.getByRole('button', { name: 'Save' }));
    await closed();
    await expect(result).toHaveTextContent('save');

    // Every dismissal resolves null: the × button, the backdrop (and Escape, in
    // tests/e2e/modal.spec.ts: only a real key press closes a native dialog).
    await userEvent.click(trigger);
    await openedModal();
    await userEvent.click(page.getByRole('button', { name: 'Close' }));
    await closed();
    await expect(result).toHaveTextContent('null');
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    m = await openedModal();
    // A click inside the dialog's box, and a drag from its text onto the backdrop, keep it open.
    const box = m.getBoundingClientRect();
    clickAt(m, m, box.left + 4, box.top + 12);
    clickAt(m, m.querySelector('p')!, 2, 2);
    await expect(m).toHaveAttribute('open');
    clickAt(m, m, 2, 2);
    await closed();
    await expect(result).toHaveTextContent('null');
    await expect(trigger).toHaveFocus();
  }}
/>

<!--
  `openModal()` with a Svelte snippet as the body and `size: 'medium'`.

  **Why:** rich content is passed as a snippet, never as an HTML string (the project bans HTML sinks, and consumers run a strict CSP). Only a plain `message` describes the dialog: a snippet body may hold controls, which shouldn't be read as its description.

  **Review:** the dialog is wider than the alert and shows a paragraph and a two-item list between the title and the button.
-->
<Story
  name="Rich body"
  args={{ kind: 'rich' }}
  play={async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show import summary' }));
    const m = await openedModal();
    await expect(m).toHaveClass('ilw-modal--medium');
    await expect(m).toHaveAccessibleName('Import summary');
    await expect(m).not.toHaveAttribute('aria-describedby');
    const body = m.querySelector('.ilw-modal-body')!;
    await expect([...body.children].map((c) => c.tagName)).toEqual(['P', 'UL']);
    await expect(within(m).getAllByRole('listitem')).toHaveLength(2);
    await userEvent.click(page.getByRole('button', { name: 'Got it' }));
    await closed();
    await expect(canvas.getByRole('status')).toHaveTextContent('true');
  }}
/>

<!--
  `openModal()` with a form in its body: an `autofocus` input, and a link that appears once the input has text.

  **Why:** fixes two `ilw-modal` gaps: `autofocus` works anywhere in the dialog, not only on its direct children, and the Tab cycle includes content added while it is open.

  **Review:** focus starts in the input. Type a name: a "Preview" link appears, and Tab reaches it before the buttons. Rename gives `rename:<name>`.
-->
<Story
  name="Form body"
  args={{ kind: 'form' }}
  play={async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Rename section' }));
    const m = await openedModal();
    const input = within(m).getByRole('textbox', { name: 'New name' });
    await waitFor(() => expect(input).toHaveFocus());
    await userEvent.type(input, 'Lab A');
    await expect(within(m).getByRole('link', { name: 'Preview “Lab A”' })).toBeVisible();
    await userEvent.click(within(m).getByRole('button', { name: 'Rename' }));
    await closed();
    await expect(canvas.getByRole('status')).toHaveTextContent('rename:Lab A');
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
    // Escape is in tests/e2e/modal.spec.ts: a synthetic key press doesn't close a native dialog.
    for (const close of ['button', 'close', 'backdrop'] as const) {
      const onclose = fn();
      const c = mount(Modal<string>, {
        target: document.body,
        props: { id: 'reason-test', message: 'Hi', buttons: [{ label: 'OK', value: 'ok' }], onclose },
      });
      const m = await openedModal();
      if (close === 'button') await userEvent.click(page.getByRole('button', { name: 'OK' }));
      else if (close === 'close') await userEvent.click(page.getByRole('button', { name: 'Close' }));
      else clickAt(m, m, 2, 2);
      await waitFor(() => expect(onclose).toHaveBeenCalledOnce());
      reasons.push(onclose.mock.calls[0] as [string, unknown]);
      unmount(c);
    }
    await expect(reasons).toEqual([
      ['button', 'ok'],
      ['dismiss', null],
      ['dismiss', null],
    ]);
  }}
/>

<!--
  Mounts `Modal` directly without a title: the message names the dialog, and a snippet body falls back to `label`.

  **Why:** a dialog needs an accessible name (axe `aria-dialog-name`); `ilw-modal` labels it with an empty title slot.

  **Review:** nothing to see on the canvas. Check the Interactions panel.
-->
<Story
  name="Names"
  args={{ kind: 'alert' }}
  play={async () => {
    const buttons = [{ label: 'OK', value: 'ok' }];
    let c = mount(Modal<string>, { target: document.body, props: { message: 'Saved.', buttons, onclose: fn() } });
    let m = await openedModal();
    await expect(m).toHaveAccessibleName('Saved.');
    await expect(m).not.toHaveAttribute('aria-describedby');
    await expect(m.id).toMatch(/^ilw-modal-\d+$/);
    unmount(c);

    c = mount(Modal<string>, {
      target: document.body,
      props: { label: 'Preferences', buttons, onclose: fn() },
    });
    m = await openedModal();
    await expect(m).toHaveAccessibleName('Preferences');
    unmount(c);
  }}
/>

<!--
  The confirm dialog left open, so axe checks the open modal.

  **Why:** axe only checks what is rendered, and every other story closes its modal.

  **Review:** the a11y panel should show no violations. The title, message and buttons are readable against the backdrop, in light and dark mode.
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

<!--
  Has no `play` function: the starting page for the Tab-cycle spec with a form body in `tests/e2e/modal.spec.ts`.

  **Review:** open it, type a name, and Tab through: input → Preview link → Cancel → Rename → × → input.
-->
<Story name="Form trigger" args={{ kind: 'form' }} />
