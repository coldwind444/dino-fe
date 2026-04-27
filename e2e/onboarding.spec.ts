import { test, expect } from '@playwright/test';

test.describe('Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming login logic is handled here to reach onboarding
    await page.goto('/onboarding');
  });

  test('TC-12-01: Empty name', async ({ page }) => {
    await page.getByPlaceholder('Họ và tên').fill('');
    await page.getByRole('combobox').selectOption({ label: 'Lớp 1' });
    
    // Using exact text matches for buttons since there are multiple translated views
    const continueBtn = page.getByRole('button', { name: 'Tiếp tục', exact: true }).first();
    await expect(continueBtn).toBeDisabled();
  });

  test('TC-12-02: No class is selected', async ({ page }) => {
    await page.getByPlaceholder('Họ và tên').fill('Nguyễn Văn A');
    // Not selecting a class
    const continueBtn = page.getByRole('button', { name: 'Tiếp tục', exact: true }).first();
    
    // Note: The source code currently only checks `disabled={name.length === 0}`
    // If the expected result is for this button to be disabled, this test will catch the bug.
    await expect(continueBtn).toBeDisabled();
  });

  test('TC-12-03: Invalid family invite code', async ({ page }) => {
    await page.getByPlaceholder('Họ và tên').fill('Nguyễn Văn A');
    await page.getByRole('combobox').selectOption({ label: 'Lớp 1' });
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).first().click();
    
    // Avatar section
    await page.getByText('Ảnh hệ thống:').click();
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).nth(1).click();

    // Code section
    await page.getByPlaceholder('Mã liên kết').fill('WRONGCODE');
    await page.getByText('Hoàn thành').click();
    
    // Wait for the generic error toast or general error text
    await expect(page.locator('.go3958317564')).toBeVisible(); 
  });

  test('TC-12-04: Happy Path (use system avatar)', async ({ page }) => {
    await page.getByPlaceholder('Họ và tên').fill('Nguyễn Văn A');
    await page.getByRole('combobox').selectOption({ label: 'Lớp 1' });
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).first().click();
    
    // Avatar section
    await page.getByText('Ảnh hệ thống:').click();
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).nth(1).click();

    // Code section
    await page.getByPlaceholder('Mã liên kết').fill('INVITE123');
    await page.getByText('Hoàn thành').click();
    
    // Expect success toast text
    await expect(page.getByText(/Hoàn thành hồ sơ thành công/i)).toBeVisible();
  });
});
