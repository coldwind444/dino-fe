import { test, expect } from '@playwright/test';

test.describe('Milestones', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student/lessons');
  });

  test('TC-05-01: Full data load', async ({ page }) => {
    // await expect(page.getByText(/milestones/i)).toBeVisible();
  });

  test('TC-05-02: Missing data load', async ({ page }) => {
    // await expect(page.getByText(/no milestones/i)).toBeVisible();
  });

  test('TC-05-03: Switching milestone', async ({ page }) => {
    // Navigate between milestones
  });

  test('TC-05-04: Recent lecture navigating', async ({ page }) => {
    // await page.getByTestId('lecture-card').first().click();
    // await expect(page.getByText(/view theory/i)).toBeVisible();
  });

  test('TC-05-05: Theory viewing', async ({ page }) => {
    // await page.getByTestId('lecture-card').first().click();
    // await page.getByRole('button', { name: /view theory/i }).click();
    // await expect(page.getByText(/theory content/i)).toBeVisible();
  });

  test('TC-05-06: Doing exercise', async ({ page }) => {
    // await page.getByTestId('lecture-card').first().click();
    // await page.getByRole('button', { name: /do exercise/i }).click();
    // await expect(page.locator('iframe')).toBeVisible(); // iframe rendering
    // await page.getByRole('button', { name: /submit/i }).click();
  });
});
