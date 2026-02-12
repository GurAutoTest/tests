import { test, expect } from '@playwright/test';
import { LoginPage1 } from '../pages/LoginPage1';
import { DashboardPage } from '../pages/DashboardPage';
import { ContractDetailsPage } from '../pages/ContractDetailsPage';
import { Calculations} from '../pages/Calculations';

test.describe('Contract Calculations Verifications', () => {
    let loginPage: LoginPage1;
    let dashboardPage: DashboardPage;
    let contractDetailsPage: ContractDetailsPage;
    let calculations: Calculations;

    const user = { 
        email: 'gurdeep.singh+cust101@bridgingtech.com', 
        password: '123123', 
        expectedName: 'Cust 100' 
    };

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage1(page);
        dashboardPage = new DashboardPage(page);
        contractDetailsPage = new ContractDetailsPage(page);
        calculations = new Calculations(page);

        // 1. Login
        await loginPage.navigate();
        await loginPage.loginWithPassword(user.email, user.password);

        // 2. Navigate to Contract Details
        await page.waitForTimeout(3000); // Give dashboard time to load completely
        await dashboardPage.clickViewDetails();
        await page.waitForTimeout(2000); // Give contract details page time to load its dynamic data
    });

    // test('Verify Contract calculations and logic', async () => {
    //     await contractDetailsPage.verifyCalculationswrong();
    // });

    test('Verify Initial calculations', async () => {
        await calculations.verifyInitialCalculations();
    });

    test('Verify Transaction History Calculation', async () => {
        await calculations.verifyTransactionHistory();
    });
});
