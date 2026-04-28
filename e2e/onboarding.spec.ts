import { test, expect } from '@playwright/test';

test.describe('Onboarding', () => {
  test.use({ storageState: 'playwright/.auth/student.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
  });

  test('TC-12-01: Empty name', async ({ page }) => {
    await page.getByPlaceholder('Họ và tên').fill('');
    await page.getByRole('combobox').selectOption({ label: 'Lớp 1' });

    const continueBtn = page.getByRole('button', { name: 'Tiếp tục', exact: true }).first();
    await expect(continueBtn).toBeDisabled();
  });

  test('TC-12-02: No class is selected', async ({ page }) => {
    await page.getByPlaceholder('Họ và tên').fill('Nguyễn Văn A');
    const continueBtn = page.getByRole('button', { name: 'Tiếp tục', exact: true }).first();
    await expect(continueBtn).toBeDisabled();
  });

  test('TC-12-03: Invalid family invite code', async ({ page }) => {
    await page.getByPlaceholder('Họ và tên').fill('Nguyễn Văn A');
    await page.getByRole('combobox').selectOption({ label: 'Lớp 1' });
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).first().click();

    await page.getByText('Ảnh hệ thống:').click();
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).nth(1).click();

    await page.getByPlaceholder('Mã liên kết').fill('WRONGCODE');
    await page.getByText('Hoàn thành').click();

    await expect(page.getByText(/"inviteCode không hợp lệ"/i)).toBeVisible();
  });

  test('TC-12-04: Happy Path (use system avatar)', async ({ page }) => {
    await page.getByPlaceholder('Họ và tên').fill('Nguyễn Hoàng Anh');
    await page.getByRole('combobox').selectOption({ label: 'Lớp 2' });
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).first().click();

    await page.getByText('Ảnh hệ thống:').click();
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).nth(1).click();

    await page.getByPlaceholder('Mã liên kết').fill('INVITE123');
    await page.getByText('Hoàn thành').click();

    await expect(page.getByText(/Hoàn thành hồ sơ thành công/i)).toBeVisible();
    await expect(page).toHaveURL(/\/student\/home/);
  });
});
