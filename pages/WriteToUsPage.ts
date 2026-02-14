import { Page, Locator, expect } from '@playwright/test';

export class WriteToUsPage {
    readonly page: Page;
    readonly backToDashboardLink: Locator;
    readonly pageTitle: Locator;
    readonly messageLabel: Locator;
    readonly messageTextarea: Locator;
    readonly sendMessageButton: Locator;
    readonly supportEmail: Locator;
    readonly supportPhone: Locator;
    readonly writeToUsLink: Locator;
    readonly writeUsDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backToDashboardLink = page.getByRole('heading', { name: 'Back to Dashboard' }).first();
        this.pageTitle = page.getByRole('heading', { name: 'Hi! We would love to hear from you!' }).first();
        this.messageLabel = page.getByText('Your Message');
        this.messageTextarea = page.locator('textarea.form-control');
        this.sendMessageButton = page.getByRole('button', { name: 'Send Message' });
        this.supportEmail = page.getByText('billing@denefits.com');
        this.supportPhone = page.getByText('(833) 336-3348');   
        this.writeToUsLink = page.getByRole('link', { name: 'Write to us' });
        this.writeUsDropdown = page.locator('#dropdownMenuButton1');
    }

    async navigateToPage() {
        console.log('Navigating to Write to Us page...');
        await this.writeUsDropdown.click();
        await this.writeToUsLink.click();
        await this.page.waitForTimeout(2000);
    }

    async verifyUIVisibility() {
        console.log('Verifying Write to Us Page UI Elements...');
        await expect.soft(this.backToDashboardLink, 'Back to Dashboard link should be visible').toBeVisible();
        await expect.soft(this.pageTitle, 'Page title should be visible').toBeVisible();
        await expect.soft(this.messageTextarea, 'Message textarea should be visible').toBeVisible();
        await expect.soft(this.sendMessageButton, 'Send Message button should be visible').toBeVisible();
        await expect.soft(this.supportEmail, 'Support email should be visible').toBeVisible();
        await expect.soft(this.supportPhone, 'Support phone should be visible').toBeVisible();
    }

    async verifyFieldsEditable() {
        console.log('Verifying fields are editable...');
        await expect.soft(this.messageTextarea, 'Message area should be editable').toBeEditable();
        await this.messageTextarea.fill('Testing Write to Us functionality.');
        console.log('Message field filled successfully.');
    }
}
