class AdminPage {
  constructor(page) {
  this.page = page;

  // Navigation
  this.adminMenu = page.getByRole('link', { name: 'Admin' });

  // Search / Filter section
  this.usernameInput = page.locator('.oxd-input').nth(1);
  this.userRoleDropdown = page.locator('.oxd-select-text').nth(0);
  this.statusDropdown = page.locator('.oxd-select-text').nth(1);

  this.searchButton = page.getByRole('button', { name: 'Search' });
  this.resetButton = page.getByRole('button', { name: 'Reset' });

  this.resultRows = page.locator('.oxd-table-body .oxd-table-card');
  this.noRecordsMessage = page.locator('span:has-text("No Records Found")');

  // Add User section
  this.addButton = page.getByRole('button', { name: 'Add' });
  this.saveButton = page.getByRole('button', { name: 'Save' });

  this.addUserRoleDropdown = page.locator('.oxd-select-text').nth(0);
  this.addStatusDropdown = page.locator('.oxd-select-text').nth(1);

  this.employeeNameInput = page.getByPlaceholder('Type for hints...');

  this.addUsernameInput = page
    .locator('.oxd-input-group')
    .filter({ hasText: 'Username' })
    .locator('input');

  this.passwordInput = page.locator('input[type="password"]').nth(0);
  this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);

  this.successMessage = page.locator('.oxd-toast').filter({
    hasText: 'Successfully Saved',
  });
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

  async clickAddButton() {
    await this.addButton.click();
  }

  async selectUserRole(role) {
    await this.addUserRoleDropdown.click();
    await this.page.getByRole('option', { name: role }).click();
  }

  async selectStatus(status) {
    await this.addStatusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async selectEmployeeName(employeeName) {
  await this.employeeNameInput.fill(employeeName);

  const suggestionOptions = this.page.locator(
    '.oxd-autocomplete-dropdown .oxd-autocomplete-option'
  );

  await suggestionOptions.first().waitFor({
    state: 'visible',
    timeout: 15000,
  });

  // Current OrangeHRM demo autocomplete needs time to load valid employee suggestions
  await this.page.waitForTimeout(3000);

  const optionCount = await suggestionOptions.count();

  if (optionCount > 1) {
    await suggestionOptions.nth(1).click();
    return;
  }

  await suggestionOptions.first().click();
}

  async fillUsername(username) {
    await this.addUsernameInput.fill(username);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async clickSave() {
  await this.saveButton.click();

  await this.page
    .locator('.oxd-toast')
    .filter({ hasText: 'Successfully Saved' })
    .waitFor({
      state: 'visible',
      timeout: 10000,
    });
}
 
  asyncgetResultRowByUsername(username) {
  return this.resultRows.filter({ hasText: username });
}

  async createUser({ username, password, role, employeeName, status }) {
    await this.clickAddButton();
    await this.selectUserRole(role);
    await this.selectEmployeeName(employeeName);
    await this.selectStatus(status);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSave();
  }
}

module.exports = { AdminPage };
