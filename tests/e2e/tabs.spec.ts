import { expect, type Page, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

function tabs(page: Page) {
  const list = page.getByRole('tablist', { name: 'Programs' });
  return {
    tab: (name: string) => list.getByRole('tab', { name, exact: true }),
    panel: page.getByRole('tabpanel'),
  };
}

test('manual activation: arrows, Home and End move focus and wrap; Enter and Space select; Tab reaches the panel', async ({
  page,
}) => {
  await openStory(page, 'tabs--fixture');
  const { tab, panel } = tabs(page);

  // The Page shell's skip link comes first; then the selected tab.
  await press(page, 'Tab');
  await press(page, 'Tab');
  await expect(tab('Degree Programs')).toBeFocused();

  // Focus moves; the selection doesn't.
  await press(page, 'ArrowDown');
  await expect(tab('Non-degree Programs')).toBeFocused();
  await expect(tab('Non-degree Programs')).toHaveAttribute('aria-selected', 'false');
  await expect(panel).toHaveAccessibleName('Degree Programs');
  await press(page, 'ArrowRight');
  await expect(tab('Classroom Experience')).toBeFocused();
  await press(page, 'End');
  await expect(tab('Undergraduate Research')).toBeFocused();
  await press(page, 'ArrowDown');
  await expect(tab('Degree Programs')).toBeFocused();
  await press(page, 'ArrowUp');
  await expect(tab('Undergraduate Research')).toBeFocused();
  await press(page, 'Home');
  await expect(tab('Degree Programs')).toBeFocused();
  await expect(page.getByTestId('changes')).toHaveText('');

  await press(page, 'ArrowDown');
  await press(page, 'ArrowLeft');
  await press(page, 'ArrowLeft');
  await expect(tab('Undergraduate Research')).toBeFocused();
  await press(page, 'ArrowUp');
  await expect(tab('Classroom Experience')).toBeFocused();
  await press(page, 'Enter');
  await expect(tab('Classroom Experience')).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveAccessibleName('Classroom Experience');
  await press(page, 'ArrowDown');
  await press(page, 'Space');
  await expect(tab('Undergraduate Research')).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveAccessibleName('Undergraduate Research');
  await expect(page.getByTestId('changes')).toHaveText('programs-classroom, programs-research');

  // One tab stop for the list: Tab goes to the panel, Shift+Tab back to the selected tab.
  await press(page, 'Tab');
  await expect(panel).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(tab('Undergraduate Research')).toBeFocused();
});

test('automatic activation: each arrow selects the tab it reaches', async ({ page }) => {
  await openStory(page, 'tabs--automatic-fixture');
  const { tab, panel } = tabs(page);

  await press(page, 'Tab');
  await press(page, 'Tab');
  await expect(tab('Degree Programs')).toBeFocused();
  await press(page, 'ArrowRight');
  await expect(tab('Non-degree Programs')).toBeFocused();
  await expect(tab('Non-degree Programs')).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveAccessibleName('Non-degree Programs');
  await press(page, 'ArrowLeft');
  await press(page, 'ArrowLeft');
  await expect(tab('Undergraduate Research')).toBeFocused();
  await expect(panel).toHaveAccessibleName('Undergraduate Research');
  await press(page, 'Home');
  await expect(panel).toHaveAccessibleName('Degree Programs');
  await expect(page.getByTestId('changes')).toHaveText(
    'programs-non-degree, programs-degree, programs-research, programs-degree',
  );

  // Tab leaves the list for the panel's link... after the panel itself.
  await press(page, 'Tab');
  await expect(panel).toBeFocused();
  await press(page, 'Tab');
  await expect(page.getByRole('link', { name: 'Browse all majors' })).toBeFocused();
});

test('a fragment naming a panel selects it on load; with hash, choosing a tab writes the fragment', async ({ page }) => {
  await openStory(page, 'tabs--hash-fixture', '#programs-research');
  const { tab, panel } = tabs(page);
  await expect(tab('Undergraduate Research')).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveAccessibleName('Undergraduate Research');

  await tab('Degree Programs').click();
  await expect(page).toHaveURL(/#programs-degree$/);

  // An in-page link to a panel opens its tab.
  await page.getByRole('link', { name: 'the classroom experience' }).click();
  await expect(tab('Classroom Experience')).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveAccessibleName('Classroom Experience');
  await expect(panel).toBeInViewport();
});
