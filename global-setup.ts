import { test as base } from '@playwright/test';
import { takeNamedScreenshot } from './helpers/screenshotHelper';

export const test = base.extend({
  // After each test hook global
  page: async ({ page }, use, testInfo) => {
    await use(page);

    // Take screeshot after test
    await takeNamedScreenshot(page, testInfo);
  }
});

export { expect } from '@playwright/test';
