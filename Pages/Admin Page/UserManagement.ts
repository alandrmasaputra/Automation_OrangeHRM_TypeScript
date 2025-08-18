import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';
import { BaseHelpers } from '../BaseHelpers';
import { ExpectedTextFilter, ExpectedTextTable } from '../../expected-text-data/Admin Page/UserManagement';

export class UserManagement extends BaseHelpers {
  readonly adminPageNavigation: Locator;
  readonly adminPageUserManagement: Locator;
  readonly userManagementFilter: Locator;
  readonly userManagementTableAdd: Locator;
  readonly userManagementDynamicNumber: Locator;
  readonly userManagementTableRow: Locator;

  constructor(page: Page) {
    super(page);

    this.adminPageNavigation = page.locator('a:has-text("Admin")');
    this.adminPageUserManagement = page.locator('div.oxd-layout-context');
    this.userManagementFilter = page.locator('div.oxd-table-filter');
    this.userManagementTableAdd = page.locator('div.orangehrm-header-container');
    this.userManagementDynamicNumber = page.locator('//div[@class="orangehrm-horizontal-padding orangehrm-vertical-padding"]/span');
    this.userManagementTableRow = page.locator('//div[@class="oxd-table-header"]/div[@role="row"]')
  }

  async goToAdminPage() {
    await this.adminPageNavigation.click();
  }

  async validateFilter(testInfo: TestInfo) {
    await expect(this.userManagementFilter).toBeVisible();
    await this.attachTextsWithExpected(
      this.userManagementFilter,
      testInfo,
      'User Management Filter',
      ExpectedTextFilter
    )
  }

  async validateTable(testInfo: TestInfo) {
    await expect(this.userManagementTableRow).toBeVisible();
    await expect(this.userManagementTableAdd).toBeVisible();
    await expect(this.userManagementDynamicNumber).toBeVisible();
    await this.attachTextsWithMultipleLocator(
      [this.userManagementTableAdd, this.userManagementTableRow, this.userManagementDynamicNumber],
      testInfo,
      'User Management Table',
      ExpectedTextTable
    )
  }
}