import { Page, Locator, expect } from '@playwright/test';

export class Calculations {
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

    // Internal calculation storage
    private my_totalBalanceRemaining: number = 0;
    private my_downPaymentAmount: number = 0;
    private my_recurringAmount: number = 0;
    private my_intrestamount: number = 0;

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
        // this.interestRate = page.getByLabel('Interest Rate');
        

        this.interestRate = page.locator('#interest_rate_to_show, p:has-text("Interest Rate") + p').first();
        


        this.fixedDenefitsFee = page.getByText(/Fixed Denefits Fee/i).locator('xpath=..').locator('p, span, div').last();
        this.customerPayoffAmount = page.getByText(/Customer Payoff Amount/i).locator('xpath=..').locator('p, span, div').last();
        
        this.enrollmentDate = page.getByText(/Enrollment Date/i).locator('xpath=..').locator('p, span, div').last();
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
        // Transactions
        this.transactionHistoryList = page.locator('div, section, .card').filter({ hasText: /Transaction History/i });

        this.serviceBreakdownTable = page.locator('table, [class*="breakdown-table"]');
        this.proofOfIdStatus = page.locator('div').filter({ hasText: /Proof of ID/i }).getByText(/Uploaded|Pending|Missing/i).first();

        this.downloadContractButton = page.getByText(/Download Contract/i).first();
        this.downloadConsentFormButton = page.getByText(/Download Consent Form/i).first();
        this.generateContributionLinkButton = page.getByText(/Generate Contribution Link/i).first();
        this.backToDashboardLink = page.getByText(/Back to dashboard/i).first();
    }

    
   


    // --- Calculation Helper ---
    async getNumericAmount(locator: Locator): Promise<number> {
        try {
            const text = await locator.innerText();
            // Remove '$', ',', and spaces
            let cleanText = text.replace(/[$,\s]/g, '');
            
            // Handle expressions like '25*2' or '138.35+4.15'
            if (cleanText.includes('*')) {
                const parts = cleanText.split('*');
                return (parseFloat(parts[0]) || 0) * (parseFloat(parts[1]) || 1);
            }
            if (cleanText.includes('+')) {
                const parts = cleanText.split('+');
                return (parseFloat(parts[0]) || 0) + (parseFloat(parts[1]) || 0);
            }

            return parseFloat(cleanText) || 0;
        } catch (e) {
            console.log(`Failed to parse amount: ${e}`);
            return 0;
        }
    }

    // async verifyCalculations() {
    //     const balance = await this.getNumericAmount(this.totalBalanceRemaining);
    //     const payoff = await this.getNumericAmount(this.customerPayoffAmount);
    //     const planAmount = await this.getNumericAmount(this.estimatedPaymentPlanAmount);

    //     console.log(`Verifying Calculations -> Balance: ${balance}, Payoff: ${payoff}, Plan: ${planAmount}`);

    //     // 1. Basic Sanity: Amounts should be positive
    //     expect.soft(balance, 'Total Balance should be greater than 0').toBeGreaterThan(0);
    //     expect.soft(payoff, 'Payoff Amount should be greater than 0').toBeGreaterThan(0);
        
    //     // 2. Logic: Payoff amount is typically <= Total Balance (due to early payoff benefits)
    //     expect.soft(payoff, 'Customer Payoff Amount should be less than or equal to Total Balance Remaining').toBeLessThanOrEqual(balance);

    //     // 3. Logic: If balance is > 0, plan amount should also be > 0 (usually)
    //     expect.soft(planAmount, 'Estimated Plan Amount should be greater than 0').toBeGreaterThan(0);
    // }


    async verifyPayoffCalculations() {
        // Capturing all fields as variables
        const balance = await this.getNumericAmount(this.totalBalanceRemaining);
        const payoff = await this.getNumericAmount(this.customerPayoffAmount);
        const planAmount = await this.getNumericAmount(this.estimatedPaymentPlanAmount);
        //const nextPaymentDate = await this.nextPaymentDate.innerText();
        const estServiceAmount = await this.getNumericAmount(this.estimatedServiceAmount);
        const totalPayments = await this.getNumericAmount(this.totalPayments);
        const remainingPayments = await this.getNumericAmount(this.remainingPayments);
        const missingPayments = await this.getNumericAmount(this.missingPayments);
        const lateFeesCount = await this.getNumericAmount(this.lateFeesCount);
        const lateFees = await this.getNumericAmount(this.lateFees);
        const recurringAmount = await this.getNumericAmount(this.recurringAmount);
        const downPaymentAmount = await this.getNumericAmount(this.downPaymentAmount);
        const interestRate = await this.getNumericAmount(this.interestRate);
        const fixedDenefitsFee = await this.getNumericAmount(this.fixedDenefitsFee);
        //const enrollmentDateStr = await this.enrollmentDate.innerText();
        const donatedAmount = await this.getNumericAmount(this.donatedAmount);

        // Date extraction for month
        // const dateObj = new Date(enrollmentDateStr);
        // const my_enrollmentMonth = dateObj.getMonth() + 1; // 1-12

        const my_principalAmount = planAmount / totalPayments;
        // let my_interestRate;
        // if (totalPayments >= 12) {
        //     my_interestRate = 1.1990; 
        // } else {
        //     my_interestRate = 16.99;
        // }
        let my_interestRate;

        if (totalPayments < 13) {
            my_interestRate = 1.1990;   // 13 toh niche
        } else {
            my_interestRate = 16.99;   // 13 ya us toh vadh
        }


        let my_recurringAmount;
        
        console.log(`\n--- Recurring Amount Calculation Steps ---`);
        console.log(`Plan Amount: ${planAmount}`);
        console.log(`Total Payments: ${totalPayments}`);
        console.log(`Interest Rate Used: ${my_interestRate}`);

        let totalWithInterest;
        if (totalPayments < 13) {
            console.log(`Logic: Total Payments < 13 (Using Multiplier Logic)`);
            totalWithInterest = planAmount * my_interestRate;
            console.log(`Step 1: Plan Amount * Interest Rate (${planAmount} * ${my_interestRate}) = ${totalWithInterest}`);
            
            my_recurringAmount = totalWithInterest / totalPayments;
            console.log(`Step 2: Total / Total Payments (${totalWithInterest} / ${totalPayments}) = ${my_recurringAmount}`);
        } else {
            console.log(`Logic: Total Payments >= 13 (Using Compound/Exponential Logic)`);
            
            const rateFactor = 1 + (my_interestRate / 1200);
            console.log(`Step 1: Rate Factor (1 + ${my_interestRate}/1200) = ${rateFactor}`);
            
            const compoundFactor = Math.pow(rateFactor, totalPayments); // equivalent to ** totalPayments
            console.log(`Step 2: Compound Factor (${rateFactor} ^ ${totalPayments}) = ${compoundFactor}`);
            
            totalWithInterest = planAmount * compoundFactor;
            console.log(`Step 3: Plan Amount * Compound Factor (${planAmount} * ${compoundFactor}) = ${totalWithInterest}`);
            
            my_recurringAmount = totalWithInterest / (totalPayments+1);
            console.log(`Step 4: Total / Total Payments (${totalWithInterest} / ${totalPayments}) = ${my_recurringAmount}`);
        }
        
        // Round recurring amount to 2 decimal places
        my_recurringAmount = parseFloat(my_recurringAmount.toFixed(2));
        this.my_recurringAmount = my_recurringAmount;
        console.log(`Rounded Recurring Amount: ${my_recurringAmount}`);
        
        console.log(`------------------------------------------\n`);



        const my_remainingPayments = remainingPayments;
        let my_payoffAmount;
        if (missingPayments > 0) {
            /////overdue case
            my_payoffAmount = (my_principalAmount * (my_remainingPayments - missingPayments)) + (missingPayments * my_recurringAmount) + (lateFeesCount * lateFees);
        } else {
            /////actiive case
            my_payoffAmount = my_principalAmount * my_remainingPayments;
        }
        
        // Round payoff amount
        my_payoffAmount = parseFloat(my_payoffAmount.toFixed(2));
        
        const my_missingPayments = totalPayments - my_remainingPayments;
        const my_downPaymentAmount = estServiceAmount - planAmount;       
        this.my_downPaymentAmount = my_downPaymentAmount;
        this.my_intrestamount = totalWithInterest - planAmount;
        
       
        let my_totalBalanceRemaining = (recurringAmount * my_remainingPayments) + (lateFeesCount * lateFees);
        this.my_totalBalanceRemaining = parseFloat(my_totalBalanceRemaining.toFixed(2));


        let my_DenefitsFeeUpfrontPayment = 0;
        if(this.my_recurringAmount <= this.my_intrestamount){
            // if recurring amount is less than or equal to interest amount
            // then Denefits Fee + Upfront Payment = recurring amount
            my_DenefitsFeeUpfrontPayment = this.my_recurringAmount;
            console.log(`logic1`);
         }
         else if(this.my_recurringAmount > this.my_intrestamount){
            // if recurring amount is greater than interest amount
            // then Denefits Fee + Upfront Payment = interest amount
            my_DenefitsFeeUpfrontPayment = this.my_intrestamount;
            console.log(`logic2`);
         }
         else{
            my_DenefitsFeeUpfrontPayment = (await this.getNumericAmount(this.estimatedPaymentPlanAmount)) / 10;
            console.log(`logic3`);
         }
         console.log(`Calculated Denefits Fee + Upfront Payment: ${my_DenefitsFeeUpfrontPayment}`);
   


        // // Calculate Next Payment Date (Enrollment Date + 1 Month)
        // const nextDateObj = new Date(dateObj);
        // nextDateObj.setMonth(nextDateObj.getMonth() + 1);
        // const my_nextPaymentDate = nextDateObj.toLocaleDateString(); 



        console.log(`--- Calculated Expected Values ---`);
        // console.log(`Enrollment Month: ${my_enrollmentMonth}`);
        console.log(`Calculated Total Balance Remaining: ${my_totalBalanceRemaining}`);
        console.log(`Calculated Principal: ${my_principalAmount}`);
        console.log(`Calculated Payoff: ${my_payoffAmount}`);
        console.log(`Calculated Missing Payments: ${my_missingPayments}`);
        console.log(`Calculated Down Payment Amount: ${my_downPaymentAmount}`);
        console.log(`Calculated Interest Rate: ${my_interestRate}`);
        console.log(`Calculated Recurring: ${my_recurringAmount}`);
        //console.log(`Expected Next Payment Date: ${my_nextPaymentDate}`);
        console.log(`---------------------------------`);
    }

    private async ensureCalculationsPopulated() {
        if (this.my_totalBalanceRemaining === 0 && this.my_downPaymentAmount === 0) {
            console.log("Calculations not populated, running verifyPayoffCalculations first...");
            await this.verifyPayoffCalculations();
        }
    }

    async verifyTransactionHistory() {
        console.log(`\n--- Transaction History Analysis ---`);
        await this.ensureCalculationsPopulated();

        // Wait for the "Transaction History" text to be present on the page
        const header = this.page.getByText(/Transaction History/i).first();
        try {
            await header.waitFor({ state: 'attached', timeout: 10000 });
            await header.scrollIntoViewIfNeeded();
            console.log(`Found Header: "${await header.innerText()}"`);
        } catch (e) {
            console.log("Could not find 'Transaction History' header even after waiting.");
            // Log a bit of the page text to see what's actually there
            const pageText = await this.page.innerText('body');
            console.log("Page text snippet:", pageText.substring(0, 500).replace(/\n/g, ' '));
            return;
        }

        // Find rows: we look for any element that has a $ sign followed by numbers
        // We look within the parent card/section if possible, or just the whole page if it's clear
        const container = header.locator('xpath=ancestor::div[contains(@class, "card") or contains(@class, "section") or contains(@class, "container")][1] | ancestor::section[1] | ancestor::div[1]').first();
        
        // Find all rows that have a $ sign (amount) and a date (MM/DD/YYYY)
        // This helps filter out summary items that lack dates
        const rows = container.locator('div, [class*="item"], [class*="row"], tr, li').filter({ hasText: /\$\s?[0-9,]+\.[0-9]{2}/ }).filter({ hasText: /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/ });
        let rowCount = await rows.count();

        console.log(`Total Potential Transaction Rows Found: ${rowCount}`);

        if (rowCount === 0) {
            console.log("No transaction-like rows (with $ and Date) found in the container.");
            return;
        }

        let totalPaid = 0;
        let successfulTransactions = 0;

        const skipLabels = /Total Balance|Service Amount|Payment Plan|Recurring Amount|Down Payment|Payoff Amount/i;

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const rowText = await row.innerText();
            
            // Skip known summary labels just in case the date check wasn't enough
            if (skipLabels.test(rowText)) continue;

            // To avoid summing up parents that contain children already counted:
            const nestedCount = await row.locator('div, [class*="item"], [class*="row"], tr, li').filter({ hasText: /\$\s?[0-9,]+\.[0-9]{2}/ }).count();
            if (nestedCount > 0) continue; 

            console.log(`Transaction Row ${successfulTransactions + 1}: ${rowText.replace(/\n/g, ', ').replace(/\t/g, ', ')}`);
            
            // Extract amount ($123.45)
            const amountMatch = rowText.match(/\$\s?([0-9,]+\.[0-9]{2})/);
            if (amountMatch) {
                const val = parseFloat(amountMatch[1].replace(/,/g, ''));
                
                // Only sum up if not failed/declined
                if (!rowText.match(/Failed|Declined|Void/i)) {
                    totalPaid += val;
                    successfulTransactions++;

                    // Dispatch to specialized handlers based on description
                    if (rowText.includes('Denefits Fee + Upfront Payment')) {
                        await this.handleDenefitsFeeUpfrontPayment(rowText, val);
                    } else if (rowText.includes('Recurring Payment')) {
                        await this.handleRecurringPayment(rowText, val);
                    } else {
                        console.log(`Other Payment Type detected: ${val}`);
                    }
                }
            }
        }
        
    }

    async handleDenefitsFeeUpfrontPayment(rowText: string, amount: number) {
        console.log(`>>> Specialized Handler: handleDenefitsFeeUpfrontPayment ($${amount})`);
        // Add specific validation logic here if needed
        expect.soft(amount).toBeGreaterThan(0);
        // uf have 3 logics 

        // let my_DenefitsFeeUpfrontPayment = 0;
        // if(this.my_recurringAmount <= this.my_intrestamount){
        //     // if recurring amount is less than or equal to interest amount
        //     // then Denefits Fee + Upfront Payment = recurring amount
        //     my_DenefitsFeeUpfrontPayment = this.my_recurringAmount;
        //     console.log(`logic1`);
        //  }
        //  else if(this.my_recurringAmount > this.my_intrestamount){
        //     // if recurring amount is greater than interest amount
        //     // then Denefits Fee + Upfront Payment = interest amount
        //     my_DenefitsFeeUpfrontPayment = this.my_intrestamount;
        //     console.log(`logic2`);
        //  }
        //  else{
        //     my_DenefitsFeeUpfrontPayment = (await this.getNumericAmount(this.estimatedPaymentPlanAmount)) / 10;
        //     console.log(`logic3`);
        //  }
        
        //console.log(`Calculated Denefits Fee + Upfront Payment: ${my_DenefitsFeeUpfrontPayment}`);
    }

    async handleRecurringPayment(rowText: string, amount: number) {
        console.log(`>>> Specialized Handler: handleRecurringPayment ($${amount})`);
        // Add specific validation logic here if needed
        expect.soft(amount).toBeGreaterThan(0);
    }
}
