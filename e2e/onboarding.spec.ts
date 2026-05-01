import { test, expect, Page } from '@playwright/test';

test.describe('Onboarding', () => {
  test.use({ storageState: 'playwright/.auth/student.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.getByPlaceholder('Họ và tên')).toBeEnabled();
  });

  async function fillStep1(page: Page, name: string, grade: string) {
    const nameInput = page.getByPlaceholder('Họ và tên');
    await nameInput.fill(name);
    await expect(nameInput).toHaveValue(name);
    await page.getByRole('combobox').selectOption({ label: grade });

    const continueBtn = page.getByTestId('continue-btn1');
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    // Wait for step 2 to be visible before returning
    await expect(page.getByTestId('system-avatar-radio')).toBeVisible();
  }

  async function selectSystemAvatar(page: Page) {
    await page.getByTestId('system-avatar-radio').click();

    const continueBtn = page.getByTestId('continue-btn2');
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    // Wait for step 3 to be visible before returning
    await expect(page.getByPlaceholder('Mã liên kết')).toBeVisible();
  }

  test('TC-12-01: Empty name', async ({ page }) => {
    await page.getByPlaceholder('Họ và tên').fill('');
    await page.getByRole('combobox').selectOption({ label: 'Lớp 1' });
    await expect(page.getByTestId('continue-btn1')).toBeDisabled();
  });

  test('TC-12-02: No class is selected', async ({ page }) => {
    const nameInput = page.getByPlaceholder('Họ và tên');
    await nameInput.fill('Nguyễn Văn A');
    await expect(nameInput).toHaveValue('Nguyễn Văn A');
    await expect(page.getByTestId('continue-btn1')).toBeDisabled();
  });

  test('TC-12-03: Invalid family invite code', async ({ page }) => {
    await fillStep1(page, 'Nguyễn Văn A', 'Lớp 1');
    await selectSystemAvatar(page);

    const inviteInput = page.getByPlaceholder('Mã liên kết');
    await inviteInput.fill('WRONGCODE');
    await expect(inviteInput).toHaveValue('WRONGCODE');

    const finishBtn = page.getByTestId('complete-btn');
    await expect(finishBtn).toBeEnabled();
    await finishBtn.click();

    await expect(page.getByText(/inviteCode không hợp lệ/)).toBeVisible({ timeout: 10000 });
  });

  test('TC-12-04: Empty family invite code', async ({ page }) => {
    await fillStep1(page, 'Nguyễn Văn A', 'Lớp 1');
    await selectSystemAvatar(page);

    const inviteInput = page.getByPlaceholder('Mã liên kết');
    await inviteInput.fill('');
    await expect(inviteInput).toHaveValue('');

    const finishBtn = page.getByTestId('complete-btn');
    await expect(finishBtn).toBeDisabled();
  });

  test('TC-12-05: Happy Path (use system avatar)', async ({ page }) => {
    await fillStep1(page, 'Nguyễn Hoàng Anh', 'Lớp 1');
    await selectSystemAvatar(page);

    const inviteInput = page.getByPlaceholder('Mã liên kết');
    await inviteInput.fill('3TAD4C');
    await expect(inviteInput).toHaveValue('3TAD4C');

    const finishBtn = page.getByTestId('complete-btn');
    await expect(finishBtn).toBeEnabled();
    await finishBtn.click();

    await expect(page.getByText(/Hoàn thành hồ sơ thành công/)).toBeVisible({ timeout: 10000 });
    await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/home/);
  });
});