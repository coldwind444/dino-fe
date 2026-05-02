import { test, expect, Page, TestInfo } from '@playwright/test';

const BROWSER_INDEX: Record<string, number> = {
  chromium: 1,
  firefox: 2,
  webkit: 3,
  edge: 4,
};

async function fillLoginForm(page: Page, identifier: string, password: string) {
  const identifierInput = page.getByPlaceholder('Email hoặc tên đăng nhập');
  const passwordInput = page.getByPlaceholder('Mật khẩu');

  await identifierInput.click();
  await identifierInput.pressSequentially(identifier, { delay: 50 });
  await expect(identifierInput).toHaveValue(identifier);

  await passwordInput.click();
  await passwordInput.pressSequentially(password, { delay: 50 });
  await expect(passwordInput).toHaveValue(password);
}


test.describe('Mission', () => {
  test.beforeEach(async ({ page }, testInfo: TestInfo) => {
    await page.goto('/auth');
    await fillLoginForm(page, 'student_user123', 'P@ssw0rd2026!');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
    await page.goto('/student/missions');
  });

  test('TC-07-01: Claim rewards', async ({ page }, testInfo: TestInfo) => {
    const projectName = testInfo.project.name.toLowerCase();
    const browserIndex = BROWSER_INDEX[projectName];
    if (!browserIndex) throw new Error(`No index mapped for project: "${projectName}"`);

    await expect(page.getByText(`Đi học đầy đủ ${browserIndex}`)).toBeVisible();

    const claimBtn = page.getByTestId(`claim-btn-${browserIndex}`);

    if (await claimBtn.isVisible() && await claimBtn.isEnabled()) {
      // Click claim btn
      await claimBtn.click();
      await expect(page.getByText(/Chúc mừng bạn đã nhận được/i)).toBeVisible();

      // Close modal
      const closeBtn = page.getByTestId('close-modal-btn');
      await expect(closeBtn).toBeVisible();
      await closeBtn.click();
      await expect(page.getByText(/Chúc mừng bạn đã nhận được/i)).toBeHidden();

      // Check if the mission is moved to the complete tab
      const completeTab = page.getByTestId('complete-tab');
      await expect(completeTab).toBeVisible();
      await completeTab.click();
      await expect(page.getByText(`Đi học đầy đủ ${browserIndex}`)).toBeVisible();
    }
  });

});
