import { test, expect } from '@playwright/test';
import { LoginPage1 } from '../pages/LoginPage1';
import { CallbackPage } from '../pages/CallbackPage';

test.describe('Have Us Call Page Tests', () => {
    let loginPage: LoginPage1;
    let callbackPage: CallbackPage;

    const credentials = { 
        email: 'gurdeep.singh+cust101@bridgingtech.com', 
        password: '123123'
    };

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage1(page);
        callbackPage = new CallbackPage(page);

        // 1. Login
        await loginPage.navigate();
        await loginPage.loginWithPassword(credentials.email, credentials.password);
        
        // Wait for dashboard to load
        await expect(page).toHaveURL(/.*dashboard/);
        
        // 2. Go to "Have Us Call" Page
        await callbackPage.navigateToPage();
    });

    test('1. Verify Buttons, Links Visibility and Field Editability', async () => {
        console.log('--- Test Case 1: UI & Editability Check ---');
        
        // 1. Verify UI Elements Visibility
        await callbackPage.verifyUIVisibility();
        
        // Additional Link/Button checks for completeness
        await expect(callbackPage.backToDashboardLink).toBeVisible();
        await expect(callbackPage.lowPriority).toBeVisible();
        await expect(callbackPage.mediumPriority).toBeVisible();
        await expect(callbackPage.highPriority).toBeVisible();

        // 2. Verify Field Editability
        await callbackPage.verifyFieldsEditable();
        
        console.log('UI verification and editability check completed successfully.');
    });

    test('2. Console Data and Verification Log', async () => {
        console.log('--- Test Case 2: Verification Logging ---');
        
        const nameValue = await callbackPage.nameInput.inputValue();
        const phoneValue = await callbackPage.phoneDropdown.inputValue();
        const isSubmitEnabled = await callbackPage.submitButton.isEnabled();
        
        console.log(`[LOG] Name Input Value: "${nameValue}"`);
        console.log(`[LOG] Phone Select Value: "${phoneValue}"`);
        console.log(`[LOG] Submit Button Enabled: ${isSubmitEnabled}`);
        
        // Simply logging checks as requested
        console.log('All element checks logged to console.');
    });
});
