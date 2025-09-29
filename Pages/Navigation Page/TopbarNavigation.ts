import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';
import { BaseHelpers } from '../BaseHelpers';
import { step } from '../../helpers/stepHelper';
import { ExpectedTextSupportPage, ExpectedTextChangePasswordForm, ExpectedTextAboutPopup } from '../../expected-text-data/Topbar Navigation/TextProfileMenu';

export class TopbarNavigation extends BaseHelpers {
  readonly profileBottomsheet: Locator;
  readonly logoutButton: Locator;
  readonly aboutButton: Locator;
  readonly supportButton: Locator;
  readonly changePasswordButton: Locator;
  readonly aboutPopUp: Locator;
  readonly aboutPopUpDetail: Locator;
  readonly supportPage: Locator;
  readonly updatePassword: Locator;
  readonly supportPageText: Locator;
  readonly upgradeButton: Locator;
  readonly upgradePage: Locator;
  readonly currentPasswordField: Locator;
  readonly passwordField: Locator;
  readonly confirmPassword: Locator;
  readonly successEditPassswordToats: Locator;
  readonly failedEditPasswordToasts: Locator;
  readonly cancelButtonChangePassword: Locator;
  readonly saveButtonChangePassword: Locator;
  readonly errorLabelCurrentPassword: Locator;
  readonly errorLabelPasswordField: Locator;
  readonly errorLabelConfirmPassword: Locator;

  constructor(page: Page) {
    super(page);

    this.profileBottomsheet = page.locator('.oxd-topbar-header-userarea');
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.aboutButton = page.getByRole('menuitem', { name: 'About' });
    this.supportButton = page.getByRole('menuitem', { name: 'Support' });
    this.changePasswordButton = page.getByRole('menuitem', { name: 'Change Password' });
    this.aboutPopUp = page.locator('div[role="document"]');
    this.aboutPopUpDetail = page.locator('//div[@class="oxd-grid-2 orangehrm-about"]');
    this.supportPage = page.locator('p:has-text("Customer Support")');
    this.updatePassword = page.locator('form.oxd-form');
    this.supportPageText = page.locator('div.orangehrm-card-container');
    this.upgradeButton = page.locator('a.orangehrm-upgrade-link');
    this.upgradePage = page.locator('div.form-ohrm');
    this.currentPasswordField = page.locator('//div[@class="oxd-form-row"]//input');
    this.passwordField = page.locator('//div[@class="oxd-form-row user-password-row"]//input').nth(0);
    this.confirmPassword = page.locator('//div[@class="oxd-form-row user-password-row"]//input').nth(1);
    this.successEditPassswordToats = page.locator('div#oxd-toaster_1:has-text("Successfully Saved")');
    this.failedEditPasswordToasts = page.locator('div#oxd-toaster_1:has-text("Current Password is Incorrect")');
    this.cancelButtonChangePassword = page.locator('button:has-text("Cancel")');
    this.saveButtonChangePassword = page.locator('button:has-text("Save")');
    this.errorLabelCurrentPassword = page.locator('(//div[@class= "oxd-input-group oxd-input-field-bottom-space"])[1]/span');
    this.errorLabelPasswordField = page.locator('(//div[@class= "oxd-input-group oxd-input-field-bottom-space"])[2]/span');
    this.errorLabelConfirmPassword = page.locator('(//div[@class= "oxd-input-group oxd-input-field-bottom-space"])[3]/span');
  }

  async inputUpdatePasswordForm(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    await step('Input current password, Password, Confirm password', async () => {
      await this.currentPasswordField.fill(currentPassword);
      await this.passwordField.fill(newPassword);
      await this.confirmPassword.fill(confirmNewPassword);
      await this.saveButtonChangePassword.click();
    })
  }

  async inputUpdatePasswordFormWithoutCurrentPassword(
    newPassword: string,
    confirmNewPassword: string
  ) {
    await step('Input Password, Confirm password', async () => {
      await this.passwordField.fill(newPassword);
      await this.confirmPassword.fill(confirmNewPassword);
      await this.saveButtonChangePassword.click();
    })

    await step('Current Password empty validation', async () => {
      await expect(this.errorLabelCurrentPassword).toBeVisible();
      await expect(this.errorLabelCurrentPassword).toHaveText('Required');
      await expect(this.passwordField).toHaveValue(newPassword);
      await expect(this.confirmPassword).toHaveValue(confirmNewPassword);
    })
  }

  async inputUpdatePasswordFormWithoutNewPassword(
    currentPassword: string,
    confirmNewPassword: string
  ) {
    await step('Input Password, Confirm password', async () => {
      await this.currentPasswordField.fill(currentPassword);
      await this.confirmPassword.fill(confirmNewPassword);
      await this.saveButtonChangePassword.click();
    })

    await step('New Password empty validation', async () => {
      await expect(this.errorLabelPasswordField).toBeVisible();
      await expect(this.errorLabelPasswordField).toHaveText('Required');
      await expect(this.errorLabelConfirmPassword).toBeVisible();
      await expect(this.errorLabelConfirmPassword).toHaveText('Passwords do not match');
      await expect(this.currentPasswordField).toHaveValue(currentPassword);
      await expect(this.confirmPassword).toHaveValue(confirmNewPassword);
    })
  }

