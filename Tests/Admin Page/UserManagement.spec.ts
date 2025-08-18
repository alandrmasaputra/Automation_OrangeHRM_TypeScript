import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';
import { UserManagement } from '../../Pages/Admin Page/UserManagement';

test('Test Dynamic Number', async ({ page }, testInfo) => {
  const userManagement = new UserManagement(page);
  const login = new LoginPage(page);
  await login.goto();
  await login.login('Admin', 'admin123');
  await userManagement.goToAdminPage();
  await userManagement.validateFilter(testInfo);
  await userManagement.validateTable(testInfo);
});