import { test, expect } from '@playwright/test';

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.getByText('Đăng ký', { exact: true }).click();
  });

  test('TC-02-01: Invalid Username Length (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').fill('stud');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@ssw0rd2026!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('P@ssw0rd2026!');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-02: Password Too Short (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').fill('student_user123');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@s1!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('P@s1!');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-03: Password Missing Alpha (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').fill('student_user123');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('12345678!!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('12345678!!');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-04: Password Missing Number (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').fill('student_user123');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('Password!!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('Password!!');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-05: Password Missing Special (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').fill('student_user123');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('StrongPass123');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('StrongPass123');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-06: Confirm Mismatch (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').fill('student_user123');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@ssw0rd2026!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('Diff789?');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-07: Username Already Taken (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').fill('student1');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@ssw0rd2026!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('P@ssw0rd2026!');
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await expect(page.getByText('Username đã được sử dụng')).toBeVisible();
  });

  test('TC-02-08: Invalid Email Format (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').fill('John Quincey Adams');
    await page.getByPlaceholder('Email').fill('parent.test@com');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@ssw0rd2026!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('P@ssw0rd2026!');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-09: Password Too Short (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').fill('John Quincey Adams');
    await page.getByPlaceholder('Email').fill('parent.test@example.com');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@s1!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('P@s1!');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-10: Password Missing Alpha (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').fill('John Quincey Adams');
    await page.getByPlaceholder('Email').fill('parent.test@example.com');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('12345678!!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('12345678!!');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-11: Password Missing Number (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').fill('John Quincey Adams');
    await page.getByPlaceholder('Email').fill('parent.test@example.com');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('Password!!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('Password!!');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-12: Password Missing Special (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').fill('John Quincey Adams');
    await page.getByPlaceholder('Email').fill('parent.test@example.com');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('StrongPass123');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('StrongPass123');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-13: Confirm Mismatch (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').fill('John Quincey Adams');
    await page.getByPlaceholder('Email').fill('parent.test@example.com');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@ssw0rd2026!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('Diff789?');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-14: Invalid Full Name (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').fill('');
    await page.getByPlaceholder('Email').fill('parent.test@example.com');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@ssw0rd2026!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('P@ssw0rd2026!');
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-15: Email Already Registered (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').fill('John Quincey Adams');
    await page.getByPlaceholder('Email').fill('testparent@example.com');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@ssw0rd2026!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('P@ssw0rd2026!');
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await expect(page.getByText("Email đã được sử dụng")).toBeVisible();
  });

  test('TC-02-16: All Valid (Success) (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').fill('student_user123');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@ssw0rd2026!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('P@ssw0rd2026!');
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await expect(page.getByText('Đăng ký thành công !')).toBeVisible();
  });

  test('TC-02-17: All Valid (Success) (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Email').fill('dinopr@gmail.com');
    await page.getByPlaceholder('Họ và tên').fill('John Adams');
    await page.getByPlaceholder('Mật khẩu', { exact: true }).fill('P@ssw0rd2026!');
    await page.getByPlaceholder('Xác nhận mật khẩu').fill('P@ssw0rd2026!');
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await expect(page.getByText('Đăng ký thành công !')).toBeVisible();
  });
});
