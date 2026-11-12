# MiniShop – Bài tập React Native + Expo

Ứng dụng mua sắm mini xây dựng bằng **React Native (Expo)**, hoàn thiện theo yêu cầu bài tập:

- Điều hướng **bottom tabs + stack**, chạm vào sản phẩm để mở **trang chi tiết**.
- Component tái sử dụng **`CategorySelector`**, chọn danh mục sẽ mở **danh sách sản phẩm đã lọc**.
- **Đăng ký / đăng nhập** lưu cục bộ, có phân quyền **admin / user**.
- **Khu quản trị** đầy đủ: quản lý người dùng, loại sản phẩm, sản phẩm.
- **Giỏ hàng, thanh toán, đặt hàng, lịch sử mua hàng** và **cập nhật thông tin cá nhân**.

---

## Công nghệ & phiên bản

| Thành phần | Phiên bản |
| --- | --- |
| Expo SDK | `~58.0.23` |
| React Native | `0.88.1` |
| React | `19.3.0` |
| Expo Router | `~58.0.30` (file-based routing, JS tabs) |
| TypeScript | `~6.0.3` |
| AsyncStorage | `2.2.0` |
| Expo Crypto | `~58.0.7` |

Các phiên bản được cài bằng `npx expo install` để tương thích với SDK 58. Chạy `npx expo-doctor` đạt **20/20** kiểm tra.

---

## Yêu cầu môi trường

- Node.js 20 LTS trở lên (khuyến nghị Node 22).
- npm.
- Điện thoại cài **Expo Go**, máy ảo Android/iOS, hoặc trình duyệt để chạy bản web.

## Cài đặt & chạy

```bash
cd D:\BaiTapReactNative
npm install
npx expo start
```

Sau khi Metro khởi động:

- Quét mã QR bằng **Expo Go** để chạy trên điện thoại.
- Nhấn `a` để mở Android emulator.
- Nhấn `i` để mở iOS simulator (macOS).
- Nhấn `w` để mở trên trình duyệt web.

Chạy trực tiếp từng nền tảng:

```bash
npm run android
npm run ios
npm run web
```

---

## Tài khoản demo & phân quyền

### Tài khoản có sẵn

| Vai trò | Email | Mật khẩu | Ghi chú |
| --- | --- | --- | --- |
| **Admin** | `admin@minishop.vn` | `admin123` | Tài khoản admin gốc, luôn được bảo đảm tồn tại |
| **User** | `demo@minishop.vn` | `123456` | Chỉ seed ở lần chạy đầu tiên, có thể bị admin xóa |

Tại màn hình đăng nhập có hai nút **Điền ngay** riêng cho admin và người dùng demo. Đăng nhập bằng tài khoản admin sẽ tự chuyển đến `/admin`; tài khoản user chuyển về trang chủ `/`.

### Quy tắc vai trò

- Tài khoản đăng ký mới luôn có vai trò `user`.
- Admin có thể **cấp quyền admin** hoặc **chuyển một tài khoản khác về user**.
- Không thể tự hạ quyền hoặc tự xóa tài khoản đang đăng nhập.
- Không thể đổi vai trò hoặc xóa tài khoản admin gốc `admin@minishop.vn`.
- Hệ thống luôn bảo đảm còn ít nhất một admin.
- User không truy cập được các route `/admin/*`; admin đăng nhập nhầm vào khu user vẫn có thể dùng tab **Home của user**.

### Lưu trữ cục bộ

| Khóa AsyncStorage | Nội dung |
| --- | --- |
| `@minishop/users/v1` | Danh sách tài khoản và mật khẩu đã băm |
| `@minishop/session/v1` | ID người dùng đang đăng nhập |
| `@minishop/catalog/v1` | Danh mục + sản phẩm do admin chỉnh sửa |
| `@minishop/cart/v1/<userId>` | Giỏ hàng riêng của từng người dùng |
| `@minishop/orders/v1` | Toàn bộ đơn hàng, lọc theo người dùng khi hiển thị |

Mật khẩu được băm **SHA-256 + salt** trước khi lưu. Phiên đăng nhập, danh mục, sản phẩm, giỏ hàng và đơn hàng đều được khôi phục sau khi tải lại ứng dụng.

