import { test, expect } from '@playwright/test';
import { LoginPage1 } from '../pages/LoginPage1';
import { DashboardPage } from '../pages/DashboardPage';
import { ContractDetailsPage } from '../pages/ContractDetailsPage';

test.describe('Contract Details Page Verifications', () => {
    let loginPage: LoginPage1;
    let dashboardPage: DashboardPage;
    let contractDetailsPage: ContractDetailsPage;

    const user = { 
        email: 'gurdeep.singh+cust100@bridgingtech.com', 
        password: '123123', 
        expectedName: 'Cust 100' 
    };

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage1(page);
        dashboardPage = new DashboardPage(page);
        contractDetailsPage = new ContractDetailsPage(page);

        // 1. Login
        await loginPage.navigate();
        await loginPage.loginWithPassword(user.email, user.password);

        // 2. Navigate to Contract Details
        await page.waitForTimeout(3000); // Give dashboard time to load completely
        await dashboardPage.clickViewDetails();
        await page.waitForTimeout(2000); // Give contract details page time to load its dynamic data
    });

    test('Verify Contract details page structure and visibility', async () => {
        await contractDetailsPage.verifyContractDetailsVisible();
    });

    test('Verify Action buttons on contract details page', async () => {
        await contractDetailsPage.verifyActionButtons();
    });

    test('Verify Summary card data presence', async () => {
        // This will log the amounts to console and ensure they are present
        const details = await contractDetailsPage.getSummaryDetails();
        
        expect(details.balance).toContain('$');
        expect(details.planAmount).toContain('$');
    });

    test('Verify navigation back to dashboard', async ({ page }) => {
        await contractDetailsPage.goBackToDashboard();
        // Verify we are back on the main dashboard url or see the dashboard heading
        await expect(page).toHaveURL(/.*dashboard/);
    });
});
