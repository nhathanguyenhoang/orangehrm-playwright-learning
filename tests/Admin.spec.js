const { test, expect } = require('@playwright/test');
const { AdminPage } = require('../pages/AdminPage');
const adminSearchData = require('../test-data/adminSearchData.json');

test.use({
  storageState: './auth/user.json',
});


test.describe('OrangeHRM - Admin Search and Filter Feature', () => {
  let adminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);

    await test.step('Navigate to Admin page', async () => {
      await adminPage.goto();
      await expect(page).toHaveURL(/admin/);
    });
  });

  for (const data of adminSearchData.usernameSearch) {
    test(`[${data.type}] ${data.id} - ${data.name}`, async () => {
      await test.step('Search user by username', async () => {
        await adminPage.searchByUsername(data.username);
      });

      await test.step('Verify username search result', async () => {
        if (data.expected === 'result') {
          await expect(adminPage.resultRows.first()).toBeVisible();
        }

        if (data.expected === 'noRecord') {
          await expect(adminPage.noRecordsMessage).toBeVisible();
        }
      });
    });
  }

  for (const data of adminSearchData.roleFilter) {
    test(`[${data.type}] ${data.id} - ${data.name}`, async () => {
      await test.step('Filter users by role', async () => {
        await adminPage.filterByUserRole(data.role);
      });

      await test.step('Verify role filter result', async () => {
        await expect(adminPage.resultRows.first()).toBeVisible();
      });
    });
  }

for (const data of adminSearchData.statusFilter) {
  test(`[${data.type}] ${data.id} - ${data.name}`, async () => {
    await test.step('Filter users by status', async () => {
      await adminPage.filterByStatus(data.status);
    });

    await test.step('Verify status filter result', async () => {
      const rowCount = await adminPage.resultRows.count();

      if (rowCount > 0) {
        await expect(adminPage.resultRows.first()).toContainText(data.status);
      } else {
        await expect(adminPage.resultRows).toHaveCount(0);
      }
    });
  });
}

  test('[POSITIVE] TC_ADMIN_006 - Verify reset button clears search criteria', async () => {
    await test.step('Search user by username', async () => {
      await adminPage.usernameInput.fill('Admin');
      await adminPage.clickSearch();
    });

    await test.step('Reset search form', async () => {
      await adminPage.resetSearch();
    });

    await test.step('Verify username field is cleared', async () => {
      await expect(adminPage.usernameInput).toHaveValue('');
    });
  });
});