---

## Chức năng & vị trí code

### 1. Điều hướng tabs + stack

**Khu người dùng** gồm 4 tab: Trang chủ, Danh mục, Yêu thích, Tài khoản.

- Code: `src/app/(tabs)/_layout.tsx`
- Các màn stack dùng chung: `/category/[categoryId]`, `/product/[id]`, `/cart`, `/checkout`, `/orders`, `/profile/edit`.
- Code guard: `src/app/_layout.tsx`

**Khu admin** có đúng 4 tab theo yêu cầu: **Home của user**, **Home của admin**, **Signup**, **Login**.

- Code: `src/app/admin/(tabs)/_layout.tsx`
- Tab **Home của user** hiển thị nguyên giao diện cửa hàng dành cho người dùng.
- Tab **Home của admin** là bảng điều khiển quản trị.
- Tab **Signup** và **Login** dùng lại màn đăng ký/đăng nhập hiện có.
- Các màn quản lý được mở dưới dạng stack: `/admin/users`, `/admin/categories`, `/admin/category-form`, `/admin/products`, `/admin/product-form`.

Route guard dùng `Stack.Protected`:

- Chưa đăng nhập chỉ vào được `login` / `register`.
- Người dùng đã đăng nhập vào được khu mua sắm và các màn stack mua hàng.
- Chỉ tài khoản `role === 'admin'` mới vào được `/admin`.
- Khi đã đăng nhập, truy cập `/login` hoặc `/register` sẽ được chuyển hướng theo vai trò.

### 2. Đăng ký / đăng nhập

- Code: `src/context/AuthContext.tsx`
- Đăng ký thành công tự động đăng nhập.
- Validate: email đúng định dạng, số điện thoại Việt Nam 10 số, mật khẩu tối thiểu 6 ký tự, nhập lại mật khẩu khớp.
- Khi nâng cấp từ dữ liệu cũ, user chưa có trường `role` được tự động gán `user`.
- Tài khoản demo bị xóa sẽ không xuất hiện lại; tài khoản admin gốc được tạo lại nếu thiếu.

### 3. Khu quản trị admin

**Header dùng chung** – `src/components/Header.tsx`

- Hiển thị avatar, họ tên, email, nhãn **ADMIN**, mô tả màn hiện tại và nút đăng xuất.
- Có mặt trên bảng điều khiển và toàn bộ màn quản lý người dùng / danh mục / sản phẩm.

**Bảng điều khiển** – `src/app/admin/(tabs)/index.tsx`

- Thống kê số người dùng, danh mục, sản phẩm.
- Nút **Quản lý user**, **Quản lý loại sản phẩm**, **Quản lý sản phẩm**.
- Liên kết xem cửa hàng dưới góc nhìn người dùng.

**Quản lý người dùng** – `src/app/admin/users.tsx`

- Xem danh sách, email, số điện thoại, ngày tham gia và vai trò.
- Cấp quyền admin / chuyển về user.
- Xóa người dùng có xác nhận.
- Khóa thao tác với chính mình và tài khoản admin gốc.

**Quản lý loại sản phẩm** – `src/app/admin/categories.tsx`, `category-form.tsx`

- Thêm, sửa, xóa danh mục.
- Chọn biểu tượng và bộ màu có sẵn, xem trước ngay trong form.
- Nút **Thêm sản phẩm cho loại này** mở form sản phẩm với danh mục được điền trước.
- Không cho xóa danh mục khi vẫn còn sản phẩm thuộc danh mục đó.

**Quản lý sản phẩm** – `src/app/admin/products.tsx`, `product-form.tsx`

- Thêm, sửa, xóa sản phẩm; tìm theo tên sản phẩm hoặc tên danh mục.
- Form hỗ trợ tên, danh mục, giá bán, giá gốc, nhãn nổi bật, đánh giá, số đã bán, URL ảnh, mô tả ngắn và mô tả chi tiết.
- Sản phẩm seed dùng ảnh đóng gói trong `assets/products/`; sản phẩm admin tạo có thể dùng URL ảnh hoặc để trống và hiển thị placeholder.
- Mọi thay đổi danh mục/sản phẩm được lưu vào catalog và phản ánh ngay trên cửa hàng.

