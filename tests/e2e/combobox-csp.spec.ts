import { expect, test } from '@playwright/test';

import { openStory } from './focus.ts';

// ta-manager runs a strict CSP: same-origin scripts, no eval. Storybook's
// iframe needs its own inline scripts, so allow those, but no eval and no
// inline style attributes: the combobox must work without Floating UI's
// positioner `style` (styles set through CSSOM, e.g. Zag's live region, are
// allowed by any style-src).
const CSP = "script-src 'self' 'unsafe-inline'; style-src-attr 'none'";

test('the open combobox causes no CSP violations and lays out under the input', async ({ page }) => {
  await page.route('**/iframe.html*', async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': CSP } });
  });
  await page.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { cspViolations: string[] }).cspViolations = seen;
    document.addEventListener('securitypolicyviolation', (e) => {
      // Storybook's own chrome (e.g. the a11y addon's hidden filter <svg>)
      // isn't ours; anything in the story root, or not tied to an element, is.
      const el = e.target instanceof Element ? e.target : null;
      if (el && !el.closest('#storybook-root')) return;
      seen.push(`${e.violatedDirective} ${e.sourceFile}:${e.lineNumber}:${e.columnNumber} on ${el?.outerHTML.slice(0, 200) ?? 'document'}`);
    });
  });

  await openStory(page, 'combobox--fixture');
  const input = page.getByRole('combobox', { name: 'Person' });
  await input.focus();
  await page.keyboard.type('ad');
  await page.keyboard.press('ArrowDown');
  const popup = page.locator('#person-popup');
  await expect(popup).toBeVisible();
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-aadams');

  // Both boxes in one frame: the label's web font can still be shifting layout.
  const { inputBox, popupBox } = await page.evaluate(() => ({
    inputBox: document.getElementById('person-cb')!.getBoundingClientRect().toJSON(),
    popupBox: document.getElementById('person-popup')!.getBoundingClientRect().toJSON(),
  }));
  expect(popupBox.top).toBeGreaterThanOrEqual(inputBox.bottom);
  expect(popupBox.top).toBeLessThan(inputBox.bottom + 10);
  expect(Math.abs(popupBox.left - inputBox.left)).toBeLessThan(1);
  expect(popupBox.width).toBeGreaterThanOrEqual(inputBox.width);

  await page.keyboard.press('Enter');
  await expect(page.getByTestId('selected')).toHaveText('aadams');
  const violations = await page.evaluate(() => (window as unknown as { cspViolations: string[] }).cspViolations);
  expect(violations).toEqual([]);
});
