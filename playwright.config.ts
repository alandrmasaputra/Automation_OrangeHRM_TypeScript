import { defineConfig, devices } from '@playwright/test';
import { reportFolder } from './helpers/reportPath.js';

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: reportFolder}]],
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    trace: 'on-first-retry',
    video: {
      mode: 'on',
      size: { width: 1280, height: 690 }
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'],
        deviceScaleFactor: undefined, 
        headless: false,
        viewport: null,
        launchOptions: { args: ['--start-maximized'], },
        } 
    },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
