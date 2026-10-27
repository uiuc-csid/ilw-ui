<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
  import Info from 'phosphor-svelte/lib/Info';
  import X from 'phosphor-svelte/lib/X';
  import { expect, fn, userEvent, waitFor } from 'storybook/test';

  import { Alert, Button, enhanceAlerts, Field, Icon } from '../src/svelte/index.ts';
  import AlertDemo from './AlertDemo.svelte';

  // No `component`: each story gives the alert its page around it.
  const { Story } = defineMeta({
    title: 'Components/Alert',
    tags: ['autodocs'],
    parameters: { styles: 'ilw-ui' },
  });

  const WHITE = 'rgb(255, 255, 255)';
  const DARK = 'rgb(17, 24, 29)';
  const ACCENTS = {
    info: 'rgb(29, 88, 167)',
    success: 'rgb(0, 98, 48)',
    warning: 'rgb(125, 62, 19)',
    error: 'rgb(200, 65, 19)',
  };
  const HARVEST = 'rgb(252, 179, 22)';
  const onDismiss = fn();

  /** Checks the contract of the one alert in `root`: class, role, hidden label, decorative icon, accent colours. */
  async function contract(root: HTMLElement, variant: keyof typeof ACCENTS, role: 'status' | 'alert', label: string) {
    const alerts = root.querySelectorAll<HTMLElement>('.ilw-alert');
    await expect(alerts).toHaveLength(1);
    const alert = alerts[0];
    await expect(alert).toHaveClass('ilw-alert', `ilw-alert--${variant}`);
    await expect(alert).toHaveAttribute('role', role);
    const icon = alert.querySelector('svg.ilw-alert-icon')!;
    await expect(icon).toHaveClass('ilw-icon');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    const hidden = alert.querySelector('.ilw-alert-body > .ilw-visually-hidden')!;
    await expect(hidden).toHaveTextContent(label);
    await expect(alert.querySelector('.ilw-alert-body')!.firstElementChild).toBe(hidden);
    await expect(getComputedStyle(icon).color).toBe(ACCENTS[variant]);
    await expect(getComputedStyle(alert).borderLeftColor).toBe(variant === 'warning' ? HARVEST : ACCENTS[variant]);
    await expect(getComputedStyle(alert).backgroundColor).toBe(WHITE);
    return alert;
  }
</script>

<!--
  An info notice on a course page: no title, no actions, not dismissible.

  **Why:** the play function checks the contract: `div.ilw-alert.ilw-alert--info` with `role="status"`, the hidden "Information:" label first in the body, a decorative icon in Industrial blue, the Industrial stripe on a white card. No dismiss button unless asked for.

  **Review:** a white card with a blue left stripe and a blue "i" icon, the message beside it, between the heading and the schedule.
-->
<Story
  name="Info"
  play={async ({ canvasElement }) => {
    const alert = await contract(canvasElement, 'info', 'status', 'Information:');
    await expect(alert.querySelector('.ilw-alert-dismiss')).toBeNull();
    await expect(alert.querySelector('.ilw-alert-title')).toBeNull();
  }}
>
  <h1>CS 124 office hours</h1>
  <Alert>
    <p>Office hours move to Siebel 0216 next week while the lab is repainted.</p>
  </Alert>
  <h2>This week</h2>
  <p>Monday to Thursday, 3–5 p.m., Siebel 0222. Bring your laptop and your iCard.</p>
</Story>

<!--
  A success message after submitting an application, dismissible.

  **Why:** the play function checks the contract (`role="status"`, "Success:", Prairie green), the title, and that the dismiss button is named "Dismiss" and comes after the message.

  **Review:** a green check and stripe, a bold "Application submitted" over the message, an × at the top right. Tab to the ×: it gets the light blue focus ring.
