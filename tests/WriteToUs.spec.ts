import { test, expect } from '@playwright/test';
import { LoginPage1 } from '../pages/LoginPage1';
import { WriteToUsPage } from '../pages/WriteToUsPage';

test.describe('Write To Us Page Tests', () => {
    let loginPage: LoginPage1;
    let writeToUsPage: WriteToUsPage;

    const credentials = { 
        email: 'gurdeep.singh+cust101@bridgingtech.com', 
        password: '123123'
    };

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage1(page);
        writeToUsPage = new WriteToUsPage(page);

        // 1. Login
        await loginPage.navigate();
        await loginPage.loginWithPassword(credentials.email, credentials.password);
        
        // Wait for dashboard or direct navigation
        await expect(page).toHaveURL(/.*dashboard/);
        
        // 2. Go to "Write to Us" Page
        await writeToUsPage.navigateToPage();
    });

    test('1. Verify Buttons, Links Visibility and Field Editability', async ({ page }) => {
        console.log('--- Test Case 1: UI & Editability Check ---');
        
        // UI elements visibility
        await writeToUsPage.verifyUIVisibility();
        
        // Check links and buttons count specifically if needed
        const btnCount = await page.locator('button').count();
        const linkCount = await page.locator('a').count();
        console.log(`Buttons found: ${btnCount}, Links found: ${linkCount}`);

        // Field editability
        await writeToUsPage.verifyFieldsEditable();
        
        console.log('UI verification and editability check completed successfully.');
    });

    test('2. Console Data and Verification Log', async () => {
        console.log('--- Test Case 2: Console Logging ---');
        
        // Just fill and log for verification
        await writeToUsPage.messageTextarea.fill('Log check: Testing Write to Us.');
        const messageVal = await writeToUsPage.messageTextarea.inputValue();
        const isSendEnabled = await writeToUsPage.sendMessageButton.isEnabled();
        
        console.log(`[LOG] Message Input Value: "${messageVal}"`);
        console.log(`[LOG] Send Message Button Enabled: ${isSendEnabled}`);
        console.log('Verification completed and logged to console.');
    });
});
