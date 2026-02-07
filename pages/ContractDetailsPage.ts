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
    readonly estimatedServiceAmount: Locator;
    readonly estimatedPaymentPlanAmount: Locator;
    readonly totalPayments: Locator;
    readonly remainingPayments: Locator;
    readonly missingPayments: Locator;
    readonly lateFeesCount: Locator;
    readonly lateFees: Locator;
    readonly recurringAmount: Locator;
    readonly downPaymentAmount: Locator;
    readonly interestRate: Locator;
    readonly fixedDenefitsFee: Locator;
    readonly customerPayoffAmount: Locator;
    readonly enrollmentDate: Locator;
    readonly donatedAmount: Locator;
    
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

        // Summary Card & Payment Details (Grid items)
        this.totalBalanceRemaining = page.getByText(/Total Balance Remaining/i).locator('xpath=..').getByText('$').first();
        this.nextPaymentDate = page.getByText(/Next Payment Date/i).locator('xpath=..').locator('p, span, div').last();
        
        this.estimatedServiceAmount = page.getByText(/Estimated Service Amount/i).locator('xpath=..').locator('p, span, div').last();
        this.estimatedPaymentPlanAmount = page.getByText(/Estimated Payment Plan Amount/i).locator('xpath=..').locator('p, span, div').last();
        
        this.totalPayments = page.getByText(/Total Payments/i, { exact: true }).locator('xpath=..').locator('p, span, div').last();
        this.remainingPayments = page.getByText(/Remaining Payments/i).locator('xpath=..').locator('p, span, div').last();
        
        this.missingPayments = page.getByText(/Missing Payments/i).locator('xpath=..').locator('p, span, div').last();
        this.lateFeesCount = page.getByText(/Late Fees Count/i).locator('xpath=..').locator('p, span, div').last();
        
        this.lateFees = page.getByText(/Late Fees/i, { exact: true }).locator('xpath=..').locator('p, span, div').last();
        this.recurringAmount = page.getByText(/Recurring Amount/i).locator('xpath=..').locator('p, span, div').last();
        
        this.downPaymentAmount = page.getByText(/Down Payment Amount/i).locator('xpath=..').locator('p, span, div').last();
        // Direct ID is most reliable, fallback to specific P tag if ID missing
        this.interestRate = page.locator('#interest_rate_to_show, p:has-text("Interest Rate") + p').first();
        
        this.fixedDenefitsFee = page.getByText(/Fixed Denefits Fee/i).locator('xpath=..').locator('p, span, div').last();
        this.customerPayoffAmount = page.getByText(/Customer Payoff Amount/i).locator('xpath=..').locator('p, span, div').last();
        
        this.enrollmentDate = page.locator('p:has-text("Enrollment Date") + p, [id*="enrollment_date"]').first();
        this.donatedAmount = page.getByText(/Donated Amount/i).locator('xpath=..').locator('p, span, div').last();
        
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

    // --- Calculation Helper ---
    async getNumericAmount(locator: Locator): Promise<number> {
        try {
            const text = await locator.innerText();
            // Remove '$', ',', and whitespace
            const cleanText = text.replace(/[$,\s]/g, '');
            return parseFloat(cleanText) || 0;
        } catch (e) {
            console.log(`Failed to parse amount: ${e}`);
            return 0;
        }
    }

    async verifyCalculationswrong() {
        const balance = await this.getNumericAmount(this.totalBalanceRemaining);
        const payoff = await this.getNumericAmount(this.customerPayoffAmount);
        const planAmount = await this.getNumericAmount(this.estimatedPaymentPlanAmount);

        console.log(`Verifying Calculations -> Balance: ${balance}, Payoff: ${payoff}, Plan: ${planAmount}`);

        // 1. Basic Sanity: Amounts should be positive
        expect.soft(balance, 'Total Balance should be greater than 0').toBeGreaterThan(0);
        expect.soft(payoff, 'Payoff Amount should be greater than 0').toBeGreaterThan(0);
        
        // 2. Logic: Payoff amount is typically <= Total Balance (due to early payoff benefits)
        expect.soft(payoff, 'Customer Payoff Amount should be less than or equal to Total Balance Remaining').toBeLessThanOrEqual(balance);

        // 3. Logic: If balance is > 0, plan amount should also be > 0 (usually)
        expect.soft(planAmount, 'Estimated Plan Amount should be greater than 0').toBeGreaterThan(0);
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

    async getAllPaymentDetails() {
        const details = {
            "Total Balance Remaining": await this.totalBalanceRemaining.innerText(),
            "Next Payment Date": await this.nextPaymentDate.innerText(),
            "Estimated Service Amount": await this.estimatedServiceAmount.innerText(),
            "Estimated Payment Plan Amount": await this.estimatedPaymentPlanAmount.innerText(),
            "Total Payments": await this.totalPayments.innerText(),
            "Remaining Payments": await this.remainingPayments.innerText(),
            "Missing Payments": await this.missingPayments.innerText(),
            "Late Fees Count": await this.lateFeesCount.innerText(),
            "Late Fees": await this.lateFees.innerText(),
            "Recurring Amount": await this.recurringAmount.innerText(),
            "Down Payment Amount": await this.downPaymentAmount.innerText(),
            "Interest Rate": await this.interestRate.innerText(),
            "Fixed Denefits Fee": await this.fixedDenefitsFee.innerText(),
            "Customer Payoff Amount": await this.customerPayoffAmount.innerText(),
            "Enrollment Date": await this.enrollmentDate.innerText(),
            "Donated Amount": await this.donatedAmount.innerText()
        };
        console.log('\n--- ALL PAYMENT VALUES ---');
        console.table(details);
        return details;
    }

    async goBackToDashboard() {
        await this.backToDashboardLink.click();
    }
}
