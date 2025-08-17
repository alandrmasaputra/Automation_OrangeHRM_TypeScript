import { expect, type Page, type Locator, type TestInfo } from '@playwright/test';

export class BaseHelpers {
  constructor(protected readonly page: Page) { }

  // Ambil hasil sebagai array per elemen (lebih aman untuk perbandingan expected)
  async getTextsArray(locator: Locator): Promise<string[]> {
    const segments: string[] = await locator.allInnerTexts();
    return segments
      .flatMap(s => s.split(/\r?\n/))
      .map(s => s.trim())
      .filter(Boolean);
  }



  // Ambil hasil sebagai string gabungan (dipakai untuk attach biasa)
  async getTexts(locator: Locator): Promise<string> {
    const arr = await this.getTextsArray(locator);
    return arr.join('\n\n');
  }



  async expectTextsToContain(texts: string, expected: string[]) {
    for (const text of expected) {
      expect(texts).toContain(text);
    }
  }



  async attachTexts(locator: Locator, testInfo: TestInfo, title: string): Promise<void> {
    const formatted = await this.getTexts(locator);
    await testInfo.attach(title, {
      body: formatted,
      contentType: 'text/plain',
    });
  }



  // this function need to combine with expectTextToContain
  async attachTextsWithDetail(
    locator: Locator,
    testInfo: TestInfo,
    title: string,
    expected: string[]
  ): Promise<void> {
    const actualLines = await this.getTextsArray(locator);
    const maxLen = Math.max(actualLines.length, expected.length);

    const formatted = Array.from({ length: maxLen }, (_, i) => {
      const actual = actualLines[i] ?? '(Missing Element)';
      const exp = expected[i] ?? '(Not provided)';

      if (actual === exp) {
        return `${exp} --> ${actual} (Expected ✅)`;
      } else {
        return `${exp} --> ${actual} (Not Expected ❌)`;
      }

    }).join('\n\n');

    await testInfo.attach(title, {
      body: formatted,
      contentType: 'text/plain',
    });
  }



  async attachTextsWithExpected(
    locator: Locator,
    testInfo: TestInfo,
    title: string,
    expected: string[]
  ): Promise<void> {
    const actualLines = (await this.getTextsArray(locator)).map(a => a.trim());
    const expectedLines = expected.map(e => e.trim());

    const actualSet = new Set(actualLines.map(a => a.toLowerCase()));
    const expectedSet = new Set(expectedLines.map(e => e.toLowerCase()));

    const rows: string[] = [];
    const errors: string[] = [];

    // Cek expected → actual
    for (const exp of expectedLines) {
      const expLower = exp.toLowerCase();
      const actualMatch = actualLines.find(a => a.toLowerCase() === expLower);

      if (actualMatch) {
        if (actualMatch === exp) {
          // Expected
          rows.push(`${exp} --> ${actualMatch} (Expected ✅)`);
        } else {
          // Case Sensitive
          rows.push(`${exp} --> ${actualMatch} (Case Sensitive ❌)`);
          errors.push(`Case mismatch: expected "${exp}", got "${actualMatch}"`);
        }
      } else {
        rows.push(`${exp} --> (Missing Element) (Not Found ❌)`);
        errors.push(`Expected "${exp}" not found in actual`);
      }
    }

    for (const actual of actualLines) {
      const actLower = actual.toLowerCase();
      if (!expectedSet.has(actLower)) {
        rows.push(`${actual} --> (Not Provided) (Unexpected ❌)`);
        errors.push(`Unexpected element "${actual}" found in actual`);
      }
    }

    const formatted = rows.join('\n\n');

    await testInfo.attach(title, {
      body: formatted,
      contentType: 'text/plain',
    });

    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
  }



  async attachTextsWithExpectedDynamicNumber(
    locator: Locator,
    testInfo: TestInfo,
    title: string,
    expected: string[]
  ): Promise<void> {
    const actualLines = (await this.getTextsArray(locator)).map(a => a.trim());
    const expectedLines = expected.map(e => e.trim());

    const rows: string[] = [];
    const errors: string[] = [];

    const remainingActual = [...actualLines];

    for (const exp of expectedLines) {
      if (exp === "{number}") {
        const numberIndex = remainingActual.findIndex(a => /^\d+$/.test(a));
        if (numberIndex !== -1) {
          const numberValue = remainingActual[numberIndex];
          rows.push(`${numberValue} --> ${numberValue} (Dynamic Number ✅)`);
          remainingActual.splice(numberIndex, 1);
        } else {
          rows.push(`{number} --> (Missing Number ❌)`);
          errors.push(`Expected a number but not found`);
        }
      } else {
        const matchIndex = remainingActual.findIndex(
          a => a.toLowerCase() === exp.toLowerCase()
        );
        if (matchIndex !== -1) {
          const actualMatch = remainingActual[matchIndex];
          if (actualMatch === exp) {
            rows.push(`${exp} --> ${actualMatch} (Expected ✅)`);
          } else {
            rows.push(`${exp} --> ${actualMatch} (Case Sensitive ❌)`);
            errors.push(`Error Case Sensitive: expected "${exp}", got "${actualMatch}"`);
          }
          remainingActual.splice(matchIndex, 1); // hapus biar ga diulang
        } else {
          rows.push(`${exp} --> (Missing Text) (Not Found ❌)`);
          errors.push(`Expected "${exp}" not found in actual`);
        }
      }
    }

    for (const leftover of remainingActual) {
      rows.push(`${leftover} --> (Not Provided) (Unexpected ❌)`);
      errors.push(`Unexpected element "${leftover}" found in actual`);
    }

    const formatted = rows.join("\n\n");

    await testInfo.attach(title, {
      body: formatted,
      contentType: "text/plain",
    });

    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
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
