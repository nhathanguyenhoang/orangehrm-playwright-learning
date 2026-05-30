class AdminPage {
  constructor(page) {
    this.page = page;

    this.adminMenu = page.getByRole('link', { name: 'Admin' });

    this.usernameInput = page.locator('.oxd-input').nth(1);

    this.userRoleDropdown = page.locator('.oxd-select-text').nth(0);
    this.statusDropdown = page.locator('.oxd-select-text').nth(1);

    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });

    this.resultRows = page.locator('.oxd-table-body .oxd-table-card');
    this.noRecordsMessage = page.locator('span:has-text("No Records Found")');
  }

  async gotoAdminPage() {
    await this.adminMenu.click();
    await this.page.waitForURL(/admin/, { timeout: 60000 });
  }

    async goto() {
    await this.page.goto('web/index.php/admin/viewSystemUsers');
    }

  async searchByUsername(username) {
    await this.usernameInput.fill(username);
    await this.clickSearch();
  }

  async filterByUserRole(role) {
    await this.userRoleDropdown.click();
    await this.page.getByRole('option', { name: role }).click();
    await this.clickSearch();
  }

  async filterByStatus(status) {
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
    await this.clickSearch();
  }

  async clickSearch() {
    await this.searchButton.click();
  }

  async resetSearch() {
    await this.resetButton.click();
  }
  async getFirstResultRowText() {
  return await this.resultRows.first().textContent();
}

async isNoRecordsDisplayed() {
  return await this.noRecordsMessage.isVisible().catch(() => false);
}
}

module.exports = { AdminPage };