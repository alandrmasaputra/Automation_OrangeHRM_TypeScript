import { expect, type Page, type Locator, type TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parse/sync';
import * as XLSX from 'xlsx';

export class BaseHelpers {
  constructor(protected readonly page: Page) { }

  async getTextsArray(locator: Locator): Promise<string[]> {
    const segments: string[] = [];

    const count = await locator.count();
    for (let i = 0; i < count; i++) {
      const el = locator.nth(i);

      // Get innerText from Container
      const text = (await el.innerText()).trim();
      if (text) {
        segments.push(text);
      }

      // get text from element with placeholder attribute
      const withPlaceholder = el.locator('[placeholder]');
      const placeholderCount = await withPlaceholder.count();
      for (let j = 0; j < placeholderCount; j++) {
        const placeholder = await withPlaceholder.nth(j).getAttribute("placeholder");
        if (placeholder) {
          segments.push(placeholder.trim());
        }
      }
    }

    return segments
      .flatMap(s => s.split(/\r?\n/))
      .map(s => s.trim())
      .filter(Boolean);
  }



  // Take the result as a concatenated string (used for normal attachment)
  async getTexts(locator: Locator): Promise<string> {
    const arr = await this.getTextsArray(locator);
    return arr.join('\n\n');
  }




  async expectTextsToContain(texts: string, expected: string[]) {
    for (const text of expected) {
      expect(texts).toContain(text);
    }
  }




  async expectTextsNotToContain(texts: string, expected: string) {
    expect(texts).not.toContain(expected);
  }




  async expectTextsNotToContainMultiple(texts: string, expected: string | string[]) {
    for (const text of expected) {
      expect(texts).not.toContain(text);
    }
  }




  async attachTexts(locator: Locator, testInfo: TestInfo, title: string): Promise<void> {
    const formatted = await this.getTexts(locator);
    await testInfo.attach(title, {
      body: formatted,
      contentType: 'text/plain',
    });
  }




  async attachTextsWithExpected(
    locators: Locator | Locator[],
    testInfo: TestInfo,
    title: string,
    expected: string[]
  ): Promise<void> {
    const rows: string[] = [];
    const errors: string[] = [];

    // Normalize biar selalu array
    const locatorList = Array.isArray(locators) ? locators : [locators];

    // Ambil semua teks dari semua locator
    let actualLines: string[] = [];
    for (const loc of locatorList) {
      const texts = await this.getTextsArray(loc);
      actualLines.push(...texts.map(a => a.trim()));
    }

    const remainingActual = [...actualLines];

    const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const buildPattern = (tpl: string) => {
      let pattern = tpl
        .split('{number}')
        .map(escapeRe)
        .join('\\s*([0-9][0-9,\\.]*)\\s*');

      pattern = pattern.replace(/\\\((s)\\\)/gi, '(?:s)?'); // handle (s)
      pattern = pattern.replace(/ +/g, '\\s+');
      return new RegExp('^' + pattern + '$', 'i');
    };

    for (const exp of expected.map(e => e.trim())) {
      const re = buildPattern(exp);
      const idx = remainingActual.findIndex(a => re.test(a));

      if (idx !== -1) {
        const actual = remainingActual[idx];
        const hasNumber = exp.includes('{number}');

        let reportNote = '';
        if (hasNumber) {
          reportNote = exp === '{number}'
            ? '(Dynamic Number ✅)'
            : '(Dynamic Number on Text ✅)';
        } else {
          reportNote = '(Expected ✅)';
        }

        rows.push(`${actual} --> ${actual} ${reportNote}`);
        remainingActual.splice(idx, 1);
      } else {
        rows.push(`${exp} --> (Missing Text ❌)`);
        errors.push(`Text "${exp}" not found in actual`);
      }
    }

    for (const leftover of remainingActual) {
      rows.push(`${leftover} --> (Not Provided) (Unexpected ❌)`);
      errors.push(`Unexpected element "${leftover}" found in actual`);
    }

    await testInfo.attach(title, {
      body: rows.join('\n\n'),
      contentType: 'text/plain',
    });

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  }




  async attachTextWithExpectedOnCSV(
    locators: Locator | Locator[],
    testInfo: TestInfo,
    title: string,
    csvFilePath: string,
    language: 'English' | 'Indonesian' = 'English'
  ): Promise<void> {
    // 1. Read CSV
    const fileContent = fs.readFileSync(path.resolve(csvFilePath));
    const records: any[] = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // 2. choose column name
    const columnName = language === 'English' ? 'English Copy' : 'Indonesian Copy';

    // 3. Ambil expected values
    const expected: string[] = records
      .map((r) => r[columnName]?.trim())
      .filter(Boolean);

    if (expected.length === 0) {
      throw new Error(`❌ No data found in column "${columnName}" at file "${csvFilePath}"`);
    }

    // 4. Reuse attachTextsWithExpected
    await this.attachTextsWithExpected(locators, testInfo, title, expected);
  }




  async attachTextWithExpectedOnExcel(
    locators: Locator | Locator[],
    testInfo: TestInfo,
    title: string,
    excelFilePath: string,
    sheetName: string,
    language: 'English' | 'Indonesian' = 'English'
  ): Promise<void> {
    // 1. Read Excel File
    const workbook = XLSX.readFile(path.resolve(excelFilePath));
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error(`❌ Sheet "${sheetName}" not found in file ${excelFilePath}`);
    }

    // 2. Convert to JSON
    const records: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    // 3. choose column name
    const colName = language === 'English' ? 'English Copy' : 'Indonesian Copy';
    const expected: string[] = records
      .map((r) => r[colName]?.toString().trim())
      .filter(Boolean);

    if (expected.length === 0) {
      throw new Error(`❌ No data found in column "${colName}" at sheet "${sheetName}"`);
    }

    // 4. Reuse attachTextsWithExpected
    await this.attachTextsWithExpected(locators, testInfo, title, expected);
  }




  async expectAllVisible(locators: Locator[], message?: string): Promise<void> {
    for (const locator of locators) {
      await expect(locator, message ?? 'Element not visible').toBeVisible();
    }
  }




  async openNewTab(action: () => Promise<void>): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      action(),
    ]);

    await newPage.waitForLoadState();
    return newPage;
  }




  async captureNewTabScreenshot(
    action: () => Promise<void>,
    testInfo: TestInfo,
    screenshotName = "NewTab"
  ): Promise<Page> {
    const newPage = await this.openNewTab(action);
    await testInfo.attach(screenshotName, {
      body: await newPage.screenshot(),
      contentType: "image/png",
    });
    return newPage;
  }




  async validateNewTabElement(
    action: () => Promise<void>,
    locator: string
  ): Promise<Page> {
    const newPage = await this.openNewTab(action);
    const element = newPage.locator(locator);
    await expect(element).toBeVisible();
    return newPage;
  }




  async validateNewTabURL(
    action: () => Promise<void>,
    expectedUrl: RegExp
  ): Promise<Page> {
    const newPage = await this.openNewTab(action);
    await expect(newPage).toHaveURL(expectedUrl);
    return newPage;
  }




  async validateNewTabURLandScreenShot(
    action: () => Promise<void>,
    expectedUrl: RegExp,
    testInfo: TestInfo,
    screenshotName = "NewTab"
  ): Promise<Page> {
    const newPage = await this.openNewTab(action);

    // validate new tab url
    await expect(newPage).toHaveURL(expectedUrl);

    // Attach screenshot
    await testInfo.attach(screenshotName, {
      body: await newPage.screenshot(),
      contentType: "image/png",
    });

    return newPage;
  }




  async validateNewTab(
    action: () => Promise<void>,
    testInfo: TestInfo,
    options?: {
      expectedUrl?: RegExp;
      expectedLocator?: Locator;
      screenshotName?: string;
    }
  ): Promise<Page> {
    const newPage = await this.openNewTab(action);

    // validate new tab URL
    if (options?.expectedUrl) {
      await expect(newPage).toHaveURL(options.expectedUrl);
    }

    // validate new tab element
    if (options?.expectedLocator) {
      // @ts-ignore
      const selector: string = options.expectedLocator["_selector"];
      if (!selector) {
        throw new Error("❌ Gagal ambil selector dari expectedLocator");
      }

      const newLocator = newPage.locator(selector);
      await expect(newLocator).toBeVisible();
      await this.attachTexts(
        newLocator,
        testInfo,
        'TextNewTab')
    }

    // screenshot new tab
    if (testInfo && options?.screenshotName) {
      await testInfo.attach(options.screenshotName, {
        body: await newPage.screenshot(),
        contentType: "image/png",
      });
    }

    return newPage;
  }
}
