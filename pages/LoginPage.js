class LoginPage {
   
  constructor(page) {
    // Define all page elements (locators)
    this.page = page;
    this.username = page.locator('input[placeholder="Username"]');
    this.password = page.locator('input[placeholder="Password"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.requiredMessages = page.getByText('Required');
    this.loginButton = page.locator('button[type="submit"]');
  }
  // Reusable action methods to reduce code duplication
  async performLogin(user, pass) {
        await this.username.fill(user);
        await this.password.fill(pass);
        await this.loginButton.click();
    }
    
  async goto() {
    await this.page.goto('/web/index.php/auth/login');
    }

  async submitLogin() {
    await this.loginButton.click();
    }

}
module.exports = { LoginPage };