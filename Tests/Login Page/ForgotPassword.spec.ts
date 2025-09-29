import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';

test('Cancel Forgot Password', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.cancelForgotPassword();
});

test('Reset password without input username', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.forgotPassword('');
  await login.checkErrorLabelUsername();
});

test('Reset password with input valid username', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.forgotPassword('Admin');
  await login.validateResetPassword();
});

test('Reset password with input invalid username', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.forgotPassword('AdminInvalid');
  await login.validateInvalidForgotPassword();
});