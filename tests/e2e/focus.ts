import { expect, type Page } from '@playwright/test';

/** Opens a story from the static Storybook build. */
export async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.locator('#storybook-root > *').first().waitFor();
}

/** Fails if focus has fallen to `<body>` (or nowhere). */
export async function expectFocusNotOnBody(page: Page): Promise<void> {
  const tag = await page.evaluate(() => document.activeElement?.tagName ?? null);
  expect(tag, 'focus fell to <body>').not.toBe('BODY');
  expect(tag, 'nothing is focused').not.toBeNull();
}

/**
 * Presses `key` with the real keyboard, then checks focus is still somewhere.
 * macOS WebKit, like Safari's default setting, skips buttons on Tab; Option-Tab
 * is how those users reach them, so send that.
 */
export async function press(page: Page, key: string): Promise<void> {
  const macWebKit = process.platform === 'darwin' && page.context().browser()?.browserType().name() === 'webkit';
  await page.keyboard.press(macWebKit ? key.replace(/^(Shift\+)?Tab$/, 'Alt+$&') : key);
  await expectFocusNotOnBody(page);
}

/**
 * Delays every animation frame by `ms`, before the page loads. Zag defers its
 * focus calls by a frame; on a slow CI runner a key can land inside that frame,
 * so this makes the race deterministic.
 */
export async function slowFrames(page: Page, ms = 150): Promise<void> {
  await page.addInitScript((delay) => {
    const own = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => own(() => setTimeout(() => own(cb), delay));
  }, ms);
}

/** Resolves once every animation frame callback queued before it has run. */
export async function framesSettled(page: Page): Promise<void> {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
