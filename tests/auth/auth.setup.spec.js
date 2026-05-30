const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

test.use({ storageState: undefined });

test('Login and save authentication state', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step('Open OrangeHRM login page', async () => {
    await loginPage.goto();
  });

  await test.step('Login with valid credentials', async () => {
    await loginPage.performLogin('Admin', 'admin123');
  });

  await test.step('Verify user is redirected to the admin page', async () => {
    await page.waitForURL(/dashboard/, { timeout: 60000 });

    await expect(page).toHaveURL(/dashboard/);
  });

  await test.step('Save authentication session', async () => {
    await page.context().storageState({
      path: 'auth/user.json',
    });
  });
});