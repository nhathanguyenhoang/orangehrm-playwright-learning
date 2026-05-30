# OrangeHRM Playwright Automation

A self-learning UI automation project using **Playwright** and the **OrangeHRM Open Source demo website**. This project focuses on implementing clean, maintainable test scripts using modern automation design patterns.

---

## 🚀 Features & Highlights

- **Page Object Model (POM):** Enhances code reusability and maintainability.
- **Data-Driven Testing:** Utilizes JSON files to execute tests with multiple datasets.
- **Session Reusability:** Leverages Playwright's `storageState` to reuse login sessions, reducing execution time.
- **CI/CD Integration:** Configured with GitHub Actions for automated test runs on push/pull requests.
- **Rich Reporting:** Generates comprehensive HTML reports for test execution analysis.

---

## 🛠️ Tech Stack

- **Framework:** Playwright (JavaScript)
- **Runtime:** Node.js
- **CI/CD:** GitHub Actions

---

## 📁 Project Structure

```bash
playwright_beginner/
├── .github/workflows/     # CI/CD workflow configurations
├── auth/                  # Stores global authentication state (user.json)
├── docs/                  # Project documentation
├── pages/                 # Page Object Model (POM) classes
│   ├── LoginPage.js
│   └── AdminPage.js
├── practice/              # Scratchpad for learning & experiments
├── test-data/             # JSON files for data-driven testing
│   ├── loginData.json
│   └── adminSearchData.json
├── tests/                 # Test specifications
│   ├── auth/
│   │   └── auth.setup.spec.js # Handles global login setup
│   ├── Login_dataDriven.spec.js
│   ├── Login_withPOM.spec.js
│   └── Admin.spec.js
├── playwright.config.js   # Playwright configuration file
├── package.json
└── README.md
```

---

## 📊 Test Coverage

| Module | Test Case Description | Type |
| :--- | :--- | :--- |
| **Auth** | Valid login & Session saving | Setup / Happy Path |
| **Login** | Valid login using POM | Happy Path |
| | Invalid password | Negative |
| | Invalid username | Negative |
| | Invalid username and password | Negative |
| | Blank username/password validation | Edge Case |
| **Admin** | Search by an existing username | Functional |
| | Search by a non-existent username | Negative |
| | Filter users by User Role | Functional |
| | Filter users by Status | Functional |
| | Reset search form validation | Functional |

---

## ⚙️ Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
npx playwright install
```

### 3. Generate Login Session (`storageState`)
Run the authentication setup first to generate the login session (`auth/user.json`). This prevents logging in repeatedly before every single test case:
```bash
npx playwright test tests/auth/auth.setup.spec.js --headed
```

---

## 🧪 Running Tests

Run all tests in headless mode:
```bash
npx playwright test
```

Run a specific test file:
```bash
npx playwright test tests/Login_dataDriven.spec.js
# Or
npx playwright test tests/Admin.spec.js
```

Run tests with browser visible (Headed mode):
```bash
npx playwright test --headed
```

View HTML Test Report:
```bash
npx playwright show-report
```

---

## 📝 Notes

- This project is primarily built for learning, practicing automation best practices, and building a portfolio.
- Key focus areas: Framework architecture, clean code principles, and optimized test execution using global setup.

---

## 👤 Author

- **Nguyen Hoang Nhat Ha** - *QA Engineer / System Verification Tester*