### 4. Cửa hàng dành cho người dùng

- Trang chủ: tìm kiếm không phân biệt dấu tiếng Việt, chọn danh mục, thẻ sản phẩm, nút giỏ hàng kèm badge số lượng.
  - Code: `src/app/(tabs)/index.tsx`
- Tab Danh mục: xem dạng grid và mở danh sách sản phẩm theo loại.
  - Code: `src/app/(tabs)/categories.tsx`, `src/app/category/[categoryId].tsx`
- Tab Yêu thích: lưu sản phẩm bằng AsyncStorage, badge trên tab.
  - Code: `src/app/(tabs)/favorites.tsx`, `src/context/FavoritesContext.tsx`
- Chi tiết sản phẩm: ảnh lớn, giảm giá, đánh giá, mô tả, thông số, màu sắc, yêu thích, **Thêm vào giỏ** và **Mua ngay**.
  - Code: `src/app/product/[id].tsx`

### 5. Giỏ hàng, thanh toán & đơn hàng

- **Giỏ hàng** – `src/app/cart.tsx`
  - Tăng/giảm số lượng, xóa từng sản phẩm, xóa toàn bộ, tính tạm tính theo thời gian thực.
  - Giỏ hàng được lưu riêng cho từng tài khoản.
- **Thanh toán** – `src/app/checkout.tsx`
  - Nhập người nhận, số điện thoại, địa chỉ, ghi chú.
  - Chọn **COD** hoặc **chuyển khoản ngân hàng**.
  - Phí vận chuyển `30.000₫`, miễn phí cho đơn từ `5.000.000₫`.
  - Đặt hàng thành công sẽ tạo đơn trạng thái **Chờ xác nhận**, xóa giỏ hàng và chuyển tới lịch sử mua hàng.
- **Lịch sử mua hàng** – `src/app/orders.tsx`
  - Hiển thị mã đơn, thời gian, trạng thái, sản phẩm, người nhận, địa chỉ, thanh toán, ghi chú và tổng tiền.
  - Đơn hàng lưu ảnh chụp thông tin sản phẩm tại thời điểm mua, nên xóa sản phẩm khỏi cửa hàng không làm mất lịch sử.
- **Context** – `src/context/CartContext.tsx`, `src/context/OrdersContext.tsx`

### 6. Cập nhật thông tin người dùng

- Code: `src/app/profile/edit.tsx`
- Cho phép đổi họ tên và số điện thoại; email chỉ đọc.
- Validate họ tên tối thiểu 2 ký tự và số điện thoại Việt Nam 10 số.
- Sau khi lưu, thông tin mới hiển thị ngay ở tab Tài khoản và được điền sẵn khi thanh toán.
- Tab Tài khoản có các lối tắt: cập nhật thông tin, giỏ hàng, lịch sử mua hàng, yêu thích, danh mục và trang quản trị (nếu là admin).

---

## Cấu trúc project

```text
BaiTapReactNative/
├── assets/
│   ├── products/                 # 8 ảnh sản phẩm PNG
│   ├── icon.png
│   └── splash-icon.png
├── scripts/
│   └── generate-product-images.ps1
├── src/
│   ├── app/                      # Expo Router (file-based routing)
│   │   ├── _layout.tsx           # Providers + auth guard theo vai trò
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── cart.tsx
│   │   ├── checkout.tsx
│   │   ├── orders.tsx
│   │   ├── +not-found.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx       # 4 tab người dùng
│   │   │   ├── index.tsx         # Trang chủ + tìm kiếm + giỏ hàng
│   │   │   ├── categories.tsx    # Danh mục dạng grid
│   │   │   ├── favorites.tsx
│   │   │   └── profile.tsx
│   │   ├── category/
│   │   │   └── [categoryId].tsx  # Danh sách sản phẩm theo danh mục
│   │   ├── product/
│   │   │   └── [id].tsx          # Chi tiết sản phẩm
│   │   ├── profile/
│   │   │   └── edit.tsx          # Cập nhật thông tin
│   │   └── admin/
│   │       ├── _layout.tsx       # Stack khu quản trị
│   │       ├── users.tsx
│   │       ├── categories.tsx
│   │       ├── category-form.tsx
│   │       ├── products.tsx
│   │       ├── product-form.tsx
│   │       └── (tabs)/
│   │           ├── _layout.tsx   # Đúng 4 tab admin
│   │           ├── user-home.tsx
│   │           ├── index.tsx     # Bảng điều khiển admin
│   │           ├── signup.tsx
│   │           └── login.tsx
│   ├── components/
│   │   ├── AuthField.tsx
│   │   ├── CategorySelector.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FormTextArea.tsx
│   │   ├── Header.tsx            # Thông tin admin + đăng xuất
│   │   ├── PrimaryButton.tsx
│   │   ├── ProductCard.tsx
│   │   └── SectionHeading.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── CatalogContext.tsx
│   │   ├── FavoritesContext.tsx
│   │   └── OrdersContext.tsx
│   ├── data/
│   │   ├── categories.ts
│   │   ├── orders.ts
│   │   └── products.ts
│   ├── theme/
│   │   └── index.ts
│   └── utils/
│       ├── confirm.ts
│       ├── format.ts
│       └── validation.ts
├── app.json
├── package.json
└── tsconfig.json
```

