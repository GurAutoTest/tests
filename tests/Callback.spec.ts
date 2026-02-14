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

    test('1. Verify UI Elements and Field Editability', async () => {
        await callbackPage.verifyUIVisibility();
        await callbackPage.verifyFieldsEditable();
        console.log('UI verification and editability check completed.');
    });

    test('2. Console Data Check', async () => {
        const nameValue = await callbackPage.nameInput.inputValue();
        const phoneValue = await callbackPage.phoneDropdown.inputValue();
        
        console.log('--- Page Data Log ---');
        console.log(`Pre-filled Name: ${nameValue}`);
        console.log(`Pre-filled Phone: ${phoneValue}`);
        console.log('Data logged to console successfully.');
    });
});
