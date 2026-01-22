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
        this.emailInput = page.getByLabel('Email');
        this.enterPasswordButton = page.getByRole('button', { name: 'Enter Password' });
        this.getOTPButton = page.getByRole('button', { name: 'Get OTP' });
        this.passwordInput = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    }

    async navigate() {
        await this.page.goto('https://testcustomer.denefits.com/login');
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async clickEnterPassword() {
        await this.enterPasswordButton.click();
    }

    async enterPassword(password: string) {
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
