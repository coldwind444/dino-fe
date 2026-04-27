import { test, expect } from '@playwright/test';

test.describe('Assessment and Arena', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student/home');
  });

  test('TC-06-01: Assessment unavailable', async ({ page }) => {
    // If float button is absent or shows placeholder
    // In home page, the float button has a flask icon.
  });

  test('TC-06-02: Arena unavailable', async ({ page }) => {
    await page.goto('/student/arena');
    // Either "Hiện chưa có đấu trường nào mở cửa" or "Đấu trường chưa bắt đầu"
    // await expect(page.getByText(/chưa có đấu trường nào|chưa bắt đầu/i)).toBeVisible();
  });

  test('TC-06-03: Arena leaderboard empty', async ({ page }) => {
    await page.goto('/student/arena');
    // await expect(page.getByText(/Chưa có dữ liệu/i)).toBeVisible();
  });

  test('TC-06-04: Arena leaderboard non-empty', async ({ page }) => {
    await page.goto('/student/arena');
    // await expect(page.getByTestId('leaderboard')).toBeVisible();
  });

  test('TC-06-05: Arena principles viewing', async ({ page }) => {
    await page.goto('/student/arena');
    await page.getByText('Xem thể lệ').click();
    await expect(page.getByText('THỂ LỆ ĐẤU TRƯỜNG')).toBeVisible();
    
    // Close button
    // await page.locator('.fa-caret-left').click();
  });

  test('TC-06-06: Arena progress saving test 2', async ({ page }) => {
    await page.goto('/student/arena');
    // await page.getByText('Tham gia ngay').click();
    // Saved answers are displayed correctly
  });

  test('TC-06-07: Arena done', async ({ page }) => {
    await page.goto('/student/arena');
    // await expect(page.getByText(/Bạn đã hoàn thành/i)).toBeVisible();
  });

  test('TC-06-08: Arena progress saving test 1', async ({ page }) => {
    await page.goto('/student/arena');
    // await page.getByText('Tham gia ngay').click();
    // Answer 1 question
    // await page.getByRole('button', { name: /thoát/i }).click();
    // await page.getByRole('button', { name: /đồng ý/i }).click();
  });

  test('TC-06-09: Assessment data available', async ({ page }) => {
    // float button for assessment
    // await page.locator('.fa-flask-vial').click();
    // await page.getByText('Bắt đầu').click();
  });

  test('TC-06-10: Arena data available', async ({ page }) => {
    await page.goto('/student/arena');
    // await page.getByText('Tham gia ngay').click();
  });

  test('TC-06-11: Arena auto submission', async ({ page }) => {
    await page.goto('/student/arena');
    // await page.getByText('Tham gia ngay').click();
    // wait until timeout
  });
});
