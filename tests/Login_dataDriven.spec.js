const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const loginTestData = require('../test-data/loginData.json');


test.describe('Login Data Driven', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  for (const data of loginTestData) {
    test(`[${data.type}] ${data.id} - ${data.name}`, async ({ page }) => {
      await test.step('Open OrangeHRM login page', async () => {
        await loginPage.goto();
      });

      await test.step('Perform login action', async () => {
        if (data.expected === 'required') {
          // For blank credentials test: just click login button without entering data
          await loginPage.submitLogin();
        } else {
          // For other tests: enter credentials and click login
          await loginPage.performLogin(data.user, data.pass);
        }
      });

      await test.step('Verify expected result', async () => {
        const assertions = {
          // SUCCESS ASSERTION: Verify successful login by checking URL
          // After successful login, user should be redirected to dashboard page
          success: async () => {
            await expect(page).toHaveURL(/dashboard/);
          },

          // ERROR ASSERTION: Verify error message for invalid credentials
          // When login fails, an error message should be displayed
          error: async () => {
            await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
          },

          // REQUIRED ASSERTION: Verify validation messages for blank fields
          // When fields are empty, "Required" messages should appear for both fields
          required: async () => {
              await expect(loginPage.requiredMessages).toHaveText([
              'Required',
              'Required',
            ]);
          },
        };

        await assertions[data.expected]();
      });
    });
  }
});