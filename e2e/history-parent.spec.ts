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

test.describe('History View - Parent Role', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/auth');
        await fillLoginForm(page, 'rasenganlk55123@gmail.com', 'P@ssw0rd2026!');
        const loginBtn = page.getByRole('button', { name: 'Đăng nhập', exact: true });
        await expect(loginBtn).toBeEnabled();
        await loginBtn.click();

        await page.waitForURL(/\/parent\/dashboard/, { waitUntil: 'commit', timeout: 15000 });
        await expect(page).toHaveURL(/\/parent\/dashboard/);

        await page.goto('/parent/history');
        await page.waitForURL(/\/parent\/history/, { waitUntil: 'commit', timeout: 15000 });
        await expect(page).toHaveURL(/\/parent\/history/);
    });

    test('TC-08B-01: Page load and initial data', async ({ page }) => {
        const studentSelect = page.getByTestId('student-select');
        const filterBtn = page.getByTestId('filter-btn')
        await studentSelect.selectOption({ label: 'Nguyễn Hoàng Anh' });
        await filterBtn.click();

        await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
        await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
        const totalExercises = page.getByTestId('total-exercises');
        const accuracy = page.getByTestId('accuracy');
        await expect(totalExercises).toHaveText('8');
        await expect(accuracy).toHaveText('100%');
        await expect(page.getByText('Cộng trừ số có 2 chữ số (có nhớ)').first()).toBeVisible();
    });

    test('TC-08B-02: Filter - filter by category', async ({ page }) => {
        // Set category filter and apply
        const studentSelect = page.getByTestId('student-select');
        await studentSelect.selectOption({ label: 'Nguyễn Hoàng Anh' });
        const categorySelect = page.getByTestId('category-select');
        const filterBtn = page.getByTestId('filter-btn')
        await categorySelect.selectOption({ label: 'Bài tập' });
        await filterBtn.click();

        // Verify filter
        await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
        await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
        const totalExercises = page.getByTestId('total-exercises');
        const accuracy = page.getByTestId('accuracy');
        await expect(totalExercises).toHaveText('8');
        await expect(accuracy).toHaveText('100%');
        await expect(page.getByText('Cộng trừ số có 2 chữ số (có nhớ)').first()).toBeVisible();

        // Filter by category (Not found) - to make sure filter is working
        await categorySelect.selectOption({ label: 'Đấu trường' });
        await filterBtn.click();
        // Must be no records
        await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
        await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
        await expect(totalExercises).toHaveText('0');
        await expect(accuracy).toHaveText('0%');
        await expect(page.getByText('Chưa có kết quả nào')).toBeVisible();

    });

    test('TC-08B-03: Filter - keyword', async ({ page }) => {
        // Set category filter and apply
        const studentSelect = page.getByTestId('student-select');
        await studentSelect.selectOption({ label: 'Nguyễn Hoàng Anh' });
        const filterBtn = page.getByTestId('filter-btn')
        const totalExercises = page.getByTestId('total-exercises');
        const accuracy = page.getByTestId('accuracy');
        await filterBtn.click();

        // Filter with empty keyword - display all records
        await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
        await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
        await expect(totalExercises).toHaveText('8');
        await expect(accuracy).toHaveText('100%');
        await expect(page.getByText('Cộng trừ số có 2 chữ số (có nhớ)').first()).toBeVisible();

        // Filter by keyword (Not found) - to make sure filter is working
        const keywordInput = page.getByTestId('keyword-input');
        await keywordInput.fill('None');
        await filterBtn.click();

        // Must be no records
        await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
        await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
        await expect(totalExercises).toHaveText('0');
        await expect(accuracy).toHaveText('0%');
        await expect(page.getByText('Chưa có kết quả nào')).toBeVisible();

    });

    test('TC-08B-04: Filter - Valid Date', async ({ page }) => {
        // Set category filter and apply
        const studentSelect = page.getByTestId('student-select');
        await studentSelect.selectOption({ label: 'Nguyễn Hoàng Anh' });
        const filterBtn = page.getByTestId('filter-btn')
        const startDateInput = page.getByTestId('start-date-input');
        const endDateInput = page.getByTestId('end-date-input');
        await startDateInput.fill('01/04/26');
        await endDateInput.fill('04/05/26');
        await filterBtn.click();

        // Verify filter - have results
        await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
        await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
        const totalExercises = page.getByTestId('total-exercises');
        const accuracy = page.getByTestId('accuracy');
        await expect(totalExercises).toHaveText('8');
        await expect(accuracy).toHaveText('100%');
        await expect(page.getByText('Cộng trừ số có 2 chữ số (có nhớ)').first()).toBeVisible();

        // Filter by valid dates (Not found) - to make sure filter is working
        await startDateInput.fill('01/04/25');
        await endDateInput.fill('04/05/25');
        await filterBtn.click();
        // Must be no records
        await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
        await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
        await expect(totalExercises).toHaveText('0');
        await expect(accuracy).toHaveText('0%');
        await expect(page.getByText('Chưa có kết quả nào')).toBeVisible();

    });

    test('TC-08B-05: Filter - Invalid Date (start > end)', async ({ page }) => {
        const studentSelect = page.getByTestId('student-select');
        await studentSelect.selectOption({ label: 'Nguyễn Hoàng Anh' });
        const startDateInput = page.getByTestId('start-date-input');
        const endDateInput = page.getByTestId('end-date-input');
        await startDateInput.fill('04/05/26');
        await endDateInput.fill('01/04/26');
        expect(page.getByText("Ngày bắt đầu phải trước ngày kết thúc")).toBeVisible();
    });

    test('TC-08B-06: View history record detail', async ({ page }) => {
        const studentSelect = page.getByTestId('student-select');
        await studentSelect.selectOption({ label: 'Nguyễn Hoàng Anh' });
        const filterBtn = page.getByTestId('filter-btn')
        await filterBtn.click();

        const viewButton = page.getByTestId('view-detail-btn-0');
        if (await viewButton.isVisible()) {
            await viewButton.click();
            await expect(page.getByText('Chi tiết bài làm', { exact: false })).toBeVisible();
            await expect(page.getByText('Tổng số câu hỏi')).toBeVisible();
            await page.getByTestId('back-link').click();
            await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
            await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
        }
    });

    test('TC-08B-07: View history records - student has no data', async ({ page }) => {
        const studentSelect = page.getByTestId('student-select');
        await studentSelect.selectOption({ label: 'Nguyễn Văn A' });
        const filterBtn = page.getByTestId('filter-btn')
        await filterBtn.click();

        await expect(page.getByText('Thống kê tổng quát')).toBeVisible();
        await expect(page.getByText('Lịch sử làm bài')).toBeVisible();
        const totalExercises = page.getByTestId('total-exercises');
        const accuracy = page.getByTestId('accuracy');
        await expect(totalExercises).toHaveText('0');
        await expect(accuracy).toHaveText('0%');
        await expect(page.getByText('Chưa có kết quả nào')).toBeVisible();
    });
});