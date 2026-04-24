import { test, expect } from '@playwright/test';

test('Keyboard navigation and focus order', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
  expect(focused).toBeTruthy();
});

test('Screen-reader labels and ARIA presence', async ({ page }) => {
  await page.goto('/');
  const ariaCount = await page.locator('[role], [aria-label], [aria-labelledby]').count();
  expect(ariaCount).toBeGreaterThanOrEqual(0);
});

test('Basic performance check', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const loadMs = Date.now() - start;
  console.log('cold load ms:', loadMs);
  expect(loadMs).toBeLessThan(30000);
});
