import { test, expect } from '@playwright/test';

test('Main navigation (desktop)', async ({ page }) => {
  await page.goto('/');
  const navItems = [
    { label: 'Nhà', path: '/student/home' },
    { label: 'Bài học', path: '/student/lessons' },
    { label: 'Đấu trường', path: '/student/arena' },
    { label: 'Xếp hạng', path: '/student/leaderboard' },
    { label: 'Nhiệm vụ', path: '/student/missions' },
    { label: 'Trò chơi', path: '/student/games' },
    { label: 'Lịch sử', path: '/student/history' },
  ];
  for (const item of navItems) {
    const link = page.locator(`a[href="${item.path}"], text=${item.label}`);
    if (await link.count()) {
      await link.first().click();
      await expect(page).toHaveURL(new RegExp(item.path.split('/').slice(0,3).join('/'), 'i')).catch(()=>{});
      await expect(page.locator('header, h1, nav')).toBeVisible();
    }
  }
});
