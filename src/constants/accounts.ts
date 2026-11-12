/**
 * Tài khoản demo dùng cho bài tập. Mật khẩu chỉ dùng để seed dữ liệu cục bộ,
 * không phải thông tin đăng nhập thật.
 */
export const DEMO_ACCOUNT = {
  name: 'Nguyễn Minh Anh',
  email: 'demo@minishop.vn',
  phone: '0901234567',
  password: '123456',
} as const;

export const ADMIN_ACCOUNT = {
  name: 'Quản trị viên MiniShop',
  email: 'admin@minishop.vn',
  phone: '0900000001',
  password: 'admin123',
} as const;
