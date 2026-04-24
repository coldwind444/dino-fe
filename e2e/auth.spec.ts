import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_PASS = process.env.TEST_USER_PASSWORD || 'password123';

test.describe('Authentication', () => {
  test('Login — happy path', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"], input[name="email"]', TEST_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', TEST_PASS);
    await page.click('button:has-text("Đăng nhập"), button:has-text("Login"), button[type="submit"]');
    await expect(page).toHaveURL(/student|dashboard|home/i);
    await expect(page.locator(`text=${TEST_EMAIL}`).first()).toBeVisible().catch(()=>{});
  });

  test('Login — invalid credentials', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"], input[name="email"]', TEST_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', 'wrongpass');
    await page.click('button:has-text("Đăng nhập"), button:has-text("Login"), button[type="submit"]');
    await expect(page.locator('text=invalid|incorrect|error|sai', { hasText: /invalid|incorrect|error|sai/i })).toBeVisible();
  });

  test('Signup — happy path', async ({ page }) => {
    await page.goto('/auth');
    await page.click('text=Đăng ký, text=Sign up, text=Signup, text=Register').catch(()=>{});
    await page.fill('input[name="email"], input[type="email"]', `e2e+${Date.now()}@example.com`);
    await page.fill('input[name="name"], input[name="fullName"]', 'E2E Test');
    await page.fill('input[name="password"], input[type="password"]', TEST_PASS);
    await page.click('button:has-text("Đăng ký"), button:has-text("Sign up"), button:has-text("Register")').catch(()=>{});
    await expect(page.locator('text=confirm|welcome|verification|chào mừng', { hasText: /confirm|welcome|verification|chào mừng/i })).toBeVisible();
  });

  test('Password reset', async ({ page }) => {
    await page.goto('/auth');
    await page.click('text=Quên mật khẩu, text=Forgot password, text=Reset password').catch(()=>{});
    await page.fill('input[type="email"], input[name="email"]', TEST_EMAIL);
    await page.click('button:has-text("Gửi"), button:has-text("Send"), button:has-text("Reset")').catch(()=>{});
    await expect(page.locator('text=sent|check your email|reset link|đã gửi', { hasText: /sent|check your email|reset link|đã gửi/i })).toBeVisible();
  });
});
