import { test, expect } from '@playwright/test';

test.describe('Parent Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/parent/dashboard');
  });

  test('TC-09-01: Page load and initial empty state', async ({ page }) => {
    await expect(page.getByText('Thống kê học tập')).toBeVisible();
    await expect(page.getByText('Thống kê đấu trường')).toBeVisible();
    await expect(page.getByText('Chưa có dữ liệu thống kê')).toBeVisible();
  });

  test('TC-09-02: Correct data display (With student and dates)', async ({ page }) => {
    // Wait for student list to load
    await page.waitForSelector('select[name="student-select"]');
    await page.selectOption('select[name="student-select"]', { label: 'Nguyễn Hoàng Anh' });

    // Fill "Từ ngày" and "Đến ngày"
    const dateInputs = page.getByPlaceholder('dd/mm/yy');
    await dateInputs.first().fill('01/01/24');
    await dateInputs.last().fill('31/12/24');

    await page.getByText('Lọc kết quả').click();

    // Check for statistics cards labels
    await expect(page.getByText('Số chủ đề đã học')).toBeVisible();
    await expect(page.getByText('Tỉ lệ làm đúng')).toBeVisible();
    await expect(page.getByText('Bậc xếp hạng hiện tại')).toBeVisible();
  });

  test('TC-09-03: Invalid date format validation', async ({ page }) => {
    await page.waitForSelector('select[name="student-select"]');
    await page.selectOption('select[name="student-select"]', { label: 'Nguyễn Hoàng Anh' });

    const dateInputs = page.getByPlaceholder('dd/mm/yy');
    await dateInputs.first().fill('invalid-date');
    await page.getByText('Lọc kết quả').click();

    await expect(page.getByText('Ngày bắt đầu không hợp lệ. Dùng định dạng dd/mm/yy.')).toBeVisible();
  });

  test('TC-09-04: End Date before Start Date validation', async ({ page }) => {
    await page.waitForSelector('select[name="student-select"]');
    await page.selectOption('select[name="student-select"]', { label: 'Nguyễn Hoàng Anh' });

    const dateInputs = page.getByPlaceholder('dd/mm/yy');
    await dateInputs.first().fill('31/12/24');
    await dateInputs.last().fill('01/01/24');

    await page.getByText('Lọc kết quả').click();

    await expect(page.getByText('Ngày bắt đầu không được lớn hơn ngày kết thúc.')).toBeVisible();
  });

  test('TC-09-05: Reset date functionality', async ({ page }) => {
    const dateInputs = page.getByPlaceholder('dd/mm/yy');
    await dateInputs.first().fill('01/01/24');
    await expect(dateInputs.first()).toHaveValue('01/01/24');

    await page.getByText('Đặt lại ngày').click();
    await expect(dateInputs.first()).toHaveValue('');
  });
});
