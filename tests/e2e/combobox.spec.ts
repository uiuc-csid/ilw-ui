import { expect, type Page, test } from '@playwright/test';

import { expectFocusNotOnBody, framesSettled, openStory, press, slowFrames } from './focus.ts';

function parts(page: Page) {
  return {
    before: page.getByRole('textbox', { name: 'Before' }),
    input: page.getByRole('combobox', { name: 'Person' }),
    after: page.getByRole('textbox', { name: 'After' }),
    selected: page.getByTestId('selected'),
  };
}

async function type(page: Page, text: string) {
  await page.keyboard.type(text);
  await expectFocusNotOnBody(page);
}

test('typing opens at two characters; arrows move and wrap; Enter commits', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { before, input, selected } = parts(page);

  await before.focus();
  await press(page, 'Tab');
  await expect(input).toBeFocused();
  await type(page, 'a');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await type(page, 'd');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('option')).toHaveText(['Avery Adams', 'Drew Adams']);
  await expect(input).not.toHaveAttribute('aria-activedescendant');

  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-aadams');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-dadams');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-aadams');
  await press(page, 'ArrowUp');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-dadams');

  await press(page, 'Enter');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toHaveValue('Drew Adams');
  await expect(selected).toHaveText('dadams');
  await expect(input).toBeFocused();
});

test('Alt+ArrowDown opens without highlighting; Escape closes and keeps focus', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { input } = parts(page);

  await input.focus();
  await press(page, 'Alt+ArrowDown');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('option')).toHaveCount(4);
  await expect(input).not.toHaveAttribute('aria-activedescendant');

  // ta-manager's legacy combobox dropped focus to <body> here.
  await press(page, 'Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#person-popup')).toBeHidden();
  await expect(input).toBeFocused();
});

test('Tab commits a unique match and moves on; Shift+Tab comes back', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { before, input, after, selected } = parts(page);

  await input.focus();
  await type(page, 'blake');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-bbrown');
  await press(page, 'Tab');
  await expect(after).toBeFocused();
  await expect(selected).toHaveText('bbrown');
  await expect(input).toHaveValue('Blake Brown');
  await expect(input).toHaveAttribute('aria-expanded', 'false');

  await press(page, 'Shift+Tab');
  await expect(input).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(before).toBeFocused();
});

test('Tab before Zag\'s deferred focus lands still moves on', async ({ page }) => {
  // Opening the list queues a focus on the input for the next frame; a Tab
  // inside that frame was pulled back (flaked in CI).
  await slowFrames(page);
  await openStory(page, 'combobox--fixture');
  const { input, after, selected } = parts(page);

  await input.focus();
  await type(page, 'blake');
  await press(page, 'Tab');
  await expect(selected).toHaveText('bbrown');
  await framesSettled(page);
  await expectFocusNotOnBody(page);
  await expect(after).toBeFocused();
});

test('unmatched text stays on Tab and commits nothing', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { input, after, selected } = parts(page);

  await input.focus();
  await type(page, 'adams');
  await press(page, 'Tab');
  await expect(after).toBeFocused();
  await expect(input).toHaveValue('adams');
  await expect(selected).toHaveText('');
  await expect(page.getByTestId('changes')).toHaveText('0');
});

test('ArrowDown on a selected value opens the whole list at the selection', async ({ page }) => {
  await openStory(page, 'combobox--fixture-preselected');
  const { input, selected } = parts(page);

  await expect(input).toHaveValue('Casey Clark');
  await input.focus();
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('option')).toHaveCount(4);
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-cclark');
  await press(page, 'ArrowDown');
  await press(page, 'Enter');
  await expect(selected).toHaveText('dadams');
  await expect(input).toHaveValue('Drew Adams');
});

test('keys typed in the frame after ArrowDown keep their lone-match highlight', async ({ page }) => {
  // ArrowDown highlights the selection; Zag did it a frame later, after the
  // next keys had filtered the list, and the hidden selection replaced the
  // lone match (flaked in CI on WebKit). The long delay holds that frame
  // past every key below.
  await slowFrames(page, 1000);
  await openStory(page, 'combobox--fixture');
  const { input, selected } = parts(page);

  await input.focus();
  await type(page, 'drew');
  await press(page, 'Enter');
  await expect(selected).toHaveText('dadams');
  await press(page, 'ArrowDown');
  await press(page, 'Escape');
  await press(page, 'ControlOrMeta+a');
  await press(page, 'Backspace');
  await type(page, 'blake');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-bbrown');
  await framesSettled(page);
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-bbrown');
  await press(page, 'Enter');
  await expect(selected).toHaveText('bbrown');
});

