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

test.describe("Update profile", () => {
    test.describe.configure({ mode: "serial" })

    test.beforeEach(async ({ page }) => {
        await page.goto('/auth');
        await fillLoginForm(page, 'student_user123', 'NewPass@123');
        const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
        await expect(loginBtn).toBeEnabled();
        await loginBtn.click();

        await page.waitForURL(/\/student\/home/, { waitUntil: 'commit', timeout: 15000 });
        await expect(page).toHaveURL(/\/student\/home/);

        await page.getByTestId('profile-btn').click();
        await page.getByTestId('profile-tab').click();

        await page.waitForTimeout(2000);
        await expect(page.getByText('Thông tin cá nhân').first()).toBeVisible();
    })

    test("TC-14-01: Change name (Empty name)", async ({ page }) => {
        await page.getByTestId('name-input').click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
        await expect(page.getByTestId('update-profile-button')).toBeDisabled();
    })

    test("TC-14-02: Change name (valid name)", async ({ page }) => {
        await page.getByTestId('name-input').fill('Nguyễn Hoàng Anh Quân');
        await expect(page.getByTestId('update-profile-button')).toBeEnabled();
        await page.getByTestId('update-profile-button').click();
        await expect(page.getByText('Cập nhật thông tin thành công!')).toBeVisible();
    })

    test("TC-14-03: Change system avatar", async ({ page }) => {
        await page.getByTestId('system-avatar-1').click();
        await expect(page.getByTestId('update-profile-button')).toBeEnabled();
        await page.getByTestId('update-profile-button').click();
        await expect(page.getByText('Cập nhật thông tin thành công!')).toBeVisible();
    })

    test("TC-14-04: Upload file avatar", async ({ page }) => {
        await page.getByTestId('user-avatar-radio').click();
        await expect(page.getByTestId('upload-avatar-button')).toBeEnabled();

        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByTestId('upload-avatar-button').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles('tests/fixtures/cat.png');

        await expect(page.getByTestId('update-profile-button')).toBeEnabled();

        // Listen for the toast AND the confirm dialog
        const dialogPromise = page.waitForEvent('dialog');
        await page.getByTestId('update-profile-button').click();

        // Then handle the confirm dialog
        const dialog = await dialogPromise;
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toContain('Cập nhật thông tin thành công');
        await dialog.dismiss();
    })

    test("TC-14-05: Upload invalid file avatar", async ({ page }) => {
        await page.getByTestId('user-avatar-radio').click();
        await expect(page.getByTestId('upload-avatar-button')).toBeEnabled();

        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByTestId('upload-avatar-button').click();
        const fileChooser = await fileChooserPromise;

        // Register handler before setFiles — accepts dialog immediately when it appears
        let dialogMessage = '';
        page.once('dialog', async (dialog) => {
            dialogMessage = dialog.message();
            await dialog.accept();
        });

        await fileChooser.setFiles('tests/fixtures/invalid.txt');
        await page.waitForTimeout(500); // let the handler fire

        expect(dialogMessage).toContain('Vui lòng chọn 1 tệp ảnh hợp lệ');
        await expect(page.getByTestId('update-profile-button')).toBeDisabled();
    })

    test("TC-14-06: Update grade", async ({ page }) => {
        const gradeSelect = page.getByTestId('grade-select');
        await gradeSelect.selectOption({ label: 'Khối 2' });

        await expect(page.getByTestId('update-profile-button')).toBeEnabled();
        await page.getByTestId('update-profile-button').click();
        await expect(page.getByText('Cập nhật thông tin thành công!')).toBeVisible();
    })

})