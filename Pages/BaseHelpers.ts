import { expect, type Page, type Locator, type TestInfo } from '@playwright/test';

export class BaseHelpers {
  constructor(protected readonly page: Page) {}

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
    const actualLines = await this.getTextsArray(locator); // 🔑 gunakan array
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
  
    const rows: string[] = [];
    const errors: string[] = [];
  
    for (const exp of expectedLines) {
      const expLower = exp.toLowerCase();
  
      if (exp === "{number}") {
        // Cari angka di actual
        const numberMatch = actualLines.find(a => /^\d+$/.test(a));
        if (numberMatch) {
          rows.push(`${exp} --> ${numberMatch} (Dynamic Number ✅)`);
        } else {
          rows.push(`${exp} --> (Missing Number ❌)`);
          errors.push(`Expected a number but not found`);
        }
        continue;
      }
  
      const actualMatch = actualLines.find(a => a.toLowerCase() === expLower);
  
      if (actualMatch) {
        if (actualMatch === exp) {
          rows.push(`${exp} --> ${actualMatch} (Expected ✅)`);
        } else {
          rows.push(`${exp} --> ${actualMatch} (Case Sensitive ❌)`);
          errors.push(`Error Case Sensitive: expected "${exp}", got "${actualMatch}"`);
        }
      } else {
        rows.push(`${exp} --> (Missing Text) (Not Found ❌)`);
        errors.push(`Expected "${exp}" not found in actual`);
      }
    }
  
    // Cek unexpected actual
    for (const actual of actualLines) {
      if (/^\d+$/.test(actual)) {
        // kalau angka, kita skip karena sudah ditangani {number}
        continue;
      }
      const actLower = actual.toLowerCase();
      if (!expectedLines.map(e => e.toLowerCase()).includes(actLower)) {
        rows.push(`${actual} --> (Not Provided) (Unexpected Text ❌)`);
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
}
