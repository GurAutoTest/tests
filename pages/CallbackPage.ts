// work pending excel file te km krna multiple case bna k data pu krn lai 

import { Page, Locator, expect } from '@playwright/test';

export class CallbackPage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly phoneDropdown: Locator;
    readonly reasonDropdown: Locator;
    readonly messageArea: Locator;
    readonly lowPriority: Locator;
    readonly mediumPriority: Locator;
    readonly highPriority: Locator;
    readonly submitButton: Locator;
    readonly backToDashboardLink: Locator;
    readonly allButtons: Locator;
    readonly allLinks: Locator;

    constructor(page: Page) {
        this.page = page;
        // Navigation / Breadcrumb
        this.backToDashboardLink = page.getByText(/Back to Dashboard/i).first();

        // Form Fields
        this.nameInput = page.locator('input[class*="ng-valid"]').first();
        this.phoneDropdown = page.locator('select.form-select').first();
        this.reasonDropdown = page.locator('select').nth(1); // Second select on page
        this.messageArea = page.locator('textarea[placeholder*="message"]');
        
        // Priority Radio Buttons
        this.lowPriority = page.locator('input[type="radio"]').nth(0);
        this.mediumPriority = page.locator('input[type="radio"]').nth(1);
        this.highPriority = page.locator('input[type="radio"]').nth(2);

        this.submitButton = page.getByRole('button', { name: /Submit/i });
        
        this.allButtons = page.locator('button');
        this.allLinks = page.locator('a');
    }

    async navigateToPage() {
        console.log('Navigating to Callback page...');
        await this.page.goto('https://testcustomer.denefits.com/callback', { waitUntil: 'load' });
        await this.page.waitForTimeout(2000);
    }

    async verifyUIVisibility() {
        console.log('Verifying Callback Page UI Elements...');
        await expect.soft(this.nameInput, 'Name input should be visible').toBeVisible();
        await expect.soft(this.phoneDropdown, 'Phone dropdown should be visible').toBeVisible();
        await expect.soft(this.reasonDropdown, 'Reason dropdown should be visible').toBeVisible();
        await expect.soft(this.messageArea, 'Message area should be visible').toBeVisible();
        await expect.soft(this.submitButton, 'Submit button should be visible').toBeVisible();
        
        // Buttons and Links
        const btnCount = await this.allButtons.count();
        console.log(`Found ${btnCount} buttons.`);
        const linkCount = await this.allLinks.count();
        console.log(`Found ${linkCount} links.`);
    }

    async verifyFieldsEditable() {
        console.log('Verifying fields are editable/interactive...');
        // Note: Name and Phone might be pre-filled/readonly sometimes, 
        // but we check if they are at least interactive or if we can type in message
        await expect.soft(this.messageArea, 'Message area should be editable').toBeEditable();
        await this.messageArea.fill('Testing callback request description.');
        
        await this.lowPriority.check();
        await expect.soft(this.lowPriority, 'Low priority should be checked').toBeChecked();
        
        await this.highPriority.check();
        await expect.soft(this.highPriority, 'High priority should be checked').toBeChecked();
    }
}
