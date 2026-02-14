//Need to work on this file click krke ander dekhne aa sare button 
// pending 




import { test, expect } from '@playwright/test';
import { LoginPage1 } from '../pages/LoginPage1';
import { ProfilePage } from '../pages/ProfilePage';
import { SupportPage } from '../pages/SupportPage';

test.describe('Support Page Tests', () => {
    let loginPage: LoginPage1;
    let profilePage: ProfilePage;
    let supportPage: SupportPage;

    const credentials = { 
        email: 'gurdeep.singh+cust101@bridgingtech.com', 
        password: '123123'
    };

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage1(page);
        profilePage = new ProfilePage(page);
        supportPage = new SupportPage(page);

        // 1. Login
        await loginPage.navigate();
        await loginPage.loginWithPassword(credentials.email, credentials.password);
        
        // Wait for dashboard to load before proceeding to Profile
        await expect(page).toHaveURL(/.*dashboard/);
        
        
        
        // 3. Go to Support
        await supportPage.navigateToSupport();
    });

    test('1. Verify Support Page UI Elements - Buttons and Links', async () => {
        await supportPage.verifyAllButtonsAndLinks();
    });

    test('2. Verify Support Contact Information', async () => {
        await supportPage.verifyContactInfo();
    });

    test('3. Verify Navigation Back to Dashboard', async () => {
        await supportPage.navigateBackToDashboard();
    });
});
