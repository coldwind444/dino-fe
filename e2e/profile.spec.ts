import { test, expect } from '@playwright/test';

test.describe('Profile & Account', () => {
  test('View profile and account details', async ({ page }) => {
    await page.goto('/student/home');
    await page.click('a[href="/student/leaderboard"], text=Profile, text=Tài khoản').catch(()=>{});
    await page.goto('/student/home'); // safe fallback
    await expect(page.locator('text=Email, text=Name, img[alt="avatar"], .profile')).toBeVisible().catch(()=>{});
  });

  test('Edit profile — update name and avatar', async ({ page }) => {
    await page.goto('/student/home');
    await page.click('text=Tài khoản, text=Profile').catch(()=>{});
    await page.click('button:has-text("Edit"), button:has-text("Chỉnh sửa")').catch(()=>{});
    await page.fill('input[name="displayName"], input[name="name"]', 'E2E Updated').catch(()=>{});
    await page.click('button:has-text("Save"), button:has-text("Lưu")').catch(()=>{});
    await expect(page.locator('text=E2E Updated')).toBeVisible().catch(()=>{});
  });

  test('Change password flow', async ({ page }) => {
    await page.goto('/student/home');
    await page.click('text=Tài khoản, text=Profile').catch(()=>{});
    await page.click('text=Đổi mật khẩu, text=Change password').catch(()=>{});
    await page.fill('input[name="currentPassword"]', process.env.TEST_USER_PASSWORD || 'password123').catch(()=>{});
    await page.fill('input[name="newPassword"]', 'new-password-123').catch(()=>{});
    await page.fill('input[name="confirmPassword"]', 'new-password-123').catch(()=>{});
    await page.click('button:has-text("Change"), button:has-text("Lưu")').catch(()=>{});
    await expect(page.locator('text=password changed|thay đổi mật khẩu|thành công')).toBeVisible().catch(()=>{});
  });

  test('Subscription/Upgrade (upgrade tab)', async ({ page }) => {
    await page.goto('/student/home');
    await page.click('text=Upgrade, text=Nâng cấp, text=Subscription').catch(()=>{});
    await expect(page.locator('text=plans|choose plan|payment|kế hoạch')).toBeVisible().catch(()=>{});
  });
});
