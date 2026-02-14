//Need to work on this file data te work krna kyonnki suubmit ho jane c ta  
// pending 


import { test, expect } from '@playwright/test';
import { LoginPage1 } from '../pages/LoginPage1';
import { DashboardPage } from '../pages/DashboardPage';
import { ReportProblemPage } from '../pages/ReportProblemPage';
import { ExcelUtils } from '../utils/excelUtils';
import path from 'path';

const excelFilePath = path.join(process.cwd(), 'test-data/reportProblemData.xlsx');
let reportData = ExcelUtils.readExcelAsJson(excelFilePath);

// Reset executed flag
reportData.forEach(data => data.executed = false);

test.describe('Report a Problem - Excel Driven Tests', () => {
    let loginPage: LoginPage1;
    let dashboardPage: DashboardPage;
    let reportProblemPage: ReportProblemPage;

    const credentials = { 
        email: 'gurdeep.singh+cust101@bridgingtech.com', 
        password: '123123'
    };

    test.afterAll(async () => {
        ExcelUtils.writeJsonToExcel(excelFilePath, reportData);
        console.log('Results saved to Excel.');

        const mismatches = reportData.filter(data => {
            if (!data.executed) return false;
            return String(data.exp || '').toLowerCase() !== String(data.act || '').toLowerCase();
        });

        if (mismatches.length > 0) {
            console.log('\n--- MISMATCH REPORT ---');
            mismatches.forEach(m => {
                console.log(`ID: ${m.id} | Expected: ${m.exp} | Actual: ${m.act}`);
            });
        }
    });

    for (let i = 0; i < reportData.length; i++) {
        const data = reportData[i];

        test(`${data.id}: ${data.description}`, async ({ page }) => {
            reportData[i].executed = true;
            loginPage = new LoginPage1(page);
            dashboardPage = new DashboardPage(page);
            reportProblemPage = new ReportProblemPage(page);

            await loginPage.navigate();
            await loginPage.loginWithPassword(credentials.email, credentials.password);
            
            // Wait for dashboard and navigation
            await page.waitForTimeout(3000);
            await dashboardPage.reportProblemLink.click();
            await page.waitForURL(/.*report-problem|.*contact|.*support/i, { timeout: 10000 }).catch(() => {});

            try {
                await reportProblemPage.fillForm({
                    subject: data.subject,
                    contract: data.contractId,
                    transaction: data.transaction,
                    email: data.email,
                    phone: data.phone,
                    message: data.message
                });
                
                await reportProblemPage.submitForm();
                
                // Verify success message
                await expect(reportProblemPage.successMessage.first()).toBeVisible({ timeout: 15000 });
                reportData[i].act = 'Pass';
            } catch (error) {
                console.log(`Test case ${data.id} failed: ${error}`);
                reportData[i].act = 'Fail';
            }

            const exp = String(data.exp || 'Pass').toLowerCase();
            const act = String(reportData[i].act || 'Fail').toLowerCase();
            expect(act, `${data.id} Mismatch`).toBe(exp);
        });
    }
});
