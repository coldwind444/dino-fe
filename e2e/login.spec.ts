import { test, expect, Page } from '@playwright/test';

async function fillLoginForm(page: Page, identifier: string, password: string) {
  const identifierInput = page.getByPlaceholder('Email hoặc tên đăng nhập');
  const passwordInput = page.getByPlaceholder('Mật khẩu');

  await identifierInput.fill(identifier);
  await expect(identifierInput).toHaveValue(identifier); // verify value stuck

  await passwordInput.fill(password);
  await expect(passwordInput).toHaveValue(password); // verify value stuck
}

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/auth');

    const identifierInput = page.getByPlaceholder('Email hoặc tên đăng nhập');
    await identifierInput.waitFor({ state: 'visible' });
    await expect(identifierInput).toBeEnabled(); // ensures React hydration is complete
  });

  test('TC-01-01: Empty identifier', async ({ page }) => {
    await page.getByPlaceholder('Mật khẩu').fill('Random@1');
    await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeDisabled();
  });

  test('TC-01-02: Empty password', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('testIdentifier');
    await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeDisabled();
  });

  test('TC-01-03: Both Empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeDisabled();
  });

  test('TC-01-04: Account not found (Username)', async ({ page }) => {
    await fillLoginForm(page, 'noname', 'Noname@1');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await expect(page.getByText('Sai thông tin đăng nhập')).toBeVisible({ timeout: 10000 });
  });

  test('TC-01-05: Account not found (Email)', async ({ page }) => {
    await fillLoginForm(page, 'unregisteredp@example.com', 'Random@12');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await expect(page.getByText('Sai thông tin đăng nhập')).toBeVisible({ timeout: 10000 });
  });

  test('TC-01-06: Wrong password (Student)', async ({ page }) => {
    await fillLoginForm(page, 'student1', 'Password@1');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await expect(page.getByText('Sai thông tin đăng nhập')).toBeVisible({ timeout: 10000 });
  });

  test('TC-01-07: Wrong password (Parent)', async ({ page }) => {
    await fillLoginForm(page, 'testparent@example.com', 'Password@1');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await expect(page.getByText('Sai thông tin đăng nhập')).toBeVisible({ timeout: 10000 });
  });

  test('TC-01-10: Login with admin account', async ({ page }) => {
    await fillLoginForm(page, 'admin2@dino.com', 'Admin@123');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await expect(page.getByText('Quản trị viên không có quyền truy cập vào trang này')).toBeVisible({ timeout: 10000 });
  });

  test('TC-01-11: Happy path (student)', async ({ page }) => {
    await fillLoginForm(page, 'student1', 'P@ssw0rd2026!');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await page.waitForURL(/\/student|\/onboarding/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student|\/onboarding/);
  });

  test('TC-01-12: Happy path (parent)', async ({ page }) => {
    await fillLoginForm(page, 'testparent@example.com', 'P@ssw0rd2026!');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await page.waitForURL(/parent/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/parent/);
  });
});