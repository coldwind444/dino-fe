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

test.describe('Arena', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await fillLoginForm(page, 'student_user123', 'P@ssw0rd2026!');
    const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();

    await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/home/);

    await page.goto('/student/arena');
    await page.waitForURL(/\/student\/arena/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/arena/);
  });

  test('TC-06B-01: Arena main page elements', async ({ page }) => {
    await expect(page.getByText('ĐẤU TRƯỜNG', { exact: true })).toBeVisible();
    await expect(page.getByText('Xem thể lệ')).toBeVisible();
    await expect(page.getByText('Xếp hạng của bạn')).toBeVisible();
    await expect(page.getByText('Weekly Arena')).toBeVisible();
    await expect(page.getByText('Chưa có dữ liệu bảng xếp hạng.')).toBeVisible();
    await expect(page.getByText(/Đang mở cửa/i)).toBeVisible();
    await expect(page.getByText(/Đấu trường kết thúc trong/i)).toBeVisible();
    await expect(page.getByTestId('join-arena-btn')).toBeVisible();
  });

  test('TC-06B-02: Arena principles viewing', async ({ page }) => {
    await page.getByTestId('rules-btn').click();
    await expect(page.getByText('THỂ LỆ ĐẤU TRƯỜNG')).toBeVisible();

    // Check for navigation within principles
    const nextBtn = page.getByTestId('next-rules-btn');
    await nextBtn.isVisible()
    await nextBtn.click();
    await expect(page.getByText('II. Hình thức thi')).toBeVisible();

    const prevBtn = page.getByTestId('prev-rules-btn');
    await prevBtn.isVisible();
    await prevBtn.click();
    await expect(page.getByText('I. Thông tin chung')).toBeVisible();

    await page.getByTestId('close-rules-btn').click();
    await expect(page.getByTestId('rules-panel')).toHaveClass(/w-0 opacity-0/);
  });

  test('TC-06B-03: Exercise interaction and progress', async ({ page }) => {
    const joinBtn = page.getByTestId('join-arena-btn');
    await expect(joinBtn).toBeVisible();
    await joinBtn.click();

    await page.waitForURL(/\/student\/arena-exam/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/arena-exam/);

    // 1. Multiple choice interaction (Question 1)
    const choiceOption = page.getByTestId('choice-option-0');
    await choiceOption.click();
    await expect(choiceOption).toHaveClass(/bg-\[#D8FFFA\]/);
    await page.getByTestId('next-question-btn').click();

    // 2. Fill-in interaction (Question 2)
    await expect(page.getByText('Câu 2')).toBeVisible();
    const fillInInput = page.getByTestId('fill-in-input-0');
    await fillInInput.fill('test1');
    await expect(fillInInput).toHaveValue('test1');
    await page.getByTestId('next-question-btn').click();

    // 3. Matching interaction (Question 3)
    await expect(page.getByText('Câu 3')).toBeVisible();
    const matchingLeft = page.getByTestId('matching-left-item-0');
    const matchingRight = page.getByTestId('matching-right-item-0');
    await matchingLeft.click();
    await matchingRight.click();
    await expect(matchingLeft).toHaveClass(/bg-\[#D8FFFA\]/);
    await expect(matchingRight).toHaveClass(/bg-\[#D8FFFA\]/);
    await page.getByTestId('delete-pairing-btn-0').click();
    await expect(matchingLeft).not.toHaveClass(/bg-\[#D8FFFA\]/);
    await expect(matchingRight).not.toHaveClass(/bg-\[#D8FFFA\]/);
    await page.getByTestId('next-question-btn').click();

    // 4. Interactive (Drag & Drop) interaction (Question 4)
    await expect(page.getByText('Câu 4')).toBeVisible();
    const interactiveOption = page.getByTestId('interactive-option-0');
    const blank = page.getByTestId('interactive-blank');
    const optionText = await interactiveOption.innerText();
    await interactiveOption.click();
    await expect(blank).toHaveText(optionText);
    await blank.click();
    await expect(blank).toHaveText('Kéo vào đây');

    await page.getByTestId('next-question-btn').click();

    // 5. True/False interaction (Question 5)
    await expect(page.getByText('Câu 5')).toBeVisible();
    const trueBtn = page.getByTestId('true-option');
    const falseBtn = page.getByTestId('false-option');

    await trueBtn.click();
    await expect(trueBtn).toHaveClass(/bg-\[#D8FFFA\]/);
    await expect(falseBtn).toHaveClass(/bg-white/);

    await falseBtn.click();
    await expect(falseBtn).toHaveClass(/bg-\[#f6dada\]/i);
    await expect(trueBtn).toHaveClass(/bg-white/);

    await page.getByTestId('next-question-btn').click();

    // Final Progress Check
    await expect(page.getByTestId('answered-count')).toHaveText('3/5');

    // Exit
    await page.getByTestId('exit-exam-btn').click();
    await expect(page.getByText('Bài làm hiện tại của bạn sẽ được lưu lại. Bạn có chắc chắn muốn thoát không ?')).toBeVisible();

    // Cancel exit
    await page.getByTestId('cancel-btn').click();
    await expect(page.getByText('Bài làm hiện tại của bạn sẽ được lưu lại. Bạn có chắc chắn muốn thoát không ?')).not.toBeVisible();

    // Confirm exit
    await page.getByTestId('exit-exam-btn').click();
    await expect(page.getByText('Bài làm hiện tại của bạn sẽ được lưu lại. Bạn có chắc chắn muốn thoát không ?')).toBeVisible();
    await page.getByTestId('confirm-btn').click();
    await expect(page.getByText('Bài làm hiện tại của bạn sẽ được lưu lại. Bạn có chắc chắn muốn thoát không ?')).not.toBeVisible();
    await page.waitForURL(/\/student\/arena/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/arena/);

    // Confirm progress
    await joinBtn.click();
    await page.waitForURL(/\/student\/arena-exam/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/arena-exam/);

    // Verify progress
    await expect(page.getByTestId('answered-count')).toHaveText('3/5');
  });

  test('TC-06B-04: Exercise submit', async ({ page }) => {
    const joinBtn = page.getByTestId('join-arena-btn');
    await expect(joinBtn).toBeVisible();
    await joinBtn.click();

    await page.waitForURL(/\/student\/arena-exam/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/arena-exam/);

    const submitBtn = page.getByTestId('submit-exam-btn');
    await submitBtn.click();
    await expect(page.getByText('Bạn có chắc chắn muốn nộp bài không ?')).toBeVisible();
    await page.getByTestId('confirm-btn').click();

    await expect(page.getByText('Bạn có chắc chắn muốn nộp bài không ?')).not.toBeVisible();
    await page.waitForURL(/\/student\/arena/, { waitUntil: 'commit', timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/arena/);

    await expect(page.getByText(/Hẹn gặp lại ở kỳ tiếp theo/)).toBeVisible();
    await expect(page.getByTestId('join-arena-btn')).not.toBeVisible();
  });
});


