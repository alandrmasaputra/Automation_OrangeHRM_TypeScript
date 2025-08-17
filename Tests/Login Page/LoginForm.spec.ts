import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';

test('Username Empty', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('', 'InvalidPassword');
  await login.checkErrorLabelUsername();
});

test('Password Empty', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', '');
  await login.checkErrorLabelPassword();
});

test('Username and Password Empty', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('', '');
  await login.checkErrorLabelUsername();
  await login.checkErrorLabelPassword();
});