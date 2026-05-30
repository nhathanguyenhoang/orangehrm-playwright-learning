const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.use({ storageState: undefined });

test.describe('OrangeHRM - Login Feature with POM', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);

    await test.step('Open OrangeHRM login page', async () => {
      await loginPage.goto();
    });
  });

  test('[POSITIVE] TC_LOGIN_001 - Verify login succeeds with valid credentials', async ({ page }) => {
    await test.step('Login with valid username and password', async () => {
      await loginPage.performLogin('Admin', 'admin123');
    });

    await test.step('Verify user is redirected to the admin page', async () => {
      await expect(page).toHaveURL(/dashboard/);
    });
  });

  test('[NEGATIVE] TC_LOGIN_002 - Verify error message is displayed when password is invalid', async () => {
    await test.step('Login with valid username and invalid password', async () => {
      await loginPage.performLogin('Admin', 'wrongpassword');
    });

    await test.step('Verify invalid credentials error message is displayed', async () => {
      await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    });
  });

  test('[NEGATIVE] TC_LOGIN_003 - Verify required messages are displayed when username and password are blank', async () => {
    await test.step('Click login button without entering credentials', async () => {
      await loginPage.submitLogin();
    });

    await expect(loginPage.requiredMessages).toHaveText([
      'Required',
      'Required',
    ]);
  });

  test('[NEGATIVE] TC_LOGIN_004 - Verify error message is displayed when username is invalid', async () => {
    await test.step('Login with invalid username and valid password', async () => {
      await loginPage.performLogin('WrongUser', 'admin123');
    });

    await test.step('Verify invalid credentials error message is displayed', async () => {
      await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    });
  });
});