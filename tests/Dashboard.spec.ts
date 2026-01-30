import { test, expect } from '@playwright/test';
import { LoginPage1 } from '../pages/LoginPage1';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Dashboard Dynamic Tests', () => {
    let loginPage: LoginPage1;
    let dashboardPage: DashboardPage;

    // We can define the user context here if needed, or just run generic tests
    const users = [
        { email: 'gurdeep.singh+cust100@bridgingtech.com', password: '123123', expectedName: 'Cust 100' }
        // We can add more users here easily to test dynamic logic across different contracts
    ];

    for (const user of users) {
        test.describe(`User: ${user.expectedName}`, () => {
            
            test.beforeEach(async ({ page }) => {
                loginPage = new LoginPage1(page);
                dashboardPage = new DashboardPage(page);
                
                // Perform Login once before each verification step
                // (Optionally move to beforeAll if performance is an issue, but beforeEach is safer)
                await loginPage.navigate();
                await loginPage.loginWithPassword(user.email, user.password);
            });

            test('Verify Profile Match', async () => {
                await dashboardPage.verifyProfile(user.expectedName);
            });

            test('Verify Common UI Elements (Buttons/Logo)', async () => {
                await dashboardPage.verifyCommonElements();
            });

            test('Verify Payment calculations and logic', async () => {
                await dashboardPage.verifyPaymentCalculations();
            });
        });
    }
});

