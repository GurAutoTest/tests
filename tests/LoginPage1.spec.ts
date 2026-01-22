import { test, expect } from '../utils/fixtures';
import { LoginPage1 } from '../pages/LoginPage1';
import { ExcelUtils } from '../utils/excelUtils';
import path from 'path';

const excelFilePath = path.join(process.cwd(), 'test-data/loginpage1data.xlsx');
let loginData = ExcelUtils.readExcelAsJson(excelFilePath);

test.describe('Denefits Login Tests', () => {
    for (const data of loginData) {
        test(`${data.id}: ${data.description}`, async ({ page }) => {
            const loginPage = new LoginPage1(page);
            await loginPage.navigate();

            // Perform Login steps using individual methods
            await loginPage.enterEmail(data.email || '');
            await loginPage.clickEnterPassword();
            await loginPage.enterPassword(data.password || '');
            await loginPage.clickLogin();
        });
    }
});
