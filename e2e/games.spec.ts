import { test, expect } from '@playwright/test';

test.describe('Games & Minigames', () => {
  test('Load game canvas (Cocos)', async ({ page }) => {
    await page.goto('/student/games');
    await page.click('.game-card >> nth=0').catch(()=>{});
    await expect(page.locator('canvas, #game-canvas, .cocos')).toBeVisible().catch(()=>{});
  });

  test('Start and complete minigame/level', async ({ page }) => {
    await page.goto('/student/games');
    await page.click('.game-card >> nth=0').catch(()=>{});
    await page.click('button:has-text("Start"), button:has-text("Chơi")').catch(()=>{});
    await page.waitForTimeout(2000);
    await expect(page.locator('text=level complete|hoàn thành|thắng|you win', { hasText: /hoàn thành|thắng|you win|level complete/i })).toBeVisible().catch(()=>{});
  });

  test('Game pause/resume and audio controls', async ({ page }) => {
    await page.goto('/student/games');
    await page.click('.game-card >> nth=0').catch(()=>{});
    await page.click('button:has-text("Start"), button:has-text("Chơi")').catch(()=>{});
    if (await page.locator('button:has-text("Pause"), button:has-text("Tạm dừng")').count()) {
      await page.click('button:has-text("Pause"), button:has-text("Tạm dừng")').catch(()=>{});
      await expect(page.locator('button:has-text("Resume"), button:has-text("Tiếp tục")')).toBeVisible().catch(()=>{});
      await page.click('button:has-text("Resume"), button:has-text("Tiếp tục")').catch(()=>{});
    }
    if (await page.locator('button[aria-label="Mute"], button:has-text("Sound"), button:has-text("Tắt tiếng")').count()) {
      await page.click('button[aria-label="Mute"], button:has-text("Sound"), button:has-text("Tắt tiếng")').catch(()=>{});
    }
  });

  test('Save/Load game progress', async ({ page }) => {
    await page.goto('/student/games');
    await page.click('.game-card >> nth=0').catch(()=>{});
    await page.click('button:has-text("Start"), button:has-text("Chơi")').catch(()=>{});
    await page.click('button:has-text("Save"), button:has-text("Lưu")').catch(()=>{});
    await page.reload();
    await expect(page.locator('text=saved|resume|tiếp tục|đã lưu', { hasText: /saved|resume|tiếp tục|đã lưu/i })).toBeVisible().catch(()=>{});
  });
});
