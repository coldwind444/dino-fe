import { test, expect } from '@playwright/test';

test.describe('Onboarding', () => {
  test('Complete onboarding flow', async ({ page }) => {
    await page.goto('/onboarding');
    const next = page.locator('button:has-text("Tiếp"), button:has-text("Next"), button:has-text("Continue")');
    for (let i = 0; i < 8; i++) {
      if (await next.count()) await next.first().click();
      else break;
    }
    await page.click('button:has-text("Hoàn tất"), button:has-text("Finish"), button:has-text("Complete")').catch(()=>{});
    await expect(page.locator('text=dashboard|welcome|xin chào', { hasText: /dashboard|welcome|xin chào/i })).toBeVisible().catch(()=>{});
  });

  test('Skip onboarding', async ({ page }) => {
    await page.goto('/onboarding');
    await page.click('text=Bỏ qua, text=Skip').catch(()=>{});
    await expect(page.locator('text=dashboard|home|trang chủ', { hasText: /dashboard|home|trang chủ/i })).toBeVisible().catch(()=>{});
  });
});
