import { Page, Locator, expect } from '@playwright/test';

export class ReportProblemPage {
    readonly page: Page;
    readonly subjectsDropdown: Locator;
    readonly contractDropdown: Locator;
    readonly transactionDropdown: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly messageArea: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly backToDashboardLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.subjectsDropdown = page.locator('select[name="subjects"]');
        this.contractDropdown = page.locator('select[name="forPaymentDispute"]');
        this.transactionDropdown = page.locator('select[name="selectTransaction"]');
        this.emailInput = page.locator('input[name="userEmail"]');
        this.phoneInput = page.locator('input[name="userPhoneNumber"]');
        this.messageArea = page.locator('textarea[name="messageArea"]');
        this.submitButton = page.locator('button[type="submit"]');
        
        // Success message usually appears after submission, adjust if needed
        this.successMessage = page.getByText(/successfully|thank you|submitted/i);
        this.backToDashboardLink = page.getByText(/Back to Dashboard/i).first();
    }

    async fillForm(details: { subject: string, contract?: string, transaction?: string, email?: string, phone?: string, message: string }) {
        await this.subjectsDropdown.selectOption({ label: details.subject });
        
        if (details.subject === 'Payment Dispute' && details.contract) {
            await this.contractDropdown.selectOption({ label: details.contract });
            if (details.transaction) {
                await this.transactionDropdown.selectOption({ label: details.transaction });
            }
        }

        if (details.email) await this.emailInput.fill(details.email);
        if (details.phone) await this.phoneInput.fill(details.phone);
        await this.messageArea.fill(details.message);
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async verifyFormVisibility() {
        await expect.soft(this.subjectsDropdown, 'Subjects dropdown should be visible').toBeVisible();
        await expect.soft(this.emailInput, 'Email input should be visible').toBeVisible();
        await expect.soft(this.phoneInput, 'Phone input should be visible').toBeVisible();
        await expect.soft(this.messageArea, 'Message area should be visible').toBeVisible();
        await expect.soft(this.submitButton, 'Submit button should be visible').toBeVisible();
    }

    async verifySuccess() {
        // Updated based on likely success UI
        await expect(this.page.getByText(/successfully|thank you|submitted/i).first()).toBeVisible({ timeout: 15000 });
    }
}
