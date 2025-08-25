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

// test('Delete by checkbox', async ({ page }) => {
//   const userManagement = new UserManagement(page);
//   const login = new LoginPage(page);

//   await login.goto();
//   await login.login('Admin', 'admin123');
//   await userManagement.goToAdminPage();
//   await userManagement.deletebyCheckbox('abdullahashfaq97');
//   await userManagement.validateDeleteUser('abdullahashfaq97');
// })

// test('Delete by Icon', async ({ page }, testInfo) => {
//   const userManagement = new UserManagement(page);
//   const login = new LoginPage(page);

//   await login.goto();
//   await login.login('Admin', 'admin123');
//   await userManagement.goToAdminPage();
//   await userManagement.deleteByIcon('testinglan');
//   await userManagement.validateDeleteUser('testinglan');
// });

// test('Delete by checkbox multiple', async ({ page }) => {
//   const userManagement = new UserManagement(page);
//   const login = new LoginPage(page);

//   await login.goto();
//   await login.login('Admin', 'admin123');
//   await userManagement.goToAdminPage();
//   await userManagement.deletebyCheckboxMultiple(['Janelle_Murphy', 'kunal033']);
//   await userManagement.validateDeleteUserMultiple(['Janelle_Murphy', 'kunal033']);
// })