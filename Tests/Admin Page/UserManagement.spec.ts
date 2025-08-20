import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';
import { UserManagement } from '../../Pages/Admin Page/UserManagement';

test('Test Admin Page User Management', async ({ page }, testInfo) => {
  const userManagement = new UserManagement(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await userManagement.goToAdminPage();
  await userManagement.validateFilter(testInfo);
  await userManagement.validateTable(testInfo);
});

test('Test Add new user', async ({ page }, testInfo) => {
  const userManagement = new UserManagement(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await userManagement.goToAdminPage();
  await userManagement.clickAddButton();
  await userManagement.fillFormNewUser('Criys Talesia', 'testinglan', 'test1234', 'test1234');
  await userManagement.clickSaveButton();
  await userManagement.validateNewUser(['Criys Talesia', 'testinglan', 'Admin', 'Enabled']);
});