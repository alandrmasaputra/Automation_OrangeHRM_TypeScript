import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';

test('Cancel Forgot Password', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.cancelForgotPassword();
});

test('Not input Username on forgot password', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.forgotPassword('');
  await login.checkErrorLabelUsername();
});

test('Forgot Password', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.forgotPassword('Admin');
  await login.validateResetPassword();
});