---

## Scripts

| Lệnh | Mô tả |
| --- | --- |
| `npm start` / `npx expo start` | Chạy Metro / Expo dev server |
| `npm run android` | Mở trên Android |
| `npm run ios` | Mở trên iOS |
| `npm run web` | Mở trên trình duyệt |
| `npm run typecheck` | Kiểm tra TypeScript (`tsc --noEmit`) |
| `npm run doctor` | Kiểm tra cấu hình/phiên bản (`expo-doctor`) |

Xuất bản web tĩnh:

```bash
npx expo export --platform web
```

Kết quả nằm trong `dist/`.

---

## Kết quả kiểm tra

- `npx tsc --noEmit`: **pass**, không lỗi.
- `npx expo-doctor`: **20/20 check pass**.
- `npx expo export --platform web`: **pass**, xuất **31 route tĩnh**.
- Kiểm thử end-to-end bằng Playwright trên bản web (viewport điện thoại 390×844), tất cả các luồng sau đều pass:
  1. Đăng ký tài khoản mới và tự động đăng nhập.
  2. Đăng xuất quay về màn đăng nhập.
  3. Đăng nhập admin, chuyển đúng tới bảng điều khiển, hiển thị Header và đúng 4 tab admin.
  4. Tải lại trang vẫn giữ phiên admin.
  5. Các tab Signup, Login, Home của admin, Home của user hoạt động đúng.
  6. Admin cấp quyền admin rồi hạ quyền người dùng.
  7. Admin xóa người dùng.
  8. Admin thêm, sửa danh mục.
  9. Admin thêm sản phẩm từ màn danh mục với danh mục điền trước.
  10. Admin sửa sản phẩm; sản phẩm mới xuất hiện trên cửa hàng.
  11. Admin xóa sản phẩm, xóa danh mục.
  12. Người dùng demo đăng nhập, mở chi tiết sản phẩm và thêm vào giỏ.
  13. Cập nhật số lượng trong giỏ, kiểm tra lại tổng tiền.
  14. Thanh toán, chọn chuyển khoản, đặt hàng thành công.
  15. Lịch sử mua hàng hiển thị mã đơn, trạng thái và tổng tiền; giỏ hàng được xóa.
  16. Cập nhật họ tên người dùng và thấy thay đổi trên trang tài khoản.
  17. Mở lịch sử mua hàng từ trang tài khoản và đăng xuất.

---

## Ghi chú

- Đây là **xác thực demo cục bộ** phục vụ bài tập, không dùng cho production. Mật khẩu được băm SHA-256 kèm salt cố định nhưng AsyncStorage không mã hoá; không nên dùng lại nguyên mẫu này cho ứng dụng thật.
- Muốn xoá toàn bộ tài khoản/phiên/danh mục/đơn hàng đã lưu: xoá dữ liệu ứng dụng (Android/iOS) hoặc `localStorage` của trang web.
- Muốn cài lại dependency đúng phiên bản SDK: chạy `npx expo install` thay vì tự ý nâng cấp package.
