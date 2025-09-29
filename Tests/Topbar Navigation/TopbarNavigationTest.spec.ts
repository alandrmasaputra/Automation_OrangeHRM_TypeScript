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

test('User change password with valid current password', async ({ page }, testInfo) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickChangePassword();
  await topbarNavigation.inputUpdatePasswordFormValid(
    'admin123',
    'AdminAdmin1',
    'AdminAdmin1'
  );
})

test('User change password with invalid current password', async ({ page }) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickChangePassword();
  await topbarNavigation.inputUpdatePasswordFormInvalid(
    'Invalid123',
    'AdminAdmin1',
    'AdminAdmin1'
  );
})

test('User change password with confirm password not match', async ({ page }) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickChangePassword();
  await topbarNavigation.inputUpdatePasswordFormNotMatch(
    'admin123',
    'AdminAdmin1',
    'Admin13455'
  );
})

test('User change password without input current password', async ({ page }) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickChangePassword();
  await topbarNavigation.inputUpdatePasswordFormWithoutCurrentPassword(
    'AdminAdmin1',
    'AdminAdmin1'
  );
})

test('User change password without input new password', async ({ page }) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickChangePassword();
  await topbarNavigation.inputUpdatePasswordFormWithoutNewPassword(
    'AdminAdmin1',
    'Admin13455'
  );
})

test('User change password without input confirm password', async ({ page }) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickChangePassword();
  await topbarNavigation.inputUpdatePasswordFormWithoutConfirmPassword(
    'AdminAdmin1',
    'Admin13455'
  );
})

test('User change password without input number on new password', async ({ page }) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickChangePassword();
  await topbarNavigation.inputUpdatePasswordFormNoNumber(
    'admin123',
    'AdminAdmin',
    'AdminAdmin'
  );
})

test('User cancel change password', async ({ page }) => {
  const topbarNavigation = new TopbarNavigation(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await topbarNavigation.clickChangePassword();
  await topbarNavigation.clickCancelChangePassword();
})