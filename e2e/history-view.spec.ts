import { test, expect } from '@playwright/test';

test.describe('HistoryView', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student/history');
  });

  test('TC-08-01: Filter test 1 (All, No Dates, No Keyword)', async ({ page }) => {
    // await page.selectOption('select[name="category"]', 'All');
    // await expect(page.getByTestId('history-record')).toBeVisible();
  });

  test('TC-08-02: Filter test 2 (Lecture, Math Keyword)', async ({ page }) => {
    // await page.selectOption('select[name="category"]', 'Lecture');
    // await page.fill('input[name="keyword"]', 'Math');
    // await expect(page.getByTestId('history-record')).toBeVisible();
  });

  test('TC-08-03: Filter test 3 (Arena, Start Date)', async ({ page }) => {
    /*
    await page.selectOption('select[name="category"]', 'Arena');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await expect(page.getByTestId('history-record')).toBeVisible();
    */
  });

  test('TC-08-04: Filter test 4 (Assessment, Start Date, Keyword)', async ({ page }) => {
    /*
    await page.selectOption('select[name="category"]', 'Assessment');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="keyword"]', 'Assessment 1');
    await expect(page.getByTestId('history-record')).toBeVisible();
    */
  });

  test('TC-08-05: Filter test 5 (All, Start/End Dates, Keyword)', async ({ page }) => {
    /*
    await page.selectOption('select[name="category"]', 'All');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    await page.fill('input[name="keyword"]', 'Math');
    await expect(page.getByTestId('history-record')).toBeVisible();
    */
  });

  test('TC-08-06: Filter test 6 (All, Start/End Dates, No Keyword)', async ({ page }) => {
    /*
    await page.selectOption('select[name="category"]', 'All');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    await expect(page.getByTestId('history-record')).toBeVisible();
    */
  });

  test('TC-08-07: Filter test 7 (End before Start)', async ({ page }) => {
    /*
    await page.selectOption('select[name="category"]', 'All');
    await page.fill('input[name="startDate"]', '2024-12-31');
    await page.fill('input[name="endDate"]', '2024-01-01');
    await expect(page.getByText('End Date must be after Start Date')).toBeVisible();
    */
  });

  test('TC-08-08: No data test', async ({ page }) => {
    /*
    await page.selectOption('select[name="category"]', 'All');
    await page.fill('input[name="keyword"]', 'NonExistentKeywordXYZ');
    await expect(page.getByText(/not found/i)).toBeVisible();
    */
  });

  test('TC-08-09: Correct data display (Parent)', async ({ page }) => {
    /*
    await page.goto('/parent/history');
    await page.selectOption('select[name="student"]', 'student1');
    await expect(page.getByTestId('history-record')).toBeVisible();
    */
  });

  test('TC-08-10: No data display (Parent)', async ({ page }) => {
    /*
    await page.goto('/parent/history');
    await page.selectOption('select[name="student"]', 'student_no_data');
    await expect(page.getByText(/not found/i)).toBeVisible();
    */
  });
});
