import { expect, type Page, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

const STORY = 'overlays-popover--fixture';

function filters(page: Page) {
  return {
    button: page.getByRole('button', { name: 'Filters' }),
    panel: page.locator('#staff-filters'),
    state: page.getByTestId('filters-state'),
  };
}

/** Opens the filters panel from the keyboard: Tab past the skip link to Filters, then Enter. */
async function openFilters(page: Page) {
  const { button, panel } = filters(page);
  await press(page, 'Tab');
  await press(page, 'Tab');
  await expect(button).toBeFocused();
  await press(page, 'Enter');
  await expect(panel).toBeVisible();
}

test('Enter opens the panel with focus on the button, Tab enters it, Escape closes it and returns focus', async ({
  page,
}) => {
  await openStory(page, STORY);
  const { button, panel, state } = filters(page);
  await expect(panel).toBeHidden();

  await openFilters(page);
  await expect(button).toBeFocused();
  await expect(state).toHaveText('open');

  // The panel is next in the Tab order after its button.
  await press(page, 'Tab');
  await expect(page.getByLabel('Teaching assistants')).toBeFocused();
  await press(page, 'Tab');
  await expect(page.getByLabel('Graders')).toBeFocused();
  await press(page, 'Space');
  await expect(page.getByLabel('Graders')).not.toBeChecked();
  await expect(panel).toBeVisible();

  await press(page, 'Escape');
  await expect(panel).toBeHidden();
  await expect(button).toBeFocused();
  await expect(state).toHaveText('closed');
});

test('Done closes the panel and returns focus to the button', async ({ page }) => {
  await openStory(page, STORY);
  const { button, panel } = filters(page);
  await openFilters(page);
  for (let i = 0; i < 4; i++) await press(page, 'Tab');
  await expect(page.getByRole('button', { name: 'Done' })).toBeFocused();

  await press(page, 'Enter');
  await expect(panel).toBeHidden();
  await expect(button).toBeFocused();
});

test('Tab past the panel’s end closes it, and focus moves on to the next field', async ({ page }) => {
  await openStory(page, STORY);
  const { panel, state } = filters(page);
  await openFilters(page);
  for (let i = 0; i < 4; i++) await press(page, 'Tab');
  await expect(page.getByRole('button', { name: 'Done' })).toBeFocused();

  await press(page, 'Tab');
  await expect(page.getByLabel('Office hours per week')).toBeFocused();
  await expect(panel).toBeHidden();
  await expect(state).toHaveText('closed');
});

test('Shift+Tab from the button closes the panel', async ({ page }) => {
  await openStory(page, STORY);
  const { panel } = filters(page);
  await openFilters(page);

  await press(page, 'Shift+Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await expect(panel).toBeHidden();
});

test('a click outside closes the panel', async ({ page }) => {
  await openStory(page, STORY);
  const { button, panel, state } = filters(page);
  await button.click();
  await expect(panel).toBeVisible();
  await page.getByRole('heading', { level: 1 }).click();
  await expect(panel).toBeHidden();
  await expect(state).toHaveText('closed');
});

test.describe('without CSS anchor positioning', () => {
  // Reports position-area and anchor-scope as unsupported, so the script places the panel.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const supports = CSS.supports.bind(CSS);
      CSS.supports = ((...args: [string, string?]) =>
        /position-area|anchor-scope/.test(args.join(' ')) ? false : supports(...(args as [string]))) as typeof CSS.supports;
    });
  });

  test('the script places the panel where the CSS would', async ({ page }) => {
    await openStory(page, STORY);
    await page.evaluate(() => document.fonts.ready);
    const { button, panel } = filters(page);
    await button.click();
    await expect(panel).toBeVisible();
    // Placed inline by the script, not by popover.css.
    await expect.poll(() => panel.evaluate((el) => el.style.position)).toBe('fixed');
    const t = (await button.boundingBox())!;
    const b = (await panel.boundingBox())!;
    // bottom-left: under the button, 4px off, left edges aligned.
    expect(Math.abs(b.y - (t.y + t.height + 4))).toBeLessThanOrEqual(1);
    expect(Math.abs(b.x - t.x)).toBeLessThanOrEqual(1);
  });
});
