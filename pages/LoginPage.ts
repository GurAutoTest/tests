import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
    }

    async navigate() {
        await this.page.goto('https://admin-demo.nopcommerce.com/login?returnUrl=%2Fadmin%2F');
    }

    async login(username: string, password: string) {
        await this.emailInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyTitle(title: RegExp | string) {
        await expect(this.page).toHaveTitle(title);
    }

    async logout() {
        await this.logoutLink.click();
    }
}
