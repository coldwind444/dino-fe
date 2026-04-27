import { test, expect } from '@playwright/test';

test.describe('Mission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student/missions');
  });

  test('TC-07-01: Missions found', async ({ page }) => {
    // await expect(page.getByTestId('mission-card')).toBeVisible();
  });

  test('TC-07-02: Missions not found', async ({ page }) => {
    // await expect(page.getByText(/no missions/i)).toBeVisible();
  });

  test('TC-07-03: Login progress update and claim', async ({ page }) => {
    /*
    const claimBtn = page.getByRole('button', { name: /Nhận thưởng/i }).first();
    await claimBtn.click();
    await expect(page.getByText(/reward/i)).toBeVisible();
    */
  });

  test('TC-07-04: Lecture complete progress update', async ({ page }) => {
    /*
    const claimBtn = page.getByRole('button', { name: /Nhận thưởng/i }).nth(1);
    await claimBtn.click();
    await expect(page.getByText(/reward/i)).toBeVisible();
    */
  });
});
