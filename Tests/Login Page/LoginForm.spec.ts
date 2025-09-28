import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';

test('Click login without input username', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('', 'InvalidPassword');
  await login.checkErrorLabelUsername();
});

test('Click login without input password', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', '');
  await login.checkErrorLabelPassword();
});

test('Click login without input username and password', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('', '');
  await login.checkErrorLabelUsername();
  await login.checkErrorLabelPassword();
});