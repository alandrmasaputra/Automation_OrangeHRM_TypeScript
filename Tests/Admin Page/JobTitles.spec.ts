import { test } from '../../global-setup';
import { LoginPage } from '../../Pages/LoginPage/LoginPage';
import { JobTitles } from '../../Pages/Admin Page/JobTitles';

test('User go to job titles page', async ({ page }, testInfo) => {
  const jobTitles = new JobTitles(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await jobTitles.goToAdminPage();
  await jobTitles.clickJobTitles();
});

test('User add new job', async ({ page }, testInfo) => {
  const jobTitles = new JobTitles(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await jobTitles.goToAdminPage();
  await jobTitles.clickJobTitles();
  await jobTitles.clickAddButton();
  await jobTitles.fillFormJobTitle(
    'Rodi Work',
    'Rodi work is a hard work without getting paid',
    'C:/Users/alanp/Downloads/Admin Page.xlsx',
    'We wok de tok not only tok de tok'
  );
  await jobTitles.clickSaveButton();
  await jobTitles.validateAddSuccess([
    'Rodi Work',
    'Rodi work is a hard work without getting paid',
  ]);
});

test('User delete job title by icon', async ({ page }, testInfo) => {
  const jobTitles = new JobTitles(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await jobTitles.goToAdminPage();
  await jobTitles.clickJobTitles();
  await jobTitles.deleteByIcon('Rodi Work');
  await jobTitles.validateDeleteByIcon('Rodi Work', testInfo);
});

test('User edit job title by icon', async ({ page }, testInfo) => {
  const jobTitles = new JobTitles(page);
  const login = new LoginPage(page);

  await login.goto();
  await login.login('Admin', 'admin123');
  await jobTitles.goToAdminPage();
  await jobTitles.clickJobTitles();
  await jobTitles.clickEditByIcon('QA Edit');
  await jobTitles.editJobTitlesForm(
    'Rodi Work Banget Edit',
    'Rodi Work Banget Rodi Work Banget Edit',
    'C:/Users/alanp/Downloads/Admin Page.xlsx',
    'Kerja lembur bagai quda'
  )
  await jobTitles.clickSaveButton();
  await jobTitles.validateEditByIcon('QA Edit', 'Rodi Work Banget Edit', 'Old Job Desc', 'Rodi Work Banget Rodi Work Banget Edit');
});