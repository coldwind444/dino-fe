import { test, expect, Page } from '@playwright/test';

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

test.describe('Minigame', () => {
  test.describe.configure({ mode: "serial" })

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await fillLoginForm(page, 'student_user123', 'P@ssw0rd2026!');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/home/);
    await page.goto('/student/games');
    await page.waitForURL(/\/student\/games/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/games/);
  });

  test('TC-10-01: Correct data display', async ({ page }) => {
    await expect(page.getByText('Math Match').first()).toBeVisible();
  });

  test('TC-10-02: No data display', async ({ page }) => {
    const input = page.getByTestId('search-input');
    await expect(input).toBeVisible();
    await input.fill('NonExistentGameXYZ');
    await expect(page.getByText(/Không có trò chơi nào/i)).toBeVisible();
  });

  test('TC-10-03: Play game', async ({ page }) => {
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.getByTestId('play-btn-0').click()
    ]);
    await expect(newPage).toHaveURL("https://khoa9894.github.io/build_dacn/");
  });
});
