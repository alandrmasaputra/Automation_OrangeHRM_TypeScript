import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';
import { AdminPage } from '../../Pages/Admin Page/AdminPage';

test('Test Dynamic Number', async ({ page }, testInfo) => {
  const adminPage = new AdminPage(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await adminPage.checkDynamicNumber(testInfo);
});