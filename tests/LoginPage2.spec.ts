import { test, expect } from '../utils/fixtures';
import { LoginPage1 } from '../pages/LoginPage1';
import { ExcelUtils } from '../utils/excelUtils';
import path from 'path';

const excelFilePath = path.join(process.cwd(), 'test-data/loginpage1data.xlsx');
let loginData = ExcelUtils.readExcelAsJson(excelFilePath);

test.describe('Denefits Login Test - Single Case', () => {
    test('Sanity Test: Login with first data row', async ({ page }) => {
        const data = loginData[0];
        const loginPage = new LoginPage1(page);
        await loginPage.navigate();

        await loginPage.enterEmail(data.email || '');
        await loginPage.clickEnterPassword();
        await loginPage.enterPassword(data.password || '');
        await loginPage.clickLogin();
    });
});
