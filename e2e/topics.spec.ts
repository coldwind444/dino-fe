import { test, expect } from '@playwright/test';

test.describe('Topics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student/lessons');
  });

  test('TC-04-01: Full data load', async ({ page }) => {
    // await expect(page.getByText(/recent topic/i)).toBeVisible();
  });

  test('TC-04-02: Missing data load', async ({ page }) => {
    // await expect(page.getByText(/no topics/i)).toBeVisible();
  });

  test('TC-04-03: Switching grade', async ({ page }) => {
    // await page.getByRole('button', { name: /grade 2/i }).click();
  });

  test('TC-04-04: Recent topic redirect', async ({ page }) => {
    // await page.getByTestId('recent-topic-card').click();
    // await expect(page).toHaveURL(/.*milestones/);
  });

  test('TC-04-05: Topics redirect', async ({ page }) => {
    // await page.getByTestId('topic-card').first().click();
    // await expect(page).toHaveURL(/.*milestones/);
  });
});
