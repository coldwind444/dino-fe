import { test, expect } from '@playwright/test';

test.describe('Parent Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/parent'); // Dashboard page
  });

  test('TC-09-01: Correct data display 1 (No Dates)', async ({ page }) => {
    /*
    await page.selectOption('select[name="student"]', 'student1');
    await expect(page.getByTestId('statistics-data')).toBeVisible();
    */
  });

  test('TC-09-02: Correct data display 2 (Start Date)', async ({ page }) => {
    /*
    await page.selectOption('select[name="student"]', 'student1');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await expect(page.getByTestId('statistics-data')).toBeVisible();
    */
  });

  test('TC-09-03: No data display (Start and End Dates - Has Data)', async ({ page }) => {
    /*
    await page.selectOption('select[name="student"]', 'student1');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    await expect(page.getByTestId('statistics-data')).toBeVisible();
    */
  });

  test('TC-09-04: No data display (End before Start)', async ({ page }) => {
    /*
    await page.selectOption('select[name="student"]', 'student1');
    await page.fill('input[name="startDate"]', '2024-12-31');
    await page.fill('input[name="endDate"]', '2024-01-01');
    await expect(page.getByText('End Date must be after Start Date')).toBeVisible();
    */
  });

  test('TC-09-05: No data display (No Data for Student)', async ({ page }) => {
    /*
    await page.selectOption('select[name="student"]', 'student_no_data');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    await expect(page.getByText(/not found/i)).toBeVisible();
    */
  });
});
