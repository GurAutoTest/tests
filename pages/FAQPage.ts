// work pending excel file te km krna multiple case bna k data pu krn lai search feild lai



import { Page, Locator, expect } from '@playwright/test';

export class FAQPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly faqItems: Locator;
    readonly noResultsText: Locator;
    readonly allButtons: Locator;
    readonly allLinks: Locator;
    readonly faqDropdown: Locator;
    readonly faqLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('input[placeholder*="Search"], input[name*="search"]').first();
        this.searchButton = page.locator('button:has-text("Search"), button .fa-search').first();
        this.faqItems = page.locator('.accordion-item, .faq-item, [class*="faq"]');
        this.noResultsText = page.getByText(/No results found|No FAQ found|Keyword not match/i);
        this.allButtons = page.locator('button');
        this.allLinks = page.locator('a');
        this.faqDropdown = page.locator('#dropdownMenuButton1');
        this.faqLink = page.getByRole('link', { name: 'FAQ\'s' });
    }

    async navigate() {
        await this.faqDropdown.click();
        await this.faqLink.click();
        await this.page.waitForTimeout(2000);
    }

    async verifyUIVisibility() {
        console.log('Verifying FAQ Page UI Visibility...');
        await expect.soft(this.searchInput, 'Search input should be visible').toBeVisible();
        
        // Verify buttons
        const btnCount = await this.allButtons.count();
        console.log(`Found ${btnCount} buttons.`);
        for (let i = 0; i < Math.min(btnCount,15); i++)   { // Check first 15
            await expect.soft(this.allButtons.nth(i)).toBeVisible();
        }

        // Verify links
        const linkCount = await this.allLinks.count();
        console.log(`Found ${linkCount} links.`);
        for (let i = 0; i < Math.min(linkCount, 15); i++) {
            await expect.soft(this.allLinks.nth(i)).toBeVisible();
        }
    }

    async searchFAQ(query: string) {
        console.log(`Searching FAQ for: ${query}`);
        await this.searchInput.clear();
        await this.searchInput.fill(query);
        // Sometimes search is automatic, sometimes requires button click
        if (await this.searchButton.isVisible()) {
            await this.searchButton.click();
        } else {
            await this.page.keyboard.press('Enter');
        }
        await this.page.waitForTimeout(1000); // Wait for results
    }

    async getResultsStatus(): Promise<string> {
        const isNoResults = await this.noResultsText.isVisible();
        if (isNoResults) return 'No Results';
        
        const count = await this.faqItems.count();
        return count > 0 ? 'Found' : 'No Results';
    }
}
