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

test.describe('Topics', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await fillLoginForm(page, 'student_user123', 'P@ssw0rd2026!');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
    await page.goto('/student/lessons');
  });

  test('TC-04-01: Full data load', async ({ page }) => {
    await expect(page.getByText('Tiến trình hiện tại')).toBeVisible();
    await expect(page.getByText('TỔNG THẠCH ANH ĐANG CÓ')).toBeVisible();
    await expect(page.getByText('Số chủ đề đã học:')).toBeVisible();
    await expect(page.getByText('Các phép tính với số có 2 chữ số', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Hình học cơ bản', { exact: true })).toBeVisible();
    await expect(page.getByText('Dạng toán tìm x', { exact: true })).toBeVisible();
  });

  test('TC-04-02: Missing data load', async ({ page }) => {
    await page.getByTestId('select-grade-btn').click();
    await page.getByTestId('grade-btn-2').click();
    await expect(page.getByText('Chưa có dữ liệu')).toBeVisible();
    await expect(page.getByText('Chưa có chủ đề nào')).toBeVisible();
    await expect(page.getByText('Nội dung đang được cập nhật')).toBeVisible();
  });

  test('TC-04-03: Switching grade', async ({ page }) => {
    await page.getByTestId('select-grade-btn').click();
    await page.getByTestId('grade-btn-1').click();
    await expect(page.getByText('Chương trình lớp 1')).toBeVisible();
  });

  test('TC-04-04: Recent topic redirect', async ({ page }) => {
    const featuredButton = page.getByTestId('continue-learning-btn');
    if (await featuredButton.isVisible() && await featuredButton.isEnabled()) {
      await featuredButton.click();
      await expect(page).toHaveURL(/\/student\/adventure/);
    }
  });

  test('TC-04-05: Topics redirect', async ({ page }) => {
    const firstTopicCard = page.getByTestId('topic-card-0');
    if (await firstTopicCard.isVisible()) {
      await firstTopicCard.click();
      await expect(page).toHaveURL(/\/student\/adventure/);
    }
  });
});
