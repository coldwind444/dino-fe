import { test, expect, Page } from "@playwright/test";

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

test.describe("Change password", () => {
    test.describe.configure({ mode: "serial" })

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth');
        await fillLoginForm(page, 'student_user123', 'P@ssw0rd2026!');
        const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
        await expect(loginBtn).toBeEnabled();
        await loginBtn.click();

        await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
        await expect(page).toHaveURL(/\/student\/home/);

        await page.getByTestId('profile-btn').click();
        await page.getByTestId('password-tab').click();

        await expect(page.getByText('Đổi mật khẩu').first()).toBeVisible();
    })

    test("TC-13-01: OTP is not sent and new password section is disabled", async ({ page }) => {
        await expect(page.getByTestId('send-otp-button')).toBeEnabled();
        await expect(page.getByText(/Mã xác thực sẽ hết hiệu lực sau/)).not.toBeVisible();
        await expect(page.getByTestId('new-password-input')).toBeDisabled();
        await expect(page.getByTestId('confirm-password-input')).toBeDisabled();
        await expect(page.getByTestId('submit-password-button')).toBeDisabled();
    })

    test("TC-13-02: OTP is sent, empty OTP and valid password values", async ({ page }) => {
        await page.getByTestId('send-otp-button').click();
        await expect(page.getByText(/Mã xác thực sẽ hết hiệu lực sau/)).toBeVisible();

        await page.getByTestId('new-password-input').fill('NewPassword@1');
        await page.getByTestId('confirm-password-input').fill('NewPassword@1');
        await expect(page.getByTestId('submit-password-button')).toBeDisabled();
    })

    test("TC-13-03: OTP is sent, mismatch OTP and valid password values", async ({ page }) => {
        await page.getByTestId('send-otp-button').click();
        await expect(page.getByText(/Mã xác thực sẽ hết hiệu lực sau/)).toBeVisible();

        const firstDigit = page.getByLabel('Digit 1 of 6');
        await firstDigit.click();
        await page.keyboard.type('123456');

        await page.getByTestId('new-password-input').fill('NewPassword@1');
        await page.getByTestId('confirm-password-input').fill('NewPassword@1');
        await page.getByTestId('submit-password-button').click();
        await expect(page.getByText('Mã OTP không hợp lệ hoặc đã hết hạn')).toBeVisible();
    })

    test("TC-13-04: OTP is sent, invalid password values", async ({ page }) => {
        await page.getByTestId('send-otp-button').click();
        await expect(page.getByText(/Mã xác thực sẽ hết hiệu lực sau/)).toBeVisible();

        const firstDigit = page.getByLabel('Digit 1 of 6');
        await firstDigit.click();
        await page.keyboard.type('123456');

        await page.getByTestId('new-password-input').fill('pass');
        await page.getByTestId('confirm-password-input').fill('pass');
        await expect(page.getByTestId('submit-password-button')).toBeDisabled();
    })

    test("TC-13-05: Happy path", async ({ page }) => {
        await page.getByTestId('send-otp-button').click();
        await expect(page.getByText(/Mã xác thực sẽ hết hiệu lực sau/)).toBeVisible();

        await page.pause();

        await page.getByTestId('new-password-input').fill('NewPass@123');
        await page.getByTestId('confirm-password-input').fill('NewPass@123');
        const submitBtn = page.getByTestId('submit-password-button');
        await expect(submitBtn).toBeEnabled();
        await submitBtn.click();
        await expect(page.getByText(/Đổi mật khẩu thành công/)).toBeVisible();

        await page.getByTestId('close-btn').click();
        await expect(page.getByTestId('profile-btn')).toBeVisible();

        await page.getByTestId('logout-btn').click();
        await page.waitForURL(/\/auth/, { waitUntil: 'commit', timeout: 15000 });
        await expect(page).toHaveURL('/auth');

        await fillLoginForm(page, 'student_user123', 'NewPass@123');
        const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
        await expect(loginBtn).toBeEnabled();
        await loginBtn.click();

        await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
        await expect(page).toHaveURL(/\/student\/home/);
    })
})