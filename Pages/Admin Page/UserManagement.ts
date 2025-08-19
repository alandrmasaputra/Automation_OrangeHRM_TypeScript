import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';
import { step } from '../../helpers/stepHelper';
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
    await step('Go to Admin Page', async () => {
      await this.adminPageNavigation.click();
    })
  }

  async validateFilter(testInfo: TestInfo) {
    await step('Validate User Management Filter', async () => {
      await expect(this.userManagementFilter).toBeVisible();
      await this.attachTextWithExpectedOnCSV(
        this.userManagementFilter,
        testInfo,
        'User Management Filter',
        'expected-text-data/Admin Page/Admin Page - UserManagement.csv',
        'English' // ('English' or 'Indonesian')
      )
    })
  }

  async validateTable(testInfo: TestInfo) {
    await step('Validate User Management Table', async () => {
      await this.expectAllVisible([
        this.userManagementDynamicNumber,
        this.userManagementTableAdd,
        this.userManagementTableRow
      ])
      await this.attachTextWithExpectedOnExcel([
        this.userManagementDynamicNumber,
        this.userManagementTableAdd,
        this.userManagementTableRow
      ],
        testInfo,
        'User Management Table',
        'expected-text-data/Admin Page/Admin Page.xlsx',
        'UserManagementTable',
        'English'
      )
    })
  }
}