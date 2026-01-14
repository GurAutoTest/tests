import { test as base } from '@playwright/test';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

export const test = base.extend({
  page: async ({}, use) => {
    // Launch browser with stealth plugin
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await use(page);

    await browser.close();
  },
});

export { expect } from '@playwright/test';