test('Enter with nothing highlighted keeps the list open and does not submit', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { input } = parts(page);
  const submits = page.getByTestId('submits');

  await input.focus();
  await type(page, 'ad');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(input).not.toHaveAttribute('aria-activedescendant');
  await press(page, 'Enter');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(input).toHaveValue('ad');
  await expect(submits).toHaveText('0');

  // Closed, Enter is the input's own: it submits the form.
  await press(page, 'Escape');
  await press(page, 'Enter');
  await expect(submits).toHaveText('1');
});

test('opening and closing leave the caret where it was', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { input } = parts(page);
  const caret = () => input.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd]);

  await input.focus();
  await type(page, 'adams');
  await press(page, 'Escape');
  for (let i = 0; i < 4; i++) await press(page, 'ArrowLeft');
  await expect.poll(caret).toEqual([1, 1]);
  await press(page, 'Alt+ArrowDown');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(caret).toEqual([1, 1]);
  await press(page, 'Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(caret).toEqual([1, 1]);
});

test('a click outside right after opening closes the list', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { input } = parts(page);

  await input.focus();
  await type(page, 'ad');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  // Blank page area, in the same frame as the open: zag's outside-click
  // handling raced the blur and could leave the list open.
  await page.mouse.click(700, 5);
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#person-popup')).toBeHidden();
});

test('typing mid-text keeps the caret in place', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { input } = parts(page);
  const caret = () => input.evaluate((el: HTMLInputElement) => el.selectionStart);

  await input.focus();
  // Storybook loads @testing-library/user-event, which, on focus, wraps the
  // input's value setter and moves the caret to the end on every write. Pages
  // using ilw-ui don't load it, so undo it here.
  await input.evaluate((el) => {
    for (const key of Object.getOwnPropertyNames(el)) {
      if (key !== 'setSelectionRange' && !key.startsWith('__')) delete (el as unknown as Record<string, unknown>)[key];
    }
  });
  await type(page, 'ams');
  await press(page, 'Escape');
  for (let i = 0; i < 3; i++) await press(page, 'ArrowLeft');
  // Each keystroke reopens the list; the caret must stay after it.
  await type(page, 'ad');
  await expect(input).toHaveValue('adams');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(caret).toBe(2);
});

test('no live region is left on <body> while the list is in use', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { input } = parts(page);

  await input.focus();
  await type(page, 'ad');
  await press(page, 'ArrowDown');
  await press(page, 'ArrowDown');
  // Zag announces through it on macOS/iOS only; elsewhere there is none at all.
  await expect(page.locator('body > [data-live-announcer]')).toHaveCount(0);
});

test('async: typing searches after a pause; Enter commits; Tab moves on', async ({ page }) => {
  await openStory(page, 'combobox--fixture-async');
  const { input, after, selected } = parts(page);

  await input.focus();
  await type(page, 'ad');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('option')).toHaveText(['Avery Adams', 'Drew Adams']);
  await press(page, 'ArrowDown');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-dadams');
  await press(page, 'Enter');
  await expect(selected).toHaveText('dadams');
  await expect(input).toHaveValue('Drew Adams');
  await expect(page.locator('input[type="hidden"][name="person"]')).toHaveValue('dadams');
  await press(page, 'Tab');
  await expect(after).toBeFocused();
  await expect(selected).toHaveText('dadams');
});

test('async: "Loading…" until answered; a newer search replaces the older one', async ({ page }) => {
  await openStory(page, 'combobox--fixture-async-manual');
  const { input, selected } = parts(page);
  const status = page.locator('.combobox > [role="status"]');
  // Answer from the story's test-server panel without moving focus.
  const respond = (i: number) => page.getByTestId(`respond-${i}`).evaluate((b: HTMLButtonElement) => b.click());

  await input.focus();
  await type(page, 'ad');
  await expect(page.getByRole('option', { name: 'Loading…' })).toBeVisible();
  await expect(status).toHaveText('Loading…');
  await expect(page.locator('.stub-server q')).toHaveText(['ad']);
  await type(page, 'a');
  // The `ad` search was aborted; only `ada` waits.
  await expect(page.locator('.stub-server q')).toHaveText(['ada']);
  await respond(0);
  await expect(page.getByRole('option')).toHaveText(['Avery Adams', 'Drew Adams']);
  await expect(status).toHaveText('2 results');
  await expect(input).toBeFocused();

  // ArrowDown searches at once, and highlights the first result when it lands.
  await press(page, 'Escape');
  await press(page, 'ArrowDown');
  await expect(page.locator('.stub-server q')).toHaveText(['ada']);
  await respond(0);
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-aadams');
  await press(page, 'Enter');
  await expect(selected).toHaveText('aadams');
});
