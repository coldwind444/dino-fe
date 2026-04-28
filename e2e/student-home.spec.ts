import { test, expect } from '@playwright/test';

test.describe('Student Home', () => {
  test.use({ storageState: 'playwright/.auth/student.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/student/home');
  });

  test('TC-03-01: Full data load', async ({ page }) => {
    await expect(page.getByText('Tiếp tục học', { exact: true })).toBeVisible();
    await expect(page.getByText('Ôn lại kiến thức', { exact: true })).toBeVisible();
    await expect(page.getByText('Cộng trừ số có 2 chữ số', { exact: true })).toBeVisible();
    await expect(page.getByText('Các số có 2 chữ số', { exact: true })).toBeVisible();
  });

  test('TC-03-02: Missing data load', async ({ page }) => {
    await expect(page.getByText(/Bạn chưa học chủ đề nào/)).toBeVisible();
    await expect(page.getByText(/Bạn chưa hoàn thành chủ đề nào/)).toBeVisible();
  });

  test('TC-03-03: Switching grade', async ({ page }) => {
    await page.getByRole('button', { name: '2', exact: true }).click();
    await expect(page.getByText(/Lớp 2/)).toBeVisible();
  });

  test('TC-03-04: Recent topic redirect', async ({ page }) => {
    await page.getByText('Tiếp tục học').click();
    await expect(page).toHaveURL(/.*\/student\/adventure/);
  });

  test('TC-03-05: Complete topics redirect', async ({ page }) => {
    await page.getByRole('button', { name: 'refresh' }).first().click();
    await expect(page).toHaveURL(/.*\/student\/adventure/);
  });
});
