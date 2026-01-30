import { test, expect } from '../utils/fixtures';
import { LoginPage1 } from '../pages/LoginPage1';
import { ExcelUtils } from '../utils/excelUtils';
import path from 'path';

const excelFilePath = path.join(process.cwd(), 'test-data/loginpage1data.xlsx');
let loginData = ExcelUtils.readExcelAsJson(excelFilePath);

// Reset executed flag for fresh report
loginData.forEach(data => data.executed = false);

test.describe('Denefits Login Tests with Excel Reporting', () => {

    test.afterAll(async () => {
        // Save results back to Excel
        ExcelUtils.writeJsonToExcel(excelFilePath, loginData);
        console.log('Results saved to Excel.');

        // Generate Mismatch Report
        const mismatches = loginData.filter(data => {
            if (!data.executed) return false;
            const exp = String(data.exp || '').toLowerCase();
            const act = String(data.act || '').toLowerCase();
            return exp !== act;
        });

        if (mismatches.length > 0) {
            console.log('\n--- MISMATCH REPORT ---');
            console.log(`Found ${mismatches.length} mismatches in this run:`);
            mismatches.forEach(m => {
                console.log(`ID: ${m.id} | Desc: ${m.description} | Expected: ${m.exp} | Actual: ${m.act}`);
            });
            console.log('-----------------------\n');
        } else {
            console.log('\n--- ALL EXECUTED TEST CASES MATCHED EXPECTED RESULTS ---\n');
        }
    });

    for (let i = 0; i < loginData.length; i++) {
        const data = loginData[i];

        test(`${data.id}: ${data.description}`, async ({ page }) => {
            loginData[i].executed = true; // Mark as run
            const loginPage = new LoginPage1(page);
            await loginPage.navigate();

            try {
                // Perform Login steps
                await loginPage.enterEmail(data.email || '');
                await loginPage.clickEnterPassword();
                
                // Check if password field appeared (it won't for invalid emails)
                // Using a shorter wait to avoid long timeouts on negative tests
                const isPasswordVisible = await loginPage.passwordInput.isVisible();
                
                if (isPasswordVisible) {
                    await loginPage.enterPassword(data.password || '');
                    await loginPage.clickLogin();
                    // Wait for potential navigation
                    await page.waitForTimeout(3000); 
                }

                const currentUrl = page.url();
                // Logic: If we are still on login page, it's a Fail. Otherwise Pass.
                loginData[i].act = currentUrl.includes('/login') ? 'Fail' : 'Pass';

            } catch (error) {
                // If anything crashes, it's a Fail for the business process
                loginData[i].act = 'Fail';
                // We don't re-throw here because we want to compare with expectations below
            }

            // Final Verification: Does actual result match our Excel expectations?
            const act = String(loginData[i].act || '').toLowerCase();
            let exp = String(data.exp || '').toLowerCase();

            // Fallback: If 'exp' column is empty, use 'isValid' column logic
            if (!exp || exp === 'undefined' || exp === '') {
                const isValid = (data.isValid === true || String(data.isValid).toLowerCase() === 'true');
                exp = isValid ? 'pass' : 'fail';
            }

            expect(act, `${data.id} Mismatch: Expected ${exp} but Actual was ${act}`).toBe(exp);
        });
    }
});
