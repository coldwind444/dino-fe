import { test as setup, expect } from '@playwright/test';

const studentFile = 'playwright/.auth/student.json';

setup('authenticate as student', async ({ page }) => {
  await page.goto('/auth');
  await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('student_user123');
  await page.getByPlaceholder('Mật khẩu').fill('P@ssw0rd2026!');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  
  // Wait for navigation to student area or home
  await expect(page).toHaveURL(/.*student/);
  
  await page.context().storageState({ path: studentFile });
});

const parentFile = 'playwright/.auth/parent.json';

setup('authenticate as parent', async ({ page }) => {
  await page.goto('/auth');
  await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('dinopr@gmail.com');
  await page.getByPlaceholder('Mật khẩu').fill('P@ssw0rd2026!');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  
  // Wait for navigation to parent area
  await expect(page).toHaveURL(/.*parent/);
  
  await page.context().storageState({ path: parentFile });
});
