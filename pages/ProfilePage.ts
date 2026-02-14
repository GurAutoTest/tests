import { Page, Locator, expect } from '@playwright/test';
import { ExcelUtils } from '../utils/excelUtils';
import path from 'path';

export class ProfilePage {
    readonly page: Page;
    
    // --- Locators ---
    readonly backToDashboardLink: Locator;
    readonly profileMenu: Locator;
    
    // Tabs
    readonly profileTab: Locator;
    readonly savedCardsTab: Locator;
    readonly bankTab: Locator;
    readonly changePasswordTab: Locator;
    readonly commLanguageTab: Locator;

    // Personal Info Section
    readonly prefixDropdown: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly genderMale: Locator;
    readonly genderFemale: Locator;
    readonly genderOther: Locator;
    
    // Contact Details
    readonly phoneInput: Locator;
    readonly addAlternatePhone: Locator;
    readonly emailInput: Locator;
    readonly addAlternateEmail: Locator;
    
    // Identity & SSN
    readonly ssnInput: Locator;
    readonly driversLicenseInput: Locator;
    readonly dobInput: Locator;
    
    // Address Section
    readonly addressInput: Locator;
    readonly zipInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly addAlternateAddress: Locator;

    // Security Tab Content (Assuming they are here after switching tab)
    readonly currentPasswordInput: Locator;
    readonly newPasswordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly updatePasswordButton: Locator;

    // Payment/Bank Content
    readonly addCardButton: Locator;
    readonly addBankButton: Locator;

    // Language Tab Content
    readonly languageDropdown: Locator;

    // Actions
    readonly updateButton: Locator;
    readonly updatePhotoLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation & Layout
        this.backToDashboardLink = page.getByText(/Back to Dashboard/i).first();
        this.profileMenu = page.locator('.profile-name, .user-name, [class*="profile"] p').first();
        
        // Tabs
        this.profileTab = page.locator('.nav-link').filter({ hasText: 'Profile' });
        this.savedCardsTab = page.locator('.nav-link').filter({ hasText: 'Saved cards' });
        this.bankTab = page.locator('.nav-link').filter({ hasText: 'Bank' });

        this.changePasswordTab = page.getByText('Change Password');
        this.commLanguageTab = page.locator('.nav-link').filter({ hasText: 'Communication Language' });

        this.prefixDropdown = page.locator('select[name="Salutation"]'); 
        this.firstNameInput = page.locator('input[name*="first"], input[placeholder*="First"]').first();
        this.lastNameInput = page.locator('input[name*="last"], input[placeholder*="Last"]').first();

        // Gender
        this.genderMale = page.getByLabel('Male');
        this.genderFemale = page.getByLabel('Female');
        this.genderOther = page.getByLabel('Other');

        // Contact Details
        this.phoneInput = page.locator('input[type="tel"], input[name*="phone"]').first();
        this.addAlternatePhone = page.getByText('+ Add New Alternate Phone');
        this.emailInput = page.locator('input[type="email"], input[name*="email"]').first();
        this.addAlternateEmail = page.getByText('+ Add New Alternate Email');

        // Identity
        this.ssnInput = page.locator('input[name="ssn"]');
        this.driversLicenseInput = page.locator('input[name="dl"]');
        this.dobInput = page.locator('input#birthdate-numeric');

        // Address
        this.addressInput = page.locator('input[name="address"]');
        this.zipInput = page.locator('input#zip_code');
        this.cityInput = page.locator('input#city_name');
        this.stateInput = page.locator('input#state_name');
        this.addAlternateAddress = page.getByText('+ Add New Address');

        // Security Content (Assuming these appear on the tab)
        this.currentPasswordInput = page.locator('input[name="oldPassword"], input[name="currentPassword"]');
        this.newPasswordInput = page.locator('input[name="newPassword"]');
        this.confirmPasswordInput = page.locator('input[name="confirmPassword"]');
        this.updatePasswordButton = page.getByRole('button', { name: /Change Password|Update Password/i });

        // Others
        this.addCardButton = page.getByText(/Add New Card|Add Card/i).first();
        this.addBankButton = page.getByText(/Add New Bank|Add Bank/i).first();
        this.languageDropdown = page.locator('select[name="language"], [role="listbox"]').first();

