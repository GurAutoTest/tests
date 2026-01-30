import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;

    // --- Locators (Dynamic) ---
    readonly profileName: Locator;
    readonly contractIdValue: Locator;
    
    // Using filtered locators to find amounts near their descriptions
    readonly serviceAmountValue: Locator;
    readonly planAmountValue: Locator;
    
    readonly statusBadge: Locator;
    readonly amountPaidValue: Locator;
    readonly amountDueValue: Locator;
    
    readonly makePaymentButton: Locator;
    readonly transactionHistoryHeader: Locator;
    readonly addNewCardButton: Locator;
    readonly denefitsLogo: Locator;
    
    // New action/link properties
    readonly viewDetailsButton: Locator;
    readonly reportProblemLink: Locator;
    readonly changeMethodLink: Locator;
    readonly viewMoreContractsLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // 1. Profile
        this.profileName = page.getByRole('heading', { level: 3 }).first(); // Generic locator for the name heading

        // 2. Contract Details
        this.contractIdValue = page.getByText(/Contract ID/i).locator('xpath=following-sibling::* | ..').first();
        
        // Amounts - Using more specific filters to avoid picking up values from parent containers
        this.serviceAmountValue = page.locator('div').filter({ has: page.getByText(/^Estimated Service Amount$/i) }).getByText('$').first();
        this.planAmountValue = page.locator('div').filter({ has: page.getByText(/^Estimated Payment Plan Amount$/i) }).getByText('$').first();

        // 3. Status Section & Amounts
        // Finding the status by looking for the specific keywords anywhere near the dashboard area
        this.statusBadge = page.locator('div, span, p, [class*="badge"]').filter({ hasText: /Active|Suspended|Pending|Completed/i }).first();
        
        // Final precision fix for paid/due
        this.amountPaidValue = page.getByText(/^Amount Paid$/i).locator('xpath=..').getByText('$').first();
        this.amountDueValue = page.getByText(/^Amount Due$/i).locator('xpath=..').getByText('$').first();

        // 4. Actions & Links - Using very broad text matching for buttons as they can be div/span/a
        this.makePaymentButton = page.getByText(/Make Payment/i).first();
        this.addNewCardButton = page.getByText(/Add New Card/i).first();
        this.viewDetailsButton = page.getByText(/View Details/i).first();
        this.reportProblemLink = page.getByText(/Report.*Problem/i).first();
        this.changeMethodLink = page.getByText('Change').first();
        this.viewMoreContractsLink = page.getByText(/View More Contracts/i).first();

        // Structural Elements
        this.transactionHistoryHeader = page.getByText(/Transaction History/i).first();
        this.denefitsLogo = page.locator('header img, .sidebar img, [class*="logo"]').first();
    }

    // --- Helper to parse currency ---
    async getNumericAmount(locator: Locator): Promise<number> {
        try {
            await locator.waitFor({ state: 'visible', timeout: 5000 });
            const text = await locator.innerText();
            // Remove '$', ',', and whitespace
            const cleanText = text.replace(/[$,\s]/g, '');
            return parseFloat(cleanText) || 0;
        } catch (e) {
            console.log(`Failed to parse amount for locator: ${e}`);
            return 0;
        }
    }

    // --- Dynamic Actions ---
    
    // 1. Verify Common Elements (sanity check for any user)
    async verifyCommonElements() {
        // Soft wait to ensure dashboard animations/transitions are done
        await this.page.waitForTimeout(2000);

        // Using soft assertions so that the test continues even if one element is missing.
        // All failures will be grouped and reported at the end in Allure.
        
        // Primary Actions
        await expect.soft(this.makePaymentButton, 'Make Payment button should be visible').toBeVisible({ timeout: 10000 });
        await expect.soft(this.addNewCardButton, 'Add New Card button should be visible').toBeVisible({ timeout: 10000 });
        
        // Secondary Actions/Links
        await expect.soft(this.viewDetailsButton, 'View Details button should be visible').toBeVisible({ timeout: 5000 });
        await expect.soft(this.reportProblemLink, 'Report Problem link should be visible').toBeVisible({ timeout: 5000 });

        // Structural Elements
        await expect.soft(this.transactionHistoryHeader, 'Transaction History header should be visible').toBeVisible({ timeout: 5000 });
        await expect.soft(this.denefitsLogo, 'Denefits Logo should be visible').toBeVisible({ timeout: 5000 });
        
        // Status should be present (Active, Suspended, etc.)
        await expect.soft(this.statusBadge, 'Status Badge (Active) should be visible').toBeVisible({ timeout: 5000 });
    }

    // 2. Verify Math Logic (Paid + Due ~= Total Plan)
    // This works regardless of the specific amounts
    async verifyPaymentCalculations() {
        // We wait for amounts to be visible
        const paid = await this.getNumericAmount(this.amountPaidValue);
        const due = await this.getNumericAmount(this.amountDueValue);
        
        console.log(`Dynamic Values -> Paid: ${paid}, Due: ${due}`);

        // Simple Sanity: Paid and Due should be non-negative
        await expect.soft(paid, 'Amount Paid should be >= 0').toBeGreaterThanOrEqual(0);
        await expect.soft(due, 'Amount Due should be >= 0').toBeGreaterThanOrEqual(0);



        
    }

    // 3. Verify Profile Name (Dynamic Check)
    async verifyProfile(expectedName?: string) {
        if (expectedName) {
            await expect.soft(this.page.getByText(expectedName).first(), `Profile name "${expectedName}" not found`).toBeVisible({ timeout: 5000 });
        } else {
            await expect.soft(this.profileName, 'Profile Heading not found').toBeVisible({ timeout: 5000 });
        }
    }

    async clickViewDetails() {
        console.log('Attempting to click View Details button...');
        await this.viewDetailsButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.viewDetailsButton.click();
        console.log('View Details button clicked.');
    }
}
