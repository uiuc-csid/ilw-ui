import { expect, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

test('Enter and Space on a TableSortTh sort and keep focus on its button', async ({ page }) => {
  await openStory(page, 'datatable--fixture');
  const name = page.getByRole('button', { name: 'Name', exact: true });
  const group = page.getByRole('button', { name: 'Group' });
  const nameTh = page.getByRole('columnheader', { name: 'Name', exact: true });
  const groupTh = page.getByRole('columnheader', { name: 'Group' });

  await name.focus();
  await press(page, 'Enter');
  await expect(nameTh).toHaveAttribute('aria-sort', 'descending');
  await expect(name).toBeFocused();
  await press(page, 'Tab');
  await expect(group).toBeFocused();
  await press(page, 'Space');
  await expect(groupTh).toHaveAttribute('aria-sort', 'ascending');
  await expect(nameTh).not.toHaveAttribute('aria-sort');
  await expect(group).toBeFocused();
  await press(page, 'Space');
  await expect(groupTh).toHaveAttribute('aria-sort', 'descending');
  await expect(group).toBeFocused();
});

test('paging by keyboard keeps focus in the pager', async ({ page }) => {
  await openStory(page, 'datatable--fixture-paged');
  const pager = page.getByRole('navigation', { name: 'Pages, bottom' });
  const next = pager.getByRole('button', { name: 'Next page' });
  const currentPage = pager.locator('[aria-current="page"]');

  await next.focus();
  for (let n = 2; n <= 6; n++) {
    await press(page, 'Enter');
    await expect(currentPage).toHaveText(String(n));
    await expect(page.getByRole('navigation', { name: 'Pages, top' }).locator('[aria-current="page"]')).toHaveText(
      String(n),
    );
  }
  // Next is now disabled, so focus moved to the current page's button.
  await expect(next).toBeDisabled();
  await expect(currentPage).toBeFocused();

  const one = pager.getByRole('button', { name: '1', exact: true });
  await one.focus();
  await press(page, 'Space');
  await expect(currentPage).toHaveText('1');
  await expect(one).toBeFocused();
});

test('a sort goes back to page 1 and keeps focus on the heading', async ({ page }) => {
  await openStory(page, 'datatable--fixture-paged');
  const pager = page.getByRole('navigation', { name: 'Pages, top' });
  await pager.getByRole('button', { name: '3', exact: true }).click();
  await expect(pager.locator('[aria-current="page"]')).toHaveText('3');

  const group = page.getByRole('button', { name: 'Group' });
  await group.focus();
  await press(page, 'Enter');
  await expect(pager.locator('[aria-current="page"]')).toHaveText('1');
  await expect(group).toBeFocused();
});
