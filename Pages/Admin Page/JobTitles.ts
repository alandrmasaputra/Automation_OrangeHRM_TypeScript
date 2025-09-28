import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';
import { step } from '../../helpers/stepHelper';
import { BaseHelpers } from '../BaseHelpers';

export class JobTitles extends BaseHelpers {
  readonly adminPageNavigation: Locator;
  readonly adminPageJob: Locator;
  readonly adminJobTitles: Locator;
  readonly addButton: Locator;
  readonly jobTitleForm: Locator;
  readonly jobDescForm: Locator;
  readonly jobSpecForm: Locator;
  readonly noteForm: Locator;
  readonly buttonSave: Locator;
  readonly buttonCancel: Locator;
  readonly successAddToaster: Locator;
  readonly tableList: Locator;
  readonly confirmDeleteButton: Locator;
  readonly successDeleteToaster: Locator;
  readonly editFileInputKeep: Locator;
  readonly editFileInputDelete: Locator;
  readonly editFileInputReplace: Locator;
  readonly successEditToaster: Locator;
  readonly editJobForm: Locator;
  readonly jobTitlesList: Locator;
  readonly loadEditForm: Locator;

  constructor(page: Page) {
    super(page);

    this.adminPageNavigation = page.locator('a:has-text("Admin")');
    this.adminPageJob = page.locator('div.oxd-topbar-body li:has-text("Job ")');
    this.adminJobTitles = page.getByRole('menuitem', { name: 'Job Titles' })
    this.addButton = page.locator('div.orangehrm-header-container button');
    this.jobTitleForm = page.locator('div.oxd-form-row input').nth(0);
    this.jobDescForm = page.locator('div.oxd-form-row textarea').nth(0);
    this.jobSpecForm = page.locator('input.oxd-file-input');
    this.noteForm = page.locator('div.oxd-form-row textarea').nth(1);
    this.buttonSave = page.locator('button:has-text("Save")');
    this.buttonCancel = page.locator('button:has-text("Cancel")')
    this.successAddToaster = page.locator('div#oxd-toaster_1:has-text("Successfully Saved")');
    this.tableList = page.locator('div.oxd-table-body')
    this.confirmDeleteButton = page.locator('button:has-text(" Yes, Delete ")');
    this.successDeleteToaster = page.locator('div#oxd-toaster_1:has-text("Successfully Deleted")');
    this.editFileInputKeep = page.locator('div.oxd-radio-wrapper:has-text("Keep Current")');
    this.editFileInputDelete = page.locator('div.oxd-radio-wrapper:has-text("Delete Current")');
    this.editFileInputReplace = page.locator('div.oxd-radio-wrapper:has-text("Replace Current")');
    this.successEditToaster = page.locator('div#oxd-toaster_1:has-text("Successfully Updated")')
    this.editJobForm = page.locator('form.oxd-form');
    this.jobTitlesList = page.locator('//div[text()="Job Titles"]/../../following-sibling::div/div/div/div[@class="oxd-table-cell oxd-padding-cell"][2]');
    this.loadEditForm = page.locator('form.oxd-form div.oxd-form-loader')
  }

  private deleteIconbyJobTitles(jobTitles: string): Locator {
    return this.page.locator(
      `//div[text()="${jobTitles}"]/../following-sibling::div[2]//button[1]`
    );
  }

  private editIconbyJobTitles(jobTitles: string): Locator {
    return this.page.locator(
      `//div[text()="${jobTitles}"]/../following-sibling::div[2]//*[@class="oxd-icon bi-pencil-fill"]`
    );
  }

  private selectBox(jobTitles: string): Locator {
    return this.page.locator(
      `//div[text()="${jobTitles}"]/../preceding-sibling::div/div`
    )
  }

  async goToAdminPage() {
    await step('Go to Admin Page', async () => {
      await this.adminPageNavigation.click();
    })
  }

  async clickJobTitles() {
    await step('Go to Job titles page', async () => {
      await this.adminPageJob.click();
      await this.adminJobTitles.click();
    })
  }

  async clickAddButton() {
    await step('Click add button', async () => {
      await this.addButton.click();
    })
  }

  async fillFormJobTitle(
    title: string,
    jobDesc: string,
    filePath: string | string[],
    note: string
  ) {
    await step('Fill form add job title and save', async () => {
      await this.jobTitleForm.fill(title);
      await this.jobDescForm.fill(jobDesc);
      await this.jobSpecForm.setInputFiles(filePath);
      await this.noteForm.fill(note);
    })
  }

  async clickSaveButton() {
    await step('Click save button', async () => {
      await this.buttonSave.click();
    })
  }

  async clickEditByIcon(jobTitles: string) {
    await step('edit job by icon', async () => {
      await this.tableList.isVisible();
      await this.editIconbyJobTitles(jobTitles).click();
    })
  }

  async editJobTitlesForm(
    title: string,
    jobDesc: string,
    filePath: string | string[],
    note: string
  ) {
    await step('fill edit job title form', async () => {
      await expect(this.loadEditForm).toBeVisible({ timeout: 7000 })
      await expect(this.loadEditForm).toBeHidden({ timeout: 7000 })
      await expect(this.editJobForm).toBeVisible({ timeout: 7000 })
      await this.jobTitleForm.clear();
      await this.jobTitleForm.fill(title);
      await this.jobDescForm.clear();
      await this.jobDescForm.fill(jobDesc);
      await this.editFileInputReplace.click();
      await this.jobSpecForm.setInputFiles(filePath);
      await this.noteForm.clear();
      await this.noteForm.fill(note);
    })
  }

  async deleteByIcon(jobTitles: string) {
    await step('delete job by icon', async () => {
      await this.tableList.isVisible();
      await this.deleteIconbyJobTitles(jobTitles).click();
      await this.confirmDeleteButton.click();
    })
  }

  async validateDeleteByIcon(expectedJobTitle: string, testInfo: TestInfo) {
    await step('validate delete job titles by icon', async () => {
      await expect(this.successDeleteToaster).toBeVisible({ timeout: 6000 });
      await expect(this.tableList).toBeVisible({ timeout: 10000 });
      const actualTexts = await this.getTexts(this.jobTitlesList);
      await this.expectTextsNotToContain(actualTexts, expectedJobTitle);
      await this.attachTexts(this.jobTitlesList, testInfo, 'Job Titles')
    })
  }

  async validateEditByIcon(
    oldTitleName: string,
    newTitleName: string,
    oldJobDesc: string,
    newJobDesc: string) {
    await step('validate edit job titles by icon', async () => {
      await expect(this.successEditToaster).toBeVisible({ timeout: 6000 });
      await expect(this.tableList).toBeVisible({ timeout: 10000 });
      const actualTexts = await this.getTexts(this.tableList);
      await this.expectTextsNotToContain(actualTexts, oldTitleName);
      await this.expectTextsNotToContain(actualTexts, oldJobDesc);
      await this.expectTextsToContain(actualTexts, newTitleName);
      await this.expectTextsToContain(actualTexts, newJobDesc);
    })
  }

  async validateAddSuccess(expected: string[]) {
    await step('validate success add job titles', async () => {
      await expect(this.successAddToaster).toBeVisible();
      await expect(this.tableList).toBeVisible({ timeout: 10000 });
      const actualTexts = await this.getTexts(this.tableList);
      await this.expectTextsToContain(actualTexts, expected);
    })
  }
}