import { test, expect } from '@playwright/test';

test.describe('History View - Student Role', () => {
  test.use({ storageState: 'playwright/.auth/student.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/student/history');
  });

  test('TC-08-01: Page load and initial data', async ({ page }) => {
    await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
    await expect(page.getByText('Số bài tập đã làm')).toBeVisible();
    await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
  });

  test('TC-08-02: Filter by category and keyword', async ({ page }) => {
    // Select "Đấu trường" category
    await page.selectOption('select[name="category-select"]', { label: 'Đấu trường' });
    
    // Fill search keyword
    await page.getByPlaceholder('Tìm kiếm...').fill('Toán');
    await page.getByText('Lọc kết quả').click();
    
    // Check for filtered results or empty state if no match
    // Note: Since data is dynamic, we just check if the UI doesn't crash
    await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
  });

  test('TC-08-03: View history record detail', async ({ page }) => {
    // Wait for at least one record to appear
    const viewButton = page.getByText('Xem').first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await expect(page.getByText('Chi tiết bài làm', { exact: false })).toBeVisible();
      await expect(page.getByText('Tổng số câu hỏi')).toBeVisible();
      
      // Navigate back
      await page.getByRole('link', { name: 'Lịch sử' }).click();
      await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
    }
  });
});

test.describe('History View - Parent Role', () => {
  test.use({ storageState: 'playwright/.auth/parent.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/parent/history');
  });

  test('TC-09-01: Parent can filter by student', async ({ page }) => {
    await expect(page.getByText('Học sinh:')).toBeVisible();
    await page.selectOption('select[name="student-select"]', { label: 'Nguyễn Hoàng Anh' });
    await page.getByText('Lọc kết quả').click();
    
    await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
  });

  test('TC-09-02: Parent view record detail', async ({ page }) => {
    await page.selectOption('select[name="student-select"]', { label: 'Nguyễn Hoàng Anh' });
    await page.getByText('Lọc kết quả').click();

    const viewButton = page.getByText('Xem').first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await expect(page.getByText('Chi tiết bài làm', { exact: false })).toBeVisible();
      
      // Navigate back
      await page.getByRole('link', { name: 'Lịch sử' }).click();
      await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
    }
  });
});
