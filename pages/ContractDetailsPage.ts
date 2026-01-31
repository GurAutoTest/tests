import { Page, Locator, expect } from '@playwright/test';

export class ContractDetailsPage {
    readonly page: Page;

    // --- Locators ---
    readonly contractIdHeading: Locator;
    readonly statusBadge: Locator;
    
    // Action Buttons
    readonly makePaymentButton: Locator;
    readonly payoffContractButton: Locator;
    readonly changePaymentDateButton: Locator;
    readonly makePartialPaymentButton: Locator;

    // Summary Card Details
    readonly totalBalanceRemaining: Locator;
    readonly nextPaymentDate: Locator;
    readonly estimatedPaymentPlanAmount: Locator;
    readonly customerPayoffAmount: Locator;
    
    // Customer & Business Details
    readonly customerName: Locator;
    readonly customerEmail: Locator;
    readonly businessName: Locator;
    readonly businessEmail: Locator;
    
    // Employment & Payment
    readonly employmentInfo: Locator;
    readonly paymentMethodsList: Locator;
    readonly addNewCardButton: Locator;
    
    // Transactions & Breakdown
    readonly transactionHistoryList: Locator;
    readonly serviceBreakdownTable: Locator;
    readonly proofOfIdStatus: Locator;

    // Bottom Actions
    readonly downloadContractButton: Locator;
    readonly downloadConsentFormButton: Locator;
    readonly generateContributionLinkButton: Locator;
    readonly backToDashboardLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.contractIdHeading = page.getByText(/Contract ID/i).first();
        this.statusBadge = page.locator('.badge, [class*="status"]').first(); // Active badge

        // Buttons using regex as requested previously
        this.makePaymentButton = page.getByText(/Make Payment/i).first();
        this.payoffContractButton = page.getByText(/PayOff Contract/i).first();
        this.changePaymentDateButton = page.getByText(/Change Payment Date/i).first();
        this.makePartialPaymentButton = page.getByText(/Make Partial Payment/i).first();

        // Summary Card (Right column)
        this.totalBalanceRemaining = page.getByText(/Total Balance Remaining/i).locator('xpath=..').getByText('$').first();
        this.nextPaymentDate = page.getByText(/Next Payment Date/i).locator('xpath=..').locator('p, span, div').last();
        this.estimatedPaymentPlanAmount = page.getByText(/Estimated Payment Plan Amount/i).locator('xpath=..').getByText('$').first();
        this.customerPayoffAmount = page.getByText(/Customer PayOff Amount/i).locator('xpath=..').getByText('$').first();
        
        // Customer Details
        this.customerName = page.getByText('Customer Name').locator('..').locator('p, span').last();
        this.customerEmail = page.getByText('Email Address').first().locator('..').locator('p, span').last();
        
        // Business Details
        this.businessName = page.getByText('Business Name').locator('..').locator('p, span').last();
        this.businessEmail = page.getByText(/Business Email/i).locator('..').locator('p, span').last();
        
        // Employment & Payment
        this.employmentInfo = page.getByText(/Employment Information/i).locator('xpath=..');
        this.paymentMethodsList = page.locator('.payment-method-card, [class*="PaymentMethod"]');
        this.addNewCardButton = page.getByText(/Add New Card/i).first();

        // Transactions
        this.transactionHistoryList = page.getByText(/Transaction History/i).locator('..');
        this.serviceBreakdownTable = page.locator('table, [class*="breakdown-table"]');
        this.proofOfIdStatus = page.locator('div').filter({ hasText: /Proof of ID/i }).getByText(/Uploaded|Pending|Missing/i).first();

        this.downloadContractButton = page.getByText(/Download Contract/i).first();
        this.downloadConsentFormButton = page.getByText(/Download Consent Form/i).first();
        this.generateContributionLinkButton = page.getByText(/Generate Contribution Link/i).first();
        this.backToDashboardLink = page.getByText(/Back to dashboard/i).first();
    }

    async verifyContractDetailsVisible() {
        await expect.soft(this.contractIdHeading, 'Contract ID Heading should be visible').toBeVisible();
        await expect.soft(this.totalBalanceRemaining, 'Total Balance card should be visible').toBeVisible();
        await expect.soft(this.customerName, 'Customer Name should be visible').toBeVisible();
        await expect.soft(this.businessName, 'Business Name should be visible').toBeVisible();
        await expect.soft(this.addNewCardButton, 'Add New Card button should be visible').toBeVisible();
        await expect.soft(this.proofOfIdStatus, 'Proof of ID Status should be visible').toBeVisible();
    }

    async verifyTransactionPresence() {
        // Checking if we have at least one transaction entry as seen in image ($144.00)
        const firstEntry = this.page.getByText('$144.00');
        await expect.soft(firstEntry, 'Transaction entry of $144.00 should be visible').toBeVisible();
    }

    async verifyActionButtons() {
        await expect.soft(this.makePaymentButton, 'Make Payment button should be visible').toBeVisible();
        await expect.soft(this.payoffContractButton, 'PayOff Contract button should be visible').toBeVisible();
        await expect.soft(this.changePaymentDateButton, 'Change Payment Date button should be visible').toBeVisible();
        await expect.soft(this.makePartialPaymentButton, 'Make Partial Payment button should be visible').toBeVisible();
    }

    async getSummaryDetails() {
        const details = {
            balance: await this.totalBalanceRemaining.innerText(),
            nextDate: await this.nextPaymentDate.innerText(),
            planAmount: await this.estimatedPaymentPlanAmount.innerText(),
            payoffAmount: await this.customerPayoffAmount.innerText()
        };
        console.log('Contract Summary Details:', details);
        return details;
    }

    async goBackToDashboard() {
        await this.backToDashboardLink.click();
    }
}
