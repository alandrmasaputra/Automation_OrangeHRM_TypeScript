import { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { reportFolder } from './reportPath';

export async function takeNamedScreenshot(page: Page, testInfo: TestInfo) {
  await page.waitForLoadState('networkidle');

  const safeTestName = testInfo.title.replace(/[^\w\d_-]+/g, '_');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${safeTestName}_${timestamp}.png`;

  // Folder data dalam playwright-report (HTML reporter bawaan)
  const dataDir = path.join( reportFolder , 'Screenshot');
  fs.mkdirSync(dataDir, { recursive: true });

  const screenshotPath = path.join(dataDir, fileName);

  await page.screenshot({ path: screenshotPath, fullPage: false });

  await testInfo.attach(`Screenshot-${fileName}`, {
    path: screenshotPath,
    contentType: 'image/png',
  });
}
