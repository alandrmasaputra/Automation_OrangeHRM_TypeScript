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
  readonly confirmDeleteButton: Locator;
  readonly deleteSelectedbox: Locator;
  readonly deleteToaster: Locator
  readonly filterUsernameField: Locator;
  readonly buttonSearch: Locator;
  readonly resetSearch: Locator;
  readonly filterEmployeeName: Locator;
  readonly changePasswordCheckbox: Locator;
  readonly successToaster: Locator;

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
    this.confirmDeleteButton = page.locator('button:has-text(" Yes, Delete ")');
    this.deleteSelectedbox = page.locator('button:has-text(" Delete Selected ")');
    this.deleteToaster = page.locator('div#oxd-toaster_1');
    this.filterUsernameField = page.locator('//div[@class="oxd-form-row"]//input').nth(0);
    this.filterEmployeeName = page.locator('input[placeholder="Type for hints..."]');
    this.buttonSearch = page.locator('div.oxd-form-actions button:has-text("Search")');
    this.resetSearch = page.locator('div.oxd-form-actions button:has-text("Reset")');
    this.changePasswordCheckbox = page.locator('div.oxd-checkbox-wrapper span')
    this.successToaster = page.locator('div#oxd-toaster_1:has-text("Successfully Updated")');
  }

  // Dynamic locator for delete user
  private deleteIconbyUsername(username: string): Locator {
    return this.page.locator(
      `//div[text()="${username}"]/../following-sibling::div[4]//*[@class="oxd-icon bi-trash"]`
    );
  }

  private deleteCheckBoxbyUsername(username: string | string[]): Locator {
    return this.page.locator(
      `//div[text()="${username}"]/../preceding-sibling::div/div`
    )
  }

  private editIconbyUsername(username: string): Locator {
    return this.page.locator(
      `//div[text()="${username}"]/../following-sibling::div[4]//*[@class="oxd-icon bi-pencil-fill"]`
    )
  }

  async clickEditUser(username: string) {
    await step('click edit user', async () => {
      await this.editIconbyUsername(username).click();
      await expect(this.page).toHaveURL(/saveSystemUser/, { timeout: 6000 });
    })
  }

  async changeNameAndPassword(username: string) {
    await step('change employee name and password', async () => {
      await this.clickEditUser(username);
      await this.employeeNameForm.fill('Criys Talesia')
      await this.employeeNameList.click();
      await this.changePasswordCheckbox.click();
      await expect(this.passwordForm).toBeVisible();
      await this.passwordForm.fill('TestingTerus123');
      await this.confirmPasswordForm.fill('TestingTerus123');
      await this.clickSaveButton();
      await expect(this.successToaster).toBeVisible();
    })
  }

  async deleteByIcon(username: string) {
    await step('delete user by icon', async () => {
      await this.deleteIconbyUsername(username).click();
      await this.confirmDeleteButton.click();
    })
  }

  async filterByAllField({
    username,
    employeeName,
  }: {
    username: string;
    employeeName: string;
  }) {
    await step('filter by all field', async () => {
      await this.filterUsernameField.fill(username);
      await this.userRoleForm.click();
      await this.listBoxUserRoleAdmin.click();
      await this.filterEmployeeName.fill(employeeName);
      await this.employeeNameList.click();
      await this.statusForm.click();
      await this.listBoxStatusEnabled.click();
      await this.buttonSearch.click();
      await this.tableList.isVisible({ timeout: 7000 });
    })
  }

  async validateFilterUser(expected: string[]) {
    await step('validate filter result', async () => {
      await expect(this.tableList).toBeVisible({ timeout: 10000 });
      const filterResult = await this.getTexts(this.tableList);
      await this.expectTextsToContain(filterResult, expected);
    })

  }

  async deletebyCheckbox(username: string | string[]) {
    await step('delete user by checkbox', async () => {
      await this.deleteCheckBoxbyUsername(username).click();
      await this.deleteSelectedbox.click();
      await this.confirmDeleteButton.click();
    })
  }

  async deletebyCheckboxMultiple(username: string | string[]) {
    await step('delete user by checkbox', async () => {
      for (const user of username) {
        await this.deleteCheckBoxbyUsername(user).click();
      }
      await this.deleteSelectedbox.click();
      await this.confirmDeleteButton.click();
    })
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

  async resetFilterAndValidate(
    filterParams: { username: string; employeeName: string }
  ) {
    await step('Reset filter and validate', async () => {
      await this.filterByAllField(filterParams);
      await expect(this.tableList).toBeVisible({ timeout: 7000 });
      const filterResult = await this.getTexts(this.tableList);
      await this.resetSearch.click();
      await this.tableList.isVisible({ timeout: 10000 });
      const resetResult = await this.getTexts(this.tableList);

      if (filterResult === resetResult) {
        throw new Error(`❌ Failed to reset result`)
      }
    })
  }

  async validateDeleteUserMultiple(expected: string | string[]) {
    await step('Validate delete user', async () => {
      await expect(this.deleteToaster).toBeVisible({ timeout: 6000 });
      await expect(this.tableList).toBeVisible({ timeout: 10000 });
      const actualTexts = await this.getTexts(this.tableList);
      await this.expectTextsNotToContainMultiple(actualTexts, expected);
    });
  }

  async validateDeleteUser(expected: string) {
    await step('Validate delete user', async () => {
      await expect(this.deleteToaster).toBeVisible({ timeout: 6000 });
      await expect(this.tableList).toBeVisible({ timeout: 10000 });
      const actualTexts = await this.getTexts(this.tableList);
      await this.expectTextsNotToContain(actualTexts, expected);
    });
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