  async inputUpdatePasswordFormWithoutConfirmPassword(
    currentPassword: string,
    newPassword: string
  ) {
    await step('Input Password, Confirm password', async () => {
      await this.currentPasswordField.fill(currentPassword);
      await this.passwordField.fill(newPassword);
      await this.saveButtonChangePassword.click();
    })

    await step('Confirm password empty validation', async () => {
      await expect(this.errorLabelConfirmPassword).toBeVisible();
      await expect(this.errorLabelConfirmPassword).toHaveText('Passwords do not match');
      await expect(this.currentPasswordField).toHaveValue(currentPassword);
      await expect(this.passwordField).toHaveValue(newPassword);
    })
  }

  async inputUpdatePasswordFormValid(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    await this.inputUpdatePasswordForm(currentPassword, newPassword, confirmNewPassword);

    await step('Success change password validation', async () => {
      await expect(this.successEditPassswordToats).toBeVisible({ timeout: 6000 });
      await expect(this.page).toHaveURL(/updatePassword/);
      await expect(this.currentPasswordField).toHaveValue('');
      await expect(this.passwordField).toHaveValue('');
      await expect(this.confirmPassword).toHaveValue('');
    })
  }

  async inputUpdatePasswordFormInvalid(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    await this.inputUpdatePasswordForm(currentPassword, newPassword, confirmNewPassword);

    await step('Failed change password validation', async () => {
      await expect(this.failedEditPasswordToasts).toBeVisible({ timeout: 6000 });
      await expect(this.page).toHaveURL(/updatePassword/);
      await expect(this.currentPasswordField).toHaveValue(currentPassword);
      await expect(this.passwordField).toHaveValue(newPassword);
      await expect(this.confirmPassword).toHaveValue(confirmNewPassword);
    })
  }

  async inputUpdatePasswordFormNotMatch(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    await this.inputUpdatePasswordForm(currentPassword, newPassword, confirmNewPassword);

    await step('Password not match validation', async () => {
      await expect(this.errorLabelConfirmPassword).toBeVisible();
      await expect(this.errorLabelConfirmPassword).toHaveText('Passwords do not match');
      await expect(this.page).toHaveURL(/updatePassword/);
      await expect(this.currentPasswordField).toHaveValue(currentPassword);
      await expect(this.passwordField).toHaveValue(newPassword);
      await expect(this.confirmPassword).toHaveValue(confirmNewPassword);
    })
  }

  async inputUpdatePasswordFormNoNumber(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    await this.inputUpdatePasswordForm(currentPassword, newPassword, confirmNewPassword);

    await step('Password field validation', async () => {
      await expect(this.errorLabelPasswordField).toBeVisible();
      await expect(this.errorLabelPasswordField).toHaveText('Your password must contain minimum 1 number');
      await expect(this.page).toHaveURL(/updatePassword/);
      await expect(this.currentPasswordField).toHaveValue(currentPassword);
      await expect(this.passwordField).toHaveValue(newPassword);
      await expect(this.confirmPassword).toHaveValue(confirmNewPassword);
    })
  }

  async clickLogout() {
    await step('Click Logout on Profile Bottomsheet', async () => {
      await this.profileBottomsheet.click();
      await this.logoutButton.click();
      await expect(this.page).toHaveURL(/login/);
    })
  }

  async clickAbout() {
    await step('Click About on Profile Bottomsheet', async () => {
      await this.profileBottomsheet.click();
      await this.aboutButton.click();
    })
  }

  async clickSupport() {
    await step('Click Support on Profile Bottomsheet', async () => {
      await this.profileBottomsheet.click();
      await this.supportButton.click();
    })
  }

  async clickChangePassword() {
    await step('Click change password on Profile Bottomsheet', async () => {
      await this.profileBottomsheet.click();
      await this.changePasswordButton.click();
    })
  }

  async clickCancelChangePassword() {
    await step('Click cancel button', async () => {
      await this.cancelButtonChangePassword.click();
    })

    await step('Validate cancel button', async () => {
      await expect(this.page).toHaveURL(/dashboard/)
    })
  }

  async clickUpgradeButton(testInfo: TestInfo) {
    await step('Click Upgrade Button', async () => {
      await this.validateNewTab(() => this.upgradeButton.click(), testInfo, {
        expectedUrl: /upgrade-to-advanced/,
        expectedLocator: this.upgradePage,
        screenshotName: "UpgradeTab"
      });
    })
  }

  async validateChangePasswordFormText(testInfo: TestInfo,) {
    await step('Click change password on Profile Bottomsheet', async () => {
      await expect(this.page).toHaveURL(/updatePassword/);
      await expect(this.updatePassword).toBeVisible();
      await this.attachTextsWithExpected(
        this.updatePassword,
        testInfo,
        'Change Password Form Validation',
        ExpectedTextChangePasswordForm
      );
    })
  }

  async validateSupportPageText(testInfo: TestInfo) {
    await step('Validate Support Page', async () => {
      await expect(this.page).toHaveURL(/support/);
      await expect(this.supportPageText).toBeVisible();
      await this.attachTextsWithExpected(
        this.supportPageText,
        testInfo,
        'Support Page Text Validation',
        ExpectedTextSupportPage
      );
    })
  }

  async validateAboutPopupText(testInfo: TestInfo) {
    await step('Validate About Popup', async () => {
      await expect(this.aboutPopUp).toBeVisible();
      await expect(this.aboutPopUpDetail).toBeVisible({ timeout: 6000 })
      await this.attachTextsWithExpected(
        this.aboutPopUp,
        testInfo,
        'About Popup Text Validation',
        ExpectedTextAboutPopup
      );
    })
  }
}