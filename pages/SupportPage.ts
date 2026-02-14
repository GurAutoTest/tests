import { Page, Locator, expect } from '@playwright/test';

export class SupportPage {
    readonly page: Page;
    readonly supportLink: Locator;
    readonly contactUsHeader: Locator;
    readonly phoneLink: Locator;
    readonly emailLink: Locator;
    readonly backToDashboardLink: Locator;
    readonly allButtons: Locator;
    readonly allLinks: Locator;

    readonly supportDropdown: Locator;
   

    constructor(page: Page) {
        this.page = page;
        // // Navigation locator (assuming it's in the sidebar or profile menu)
        // this.supportLink = page.getByRole('link', { name: /Support|Help/i }).first();
        
        // Page elements
        this.contactUsHeader = page.getByRole('heading', { name: /Support|Contact Us/i }).first();
        this.phoneLink = page.locator('a[href^="tel:"]').first();
        this.emailLink = page.locator('a[href^="mailto:"]').first();
        this.backToDashboardLink = page.getByText(/Back to Dashboard/i).first();
        
        this.allButtons = page.locator('button');
        this.allLinks = page.locator('a');
        this.supportDropdown = page.locator('#dropdownMenuButton1');
        this.supportLink = page.getByRole('link', { name: 'Support' });
    }

    async navigateToSupport() {
        console.log('Navigating to Support page...');
        await this.supportDropdown.click();
        await this.supportLink.click();
        await this.page.waitForTimeout(2000);
    }

    async verifyAllButtonsAndLinks() {
        console.log('Verifying all buttons and links on Support page...');
        
        // 1. Verify Buttons
        const buttonsCount = await this.allButtons.count();
        console.log(`Found ${buttonsCount} buttons.`);
        for (let i = 0; i < buttonsCount; i++) {
            const btn = this.allButtons.nth(i);
            const isVisible = await btn.isVisible();
            const text = await btn.innerText();
            
            if (isVisible) {
                await expect.soft(btn, `Button "${text}" should be visible`).toBeVisible();
                await expect.soft(btn, `Button "${text}" should be enabled/clickable`).toBeEnabled();
                console.log(`Verified button: ${text}`);
            }
        }

        // 2. Verify Links
        const linksCount = await this.allLinks.count();
        console.log(`Found ${linksCount} links.`);
        for (let i = 0; i < linksCount; i++) {
            const link = this.allLinks.nth(i);
            const isVisible = await link.isVisible();
            const text = await link.innerText();
            const href = await link.getAttribute('href');

            if (isVisible && text.trim() !== '') {
                await expect.soft(link, `Link "${text}" (${href}) should be visible`).toBeVisible();
                console.log(`Verified link: ${text} -> ${href}`);
            }
        }
    }

    async verifyContactInfo() {
        console.log('Verifying contact information...');
        await expect.soft(this.phoneLink, 'Phone link should be visible').toBeVisible();
        await expect.soft(this.emailLink, 'Email link should be visible').toBeVisible();
        
        const phone = await this.phoneLink.innerText();
        const email = await this.emailLink.innerText();
        
        console.log(`Support Phone: ${phone}`);
        console.log(`Support Email: ${email}`);
        
        expect(phone).toContain('833'); // Example check
        expect(email).toContain('@denefits.com');
    }

    async navigateBackToDashboard() {
        console.log('Navigating back to Dashboard...');
        await this.backToDashboardLink.click();
        await expect(this.page).toHaveURL(/.*dashboard/);
    }
}
