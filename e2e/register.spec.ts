import { test, expect, TestInfo } from '@playwright/test';

interface ParentDataSet {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

interface StudentDataSet {
  username: string;
  password: string;
  confirmPassword: string;
}

const datasets: Record<string, { parent: ParentDataSet; student: StudentDataSet }> = {
  chromium: {
    parent: {
      email: 'parent.chromium3@example.com',
      fullName: 'John Quincey Adams',
      password: 'P@ssw0rd2026!',
      confirmPassword: 'P@ssw0rd2026!',
    },
    student: {
      username: 'student_reg_chr3',
      password: 'P@ssw0rd2026!',
      confirmPassword: 'P@ssw0rd2026!',
    },
  },
  firefox: {
    parent: {
      email: 'parent.firefox1@example.com',
      fullName: 'Emily Rose Bennett',
      password: 'P@ssw0rd2026!',
      confirmPassword: 'P@ssw0rd2026!',
    },
    student: {
      username: 'student_reg_ffx1',
      password: 'P@ssw0rd2026!',
      confirmPassword: 'P@ssw0rd2026!',
    },
  },
  edge: {
    parent: {
      email: 'parent.edge@example.com',
      fullName: 'Michael Tran Nguyen',
      password: 'P@ssw0rd2026!',
      confirmPassword: 'P@ssw0rd2026!',
    },
    student: {
      username: 'student_reg_edg',
      password: 'P@ssw0rd2026!',
      confirmPassword: 'P@ssw0rd2026!',
    },
  },
};

function getDataset(info: TestInfo) {
  const browserName = info.project.name;
  return datasets[browserName] ?? datasets['chromium'];
}

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.getByText('Đăng ký', { exact: true }).click();
  });

  test('TC-02-01: Invalid Username Length (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').pressSequentially('stud', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('P@ssw0rd2026!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('P@ssw0rd2026!', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-02: Password Too Short (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').pressSequentially('student_user123', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('P@s1!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('P@s1!', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-03: Password Missing Alpha (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').pressSequentially('student_user123', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('12345678!!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('12345678!!', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-04: Password Missing Number (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').pressSequentially('student_user123', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('Password!!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('Password!!', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-05: Password Missing Special (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').pressSequentially('student_user123', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('StrongPass123', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('StrongPass123', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-06: Confirm Mismatch (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').pressSequentially('student_user123', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('P@ssw0rd2026!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('Diff789?', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-07: Username Already Taken (Student)', async ({ page }) => {
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').pressSequentially('student1', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('P@ssw0rd2026!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('P@ssw0rd2026!', { delay: 50 });
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await expect(page.getByText('Username đã được sử dụng')).toBeVisible();
  });

  test('TC-02-08: Invalid Email Format (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').pressSequentially('John Quincey Adams', { delay: 50 });
    await page.getByPlaceholder('Email').pressSequentially('parent.test@com', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('P@ssw0rd2026!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('P@ssw0rd2026!', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-09: Password Too Short (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').pressSequentially('John Quincey Adams', { delay: 50 });
    await page.getByPlaceholder('Email').pressSequentially('parent.test@example.com', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('P@s1!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('P@s1!', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-10: Password Missing Alpha (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').pressSequentially('John Quincey Adams', { delay: 50 });
    await page.getByPlaceholder('Email').pressSequentially('parent.test@example.com', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('12345678!!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('12345678!!', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-11: Password Missing Number (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').pressSequentially('John Quincey Adams', { delay: 50 });
    await page.getByPlaceholder('Email').pressSequentially('parent.test@example.com', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('Password!!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('Password!!', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-12: Password Missing Special (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').pressSequentially('John Quincey Adams', { delay: 50 });
    await page.getByPlaceholder('Email').pressSequentially('parent.test@example.com', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('StrongPass123', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('StrongPass123', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-13: Confirm Mismatch (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').pressSequentially('John Quincey Adams', { delay: 50 });
    await page.getByPlaceholder('Email').pressSequentially('parent.test@example.com', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('P@ssw0rd2026!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('Diff789?', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-14: Invalid Full Name (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').pressSequentially('', { delay: 50 });
    await page.getByPlaceholder('Email').pressSequentially('parent.test@example.com', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('P@ssw0rd2026!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('P@ssw0rd2026!', { delay: 50 });
    const registerBtn = page.getByRole('button', { name: 'Tạo tài khoản' });
    await expect(registerBtn).toBeDisabled();
  });

  test('TC-02-15: Email Already Registered (Parent)', async ({ page }) => {
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Họ và tên').pressSequentially('John Quincey Adams', { delay: 50 });
    await page.getByPlaceholder('Email').pressSequentially('testparent@example.com', { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially('P@ssw0rd2026!', { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially('P@ssw0rd2026!', { delay: 50 });
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await expect(page.getByText('Email đã được sử dụng')).toBeVisible();
  });

  test('TC-02-16: All Valid (Success) (Student)', async ({ page }, info: TestInfo) => {
    const { student } = getDataset(info);
    await page.getByText('Học sinh', { exact: true }).click();
    await page.getByPlaceholder('Tên đăng nhập').pressSequentially(student.username, { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially(student.password, { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially(student.confirmPassword, { delay: 50 });
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await expect(page.getByText('Đăng ký thành công !')).toBeVisible();
  });

  test('TC-02-17: All Valid (Success) (Parent)', async ({ page }, info: TestInfo) => {
    const { parent } = getDataset(info);
    await page.getByText('Phụ huynh', { exact: true }).click();
    await page.getByPlaceholder('Email').pressSequentially(parent.email, { delay: 50 });
    await page.getByPlaceholder('Họ và tên').pressSequentially(parent.fullName, { delay: 50 });
    await page.getByPlaceholder('Mật khẩu', { exact: true }).pressSequentially(parent.password, { delay: 50 });
    await page.getByPlaceholder('Xác nhận mật khẩu').pressSequentially(parent.confirmPassword, { delay: 50 });
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click();
    await expect(page.getByText('Đăng ký thành công !')).toBeVisible();
  });
});