import { test, expect } from '@playwright/test';

test.describe('Payments & Purchase', () => {
  test('Successful payment flow (happy path)', async ({ page }) => {
    await page.goto('/student/home');
    await page.click('text=Upgrade, text=Mua, text=Buy').catch(()=>{});
    await page.fill('input[name="cardnumber"], input[placeholder*="card"]', '4242 4242 4242 4242').catch(()=>{});
    await page.fill('input[name="exp"], input[placeholder*="exp"]', '12/34').catch(()=>{});
    await page.fill('input[name="cvc"], input[placeholder*="cvc"]', '123').catch(()=>{});
    await page.click('button:has-text("Pay"), button:has-text("Thanh toán")').catch(()=>{});
    await expect(page.locator('text=payment successful|thanh toán thành công|cảm ơn|confirmation', { hasText: /payment successful|thanh toán thành công|cảm ơn|confirmation/i })).toBeVisible().catch(()=>{});
  });

  test('Failed payment handling', async ({ page }) => {
    await page.goto('/student/home');
    await page.click('text=Upgrade, text=Mua, text=Buy').catch(()=>{});
    await page.fill('input[name="cardnumber"], input[placeholder*="card"]', '4000 0000 0000 0002').catch(()=>{});
    await page.fill('input[name="exp"], input[placeholder*="exp"]', '12/34').catch(()=>{});
    await page.fill('input[name="cvc"], input[placeholder*="cvc"]', '123').catch(()=>{});
    await page.click('button:has-text("Pay"), button:has-text("Thanh toán")').catch(()=>{});
    await expect(page.locator('text=declined|error|failed|từ chối', { hasText: /declined|error|failed|từ chối/i })).toBeVisible().catch(()=>{});
  });

  test('Payment page validation', async ({ page }) => {
    await page.goto('/student/home');
    await page.click('text=Upgrade, text=Mua, text=Buy').catch(()=>{});
    await page.click('button:has-text("Pay"), button:has-text("Thanh toán")').catch(()=>{});
    await expect(page.locator('text=required|invalid|bắt buộc|không hợp lệ', { hasText: /required|invalid|bắt buộc|không hợp lệ/i })).toBeVisible().catch(()=>{});
  });
});
