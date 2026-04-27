import { test, expect } from '@playwright/test';

test.describe('Reset Password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/reset-password');
  });

  test('TC-11-01: No account found', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('nonexistent_user');
    await page.getByRole('button', { name: 'Gửi mã xác thực' }).click();
    await expect(page.getByText(/Tài khoản không tồn tại/i)).toBeVisible(); // Assuming API error text
  });

  test('TC-11-02: Empty OTP', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('reset_user');
    await page.getByRole('button', { name: 'Gửi mã xác thực' }).click();
    
    // Proceeding to step 2 manually as mock
    await page.getByPlaceholder('Mật khẩu mới').fill('NewPassword@1');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('NewPassword@1');
    const resetBtn = page.getByRole('button', { name: 'Đổi mật khẩu' });
    await expect(resetBtn).toBeDisabled();
  });

  test('TC-11-04: Invalid password', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('reset_user');
    await page.getByRole('button', { name: 'Gửi mã xác thực' }).click();

    await page.getByPlaceholder('Mật khẩu mới').fill('pass');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('pass');
    const resetBtn = page.getByRole('button', { name: 'Đổi mật khẩu' });
    await expect(resetBtn).toBeDisabled();
  });

  test('TC-11-05: Unmatch confirmation', async ({ page }) => {
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('reset_user');
    await page.getByRole('button', { name: 'Gửi mã xác thực' }).click();

    await page.getByPlaceholder('Mật khẩu mới').fill('NewPassword@1');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('DiffPassword@2');
    const resetBtn = page.getByRole('button', { name: 'Đổi mật khẩu' });
    await expect(resetBtn).toBeDisabled();
  });
});
