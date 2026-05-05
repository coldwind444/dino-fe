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

test.describe('Assessment', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth');
        await fillLoginForm(page, 'student_user123', 'P@ssw0rd2026!');
        const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
        await expect(loginBtn).toBeEnabled();
        await loginBtn.click();

        await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
        await expect(page).toHaveURL(/\/student\/home/);
    });

    test('TC-06A-01: Assessment float button and popup', async ({ page }) => {
        const floatButton = page.getByTestId('assessment-float-btn');
        await expect(floatButton).toBeVisible();
        await expect(page.getByText('Bạn đã sẵn sàng làm bài kiểm tra đầu vào chưa ?')).toBeVisible();
        await expect(page.getByTestId('start-entrance-test-btn')).toBeVisible();
        await expect(page.getByTestId('cancel-entrance-test-btn')).toBeVisible();

        // Close popup
        await page.getByTestId('cancel-entrance-test-btn').click();
        await expect(page.getByText('Bạn đã sẵn sàng làm bài kiểm tra đầu vào chưa ?')).not.toBeVisible();
    });

    test('TC-06A-02: Entrance Test interface (if active)', async ({ page }) => {
        const floatButton = page.getByTestId('assessment-float-btn');
        await expect(floatButton).toBeVisible();
        await page.getByTestId('start-entrance-test-btn').click();

        // Verify entrance test page
        await page.waitForURL(/\/student\/entrance-test/, { waitUntil: 'commit', timeout: 15000 });
        await expect(page).toHaveURL(/\/student\/entrance-test/);
        await expect(page.getByText('Entrance Test')).toBeVisible();

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

        // Check submit confirmation
        const submitBtn = page.getByTestId('submit-exam-btn');

        await submitBtn.click();
        await expect(page.getByText('Bạn có chắc chắn muốn nộp bài không ?')).toBeVisible();
        await page.getByTestId('cancel-btn').click();
        await expect(page.getByText('Bạn có chắc chắn muốn nộp bài không ?')).not.toBeVisible();

        await submitBtn.click();
        await expect(page.getByText('Bạn có chắc chắn muốn nộp bài không ?')).toBeVisible();
        await page.getByTestId('confirm-btn').click();

        await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
        await expect(page).toHaveURL(/\/student\/home/);

    });

});


