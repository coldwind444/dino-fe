import { test, expect } from '@playwright/test';

test.describe('Assessment and Arena', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.getByPlaceholder('Email hoặc tên đăng nhập').fill('student_user123');
    await page.getByPlaceholder('Mật khẩu').fill('P@ssw0rd2026!');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.goto('/student/home');
  });

  test('TC-06-01: Assessment float button and popup', async ({ page }) => {
    // Check if assessment float button is visible (it has a flask-vial icon)
    const floatButton = page.locator('svg[data-icon="flask-vial"]').locator('..');

    if (await floatButton.isVisible()) {
      await floatButton.click();
      await expect(page.getByText('Bạn đã sẵn sàng làm bài kiểm tra đầu vào chưa ?')).toBeVisible();
      await expect(page.getByText('Làm bài')).toBeVisible();
      await expect(page.getByText('Huỷ')).toBeVisible();

      // Close popup
      await page.getByText('Huỷ').click();
      await expect(page.getByText('Bạn đã sẵn sàng làm bài kiểm tra đầu vào chưa ?')).not.toBeVisible();
    }
  });

  test('TC-06-02: Arena main page elements', async ({ page }) => {
    await page.goto('/student/arena');

    // Check for common arena elements
    await expect(page.getByText('ĐẤU TRƯỜNG')).toBeVisible();
    await expect(page.getByText('Xem thể lệ')).toBeVisible();
    await expect(page.getByText('Xếp hạng của bạn')).toBeVisible();

    // Check for either "Đang mở cửa", "Chưa có đấu trường nào", or "Đấu trường chưa bắt đầu"
    const arenaStatus = page.locator('h2');
    await expect(arenaStatus.first()).toBeVisible();
  });

  test('TC-06-03: Arena principles viewing', async ({ page }) => {
    await page.goto('/student/arena');
    await page.getByText('Xem thể lệ').click();
    await expect(page.getByText('THỂ LỆ ĐẤU TRƯỜNG')).toBeVisible();

    // Check for navigation within principles
    const nextBtn = page.getByText('TRANG SAU');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await expect(page.getByText('II. Hình thức thi')).toBeVisible();
    }

    // Close principles panel (using the caret-left icon button)
    await page.locator('svg[data-icon="caret-left"]').click();
    await expect(page.getByText('THỂ LỆ ĐẤU TRƯỜNG')).not.toBeVisible();
  });

  test('TC-06-04: Arena exam interface (if active)', async ({ page }) => {
    await page.goto('/student/arena');
    const joinBtn = page.getByText('Tham gia ngay');

    if (await joinBtn.isVisible()) {
      await joinBtn.click();

      // Check for exam UI elements
      await expect(page.getByText('NỘP BÀI')).toBeVisible();
      await expect(page.getByText('Thoát')).toBeVisible();
      await expect(page.getByText('Câu 1')).toBeVisible();

      // Test Exit warning
      await page.getByText('Thoát').click();
      await expect(page.getByText('Bạn có chắc chắn muốn thoát không ?')).toBeVisible();
      await page.getByText('Không').click(); // Cancel exit
      await expect(page.getByText('NỘP BÀI')).toBeVisible();
    }
  });

  test('TC-06-05: Entrance Test interface (if active)', async ({ page }) => {
    const floatButton = page.locator('svg[data-icon="flask-vial"]').locator('..');

    if (await floatButton.isVisible()) {
      await floatButton.click();
      await page.getByText('Làm bài').click();

      // Verify entrance test page
      await expect(page.url()).toContain('/student/entrance-test');
      await expect(page.getByText('NỘP BÀI')).toBeVisible();
      await expect(page.getByText('Câu 1')).toBeVisible();

      // Check submit confirmation
      await page.getByText('NỘP BÀI').click();
      await expect(page.getByText('Bạn có chắc chắn muốn nộp bài không ?')).toBeVisible();
      await page.getByText('Không').click();
    }
  });

  test('TC-06-06: Leaderboard empty state or data', async ({ page }) => {
    await page.goto('/student/arena');
    const emptyState = page.getByText('Chưa có dữ liệu bảng xếp hạng.');
    const leaderboardHeader = page.getByText(/Bảng xếp hạng/);

    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
    } else {
      await expect(leaderboardHeader).toBeVisible();
    }
  });

  test('TC-06-07: Exercise interaction and progress', async ({ page }) => {
    // Navigate to an exam (Arena or Entrance Test)
    await page.goto('/student/arena');
    const joinBtn = page.getByText('Tham gia ngay');

    if (!(await joinBtn.isVisible())) {
      // Fallback to Entrance Test if Arena is not available
      const floatButton = page.locator('svg[data-icon="flask-vial"]').locator('..');
      if (await floatButton.isVisible()) {
        await floatButton.click();
        await page.getByText('Làm bài').click();
      } else {
        test.skip();
      }
    } else {
      await joinBtn.click();
    }

    // Now in the exam page
    // 1. Multiple Choice interaction
    const choiceOption = page.locator('.rounded-4xl.border-2').first();
    if (await choiceOption.isVisible()) {
      await choiceOption.click();
      await expect(choiceOption).toHaveClass(/bg-\[#D8FFFA\]/); // Selected state color
    }

    // 2. True/False interaction
    const trueBtn = page.getByText('Đúng', { exact: true });
    if (await trueBtn.isVisible()) {
      await trueBtn.click();
      await expect(trueBtn).toHaveClass(/bg-\[#D8FFFA\]/);
    }

    // 3. Fill-in interaction
    const fillInInput = page.locator('input[type="text"]').first();
    if (await fillInInput.isVisible()) {
      await fillInInput.fill('123');
      await expect(fillInInput).toHaveValue('123');
    }

    // 4. Matching interaction
    const matchingLeft = page.locator('.flex.flex-col.gap-4.w-1\\/3').first().locator('.rounded-xl.border-2').first();
    const matchingRight = page.locator('.flex.flex-col.gap-4.w-1\\/3').last().locator('.rounded-xl.border-2').first();
    if (await matchingLeft.isVisible() && await matchingRight.isVisible()) {
      await matchingLeft.click();
      await matchingRight.click();
      // Verify pairing (both should have the paired state class/color)
      await expect(matchingLeft).toHaveClass(/bg-\[#D8FFFA\]/);
      await expect(matchingRight).toHaveClass(/bg-\[#D8FFFA\]/);
    }

    // 5. Interactive (Drag & Drop / Blank filling) interaction
    const interactiveOption = page.locator('.py-3.px-8.rounded-xl.border-2').first();
    const blank = page.getByText('Kéo vào đây').first();
    if (await interactiveOption.isVisible() && await blank.isVisible()) {
      const optionText = await interactiveOption.innerText();
      await interactiveOption.click();
      // The blank should now contain the option text
      await expect(page.getByText(optionText).locator('..').filter({ hasText: optionText })).toBeVisible();
    }

    // 6. Navigation and Progress
    await page.getByText('Câu sau').click();
    await expect(page.getByText('Câu 2')).toBeVisible();

    // Check if progress indicator updates
    await expect(page.getByText(/Đã làm: [1-9]\//)).toBeVisible();
  });
});