        // Global Save/Update
        this.updateButton = page.getByRole('button', { name: 'Update', exact: true }).first();
        this.updatePhotoLink = page.locator('p:has-text("Your Photo")').locator('..').getByText('Update');
    }

    async navigateToProfile() {
        // Direct navigation to ensure we are on the right page as per screenshot
        await this.page.goto('https://testcustomer.denefits.com/profile', { waitUntil: 'load' }); 
        await this.page.waitForTimeout(2000);
    }

    // 1. UI Visibility & Editable Checks
    async verifyUIVisibility() {
        console.log('Verifying Personal Info section...');
        //await expect.soft(this.prefixDropdown, 'Prefix dropdown should be visible').toBeVisible();
        await expect.soft(this.firstNameInput, 'First Name should be visible').toBeVisible();
        await expect.soft(this.lastNameInput, 'Last Name should be visible').toBeVisible();
        
        console.log('Verifying gender options...');
        await expect.soft(this.genderMale, 'Gender Male option should be visible').toBeVisible();
        await expect.soft(this.genderFemale, 'Gender Female option should be visible').toBeVisible();
        await expect.soft(this.genderOther, 'Gender Other option should be visible').toBeVisible();

        console.log('Verifying update photo link...');
        await expect.soft(this.updatePhotoLink, 'Update Photo link should be visible').toBeVisible();

        console.log('Verifying contact details...');
        await expect.soft(this.phoneInput, 'Phone field should be visible').toBeVisible();
        await expect.soft(this.addAlternatePhone, 'Add Alternate Phone link should be visible').toBeVisible();
        await expect.soft(this.emailInput, 'Email field should be visible').toBeVisible();
        await expect.soft(this.addAlternateEmail, 'Add Alternate Email link should be visible').toBeVisible();

        console.log('Verifying identity fields...');
        await expect.soft(this.ssnInput, 'SSN input should be visible').toBeVisible();
        await expect.soft(this.driversLicenseInput, 'Driver\'s License input should be visible').toBeVisible();
        await expect.soft(this.dobInput, 'Date of Birth input should be visible').toBeVisible();

        console.log('Verifying address fields...');
        await expect.soft(this.addressInput, 'Address input should be visible').toBeVisible();
        await expect.soft(this.zipInput, 'Zip input should be visible').toBeVisible();
        await expect.soft(this.cityInput, 'City input should be visible').toBeVisible();
        await expect.soft(this.stateInput, 'State input should be visible').toBeVisible();
        await expect.soft(this.addAlternateAddress, 'Add Alternate Address link should be visible').toBeVisible();

        console.log('Verifying update button...');
        await expect.soft(this.updateButton, 'Update button should be visible').toBeVisible();
        
        console.log('Verifying tab presence...');
        await expect.soft(this.savedCardsTab, 'Saved cards tab should be visible').toBeVisible();
        await expect.soft(this.bankTab, 'Bank tab should be visible').toBeVisible();
        await expect.soft(this.commLanguageTab, 'Language tab should be visible').toBeVisible();

        console.log('Switching to password tab...');
        await this.switchTab('password');
        console.log('Waiting for password tab to load...');
        await this.page.waitForTimeout(2000);
        await expect.soft(this.currentPasswordInput, 'Current Password input should be visible').toBeVisible();
        await expect.soft(this.newPasswordInput, 'New Password input should be visible').toBeVisible();
        await expect.soft(this.confirmPasswordInput, 'Confirm Password input should be visible').toBeVisible();
        await expect.soft(this.updatePasswordButton, 'Update Password button should be visible').toBeVisible();
        console.log('Password tab verified.');

        console.log('Switching to card tab...');
        await this.switchTab('card');
        await expect.soft(this.addCardButton, 'Add New Card button should be visible').toBeVisible();
        
        console.log('Switching to bank tab...');
        await this.switchTab('bank');
        await expect.soft(this.addBankButton, 'Add New Bank button should be visible').toBeVisible();

        console.log('Switching to language tab...');
        await this.switchTab('language');
        await expect.soft(this.languageDropdown, 'Language dropdown should be visible').toBeVisible();

        console.log('Returning to profile tab...');
        await this.switchTab('profile');
    }

    static saveResults(data: any[]) {
        const filePath = path.join(process.cwd(), 'test-data/profileTestData.xlsx');
        ExcelUtils.writeJsonToExcel(filePath, data);
    }

    async updateProfileFromExcel(data: any) {
        await this.firstNameInput.fill(data.firstName || '');
        await this.lastNameInput.fill(data.lastName || '');
        await this.phoneInput.fill(String(data.phone || ''));
        await this.updateButton.click();
    }

    async verifySuccess() {
        const success = this.page.getByText(/successfully|updated|saved/i).first();
        await expect(success).toBeVisible({ timeout: 10000 });
    }

    async switchTab(tab: 'profile' | 'card' | 'bank' | 'password' | 'language') {
        if (tab === 'profile') await this.profileTab.click();
        else if (tab === 'card') await this.savedCardsTab.click();
        else if (tab === 'bank') await this.bankTab.click();
        else if (tab === 'password') await this.changePasswordTab.click();
        else if (tab === 'language') await this.commLanguageTab.click();
        await this.page.waitForTimeout(1000); 
    }

    // 5. Change Password
    async performPasswordChange(current: string, next: string) {
        await this.switchTab('password');
        await this.currentPasswordInput.fill(current);
        await this.newPasswordInput.fill(next);
        await this.confirmPasswordInput.fill(next);
        await this.updatePasswordButton.click();
    }

    // /**
    //  * Helper to create the initial Excel file if it doesn't exist
    //  * Call this once manually or as a setup step
    //  */
    // static createInitialExcelData() {
    //     const filePath = path.join(process.cwd(), 'test-data/profileTestData.xlsx');
    //     if (require('fs').existsSync(filePath)) return;

    //     const data = [
    //         ['id', 'description', 'firstName', 'lastName', 'phone', 'exp', 'act'],
    //         ['PRF01', 'Update names and phone', 'Gurdeep', 'Tester', '2052891317', 'Pass', ''],
    //         ['PRF02', 'Try empty first name', '', 'Tester', '2052891317', 'Fail', ''],
    //         ['PRF03', 'Symbols in names', 'Gur@deép', 'Te$t#r', '2052891317', 'Pass', '']
    //     ];
        
    //     ExcelUtils.writeRawDataToExcel(filePath, data);
    //     console.log('Initial profileTestData.xlsx created.');
    // }
}
