# Playwright Automation Project Guide

## 1. Mục đích và cách nhìn tổng quan

Project này là một bộ test tự động sử dụng Playwright để kiểm tra giao diện trang demo OrangeHRM.
Mục tiêu chính của project:
- Hiểu cấu trúc test tự động
- Áp dụng Page Object Model (POM)
- Dùng data-driven testing để chạy nhiều trường hợp từ JSON
- Tái sử dụng session bằng `storageState`
- Biết cách debug test khi nó bị fail

Project dành cho học sinh: bạn sẽ học cách đọc code, phân tích test case, và viết test theo cách logic.

---

## 2. Flow code chính

### 2.1 Flow login và setup session
1. `tests/auth/auth.setup.spec.js` chạy đầu tiên trong project `setup`.
2. Trong test, tạo đối tượng `LoginPage`.
3. Gọi `loginPage.goto()` để mở trang login.
4. Gọi `loginPage.performLogin('Admin', 'admin123')` để điền form và submit.
5. Đợi Playwright xác nhận URL chuyển sang `/dashboard/`.
6. Gọi `page.context().storageState({ path: 'auth/user.json' })` để lưu session đã đăng nhập.

Kết quả: file `auth/user.json` chứa cookie và localStorage, dùng lại cho các test khác.

### 2.2 Flow chạy test login với POM
1. `tests/Login_withPOM.spec.js` được Playwright đọc.
2. `test.beforeEach` tạo `LoginPage` và gọi `goto()`.
3. Mỗi test case gọi hành động login khác nhau:
   - `performLogin('Admin','admin123')`
   - `performLogin('Admin','wrongpassword')`
   - `submitLogin()`
   - `performLogin('WrongUser','admin123')`
4. Sau action, test kiểm tra kết quả bằng `expect`:
   - URL chứa `/dashboard/`
   - hoặc hiển thị `Invalid credentials`
   - hoặc hiển thị `Required` cho ô trống

### 2.3 Flow login data-driven
1. `tests/Login_dataDriven.spec.js` tải `loginData.json`.
2. Duyệt từng object trong danh sách dữ liệu.
3. Với mỗi case:
   - mở lại trang login
   - nếu `expected` là `required` thì chỉ click login
   - nếu không thì điền username/password và click
   - chạy assertion tương ứng với `success`, `error` hoặc `required`

### 2.4 Flow test Admin với session đã lưu
1. `tests/Admin.spec.js` dùng `test.use({ storageState: './auth/user.json' })`.
2. Playwright mở browser với session login sẵn.
3. Khi test bắt đầu, `AdminPage.goto()` đi thẳng vào trang admin.
4. Các test lần lượt gọi:
   - `searchByUsername()`
   - `filterByUserRole()`
   - `filterByStatus()`
   - `resetSearch()`
5. Mỗi test kiểm tra kết quả bằng `expect` và locator tương ứng.

---

## 3. Cấu trúc thư mục chính

```
playwright_beginer/
├── auth/                  # Lưu trạng thái đăng nhập đã tạo bằng storageState
│   └── user.json
├── docs/                  # Tài liệu học tập và hướng dẫn
├── pages/                 # Lớp Page Object Model (POM)
│   ├── LoginPage.js
│   └── AdminPage.js
├── tests/                 # Test case thực thi
│   ├── auth/auth.setup.spec.js
│   ├── Login_withPOM.spec.js
│   ├── Login_dataDriven.spec.js
│   └── Admin.spec.js
├── test-data/             # Dữ liệu test dùng trong data-driven test
│   ├── loginData.json
│   └── adminSearchData.json
├── playwright.config.js   # Cấu hình Playwright
├── package.json
└── README.md
```

---

## 3. Giải thích các file chính

### 3.1 `playwright.config.js`

Đây là file cấu hình trung tâm:
- `baseURL`: url gốc của trang web cần test
- `testDir`: thư mục mặc định chứa test
- `use`: thiết lập mặc định cho mọi test
- `projects`: tách project `setup` để tạo session và nhóm `tests` để chạy các test khác

