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
  readonly supportPage: Locator;
  readonly updatePassword: Locator;
  readonly supportPageText: Locator;
  readonly upgradeButton: Locator;
  readonly upgradePage: Locator;

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
    this.upgradeButton = page.locator('a.orangehrm-upgrade-link');
    this.upgradePage = page.locator('div.form-ohrm');
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
      await this.attachTextsWithExpected(
        this.aboutPopUp,
        testInfo,
        'About Popup Text Validation',
        ExpectedTextAboutPopup
      );
    })
  }
}