-->
<Story
  name="Success"
  play={async ({ canvasElement, canvas }) => {
    const alert = await contract(canvasElement, 'success', 'status', 'Success:');
    await expect(alert.querySelector('.ilw-alert-title')).toHaveTextContent('Application submitted');
    const dismiss = canvas.getByRole('button', { name: 'Dismiss' });
    await expect(dismiss).toHaveClass('ilw-alert-dismiss');
    await expect(alert.lastElementChild).toBe(dismiss);
    await expect(dismiss.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  }}
>
  <h1>Course assistant application</h1>
  <Alert variant="success" title="Application submitted" dismissible>
    <p>We emailed a copy to your Illinois address. You can edit it until applications close.</p>
  </Alert>
  <h2>Your application</h2>
  <p>Courses: CS 124, CS 128. Hours per week: 10.</p>
</Story>

<!--
  A warning with an action: the application deadline is close.

  **Why:** the play function checks the contract: a warning is still `role="status"` (only errors are `alert`), "Warning:", an Earth icon on the Harvest stripe, and the action sits in `.ilw-alert-actions` under the message.

  **Review:** a gold stripe with a brown warning triangle, the message, and a "Review application" button under it.
-->
<Story
  name="Warning"
  play={async ({ canvasElement, canvas }) => {
    const alert = await contract(canvasElement, 'warning', 'status', 'Warning:');
    const action = canvas.getByRole('link', { name: 'Review application' });
    await expect(action.parentElement).toHaveClass('ilw-alert-actions');
    await expect(alert.querySelector('.ilw-alert-body')!.lastElementChild).toBe(action.parentElement);
  }}
>
  <h1>Course assistant application</h1>
  <Alert variant="warning" title="Applications close Friday at 5 p.m.">
    <p>Your application is missing a course preference.</p>
    {#snippet actions()}<Button href="#review">Review application</Button>{/snippet}
  </Alert>
  <h2>Your application</h2>
  <p>Courses: none chosen yet. Hours per week: 10.</p>
</Story>

<!--
  ta-manager's save-error banner over its form, with "Try again" and "Log in again" and a dismiss button.

  **Why:** the play function checks the contract: errors, and only errors, are `role="alert"` ("Error:", Altgeld), and the actions come before the dismiss button in Tab order. `tests/e2e/alert.spec.ts` drives the same page from **Save Error Fixture**.

  **Review:** an orange-red stripe and octagon, the bold title, the message, two buttons, the ×. "Try again" swaps in a green "Settings saved" and puts focus on Save.
-->
<Story
  name="Error"
  play={async ({ canvasElement, canvas }) => {
    const alert = await contract(canvasElement, 'error', 'alert', 'Error:');
    await expect(canvas.getByRole('alert')).toBe(alert);
    const order = [...alert.querySelectorAll('a, button')].map((el) => el.textContent?.trim() || el.getAttribute('aria-label'));
    await expect(order).toEqual(['Try again', 'Log in again', 'Dismiss']);
  }}
>
  <AlertDemo />
</Story>

<!--
  The save-error page, no play function: the fixture for `tests/e2e/alert.spec.ts`.

  **Why:** the spec tabs through the actions and the dismiss button, dismisses with the keyboard and checks focus lands on "Course title", and follows "Try again" to the success message and "Save".

  **Review:** as **Error**.
-->
<Story name="Save Error Fixture">
  <AlertDemo />
</Story>

<!--
  A dismissible save error over the form, with an `ondismiss` handler.

  **Why:** the play function clicks the × with focus on it, as a keyboard user would have it: `ondismiss` runs once, the alert leaves the page and focus moves to the next tabbable element, "Course title".

  **Review:** click the ×: the banner goes and the title field has focus.
-->
<Story
  name="Dismissible"
  play={async ({ canvas }) => {
    onDismiss.mockClear();
    const dismiss = canvas.getByRole('button', { name: 'Dismiss' });
    dismiss.focus();
    await userEvent.click(dismiss);
    await waitFor(() => expect(canvas.queryByRole('alert')).toBeNull());
    await expect(onDismiss).toHaveBeenCalledOnce();
    await expect(canvas.getByRole('textbox', { name: 'Course title' })).toHaveFocus();
  }}
>
  <h1>Course settings</h1>
  <Alert variant="error" title="Your changes weren't saved" dismissible ondismiss={onDismiss}>
    <p>The server didn't answer. Your edits are still in the form below.</p>
  </Alert>
  <form>
    <Field label="Course title" required>
      {#snippet children(attrs)}<input type="text" name="title" value="Introduction to Computer Science" {...attrs} />{/snippet}
    </Field>
    <p><button type="submit" class="ilw-button">Save</button></p>
  </form>
</Story>

<!--
  A dismissible alert with nothing tabbable after it: the last thing on the page.

  **Why:** the play function dismisses it with focus on the ×: focus moves back to the previous tabbable element, the "Course page" link. With nothing tabbable at all, focus would go to `<main>`.

  **Review:** dismiss it: focus is on the link above.
-->
<Story
  name="Dismiss Last"
  play={async ({ canvas }) => {
    const dismiss = canvas.getByRole('button', { name: 'Dismiss' });
    dismiss.focus();
    await userEvent.click(dismiss);
    await waitFor(() => expect(canvas.queryByRole('status')).toBeNull());
    await expect(canvas.getByRole('link', { name: 'Course page' })).toHaveFocus();
  }}
>
  <h1>Grades posted</h1>
  <p>Midterm grades are on the <a href="#course">Course page</a>.</p>
  <Alert dismissible>
    <p>Regrade requests open tomorrow at noon.</p>
  </Alert>
</Story>

<!--
  A Django `messages` partial: server-rendered alerts, their dismiss buttons `hidden`, wired by `enhanceAlerts()`.

  **Why:** the play function checks `enhanceAlerts` reveals each `.ilw-alert-dismiss[hidden]`, a cancelled `ilw-alert-dismiss` event keeps the alert, dismissing removes it and moves focus to the next alert's button.

  **Review:** two messages over the page, each with an ×. Dismiss them in turn: focus moves to the next ×, then to "Edit profile".
-->
<Story
  name="Server Markup"
  play={async ({ canvasElement, canvas }) => {
    const buttons = canvas.getAllByRole('button', { name: 'Dismiss message' });
    await expect(buttons).toHaveLength(2);
    const [first, second] = buttons;
    // Cancelling the event keeps the alert.
    const keep = (e: Event) => e.preventDefault();
    canvasElement.addEventListener('ilw-alert-dismiss', keep, { once: true });
    first.focus();
    await userEvent.click(first);
    await expect(first).toBeInTheDocument();
    await userEvent.click(first);
    await expect(first).not.toBeInTheDocument();
    await expect(second).toHaveFocus();
    await userEvent.click(second);
    await expect(canvas.queryByRole('status')).toBeNull();
    await expect(canvas.getByRole('link', { name: 'Edit profile' })).toHaveFocus();
  }}
>
  {@render messages()}
</Story>

<!--
  The server markup again, no play function: the fixture for the server-markup test in `tests/e2e/alert.spec.ts`.

  **Why:** the spec dismisses both messages with Enter and checks focus never falls to `<body>`.

  **Review:** as **Server Markup**.
-->
<Story name="Server Markup Fixture">
  {@render messages()}
</Story>

<!--
  The four variants in dark mode.

  **Why:** axe checks the dark colours; the play function checks the card takes dark mode's white-palette surface and the accents switch to their light forms (Industrial lighter 2, Harvest, Orange).

  **Review:** dark cards with light text; blue, green, gold and orange stripes and icons, all clearly visible.
-->
<Story
  name="Dark"
  globals={{ theme: 'dark' }}
  play={async ({ canvasElement }) => {
    const alerts = [...canvasElement.querySelectorAll<HTMLElement>('.ilw-alert')];
    await expect(alerts).toHaveLength(4);
    for (const a of alerts) await expect(getComputedStyle(a).backgroundColor).toBe(DARK);
    const icon = (i: number) => getComputedStyle(alerts[i].querySelector('.ilw-alert-icon')!).color;
    await expect(icon(0)).toBe('rgb(117, 155, 209)');
    await expect(icon(2)).toBe(HARVEST);
    await expect(icon(3)).toBe('rgb(255, 95, 5)');
    await expect(icon(1)).not.toBe(ACCENTS.success);
  }}
>
  {@render variants()}
</Story>

<!--
  The four variants inside blue and orange themed sections.

  **Why:** an alert keeps the white palette whatever the theme around it, so its text, links and buttons keep their contrast; axe checks them. The play function checks each card is white with dark text.

  **Review:** white cards on a blue band and an orange band, looking the same as on the plain page.
-->
<Story
  name="On Themes"
  play={async ({ canvasElement }) => {
    const alerts = [...canvasElement.querySelectorAll<HTMLElement>('.ilw-alert')];
    await expect(alerts).toHaveLength(8);
    for (const a of alerts) {
      await expect(getComputedStyle(a).backgroundColor).toBe(WHITE);
      await expect(getComputedStyle(a).color).toBe('rgb(37, 37, 37)');
    }
  }}
>
  {#each ['blue', 'orange'] as theme (theme)}
    <section class="ilw-theme-{theme}-1" style:background="var(--ilw-color--background)" style:color="var(--ilw-color--text)" style:padding="1rem 1.5rem">
      <h2 style:color="var(--ilw-color--heading)">Announcements ({theme} section)</h2>
      {@render variants()}
    </section>
  {/each}
</Story>

{#snippet variants()}
  <Alert><p>Office hours move to Siebel 0216 next week.</p></Alert>
  <Alert variant="success"><p>Settings saved. <a href="#settings">View settings</a></p></Alert>
  <Alert variant="warning" title="Applications close Friday">
    <p>Your application is missing a course preference.</p>
    {#snippet actions()}<Button href="#review">Review application</Button>{/snippet}
  </Alert>
  <Alert variant="error" dismissible>
    <p>Your changes weren't saved.</p>
    {#snippet actions()}<Button>Try again</Button>{/snippet}
  </Alert>
{/snippet}

<!-- What a Django template renders for two messages; Icon stands in for the pasted Phosphor SVG. -->
{#snippet messages()}
  <h1>Your profile</h1>
  <div class="messages" {@attach (el) => enhanceAlerts(el)}>
    <div class="ilw-alert ilw-alert--success" role="status">
      <Icon icon={CheckCircle} class="ilw-alert-icon" />
      <div class="ilw-alert-body">
        <span class="ilw-visually-hidden">Success:</span>
        <p>Your profile was updated.</p>
      </div>
      <button type="button" class="ilw-alert-dismiss" aria-label="Dismiss message" hidden><Icon icon={X} type="line" /></button>
    </div>
    <div class="ilw-alert ilw-alert--info" role="status">
      <Icon icon={Info} class="ilw-alert-icon" />
      <div class="ilw-alert-body">
        <span class="ilw-visually-hidden">Information:</span>
        <p>Your NetID photo comes from the iCard office.</p>
      </div>
      <button type="button" class="ilw-alert-dismiss" aria-label="Dismiss message" hidden><Icon icon={X} type="line" /></button>
    </div>
  </div>
  <p>Name: Alma Mater. Department: Computer Science.</p>
  <p><a href="#edit">Edit profile</a></p>
{/snippet}
