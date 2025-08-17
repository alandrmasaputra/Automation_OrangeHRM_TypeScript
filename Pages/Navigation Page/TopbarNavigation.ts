import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';
import { BaseHelpers } from '../BaseHelpers';
import { ExpectedTextSupportPage, ExpectedTextChangePasswordForm, ExpectedTextAboutPopup } from '../../expected-text-data/Topbar Navigation/TextProfileMenu';

export class TopbarNavigation extends BaseHelpers {
  readonly profileBottomsheet: Locator;
  readonly logoutButton: Locator;
  readonly aboutButton: Locator;
  readonly supportButton: Locator;
  readonly changePasswordButton: Locator;
  readonly aboutPopUp: Locator;
  readonly supportPage: Locator;
  readonly updatePassword: Locator;
  readonly supportPageText: Locator;

  constructor(page: Page) {
    super(page);

    this.profileBottomsheet = page.locator('.oxd-topbar-header-userarea');
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.aboutButton = page.getByRole('menuitem', { name: 'About' });
    this.supportButton = page.getByRole('menuitem', { name: 'Support' });
    this.changePasswordButton = page.getByRole('menuitem', { name: 'Change Password' });
    this.aboutPopUp = page.locator('div[role="document"]');
    this.supportPage = page.locator('p:has-text("Customer Support")');
    this.updatePassword = page.locator('form.oxd-form');
    this.supportPageText = page.locator('div.orangehrm-card-container');
  }

  async clickLogout() {
    await this.profileBottomsheet.click();
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/login/);
  }

  async clickAbout() {
    await this.profileBottomsheet.click();
    await this.aboutButton.click();
    await expect(this.aboutPopUp).toBeVisible();
  }

  async clickSupport() {
    await this.profileBottomsheet.click();
    await this.supportButton.click();
    await expect(this.page).toHaveURL(/support/);
    await expect(this.supportPageText).toBeVisible();
  }

  async clickChangePassword() {
    await this.profileBottomsheet.click();
    await this.changePasswordButton.click();
    await expect(this.page).toHaveURL(/updatePassword/);
    await expect(this.updatePassword).toBeVisible();
  }

  async validateChangePasswordFormText(testInfo: TestInfo, ){
    const formText = await this.getTexts(this.updatePassword);
    await this.attachTextsWithExpected(
      this.updatePassword,
      testInfo,
      'Change Password Form Validation',
        ExpectedTextChangePasswordForm
    );
  }

  async validateSupportPageText(testInfo: TestInfo){
    const supportPageCopy = await this.getTexts(this.supportPageText);
    await this.attachTextsWithExpected(
      this.supportPageText,
      testInfo,
      'Support Page Text Validation',
        ExpectedTextSupportPage
    );
  }

  async validateAboutPopupText(testInfo: TestInfo){
    const boutPopupText = await this.getTexts(this.aboutPopUp);
    await this.attachTextsWithExpected(
      this.aboutPopUp,
      testInfo,
      'Support Page Text Validation',
        ExpectedTextAboutPopup
    );
  }
}