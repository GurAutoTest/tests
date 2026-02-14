import { test, expect } from '@playwright/test';
import { LoginPage1 } from '../pages/LoginPage1';
import { FAQPage } from '../pages/FAQPage';
import { ExcelUtils } from '../utils/excelUtils';
import path from 'path';
import fs from 'fs';

const filePath = path.join(process.cwd(), 'test-data/faqTestData.xlsx');

test.describe('FAQ Page Tests', () => {
    let loginPage: LoginPage1;
    let faqPage: FAQPage;
    let faqTestData: any[] = [];

    const credentials = { 
        email: 'gurdeep.singh+cust101@bridgingtech.com', 
        password: '123123'
    };

    test.beforeAll(async () => {
        const testDataDir = path.join(process.cwd(), 'test-data');
        if (!fs.existsSync(testDataDir)) {
            fs.mkdirSync(testDataDir);
        }

        if (!fs.existsSync(filePath)) {
            const data = [
                ['id', 'searchQuery', 'exp', 'act'],
                ['FAQ01', 'Payment', 'Found', ''],
                ['FAQ02', 'Contract', 'Found', ''],
                ['FAQ03', 'InvalidKeyword123', 'No Results', ''],
                ['FAQ04', 'Login', 'Found', '']
            ];
            ExcelUtils.writeRawDataToExcel(filePath, data);
            console.log('FAQ test data Excel created.');
        }
        faqTestData = ExcelUtils.readExcelAsJson(filePath);
    });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage1(page);
        faqPage = new FAQPage(page);

        // 1. Login
        await loginPage.navigate();
        await loginPage.loginWithPassword(credentials.email, credentials.password);
        
        // Wait for dashboard to load
        await expect(page).toHaveURL(/.*dashboard/);
        
        // 2. Go to FAQ Page
        await faqPage.navigate();
    });

    test.afterAll(async () => {
        if (faqTestData.length > 0) {
            ExcelUtils.writeJsonToExcel(filePath, faqTestData);
            console.log('FAQ test results saved to Excel.');
        }
    });

    test('1. Verify FAQ Page UI Elements - Buttons and Links', async () => {
        await faqPage.verifyUIVisibility();
    });

    test('2. Data Driven FAQ Search Verification', async () => {
        for (let i = 0; i < faqTestData.length; i++) {
            const data = faqTestData[i];
            console.log(`Running FAQ Search Case: ${data.id} - Query: ${data.searchQuery}`);
            
            await faqPage.searchFAQ(data.searchQuery);
            const status = await faqPage.getResultsStatus();
            
            faqTestData[i].act = status;
            console.log(`Expected: ${data.exp}, Actual: ${status}`);
            
            // Soft assertion to continue with other queries
            expect.soft(status, `Search status for "${data.searchQuery}" should be "${data.exp}"`).toBe(data.exp);
        }
    });
});
