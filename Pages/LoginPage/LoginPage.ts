import { expect, TestInfo, type Locator, type Page } from '@playwright/test';
import { step } from '../../helpers/stepHelper';
import { BaseHelpers } from '../BaseHelpers';
import { ExpectedSideBarAdmin } from '../../expected-text-data/Sidebar Navigation List/SideBarNavigationAdmin';
import { ExpectedSideBarESS } from '../../expected-text-data/Sidebar Navigation List/SideBarNavigationESS';

export class LoginPage extends BaseHelpers {
  readonly username: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;
  readonly errorLabelUsername: Locator;
  readonly errorLabelUPassword: Locator;
  readonly forgotPasswordButton: Locator;
  readonly cancelButton: Locator;
  readonly resetPasswordButton: Locator;
  readonly validateSuccessResetPassword: Locator;
  readonly validateInvalidLogin: Locator;
  readonly invalidForgotPasswordError: Locator;
  readonly sideBarNavigationMenu: Locator;
  readonly dashboardItem: Locator;

  constructor(page: Page) {
    super(page);

    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorLabelUsername = page.locator('//form/div[1]//span[text()="Required"]');
    this.errorLabelUPassword = page.locator('//form/div[2]//span[text()="Required"]');
    this.forgotPasswordButton = page.getByText('Forgot your password?');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.resetPasswordButton = page.getByRole('button', { name: 'Reset Password' });
    this.validateSuccessResetPassword = page.locator('h6:has-text("Reset Password link sent successfully")');
    this.validateInvalidLogin = page.getByRole('alert');
    this.invalidForgotPasswordError = page.getByRole('alert');
    this.sideBarNavigationMenu = page.locator('div.oxd-sidepanel-body ul.oxd-main-menu');
    this.dashboardItem = page.locator('div.oxd-layout-context');
  }

  async goto() {
    await step('Navigate to Login Page', async () => {
      await this.page.goto('/');
    })
  }

  async login(username: string, password: string) {
    await step('Input Username, Password and Click login', async () => {
      await this.username.fill(username);
      await this.password.fill(password);
      await this.submitButton.click();
    })
  }

  async forgotPassword(username: string) {
    await this.forgotPasswordButton.click();
    await this.username.fill(username);
    await this.resetPasswordButton.click();
  }

  async cancelForgotPassword() {
    await this.forgotPasswordButton.click();
    await this.cancelButton.click();
    await expect(this.page).toHaveURL(/login/);
  }

  async invalidLoginValidation() {
    await expect(this.validateInvalidLogin).toBeVisible();
    await expect(this.page).toHaveURL(/login/);
    await expect(this.username).toHaveValue('');
    await expect(this.password).toHaveValue('');
  }

  async expectLoggedInAdmin(testInfo: TestInfo) {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.dashboardItem).toBeVisible({ timeout: 6000 })
    await expect(this.sideBarNavigationMenu).toBeVisible({ timeout: 6000 });
    await this.attachTextsWithExpected(
      this.sideBarNavigationMenu,
      testInfo,
      'Sidebar Menu List',
      ExpectedSideBarAdmin
    )
    await this.attachTexts(
      this.dashboardItem,
      testInfo,
      'Dashboard Text'
    )
  }

  async expectLoggedInESS(testInfo: TestInfo) {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.dashboardItem).toBeVisible({ timeout: 6000 })
    await expect(this.sideBarNavigationMenu).toBeVisible({ timeout: 6000 });
    await this.attachTextsWithExpected(
      this.sideBarNavigationMenu,
      testInfo,
      'Sidebar Menu List',
      ExpectedSideBarESS
    )
    await this.attachTexts(
      this.dashboardItem,
      testInfo,
      'Dashboard Text'
    )
  }

  async checkErrorLabelUsername() {
    await expect(this.errorLabelUsername).toBeVisible();
  }

  async checkErrorLabelPassword() {
    await expect(this.errorLabelUPassword).toBeVisible();
  }

  async validateResetPassword() {
    await expect(this.validateSuccessResetPassword).toBeVisible();
    await expect(this.page).toHaveURL(/sendPasswordReset/);
  }

  async validateInvalidForgotPassword() {
    await expect(this.page).toHaveURL(/requestPasswordResetCode/);
    await expect(this.invalidForgotPasswordError).toBeVisible();
    await expect(this.username).toHaveValue('');
  }
}
