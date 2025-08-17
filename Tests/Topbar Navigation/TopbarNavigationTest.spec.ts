import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';
import { TopbarNavigation } from '../../Pages/Navigation Page/TopbarNavigation';

test('User click upgrade button', async ({ page }, testInfo) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickUpgradeButton(testInfo);
});

test('User click logout', async ({ page }) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickLogout();
});

test('User click about button', async ({ page }, testInfo) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickAbout();
  await topbarNavigation.validateAboutPopupText(testInfo);
});

test('User click support button', async ({ page }, testInfo) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickSupport();
  await topbarNavigation.validateSupportPageText(testInfo);
});

test('User click change password button', async ({ page }, testInfo) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickChangePassword();
  await topbarNavigation.validateChangePasswordFormText(testInfo);
});