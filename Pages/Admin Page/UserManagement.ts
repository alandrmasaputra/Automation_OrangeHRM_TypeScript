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
  readonly userRoleForm: Locator;
  readonly statusForm: Locator;
  readonly employeeNameForm: Locator;
  readonly usernameForm: Locator;
  readonly passwordForm: Locator;
  readonly confirmPasswordForm: Locator;
  readonly listBoxUserRoleAdmin: Locator;
  readonly listBoxUserRoleESS: Locator;
  readonly listBoxStatusEnabled: Locator;
  readonly listBoxStatusDisabled: Locator;
  readonly buttonSave: Locator;
  readonly buttonCancel: Locator;
  readonly employeeNameList: Locator;
  readonly tableList: Locator;

  constructor(page: Page) {
    super(page);

    this.adminPageNavigation = page.locator('a:has-text("Admin")');
    this.adminPageUserManagement = page.locator('div.oxd-layout-context');
    this.userManagementFilter = page.locator('div.oxd-table-filter');
    this.userManagementTableAdd = page.locator('div.orangehrm-header-container button');
    this.userManagementDynamicNumber = page.locator('//div[@class="orangehrm-horizontal-padding orangehrm-vertical-padding"]/span');
    this.userManagementTableRow = page.locator('//div[@class="oxd-table-header"]/div[@role="row"]')
    this.userRoleForm = page.locator('//div[@class="oxd-select-wrapper"]').nth(0);
    this.statusForm = page.locator('//div[@class="oxd-select-wrapper"]').nth(1);
    this.employeeNameForm = page.locator(('input[placeholder="Type for hints..."]'));
    this.usernameForm = page.locator('//div[@class="oxd-form-row"]//input').nth(1);
    this.passwordForm = page.locator('//div[@class="oxd-form-row user-password-row"]//input').nth(0);
    this.confirmPasswordForm = page.locator('//div[@class="oxd-form-row user-password-row"]//input').nth(1);
    this.listBoxUserRoleAdmin = page.getByRole('option', { name: 'Admin' });
    this.listBoxUserRoleESS = page.getByRole('option', { name: 'ESS' });
    this.listBoxStatusEnabled = page.getByRole('option', { name: 'Enabled' });
    this.listBoxStatusDisabled = page.getByRole('option', { name: 'Disabled' });
    this.buttonCancel = page.locator('button:has-text("Cancel")');
    this.buttonSave = page.locator('button:has-text("Save")');
    this.employeeNameList = page.getByRole('option', { name: 'Criys Talesia' });
    this.tableList = page.getByRole('rowgroup').nth(1);
  }

  async goToAdminPage() {
    await step('Go to Admin Page', async () => {
      await this.adminPageNavigation.click();
    })
  }

  async clickAddButton() {
    await step('Click Add button', async () => {
      await this.userManagementTableAdd.click();
      await expect(this.page).toHaveURL(/saveSystemUser/);
    })
  }

  async fillFormNewUser(employeeName: string, username: string, password: string, confirmPass: string) {
    await step('Fill form to add new user', async () => {
      await this.userRoleForm.click();
      await this.listBoxUserRoleAdmin.click();
      await this.employeeNameForm.fill(employeeName);
      await this.employeeNameList.click();
      await this.statusForm.click();
      await this.listBoxStatusEnabled.click();
      await this.usernameForm.fill(username);
      await this.passwordForm.fill(password);
      await this.confirmPasswordForm.fill(confirmPass);
    })
  }

  async clickSaveButton() {
    await step('Click Save button', async () => {
      await this.buttonSave.click();
    })
  }

  async validateNewUser(expected: string[]) {
    await step('Validate success add new user', async () => {
      await expect(this.tableList).toBeVisible({ timeout: 10000 });
      const actualTexts = await this.getTexts(this.tableList);
      await this.expectTextsToContain(actualTexts, expected);
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