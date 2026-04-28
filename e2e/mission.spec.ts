import { test, expect } from '@playwright/test';

test.describe('Mission', () => {
  test.use({ storageState: 'playwright/.auth/student.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/student/missions');
  });

  test('TC-07-01: Missions found', async ({ page }) => {
    await expect(page.getByText('Đăng nhập hằng ngày')).toBeVisible();
  });

  test('TC-07-02: Missions not found', async ({ page }) => {
    await expect(page.getByText('Không có nhiệm vụ nào')).toBeVisible();
  });

  test('TC-07-03: Claim rewards', async ({ page }) => {
    const mission = page.getByText('Đăng nhập hằng ngày');
    await expect(mission).toBeVisible();

    const claimBtn = mission.getByRole('button', { name: /Nhận/i });
    await expect(claimBtn).toBeVisible();

    await claimBtn.click();
    await expect(page.getByText(/Chúc mừng bạn đã nhận được/i)).toBeVisible();
  });

});
