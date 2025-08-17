import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';

test('Invalid Login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('InvalidUsername', 'InvalidPassword');
});

test('Valid Login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await login.expectLoggedIn();
});