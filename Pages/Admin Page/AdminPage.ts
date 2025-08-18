import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';
import { BaseHelpers } from '../BaseHelpers';
import { ExpectedTextAdminPage } from '../../expected-text-data/Admin Page/AdminPage';

export class AdminPage extends BaseHelpers {
  readonly testDynamicNumber: Locator;
  readonly adminPageNavigation: Locator;

  constructor(page: Page) {
    super(page);

    this.testDynamicNumber = page.locator('//div[@class="orangehrm-horizontal-padding orangehrm-vertical-padding"]/span');
    this.adminPageNavigation = page.locator('a:has-text("Admin")');
  }

  async checkDynamicNumber(testInfo: TestInfo,) {
    await this.adminPageNavigation.click();
    await expect(this.testDynamicNumber).toBeVisible();
    await this.attachTextsWithExpectedDynamicNumber(
      this.testDynamicNumber,
      testInfo,
      'Text Dynamic Number',
      ExpectedTextAdminPage
    )
  }
}