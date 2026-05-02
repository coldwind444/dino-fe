import { test, expect, Page } from '@playwright/test';

async function fillLoginForm(page: Page, identifier: string, password: string) {
  const identifierInput = page.getByPlaceholder('Email hoặc tên đăng nhập');
  const passwordInput = page.getByPlaceholder('Mật khẩu');

  await identifierInput.click();
  await identifierInput.pressSequentially(identifier, { delay: 50 });
  await expect(identifierInput).toHaveValue(identifier);

  await passwordInput.click();
  await passwordInput.pressSequentially(password, { delay: 50 });
  await expect(passwordInput).toHaveValue(password);
}

test.describe('Student Home', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await fillLoginForm(page, 'student_user123', 'P@ssw0rd2026!');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/home/);
    await page.getByTestId('close-topic-recommend-btn').click();
  });

  test('TC-03-01: Full data load', async ({ page }) => {
    await expect(page.getByTestId('recent-topic-title').first()).toHaveText('Các phép tính với số có 2 chữ số');
    await expect(page.getByTestId('complete-topic-title-0')).toHaveText('Các phép tính với số có 2 chữ số');
  });

  test('TC-03-02: Missing data load', async ({ page }) => {
    await page.getByTestId('grade-btn-2').click();
    await expect(page.getByText(/Bạn chưa học chủ đề nào/)).toBeVisible();
    await expect(page.getByText(/Bạn chưa hoàn thành chủ đề nào/)).toBeVisible();
  });

  test('TC-03-03: Switching grade', async ({ page }) => {
    await page.getByTestId('grade-btn-1').click();
    await expect(page.getByTestId('recent-topic-title').first()).toHaveText('Các phép tính với số có 2 chữ số');
    await expect(page.getByTestId('complete-topic-title-0')).toHaveText('Các phép tính với số có 2 chữ số');
  });

  test('TC-03-04: Recent topic redirect', async ({ page }) => {
    await page.getByTestId('continue-learning-btn').click();
    await page.waitForURL(/\/student\/adventure/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/adventure/);
  });

  test('TC-03-05: Complete topics redirect', async ({ page }) => {
    await page.getByTestId('refresh-btn-0').first().click();
    await page.waitForURL(/\/student\/adventure/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/adventure/);
  });
});
