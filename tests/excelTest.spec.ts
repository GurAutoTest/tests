import { test, expect } from '../utils/fixtures';
import { LoginPage } from '../pages/LoginPage';
import { ExcelUtils } from '../utils/excelUtils';
import path from 'path';

// Load test data from Excel
const excelFilePath = path.join(process.cwd(), 'test-data/loginData1.xlsx');
let loginData = ExcelUtils.readExcelAsJson(excelFilePath);
// Reset executed flag to ensure report only shows current run
loginData.forEach(data => data.executed = false);

test.describe.configure({ mode: 'serial' });

test.describe('Excel Data Driven Login Tests with Results', () => {

    test.afterAll(async () => {
        // Save results to Excel
        ExcelUtils.writeJsonToExcel(excelFilePath, loginData);
        console.log('Results saved to Excel.');

        // Scan for mismatches ONLY for tests that were executed in this run
        const mismatches = loginData.filter(data => {
            if (!data.executed) return false; // Skip if the test didn't run
            const exp = String(data.exp || '').toLowerCase();
            const act = String(data.act || '').toLowerCase();
            return exp !== act; // Report any mismatch, even if expected is blank
        });

        if (mismatches.length > 0) {
            console.log('\n--- MISMATCH REPORT ---');
            console.log(`Found ${mismatches.length} mismatches in the current run:`);
            mismatches.forEach(m => {
                console.log(`ID: ${m.id} | Name: ${m.description} | Expected: ${m.exp} | Actual: ${m.act}`);
            });
            console.log('-----------------------\n');
        } else {
            console.log('\n--- ALL TEST CASES MATCHED EXPECTED RESULTS ---\n');
        }
    });

    for (let i = 0; i < loginData.length; i++) {
        const data = loginData[i];
        
        test(`${data.id}: ${data.description}`, async ({ page }) => {
            loginData[i].executed = true; // Mark test as executed for mismatch report
            const loginPage = new LoginPage(page);
            await loginPage.navigate();

            try {
                // Perform Login
                await loginPage.login(data.email || '', data.password || '');

                if (data.isValid === true || String(data.isValid).toLowerCase() === 'true') {
                    // Positive Scenario: Verify Successful Login
                    await loginPage.verifyTitle(/nopcommerce/i);
                    await loginPage.logout();
                    loginData[i].act = 'Pass';
                } else {
                    // Negative Scenario: Verify failure
                    if (data.expectedError) {
                        await loginPage.assertErrorMessage(data.expectedError);
                    } else {
                        await expect(page).toHaveTitle(/Login/i);
                    }
                    loginData[i].act = 'Fail';
                }
            } catch (error) {
                // Determine what actually happened for the mismatch report
                const actualTitle = await page.title();
                loginData[i].act = /nopcommerce/i.test(actualTitle) ? 'Pass' : 'Fail';
                throw error;
            }
        });
    }
});
