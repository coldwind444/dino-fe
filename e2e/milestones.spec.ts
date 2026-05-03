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


async function navigateToAdventure(page: Page, topicCardIndex: number) {
  const topicCard = page.getByTestId(`topic-card-${topicCardIndex}`);
  await expect(topicCard).toBeVisible();
  await topicCard.click();

  await page.waitForURL(/\/student\/adventure/, { waitUntil: 'commit', timeout: 15000 });
  await expect(page).toHaveURL(/\/student\/adventure/);

  await expect(page.getByText(/Đang ở chế độ phiêu lưu/i)).toBeVisible({ timeout: 20000 });
}

test.describe('Milestones (Adventure Mode)', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await fillLoginForm(page, 'student_user123', 'P@ssw0rd2026!');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/home/);

    await page.goto('/student/lessons');
    await page.waitForURL(/\/student\/lessons/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/lessons/);
  });

  test('TC-05-01: Full data load', async ({ page }) => {
    await navigateToAdventure(page, 0);

    await expect(page.getByText(/CHỦ ĐỀ 1/i)).toBeVisible();
    await expect(page.getByText('Cộng trừ số có 2 chữ số (có nhớ)')).toBeVisible();
  });

  test('TC-05-02: Missing data load', async ({ page }) => {
    const topicCard = page.getByTestId('topic-card-1');
    await expect(topicCard).toBeVisible();
    await topicCard.click();

    await page.waitForURL(/\/student\/adventure/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/adventure/);

    // For the no-lectures case the placeholder renders without image preloading
    await expect(page.getByText(/Chưa có bài học nào/i)).toBeVisible({ timeout: 15000 });
  });

  test('TC-05-03: Switching milestone', async ({ page }) => {
    await navigateToAdventure(page, 0);

    const nextButton = page.getByTestId('next-button');
    const prevButton = page.getByTestId('prev-button');

    // Start with first lecture
    await expect(page.getByText('Cộng trừ số có 2 chữ số (có nhớ)')).toBeVisible();

    // Move to second lecture
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(page.getByText('Cộng trừ số có 2 chữ số (không nhớ)')).toBeVisible();

      // Move to third lecture
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await expect(page.getByText('Nhân chia số có 2 chữ số')).toBeVisible();

        // Move back to second lecture
        if (await prevButton.isVisible()) {
          await prevButton.click();
          await expect(page.getByText('Cộng trừ số có 2 chữ số (không nhớ)')).toBeVisible();
        }
      }

      // Move back to first lecture (if we were on second)
      if (await prevButton.isVisible() && await page.getByText('Cộng trừ số có 2 chữ số (không nhớ)').isVisible()) {
        await prevButton.click();
        await expect(page.getByText('Cộng trừ số có 2 chữ số (có nhớ)')).toBeVisible();
      }
    }
  });

  test('TC-05-04: Recent lecture navigating', async ({ page }) => {
    await navigateToAdventure(page, 0);
    const studyButton = page.getByTestId('do-exercise-button');
    await expect(studyButton).toBeVisible();
    await studyButton.click();
    await expect(page.getByText(/Cộng trừ số có 2 chữ số \(có nhớ\)/i)).toBeVisible();
    await expect(page.getByTestId('theory-button')).toBeVisible();
    await expect(page.getByTestId('exercise-button')).toBeVisible();

    // View theory
    await page.getByTestId('theory-button').click();
    await expect(page.getByText(/Cộng trừ số có 2 chữ số \(có nhớ\)/i)).toBeVisible();
    await expect(page.getByText('Test Theory')).toBeVisible();

    // Back to select
    const backToSelectBtn = page.getByTestId('back-to-select-btn');
    await expect(backToSelectBtn).toBeVisible({ timeout: 5000 });
    await backToSelectBtn.click();
    await expect(page.getByTestId('theory-button')).toBeVisible();
    await expect(page.getByTestId('exercise-button')).toBeVisible();

    // Do exercise
    await page.getByTestId('exercise-button').click();
    await expect(page.getByText(/Cộng trừ số có 2 chữ số \(có nhớ\)/i)).toBeVisible();
    await expect(page.getByText('Câu 1')).toBeVisible();
    await page.pause();

    // Submit
    await page.getByTestId('submit-btn').click();
    await expect(page.getByText(/Chúc mừng/i)).toBeVisible();
  });

});
