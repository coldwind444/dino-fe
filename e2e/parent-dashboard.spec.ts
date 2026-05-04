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

test.describe('Parent Dashboard', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await fillLoginForm(page, 'rasenganlk55123@gmail.com', 'P@ssw0rd2026!');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();

    await page.waitForURL(/\/parent\/dashboard/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/parent\/dashboard/);
  });

  test('TC-09-01: Correct data display (With student and dates)', async ({ page }) => {
    // Wait for student list to load
    const studentSelect = page.getByTestId("student-select");
    const filterBtn = page.getByTestId('filter-btn');
    await expect(studentSelect).toBeVisible();
    await studentSelect.selectOption({ label: 'Nguyễn Hoàng Anh' });
    await filterBtn.click();

    // Check for statistics cards labels
    await expect(page.getByText('Số chủ đề đã học')).toBeVisible();
    await expect(page.getByText('Tỉ lệ làm đúng')).toHaveCount(2);
    await expect(page.getByText('Bậc xếp hạng hiện tại')).toBeVisible();
    await expect(page.getByText('Số giờ hoạt động')).toBeVisible();
    await expect(page.getByText('Số thạch anh')).toBeVisible();
    await expect(page.getByText('Xếp hạng tuần')).toBeVisible();
    await expect(page.getByText('Xếp hạng tổng')).toBeVisible();
    await expect(page.getByText('Battle Points')).toBeVisible();
  });

  test('TC-09-02: Invalid date format validation', async ({ page }) => {
    const startDateInput = page.getByTestId('start-date-input');
    const endDateInput = page.getByTestId('end-date-input');
    await startDateInput.fill('04/05/26');
    await endDateInput.fill('01/04/26');
    await expect(page.getByText("Ngày bắt đầu phải trước ngày kết thúc")).toBeVisible();
  });

  test('TC-09-03: Reset date functionality', async ({ page }) => {
    const startDateInput = page.getByTestId('start-date-input');
    const endDateInput = page.getByTestId('end-date-input');

    await startDateInput.fill('01/01/24');
    await endDateInput.fill('02/02/25');
    await expect(startDateInput).toHaveValue('01/01/24');
    await expect(endDateInput).toHaveValue('02/02/25');
    await page.getByTestId('reset-date-btn').click();
    await expect(startDateInput).toHaveValue('');
    await expect(endDateInput).toHaveValue('');
  });
});
