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

test('Test filter by all field', async ({ page }, testInfo) => {
  const userManagement = new UserManagement(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await userManagement.goToAdminPage();
  await userManagement.filterByAllField({
    username: 'testinglan',
    employeeName: 'Criys Talesia'
  });
  await userManagement.validateFilterUser(['Criys Talesia', 'testinglan', 'Admin', 'Enabled']);
});

test('Reset filter test', async ({ page }) => {
  const userManagement = new UserManagement(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await userManagement.goToAdminPage();

  await userManagement.resetFilterAndValidate({
    username: 'testinglan',
    employeeName: 'Criys Talesia'
  });
});

test('Change name and passowrd', async ({ page }) => {
  const userManagement = new UserManagement(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await userManagement.goToAdminPage();

  await userManagement.changeNameAndPassword('testuser');
});


test('Delete by checkbox', async ({ page }) => {
  const userManagement = new UserManagement(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await userManagement.goToAdminPage();
  await userManagement.deletebyCheckbox('hello');
  await userManagement.validateDeleteUser('hello');
})

test('Delete by Icon', async ({ page }, testInfo) => {
  const userManagement = new UserManagement(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await userManagement.goToAdminPage();
  await userManagement.deleteByIcon('testinglan');
  await userManagement.validateDeleteUser('testinglan');
});

test('Delete by checkbox multiple', async ({ page }) => {
  const userManagement = new UserManagement(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await userManagement.goToAdminPage();
  await userManagement.deletebyCheckboxMultiple(['Test1758010445982', 'Test1758010469931']);
  await userManagement.validateDeleteUserMultiple(['Test1758010445982', 'Test1758010469931']);
})