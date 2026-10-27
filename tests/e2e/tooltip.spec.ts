import { expect, type Locator, type Page, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

const STORY = 'overlays-tooltip--fixture';

function toolbar(page: Page) {
  const exportButton = page.getByRole('button', { name: 'Export' });
  const print = page.getByRole('button', { name: 'Print' });
  return {
    exportButton,
    print,
    exportTip: page.getByRole('tooltip', { name: 'Download the grades as a CSV file' }),
    printTip: page.getByRole('tooltip', { name: 'Print the table on one page per section' }),
  };
}

/** The centre of an element's box. */
async function centre(locator: Locator): Promise<{ x: number; y: number }> {
  const box = (await locator.boundingBox())!;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

test('Tab shows each button’s tooltip and moving on hides it', async ({ page }) => {
  await openStory(page, STORY);
  const { exportButton, print, exportTip, printTip } = toolbar(page);
  await expect(exportTip).toBeHidden();

  // The Page shell's skip link comes first.
  await press(page, 'Tab');
  await press(page, 'Tab');
  await expect(exportButton).toBeFocused();
  await expect(exportTip).toBeVisible();
  await expect(exportButton).toHaveAccessibleDescription('Download the grades as a CSV file');

  await press(page, 'Tab');
  await expect(print).toBeFocused();
  await expect(exportTip).toBeHidden();
  await expect(printTip).toBeVisible();

  await press(page, 'Shift+Tab');
  await expect(exportButton).toBeFocused();
  await expect(printTip).toBeHidden();
  await expect(exportTip).toBeVisible();
});

test('Escape hides the tooltip, focus stays on the trigger, and the next focus shows one again', async ({ page }) => {
  await openStory(page, STORY);
  const { exportButton, print, exportTip, printTip } = toolbar(page);
  await exportButton.focus();
  await expect(exportTip).toBeVisible();

  await press(page, 'Escape');
  await expect(exportTip).toBeHidden();
  await expect(exportButton).toBeFocused();

  await press(page, 'Tab');
  await expect(print).toBeFocused();
  await expect(printTip).toBeVisible();
});

test('hover shows the tooltip, and it stays while the pointer moves onto it (WCAG 1.4.13)', async ({ page }) => {
  await openStory(page, STORY);
  const { exportButton, exportTip } = toolbar(page);
  const start = await centre(exportButton);
  await page.mouse.move(start.x, start.y);
  await expect(exportTip).toBeVisible();

  // Straight up, through the 12px gap, onto the bubble, a few pixels at a time.
  const tip = await centre(exportTip);
  await page.mouse.move(start.x, tip.y, { steps: 12 });
  await expect(exportTip).toBeVisible();
  await expect(page.locator('.ilw-tooltip-bubble:hover')).toHaveCount(1);

  // Off both: hidden.
  await page.mouse.move(start.x, tip.y + 400, { steps: 4 });
  await expect(exportTip).toBeHidden();
});

test('Escape hides a hovered tooltip; hovering again shows it', async ({ page }) => {
  await openStory(page, STORY);
  const { exportButton, exportTip } = toolbar(page);
  const { x, y } = await centre(exportButton);
  await page.mouse.move(x, y);
  await expect(exportTip).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(exportTip).toBeHidden();
  await page.mouse.move(x, y + 400);
  await page.mouse.move(x, y);
  await expect(exportTip).toBeVisible();
});

test.describe('without CSS anchor positioning', () => {
  // Reports position-area and anchor-scope as unsupported, so the script places the bubble.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const supports = CSS.supports.bind(CSS);
      CSS.supports = ((...args: [string, string?]) =>
        /position-area|anchor-scope/.test(args.join(' ')) ? false : supports(...(args as [string]))) as typeof CSS.supports;
    });
  });

  test('the script places each bubble where the CSS would', async ({ page }) => {
    await openStory(page, STORY);
    await page.evaluate(() => document.fonts.ready);
    const { exportButton, exportTip } = toolbar(page);
    await expect(page.locator('.ilw-tooltip--anchored')).toHaveCount(0);

    await exportButton.focus();
    await expect(exportTip).toBeVisible();
    const t = (await exportButton.boundingBox())!;
    const b = (await exportTip.boundingBox())!;
    // The toolbar's top-left: above, 12px off, left edges aligned.
    expect(Math.abs(b.y + b.height - (t.y - 12))).toBeLessThanOrEqual(1);
    expect(Math.abs(b.x - t.x)).toBeLessThanOrEqual(1);

    // The help link's right: beside it, 12px off, middles aligned.
    const link = page.getByRole('link', { name: 'Which scores?' });
    await link.focus();
    const linkTip = page.getByRole('tooltip', { name: /Only quizzes count/ });
    await expect(linkTip).toBeVisible();
    await expect(exportTip).toBeHidden();
    const l = (await link.boundingBox())!;
    const lb = (await linkTip.boundingBox())!;
    expect(Math.abs(lb.x - (l.x + l.width + 12))).toBeLessThanOrEqual(1);
    expect(Math.abs(lb.y + lb.height / 2 - (l.y + l.height / 2))).toBeLessThanOrEqual(1);
  });
});
