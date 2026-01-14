import { test, expect } from '../utils/fixtures';
import { LoginPage } from '../pages/LoginPage';
import loginData from '../test-data/loginData.json';

test.describe('Data Driven Login Tests', () => {
    for (const data of loginData) {
        test(`${data.id}: ${data.description}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.navigate();

            // Perform Login
            await loginPage.login(data.email, data.password);

            if (data.isValid) {
                // Positive Scenario: Verify Successful Login
                await loginPage.verifyTitle(/nopcommerce/i);
                await loginPage.logout();
            } else {
                // Negative Scenario: Verify Login Failed (Stay on login page or see error)
                // Note: Actual error validation depends on specific page implementation.
                // For now, we ensure we did NOT get redirected to the dashboard.
                // You can add specific error message assertions in LoginPage if needed.
                await expect(page).toHaveTitle(/Login/i);
            }
        });
    }
});