Điều quan trọng:
- `storageState` giúp lưu lại trạng thái đăng nhập
- Test được chia thành hai nhóm để tránh login lại nhiều lần

### 3.2 `pages/LoginPage.js`

Đây là Page Object Model (POM) cho trang Login.
POM giúp tách phần thao tác với trang web ra khỏi phần test logic.

Các phần chính:
- Locator: định nghĩa các phần tử cần thao tác
- Hàm reusable: `goto()`, `performLogin()`, `submitLogin()`

Ví dụ:
```js
async performLogin(user, pass) {
  await this.username.fill(user);
  await this.password.fill(pass);
  await this.loginButton.click();
}
```

### 3.3 `pages/AdminPage.js`

Đây là POM cho trang Admin.
Nó chứa các hành động như:
- `goto()` vào trang quản trị
- `searchByUsername(username)`
- `filterByUserRole(role)`
- `filterByStatus(status)`
- `resetSearch()`

POM giúp test dễ đọc và bảo trì.

### 3.4 `tests/auth/auth.setup.spec.js`

File này dùng để login và ghi `storageState` ra `auth/user.json`.
Nó chỉ chạy 1 lần hoặc khi bạn cần refresh session.

Nguyên lý:
- Mở trang login
- Login với `Admin / admin123`
- Chờ redirect tới dashboard
- Lưu session để test sau dùng lại

### 3.5 `tests/Login_withPOM.spec.js`

File này test Login bằng cách dùng `LoginPage`.
Các case test chính:
- Login thành công
- Sai password
- Để trống username/password
- Sai username

Đây là cách viết test rõ ràng và dễ đọc.

### 3.6 `tests/Login_dataDriven.spec.js`

File này dùng data-driven testing.
Nó đọc dữ liệu từ `test-data/loginData.json` rồi chạy mỗi case tự động.

Ưu điểm:
- Viết 1 test logic, chạy nhiều dữ liệu
- Dễ thêm case mới chỉ bằng cách thêm vào JSON

### 3.7 `tests/Admin.spec.js`

File này kiểm tra phần tìm kiếm và bộ lọc trên trang Admin.
Nó dùng session đã lưu trong `auth/user.json` để mở trang mà không cần login lại.

Các case:
- Tìm kiếm theo username
- Lọc theo role
- Lọc theo status
- Reset form

---

## 4. Cách tư duy khi đọc code

### 4.1 Bước 1: Xác định mục tiêu test

Mỗi test có 3 phần:
1. Chuẩn bị (setup)
2. Hành động (action)
3. Kiểm tra kết quả (assertion)

Ví dụ với `Login_withPOM.spec.js`:
- Setup: mở trang login
- Action: điền username/password và click login
- Assertion: kiểm tra URL hoặc thông báo lỗi

### 4.2 Bước 2: Tách phần thao tác ra POM

Khi thấy test viết nhiều lần cùng locator, chuyển thành POM.
POM giúp:
- không lặp mã
- sửa locator chỉ 1 chỗ
- test dễ đọc hơn

### 4.3 Bước 3: Kiểm tra dữ liệu test

Mỗi test cần dữ liệu rõ ràng.
Data-driven test dùng file JSON như `loginData.json` giúp:
- dễ mở rộng test
- quản lý case test rõ ràng

---

## 5. Cách debug Playwright

### 5.1 Chạy test ở chế độ debug

```bash
npx playwright test --debug tests/Login_withPOM.spec.js
```

Hoặc:
```bash
PWDEBUG=1 npx playwright test tests/Admin.spec.js
```

### 5.2 Dùng `page.pause()`

Trong đoạn code bạn muốn dừng:
```js
await page.pause();
```

Khi chạy test, Playwright sẽ mở Inspector và bạn có thể nhìn trực tiếp DOM, locator, state.

