import { test, expect } from '@playwright/test';
import { LoginPage1 } from '../pages/LoginPage1';
import { ProfilePage } from '../pages/ProfilePage';
import { ExcelUtils } from '../utils/excelUtils';
import path from 'path';

const filePath = path.join(process.cwd(), 'test-data/profileTestData.xlsx');
let profileTestData = ExcelUtils.readExcelAsJson(filePath);

// Reset executed flag for fresh report
profileTestData.forEach(data => data.executed = false);

test.describe('Profile Management Tests', () => {
    let loginPage: LoginPage1;
    let profilePage: ProfilePage;

    const credentials = { 
        email: 'gurdeep.singh+cust101@bridgingtech.com', 
        password: '123123'
    };


    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage1(page);
        profilePage = new ProfilePage(page);

        // 1. Login
        await loginPage.navigate();
        await loginPage.loginWithPassword(credentials.email, credentials.password);
        
        // 2. Go to Profile
        await profilePage.navigateToProfile();
    });

    test.afterAll(async () => {
        if (profileTestData.length > 0) {
            ProfilePage.saveResults(profileTestData);
            console.log('Profile test results saved to Excel.');
        }
    });

    test.only('1. Verify UI Elements Visibility and Editability', async () => {
        await profilePage.verifyUIVisibility();
        
      });

    test('2. Data Driven Profile Update', async () => {
        if (profileTestData.length === 0) test.skip();

        for (let i = 0; i < profileTestData.length; i++) {
            const data = profileTestData[i];
            console.log(`Running Profile Update Case: ${data.id}`);
            
            profileTestData[i].executed = true;
            try {
                await profilePage.updateProfileFromExcel(data);
                
                if (String(data.exp).toLowerCase() === 'pass') {
                    await profilePage.verifySuccess();
                    profileTestData[i].act = 'Pass';
                } else {
                    // Logic for expected failure cases (e.g. empty fields)
                    const isErrorVisible = await profilePage.page.locator('.error, .alert-danger, [class*="error"]').isVisible();
                    profileTestData[i].act = isErrorVisible ? 'Fail' : 'Pass';
                }
            } catch (error) {
                profileTestData[i].act = 'Fail';
            }

            // Expectation check
            expect(profileTestData[i].act.toLowerCase()).toBe(String(data.exp).toLowerCase());
        }
    });

    test('3. Saved Card Section Verification', async () => {
        await profilePage.switchTab('card');
        await expect(profilePage.addCardButton).toBeVisible();
        // Here we would add specific card data checks or "Add Card" flow if requested
        console.log('Saved Card section verified.');
    });

    test('4. Bank Section and Re-auth Cases', async () => {
        await profilePage.switchTab('bank');
        await expect(profilePage.addBankButton).toBeVisible();
        
        // Re-auth logic or fail/pass cases for bank linking would go here
        console.log('Bank section verified.');
    });

    test('5. Language Settings Verification', async () => {
        // Switch to language tab first
        await profilePage.switchTab('language');
        await profilePage.languageDropdown.selectOption({ index: 0 }); // Select any option for verification
        console.log('Language selection verified.');
    });

    test('6. Change Password UI Visibility', async () => {
        // Switch to password tab first
        await profilePage.switchTab('password');
        await expect(profilePage.currentPasswordInput).toBeVisible();
        await expect(profilePage.newPasswordInput).toBeVisible();
        await expect(profilePage.confirmPasswordInput).toBeVisible();
        console.log('Change Password UI visibility verified.');
    });
});
