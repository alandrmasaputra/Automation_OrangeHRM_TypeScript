import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';

test('Login with invalid username and password', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('InvalidUsername', 'InvalidPassword');
  await login.invalidLoginValidation();
});

test('Login with valid username and password role Admin', async ({ page }, testInfo) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('langlangmin', 'test123');
  await login.expectLoggedInAdmin(testInfo);
});

test('Login with valid username and password role ESS', async ({ page }, testInfo) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('langlang', 'test1234');
  await login.expectLoggedInESS(testInfo);
});

test('Login with disabled status account', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('UsernameDisabled', 'test1234');
  await login.invalidLoginValidation();
});