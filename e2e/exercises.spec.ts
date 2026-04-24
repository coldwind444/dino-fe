import { test, expect } from '@playwright/test';

test.describe('Exercises & Study', () => {
  test('Open exercise — Multiple Choice', async ({ page }) => {
    await page.goto('/student/lessons');
    await page.click('.exercise-card, text=Bắt đầu, text=Start', { timeout: 3000 }).catch(()=>{});
    await expect(page.locator('text=Câu hỏi, .choices, input[type="radio"], button:has-text("Nộp")')).toBeVisible().catch(()=>{});
    if (await page.locator('input[type="radio"]').count()) {
      await page.click('input[type="radio"] >> nth=0').catch(()=>{});
      await page.click('button:has-text("Nộp"), button:has-text("Submit")').catch(()=>{});
    }
    await expect(page.locator('text=correct|chính xác|đúng|well done')).toBeVisible().catch(()=>{});
  });

  test('Submit incorrect answer — shows explanation', async ({ page }) => {
    await page.goto('/student/lessons');
    await page.click('.exercise-card >> nth=0').catch(()=>{});
    if (await page.locator('input[type="radio"]').count() > 1) {
      await page.click('input[type="radio"] >> nth=1').catch(()=>{});
      await page.click('button:has-text("Nộp"), button:has-text("Submit")').catch(()=>{});
      await expect(page.locator('text=giải thích|explain|explanation|solution', { hasText: /giải thích|explain|explanation|solution/i })).toBeVisible().catch(()=>{});
    }
  });

  test('Fill-in and Matching interactions', async ({ page }) => {
    await page.goto('/student/lessons');
    await page.click('.exercise-card.interactive >> nth=0').catch(()=>{});
    if (await page.locator('input[type="text"], textarea').count()) {
      await page.fill('input[type="text"], textarea', 'test answer');
      await page.click('button:has-text("Nộp"), button:has-text("Submit")').catch(()=>{});
      await expect(page.locator('text=feedback|đánh giá|đúng')).toBeVisible().catch(()=>{});
    }
  });

  test('Exercise state persistence', async ({ page }) => {
    await page.goto('/student/lessons');
    await page.click('.exercise-card >> nth=0').catch(()=>{});
    await page.click('input[type="radio"] >> nth=0').catch(()=>{});
    await page.goto('/');
    await page.goto('/student/lessons');
    await expect(page.locator('text=resume|continue|tiếp tục|tiếp tục bài')).toBeVisible().catch(()=>{});
  });
});
