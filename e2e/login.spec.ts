import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('TC-01-01: Empty identifier', async ({ page }) => {
    await page.getByPlaceholder('Mật khẩu').fill('Random@1');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeDisabled();
  });

  test('TC-01-02: Empty password', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('testIdentifier');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeDisabled();
  });

  test('TC-01-03: Both Empty', async ({ page }) => {
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeDisabled();
  });

  test('TC-01-04: Account not found (Username)', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('noname');
    await page.getByPlaceholder('Mật khẩu').fill('Noname@1');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page.getByText('Tài khoản không tồn tại')).toBeVisible();
  });

  test('TC-01-05: Account not found (Email)', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('unregisteredp@example.com');
    await page.getByPlaceholder('Mật khẩu').fill('Random@12');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page.getByText('Tài khoản không tồn tại')).toBeVisible();
  });

  test('TC-01-06: Wrong password (Student)', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('student1');
    await page.getByPlaceholder('Mật khẩu').fill('Password@1');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page.getByText('Sai mật khẩu')).toBeVisible();
  });

  test('TC-01-07: Wrong password (Parent)', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('testparent@example.com');
    await page.getByPlaceholder('Mật khẩu').fill('Password@1');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page.getByText('Sai mật khẩu')).toBeVisible();
  });

  test('TC-01-10: Login with admin account', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('admin@dino.com');
    await page.getByPlaceholder('Mật khẩu').fill('admin@123');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page.getByText('Quản trị viên không có quyền truy cập vào trang này')).toBeVisible();
  });

  test('TC-01-11: Happy path (student)', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('student1');
    await page.getByPlaceholder('Mật khẩu').fill('Student1@rcv');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page).toHaveURL(/.*student/);
  });

  test('TC-01-12: Happy path (parent)', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('testparent@example.com');
    await page.getByPlaceholder('Mật khẩu').fill('Parent1@');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page).toHaveURL(/.*parent/);
  });
});
