import { test as setup, expect, Page } from '@playwright/test';

async function login(page: Page, identifier: string, password: string) {
  await page.goto('/auth');
  await expect(page.getByPlaceholder('Email hoặc tên đăng nhập')).toBeEnabled();
  await page.getByPlaceholder('Email hoặc tên đăng nhập').fill(identifier);
  await page.getByPlaceholder('Mật khẩu').fill(password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
}

setup('authenticate as student', async ({ page }) => {
  await login(page, 'student_user123', 'P@ssw0rd2026!');
  await page.waitForURL(/\/onboarding/, { waitUntil: 'commit', timeout: 15000 });
  await page.context().storageState({ path: 'playwright/.auth/student.json' });

  const token = await page.evaluate(() => sessionStorage.getItem('accessToken'));
  const fs = await import('fs');
  fs.writeFileSync('playwright/.auth/student-token.json', JSON.stringify({ token }));
})

setup('authenticate as parent', async ({ page }) => {
  await login(page, 'dinopr@gmail.com', 'P@ssw0rd2026!');
  await page.waitForURL(/\/parent/, { waitUntil: 'commit', timeout: 15000 });
  await page.context().storageState({ path: 'playwright/.auth/parent.json' });
});