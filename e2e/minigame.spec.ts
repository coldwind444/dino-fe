import { test, expect } from '@playwright/test';

test.describe('Minigame', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/student/games');
  });

  test('TC-10-01: Correct data display', async ({ page }) => {
    await expect(page.getByText('Math Match')).toBeVisible();
  });

  test('TC-10-02: No data display', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /Tìm kiếm/i });
    await input.fill('NonExistentGameXYZ');
    await expect(page.getByText(/Không có trò chơi nào/i)).toBeVisible();
  });

  test('TC-10-03: Play game', async ({ page }) => {
    const gameCard = page.locator(':has-text("Math Match")').last();
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      gameCard.getByRole('button', { name: 'Chơi ngay' }).click()
    ]);
    await expect(newPage).toHaveURL("https://khoa9894.github.io/build_dacn/");
  });
});