### 5.3 Nhìn log và screenshot

Config hiện tại đã bật:
- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`
- `trace: 'on-first-retry'`

Khi test fail, bạn có thể xem ảnh chụp màn hình và báo cáo HTML.

### 5.4 Debug từng bước

Nếu test fail, hãy kiểm tra:
- URL có đúng không?
- selector có tìm được phần tử không?
- page đã load xong chưa?
- `storageState` đã tạo và dùng đúng chưa?

---

## 6. Step viết một function trong POM

Khi viết một hàm mới, hãy làm theo 4 bước:

1. Xác định mục đích của hàm
2. Chọn locator đúng và rõ ràng
3. Viết hành động trong hàm
4. Dùng hàm đó trong test

Ví dụ muốn tạo hàm click nút Search:

```js
async clickSearch() {
  await this.searchButton.click();
}
```

Sau đó dùng trong `searchByUsername`:

```js
async searchByUsername(username) {
  await this.usernameInput.fill(username);
  await this.clickSearch();
}
```

Lợi ích:
- hàm nhỏ, đơn nhiệm
- dễ đọc/kiểm tra
- tái sử dụng trong nhiều test

---

## 7. Cách viết test case đúng logic

Một test case tốt cần:
- rõ ràng tên case
- không phụ thuộc vào test khác
- chỉ kiểm tra 1 điều chính
- dùng dữ liệu rõ ràng

### Ví dụ logic của test login thành công

1. Mở trang login
2. Nhập username `Admin`
3. Nhập password `admin123`
4. Click login
5. Chờ redirect tới dashboard
6. Assert URL chứa `/dashboard/`

### Ví dụ logic của test login fail

1. Mở trang login
2. Nhập username không đúng hoặc password sai
3. Click login
4. Assert hiển thị thông báo lỗi `Invalid credentials`

### Dùng `test.step()` để tách rõ từng bước

Trong Playwright, `test.step()` giúp báo cáo rõ ràng.

---

## 8. Ví dụ tư duy logic code với `Login_dataDriven.spec.js`

Đây là cách tư duy:

- Chỉ viết 1 test kịch bản
- Dữ liệu test nằm ngoài code
- Mỗi dữ liệu định nghĩa hành động và kỳ vọng
- Trong code chỉ cần chọn assertion theo `expected`

Điều này giúp:
- dễ thêm test case mới
- giữ code test sạch hơn

---

## 9. Những lỗi thường gặp và cách sửa

### 9.1 Locator không đúng

Nếu test không tìm được phần tử:
- thử dùng Playwright Inspector
- lấy selector rõ ràng hơn
- tránh dùng `nth()` nếu DOM dễ thay đổi

### 9.2 `storageState` lỗi

Nếu admin test bị redirect về login:
- kiểm tra `auth/user.json` có tồn tại
- chạy lại `tests/auth/auth.setup.spec.js`
- đảm bảo `storageState` được load đúng đường dẫn

### 9.3 Test chạy chậm

- Dùng `page.waitForURL()` nếu cần đợi redirect rõ ràng
- Dùng `expect(locator).toBeVisible()` để đợi phần tử xuất hiện
- Không dùng `await page.waitForTimeout()` nếu không cần thiết

---

## 10. Kết luận và bài học

Project này phù hợp để học:
- cách tổ chức automation bằng Playwright
- cách tách logic test và thao tác trang bằng POM
- cách dùng data-driven test với JSON
- cách debug khi test fail

Hãy bắt đầu từ một test đơn giản, sau đó mở rộng bằng cách:
- chuyển locator vào POM
- tách hành động thành function
- dùng dữ liệu bên ngoài để chạy nhiều case
- debug bằng Inspector nếu thấy test không đúng

Chúc bạn học tốt và nếu cần mình có thể giúp tiếp:
- giải thích chi tiết từng file trong `pages/`
- sửa `AdminPage.js` cho ổn định hơn
- viết thêm test case mới cho dự án
