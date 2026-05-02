import { test, expect } from '@playwright/test';

test.describe('Milestones (Adventure Mode)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/student/lessons');
    const topicCard = page.locator(':has-text("Các phép tính với số có 2 chữ số")').last();
    await topicCard.click();
  });

  test('TC-05-01: Full data load', async ({ page }) => {
    await expect(page.getByText(/Đang ở chế độ phiêu lưu/i)).toBeVisible();
    await expect(page.getByText(/CHỦ ĐỀ/i)).toBeVisible();
    await expect(page.getByText('Cộng trừ số có 2 chữ số (không nhớ)')).toBeVisible();
    await expect(page.getByText('Cộng trừ số có 2 chữ số (có nhớ)')).toBeVisible();
    await expect(page.getByText('Nhân chia số có 2 chữ số')).toBeVisible();
  });

  test('TC-05-02: Missing data load', async ({ page }) => {
    await expect(page.getByText(/Chưa có bài học nào/i)).toBeVisible();
  });

  test('TC-05-03: Switching milestone', async ({ page }) => {
    const nextButton = page.locator('svg[data-icon="arrow-right"]');
    const prevButton = page.locator('svg[data-icon="arrow-left"]');

    // Start with first lecture
    await expect(page.getByText('Cộng trừ số có 2 chữ số (không nhớ)')).toBeVisible();

    // Move to second lecture
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(page.getByText('Cộng trừ số có 2 chữ số (có nhớ)')).toBeVisible();

      // Move to third lecture
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await expect(page.getByText('Nhân chia số có 2 chữ số')).toBeVisible();

        // Move back to second lecture
        if (await prevButton.isVisible()) {
          await prevButton.click();
          await expect(page.getByText('Cộng trừ số có 2 chữ số (có nhớ)')).toBeVisible();
        }
      }

      // Move back to first lecture (if we were on second)
      if (await prevButton.isVisible() && await page.getByText('Cộng trừ số có 2 chữ số (có nhớ)').isVisible()) {
        await prevButton.click();
        await expect(page.getByText('Cộng trừ số có 2 chữ số (không nhớ)')).toBeVisible();
      }
    }
  });

  test('TC-05-04: Recent lecture navigating', async ({ page }) => {
    const studyButton = page.getByText(/Cùng học nào !/i);
    await expect(studyButton).toBeVisible();
    await studyButton.click();

    await expect(page.getByText(/Xem bài học/i)).toBeVisible();
    await expect(page.getByText(/Làm bài tập/i)).toBeVisible();
  });

  test('TC-05-05: Theory viewing', async ({ page }) => {
    await page.getByText(/Cùng học nào !/i).click();
    await page.getByText(/Xem bài học/i).click();

    await expect(page.getByText(/Bài học:/i)).toBeVisible();
    await page.locator('button').filter({ has: page.locator('svg[data-icon="arrow-left"]') }).first().click();
    await expect(page.getByText(/Xem bài học/i)).toBeVisible();
  });

  // test('TC-05-06: Doing exercise', async ({ page }) => {
  //   await page.getByText(/Cùng học nào !/i).click();
  //   await page.getByText(/Làm bài tập/i).click();
  //   await expect(page.locator('svg[data-icon="xmark"]').or(page.getByText(/Thoát/i))).toBeVisible();
  // });
});

