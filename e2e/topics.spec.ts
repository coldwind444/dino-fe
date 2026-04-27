import { test, expect } from '@playwright/test';

test.describe('Topics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('student_user123');
    await page.getByPlaceholder('Mật khẩu').fill('P@ssw0rd2026!');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.goto('/student/lessons');
  });

  test('TC-04-01: Full data load', async ({ page }) => {
    await expect(page.getByText('Tiến trình hiện tại')).toBeVisible();
    await expect(page.getByText('TỔNG THẠCH ANH ĐANG CÓ')).toBeVisible();
    await expect(page.getByText('Số chủ đề đã học:')).toBeVisible();
    await expect(page.getByText('Các phép tính với số có 2 chữ số', { exact: true })).toBeVisible();
    await expect(page.getByText('Hình học cơ bản', { exact: true })).toBeVisible();
    await expect(page.getByText('Dạng toán tìm x', { exact: true })).toBeVisible();
  });

  test('TC-04-02: Missing data load', async ({ page }) => {
    await page.getByRole('button', { name: 'CHỌN LỚP' }).click();
    await page.getByRole('button', { name: 'Lớp 1' }).click();
    await expect(page.getByText('Chưa có dữ liệu')).toBeVisible();
    await expect(page.getByText('Chưa có chủ đề nào')).toBeVisible();
    await expect(page.getByText('Nội dung đang được cập nhật')).toBeVisible();
  });

  test('TC-04-03: Switching grade', async ({ page }) => {
    await page.getByRole('button', { name: 'CHỌN LỚP' }).click();
    await page.getByRole('button', { name: 'Lớp 2' }).click();
    await expect(page.getByText('Chương trình lớp 2')).toBeVisible();
  });

  test('TC-04-04: Recent topic redirect', async ({ page }) => {
    const featuredButton = page.getByRole('button', { name: /Bắt đầu|Tiếp tục/ }).first();
    if (await featuredButton.isVisible()) {
      await featuredButton.click();
      await expect(page).toHaveURL(/\/student\/adventure\/\d+\/.*/);
    }
  });

  test('TC-04-05: Topics redirect', async ({ page }) => {
    const firstTopicCard = page.locator('div.grid > div').first();
    if (await firstTopicCard.isVisible()) {
      await firstTopicCard.click();
      await expect(page).toHaveURL(/\/student\/adventure\/\d+\/.*/);
    }
  });
});
