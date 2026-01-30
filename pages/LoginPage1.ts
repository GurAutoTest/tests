import { Page, Locator, expect } from '@playwright/test';

export class LoginPage1 {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly enterPasswordButton: Locator;
    readonly getOTPButton: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[type="email"], input[name="email"], input[type="text"]');
        this.enterPasswordButton = page.getByRole('button', { name: 'Enter Password' });
        this.getOTPButton = page.getByRole('button', { name: 'Get OTP' });
        // Solution 4: Using a more direct locator for password field
        this.passwordInput = page.locator('input[type="password"], [name="password"], #password');
        this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    }

    async navigate() {
        // Use 'commit' to bypass splash screen loading issues and wait for actual content
        await this.page.goto('https://testcustomer.denefits.com/login', { waitUntil: 'commit' });
        // Explicitly wait for the login form to be visible (past the splash screen)
        await this.emailInput.waitFor({ state: 'visible', timeout: 600000 });
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async clickEnterPassword() {
        await this.enterPasswordButton.click();
        // Solution 3: Brief delay to allow the password field to be rendered/animated
        await this.page.waitForTimeout(1000);
    }

    async enterPassword(password: string) {
        // Solution 1: Explicitly wait for the password field to be visible before filling
        await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async loginWithPassword(email: string, password: string) {
        await this.enterEmail(email);
        await this.clickEnterPassword();
        await this.enterPassword(password);
        await this.clickLogin();
    }
}
