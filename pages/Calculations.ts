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
    private my_payoffAmount: number = 0;
    private my_planAmount: number = 0;
    private my_estServiceAmount: number = 0;
    private my_totalPayments: number = 0;
    private my_remainingPayments: number = 0;
    private my_missingPayments: number = 0;
    private my_lateFeesCount: number = 0;
    private my_lateFees: number = 0;
    private my_interestRate: number = 0;
    private my_fixedDenefitsFee: number = 0;
    private my_donatedAmount: number = 0;
    private my_nextPaymentDate: string = '';
    private my_principalAmount: number = 0;



    

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

    private async readExcelValue(contractId: string, headerName: string, rowType: 'Fetched' | 'Calculated'): Promise<number> {
        const fs = require('fs');
        const path = require('path');
        const xlsx = require('node-xlsx');
        
        const dirPath = path.join(process.cwd(), 'test-contract-data');
        const filePath = path.join(dirPath, `${contractId}.xlsx`);
        
        if (!fs.existsSync(filePath)) {
            console.log(`Excel file not found for ${contractId}`);
            return 0;
        }
        
        const sheets = xlsx.parse(fs.readFileSync(filePath));
        const sheet = sheets[0];
        const data = sheet.data as any[][]; // array of arrays
        
        // Row 0 is headers
        const headers = data[0];
        const colIndex = headers.indexOf(headerName);
        
        if (colIndex === -1) {
             console.log(`Column ${headerName} not found in Excel`);
             return 0;
        }
        
        const targetRow = data.find(row => row[0] === rowType);
        if (!targetRow) {
             console.log(`Row type ${rowType} not found in Excel`);
             return 0;
        }
        
        const val = targetRow[colIndex];
        return parseFloat(val) || 0;
    }

    // async verifyCalculations() {
    //     const balance = await this.getNumericAmount(this.totalBalanceRemaining);
    //     const payoff = await this.getNumericAmount(this.customerPayoffAmount);
    //     const planAmount = await this.getNumericAmount(this.estimatedPaymentPlanAmount);
    //
    //     console.log(`Verifying Calculations -> Balance: ${balance}, Payoff: ${payoff}, Plan: ${planAmount}`);
    //
    //     // 1. Basic Sanity: Amounts should be positive
    //     expect.soft(balance, 'Total Balance should be greater than 0').toBeGreaterThan(0);
    //     expect.soft(payoff, 'Payoff Amount should be greater than 0').toBeGreaterThan(0);
    //     
    //     // 2. Logic: Payoff amount is typically <= Total Balance (due to early payoff benefits)
    //     expect.soft(payoff, 'Customer Payoff Amount should be less than or equal to Total Balance Remaining').toBeLessThanOrEqual(balance);
    //
    //     // 3. Logic: If balance is > 0, plan amount should also be > 0 (usually)
    //     expect.soft(planAmount, 'Estimated Plan Amount should be greater than 0').toBeGreaterThan(0);
    // }


    async verifyInitialCalculations() {
        // Capturing all fields as variables
        const balance = await this.getNumericAmount(this.totalBalanceRemaining);
        const payoff = await this.getNumericAmount(this.customerPayoffAmount);
        const planAmount = await this.getNumericAmount(this.estimatedPaymentPlanAmount);
        const nextPaymentDate = await this.nextPaymentDate.innerText();
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
     
        let my_interestRate;

        if (totalPayments < 13) {
            my_interestRate = 1.1990;   // 13 toh niche
        } else {
            my_interestRate = 16.99;   // 13 ya us toh vadh
        }


        let my_recurringAmount;
        let totalWithInterest: number = 0;
        
        console.log(`\n--- Recurring Amount Calculation Steps ---`);
        console.log(`Plan Amount: ${planAmount}`);
        console.log(`Total Payments: ${totalPayments}`);
        console.log(`Interest Rate Used: ${my_interestRate}`);

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
        const my_intrestamount = totalWithInterest - planAmount;
        this.my_intrestamount = my_intrestamount;
        
       
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

        await this.saveContractSummaryToExcel(
            await this.contractIdHeading.innerText().then(t => t.replace(/Contract ID:\s?/i, '').trim()),
            'Fetched',
            {
                balance, payoff, planAmount, estServiceAmount, totalPayments, remainingPayments,
                missingPayments, lateFeesCount, lateFees, recurringAmount, downPaymentAmount,
                interestRate, fixedDenefitsFee, donatedAmount, nextPaymentDate
            }
        );

        await this.saveContractSummaryToExcel(
            await this.contractIdHeading.innerText().then(t => t.replace(/Contract ID:\s?/i, '').trim()),
            'Calculated',
            {
                my_totalBalanceRemaining, my_payoffAmount,my_remainingPayments, my_principalAmount, my_missingPayments,
                 my_interestRate, my_recurringAmount, my_intrestamount,
                my_DenefitsFeeUpfrontPayment
            }
        );


        // console.log(`set toh phla: ${my_totalBalanceRemaining}`);
        // console.log(`set toh phla: ${my_payoffAmount}`);
        // console.log(`set toh phla: ${my_remainingPayments}`);
        // console.log(`set toh phla: ${my_principalAmount}`);








             // set dubara global varable *****************************************************
        this.my_totalBalanceRemaining = my_totalBalanceRemaining;
        this.my_payoffAmount = my_payoffAmount;
        this.my_planAmount = planAmount;
        this.my_nextPaymentDate = nextPaymentDate;
        this.my_estServiceAmount = estServiceAmount;
        this.my_totalPayments = totalPayments;
        this.my_remainingPayments = my_remainingPayments;
        this.my_missingPayments = my_missingPayments;
        this.my_lateFeesCount = lateFeesCount;
        this.my_lateFees = lateFees;
        this.my_principalAmount = my_principalAmount;
        this.my_recurringAmount = my_recurringAmount;
        this.my_downPaymentAmount = my_downPaymentAmount;
        this.my_interestRate = my_interestRate;
        this.my_fixedDenefitsFee = fixedDenefitsFee;
        this.my_donatedAmount = donatedAmount;



    }

    async saveContractSummaryToExcel(contractId: string, rowLabel: string, dataObj: any) {
        const fs = require('fs');
        const path = require('path');
        const xlsx = require('node-xlsx');

        const dirPath = path.join(process.cwd(), 'test-contract-data');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, `${contractId}.xlsx`);

        // Headers Definition
        const headers = [
            'Type', 'Contract ID','Service Amount','Plan Amount', 'Down Payment', 'Interest Rate',    
            'Total Payments', 'Remaining Payments','Principal', 'Recurring Amount', 'Total Balance Remaining',
             'Payoff','Next Payment Date', 'Missing Payments', 'Late Fees Count', 'Late Fees', 
            'Denefits Fee', 'Donated', 'Interest Amount', 'Denefits Fee+Upfront'
        ];

        let existingData: any[][] = [];
        if (fs.existsSync(filePath)) {
            try {
                const sheets = xlsx.parse(fs.readFileSync(filePath));
                if (sheets.length > 0) {
                     existingData = sheets[0].data;
                }
            } catch (e) { console.log(`Error reading existing excel: ${e}`); }
        }

        if (existingData.length === 0) {
            existingData.push(headers);
        }

        // Find if row already exists
        let rowIndex = existingData.findIndex(row => row[0] === rowLabel);
        if (rowIndex === -1) {
            // Initialize new row with dashes
            const newRow = new Array(headers.length).fill('-');
            newRow[0] = rowLabel;
            newRow[1] = contractId;
            existingData.splice(100, 0, newRow); // Append at end (conceptually), but before transaction history if mixed? 
                                                 // Better just push if we assume structure. 
                                                 // But let's find the header row's index + 1 + count of data rows?
                                                 // existingData could contain transaction history later.
            
            // let's insert after the last typed row. 
            // Simple approach: look for 'Transaction History' and insert before it, or push if not found.
            const transIdx = existingData.findIndex(r => r && r[0] === 'Transaction History');
            if (transIdx !== -1) {
                existingData.splice(transIdx - 1, 0, newRow); // insert before gap before transaction history
                rowIndex = transIdx - 1;
            } else {
                existingData.push(newRow);
                rowIndex = existingData.length - 1;
            }
        }
        
        // --- Dynamic Mapping Helper ---
        const update = (headerName: string, possibleValues: any[]) => {
            const colIdx = headers.indexOf(headerName);
            if (colIdx === -1) return;
            
            for (const val of possibleValues) {
                if (val !== undefined && val !== null) {
                    existingData[rowIndex][colIdx] = val;
                    break; 
                }
            }
        };

        // --- Execute Mapping ---
        // Pass array of precedence: dataObj[key], then dataObj[otherKey]...
        update('Service Amount', [dataObj.estServiceAmount, dataObj.serviceAmount]);
        update('Plan Amount', [dataObj.planAmount, dataObj.estimatedPaymentPlanAmount]);
        update('Down Payment', [dataObj.my_downPaymentAmount, dataObj.downPaymentAmount, dataObj.my_afterfirstrecurring_downPaymentAmount, dataObj.my_afterrecurring_downPaymentAmount]);
        update('Interest Rate', [dataObj.my_interestRate, dataObj.interestRate, dataObj.my_afterfirstrecurring_interestRate, dataObj.my_afterrecurring_interestRate]);
        update('Total Payments', [dataObj.totalPayments]);
        update('Remaining Payments', [dataObj.my_afterfirstrecurring_remainingPayments, dataObj.my_remainingPayments, dataObj.remainingPayments, dataObj.my_afterrecurring_remainingPayments]);
        update('Principal', [dataObj.my_principalAmount, dataObj.my_afterfirstrecurring_principalAmount, dataObj.principalAmount, dataObj.my_afterrecurring_principalAmount]);
        update('Recurring Amount', [dataObj.my_afterfirstrecurring_recurringAmount, dataObj.my_recurringAmount, dataObj.recurringAmount, dataObj.my_afterrecurring_recurringAmount]);
        update('Total Balance Remaining', [dataObj.my_afterfirstrecurring_totalBalanceRemaining, dataObj.my_totalBalanceRemaining, dataObj.balance, dataObj.totalBalanceRemaining, dataObj.my_afterrecurring_totalBalanceRemaining]);
        update('Payoff', [dataObj.my_afterfirstrecurring_payoffAmount, dataObj.my_payoffAmount, dataObj.payoff, dataObj.customerPayoffAmount, dataObj.my_afterrecurring_payoffAmount]);
        update('Next Payment Date', [dataObj.nextPaymentDate, dataObj.my_nextPaymentDate]);
        update('Missing Payments', [dataObj.my_missingPayments, dataObj.missingPayments, dataObj.my_afterfirstrecurring_missingPayments, dataObj.my_afterrecurring_missingPayments]);
        update('Late Fees Count', [dataObj.lateFeesCount]);
        update('Late Fees', [dataObj.lateFees]);
        update('Denefits Fee', [dataObj.fixedDenefitsFee, dataObj.DenefitsFee]);
        update('Donated', [dataObj.donatedAmount]);
        update('Interest Amount', [dataObj.my_afterfirstrecurring_intrestamount, dataObj.my_intrestamount, dataObj.interestAmount, dataObj.my_afterrecurring_intrestamount]);
        update('Denefits Fee+Upfront', [dataObj.my_DenefitsFeeUpfrontPayment]);


        const buffer = xlsx.build([{ name: 'Contract Data', data: existingData }]);
        fs.writeFileSync(filePath, buffer);
        console.log(`Excel file updated (${rowLabel}): ${filePath}`);
    }

    // private async ensureCalculationsPopulated() {
    //     if (this.my_totalBalanceRemaining === 0 && this.my_downPaymentAmount === 0) {
    //         console.log("Calculations not populated, running verifyInitialCalculations first...");
    //         await this.verifyInitialCalculations();
    //     }
    // }

    async verifyTransactionHistory() {
        // If initial calculations haven't been run or globals are empty, run them now.
        if (this.my_principalAmount === 0 || this.my_totalPayments === 0) {
            console.log("Initial calculations not loaded. Running verifyInitialCalculations first...");
            await this.verifyInitialCalculations();
        }

        console.log("Verifying Transaction History...");
        // // 1. Locate the transaction block
        // // Assuming it's a div, table, or list with class related to "history" or "transactions"
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

        // Find rows
        const container = header.locator('xpath=ancestor::div[contains(@class, "card") or contains(@class, "section") or contains(@class, "container")][1] | ancestor::section[1] | ancestor::div[1]').first();
        const rows = container.locator('div, [class*="item"], [class*="row"], tr, li').filter({ hasText: /\$\s?[0-9,]+\.[0-9]{2}/ }).filter({ hasText: /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/ });
        let rowCount = await rows.count();

        console.log(`Total Potential Transaction Rows Found: ${rowCount}`);

        if (rowCount === 0) {
            console.log("No transaction-like rows (with $ and Date) found in the container.");
            return;
        }

        const skipLabels = /Total Balance|Service Amount|Payment Plan|Recurring Amount|Down Payment|Payoff Amount/i;
        const capturedTransactions: any[] = [];
        let successfulTransactions = 0;

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const rowText = await row.innerText();
            
            if (skipLabels.test(rowText)) continue;

            const nestedCount = await row.locator('div, [class*="item"], [class*="row"], tr, li').filter({ hasText: /\$\s?[0-9,]+\.[0-9]{2}/ }).count();
            if (nestedCount > 0) continue; 

            // Extract amount ($123.45)
            const amountMatch = rowText.match(/\$\s?([0-9,]+\.[0-9]{2})/);
            const dateMatch = rowText.match(/([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4})/);
            
            if (amountMatch) {
                const val = parseFloat(amountMatch[1].replace(/,/g, ''));
                const date = dateMatch ? dateMatch[1] : '';
                
                // Simple parsing for description/type (removing date and amount)
                let desc = rowText.replace(amountMatch[0], '').replace(date, '').replace(/\n/g, ' ').trim();
                desc = desc.replace(/\s+/g, ' '); // collapse spaces

                capturedTransactions.push({
                    date,
                    amount: val,
                    description: desc,
                    fullText: rowText.replace(/\n/g, ' ')
                });

                if (!rowText.match(/Failed|Declined|Void/i)) {
                    successfulTransactions++;
                    console.log(`Transaction Row ${successfulTransactions}: ${rowText.replace(/\n/g, ', ').replace(/\t/g, ', ')}`);

                    if (rowText.includes('Denefits Fee + Upfront Payment')) {
                        await this.handleDenefitsFeeUpfrontPayment(rowText, val);

                    } else if (rowText.includes('First Recurring Payment')) {
                        await this.handleFirstRecurringPayment(rowText, val);
                    } else if (rowText.includes('Recurring Payment')) {
                        await this.handleRecurringPayment(rowText, val);
                    } else if (rowText.includes('Partial Payment')) {
                        await this.handlePartialPayment(rowText, val);
                    } else if (rowText.includes('Additional Payment') || rowText.includes('Pay More')) {
                        await this.handlePayMore(rowText, val);
                    } else if (rowText.includes('Payoff') || rowText.includes('Contract Payoff')) {
                        await this.handlePayoff(rowText, val);
                    } else if (rowText.includes('Contribution')) {
                        await this.handleContributionLink(rowText, val);
                    }
                }
            }
        }

        // Save to Excel
        const contractId = await this.contractIdHeading.innerText().then(t => t.replace(/Contract ID:\s?/i, '').trim());
        await this.appendTransactionsToExcel(contractId, capturedTransactions);
    }

    async handleDenefitsFeeUpfrontPayment(rowText: string, amount: number) {
        console.log(`>>> Specialized Handler: handleDenefitsFeeUpfrontPayment ($${amount})`);
        expect.soft(amount).toBeGreaterThan(0);
    }































    

    async handleFirstRecurringPayment(rowText: string, amount: number) {
        console.log(`>>> Specialized Handler: handleFirstRecurringPayment ($${amount})`);
        expect.soft(amount).toBeGreaterThan(0);
        
        const contractId = await this.contractIdHeading.innerText().then(t => t.replace(/Contract ID:\s?/i, '').trim());

        const my_principalAmount = await this.my_principalAmount;        
        const my_remainingPayments = await this.my_remainingPayments;
        const my_totalPayments = await this.my_totalPayments;
        const my_planAmount = await this.my_planAmount;
        const my_interestRate = await this.my_interestRate;
        const my_recurringAmount = await this.my_recurringAmount;
        const my_missingPayments =  await this.my_totalPayments - my_remainingPayments;
        const my_downPaymentAmount = await this.my_estServiceAmount - this.my_planAmount;       
        const my_lateFeesCount = await this.my_lateFeesCount;
        const my_lateFees = await this.my_lateFees;


        // console.log(`sidaaaaaaaaaaaaaaaaaaa: ${this.my_recurringAmount}`);

        // console.log(`my_principalAmount: ${my_principalAmount}`);
        // console.log(`my_remainingPayments: ${my_remainingPayments}`);
        // console.log(`my_totalPayments: ${my_totalPayments}`);
        // console.log(`my_planAmount: ${my_planAmount}`);
        // console.log(`my_interestRate: ${my_interestRate}`);
        // console.log(`my_recurringAmount: ${my_recurringAmount}`);
        // console.log(`my_missingPayments: ${my_missingPayments}`);
        // console.log(`my_downPaymentAmount: ${my_downPaymentAmount}`);
        // console.log(`my_lateFeesCount: ${my_lateFeesCount}`);
        // console.log(`my_lateFees: ${my_lateFees}`);




        let my_payoffAmount;
        if (my_missingPayments > 0) {
            /////overdue case
            my_payoffAmount = (my_principalAmount * (my_remainingPayments - my_missingPayments)) + (my_missingPayments * my_recurringAmount) + (my_lateFeesCount * my_lateFees);
        } else {
            /////actiive case
            my_payoffAmount = my_principalAmount * my_remainingPayments;
        }
        
        // Round payoff amount
        my_payoffAmount = parseFloat(my_payoffAmount.toFixed(2));
        
        let my_totalBalanceRemaining = (my_recurringAmount * my_remainingPayments) + (my_lateFeesCount * my_lateFees);
        my_totalBalanceRemaining = parseFloat(my_totalBalanceRemaining.toFixed(2));

        await this.saveContractSummaryToExcel(
             contractId,
             'After First Recurring',
             {
                 my_principalAmount,
                 my_interestRate,
                 my_recurringAmount,
                 my_remainingPayments,
                 my_payoffAmount,
                 my_planAmount,
                 my_totalPayments,
                 my_missingPayments,
                 my_downPaymentAmount,
                 my_totalBalanceRemaining,
                 my_lateFees,
                 my_lateFeesCount
    
             }
        );


        // set dubara global varable *****************************************************
        this.my_totalBalanceRemaining = my_totalBalanceRemaining;
        this.my_payoffAmount = my_payoffAmount;
        this.my_planAmount = my_planAmount;
        // this.my_nextPaymentDate = nextPaymentDate;
        this.my_totalPayments = my_totalPayments;
        this.my_remainingPayments = my_remainingPayments;
        this.my_missingPayments = my_missingPayments;
        this.my_lateFeesCount = my_lateFeesCount;
        this.my_lateFees = my_lateFees;
        this.my_principalAmount = my_principalAmount;
        this.my_recurringAmount = my_recurringAmount;
        this.my_downPaymentAmount = my_downPaymentAmount;
        this.my_interestRate = my_interestRate;
        //this.my_donatedAmount = donatedAmount;


    }











    async handleRecurringPayment(rowText: string, amount: number) {
        const paymentNumber = this.my_totalPayments - this.my_remainingPayments + 1;
        console.log(`>>> Specialized Handler: handleRecurringPayment ($${amount}) - Payment #${paymentNumber}`);
        expect.soft(amount).toBeGreaterThan(0);

        const contractId = await this.contractIdHeading.innerText().then(t => t.replace(/Contract ID:\s?/i, '').trim());

        const my_principalAmount = this.my_principalAmount;        
        const my_remainingPayments = this.my_remainingPayments;
        const my_totalPayments = this.my_totalPayments;
        const my_planAmount = this.my_planAmount;
        const my_interestRate = this.my_interestRate;
        const my_recurringAmount = this.my_recurringAmount;
        const my_missingPayments = this.my_totalPayments - my_remainingPayments;
        const my_downPaymentAmount = this.my_estServiceAmount - this.my_planAmount;       
        const my_lateFeesCount = this.my_lateFeesCount;
        const my_lateFees = this.my_lateFees;

        let my_payoffAmount;
        if (my_missingPayments > 0) {
            /////overdue case
            my_payoffAmount = (my_principalAmount * (my_remainingPayments - my_missingPayments)) + (my_missingPayments * my_recurringAmount) + (my_lateFeesCount * my_lateFees);
        } else {
            /////actiive case
            my_payoffAmount = my_principalAmount * my_remainingPayments;
        }
        
        // Round payoff amount
        my_payoffAmount = parseFloat(my_payoffAmount.toFixed(2));
        
        let my_totalBalanceRemaining = (my_recurringAmount * my_remainingPayments) + (my_lateFeesCount * my_lateFees);
        my_totalBalanceRemaining = parseFloat(my_totalBalanceRemaining.toFixed(2));

        await this.saveContractSummaryToExcel(
             contractId,
             'Recurring Payment',
             {
                 my_principalAmount,
                 my_interestRate,
                 my_recurringAmount,
                 my_remainingPayments,
                 my_payoffAmount,
                 my_planAmount,
                 my_totalPayments,
                 my_missingPayments,
                 my_downPaymentAmount,
                 my_totalBalanceRemaining,
                 my_lateFees,
                 my_lateFeesCount
    
             }
        );


        // set dubara global varable *****************************************************
        this.my_totalBalanceRemaining = my_totalBalanceRemaining;
        this.my_payoffAmount = my_payoffAmount;
        this.my_planAmount = my_planAmount;
        // this.my_nextPaymentDate = nextPaymentDate;
        this.my_totalPayments = my_totalPayments;
        this.my_remainingPayments = my_remainingPayments;
        this.my_missingPayments = my_missingPayments;
        this.my_lateFeesCount = my_lateFeesCount;
        this.my_lateFees = my_lateFees;
        this.my_principalAmount = my_principalAmount;
        this.my_recurringAmount = my_recurringAmount;
        this.my_downPaymentAmount = my_downPaymentAmount;
        this.my_interestRate = my_interestRate;
        //this.my_donatedAmount = donatedAmount;


    }

    async handlePartialPayment(rowText: string, amount: number) {
        console.log(`>>> Specialized Handler: handlePartialPayment ($${amount})`);
        expect.soft(amount).toBeGreaterThan(0);
    }

    async handlePayMore(rowText: string, amount: number) {
        console.log(`>>> Specialized Handler: handlePayMore ($${amount})`);
        expect.soft(amount).toBeGreaterThan(0);
    }













    async handlePayoff(rowText: string, amount: number) {
        console.log(`>>> Specialized Handler: handlePayoff ($${amount})`);
        expect.soft(amount).toBeGreaterThan(0);


        const contractId = await this.contractIdHeading.innerText().then(t => t.replace(/Contract ID:\s?/i, '').trim());

        const my_principalAmount = await this.my_principalAmount;        
        const my_remainingPayments = 0;
        const my_totalPayments = await this.my_totalPayments;
        const my_planAmount = await this.my_planAmount;
        const my_interestRate = await this.my_interestRate;
        const my_recurringAmount = await this.my_recurringAmount;
        const my_missingPayments =  0;
        const my_downPaymentAmount = await this.my_estServiceAmount - this.my_planAmount;       
        const my_lateFeesCount = 0;
        const my_lateFees = 0;




        let my_payoffAmount;
        if (my_missingPayments > 0) {
            /////overdue case
            my_payoffAmount = (my_principalAmount * (my_remainingPayments - my_missingPayments)) + (my_missingPayments * my_recurringAmount) + (my_lateFeesCount * my_lateFees);
        } else {
            /////actiive case
            my_payoffAmount = my_principalAmount * my_remainingPayments;
        }
        
        // Round payoff amount
        my_payoffAmount = parseFloat(my_payoffAmount.toFixed(2));
        
        let my_totalBalanceRemaining = 0;
        my_totalBalanceRemaining = parseFloat(my_totalBalanceRemaining.toFixed(2));

        await this.saveContractSummaryToExcel(
             contractId,
             'After First Recurring',
             {
                 my_principalAmount,
                 my_interestRate,
                 my_recurringAmount,
                 my_remainingPayments,
                 my_payoffAmount,
                 my_planAmount,
                 my_totalPayments,
                 my_missingPayments,
                 my_downPaymentAmount,
                 my_totalBalanceRemaining,
                 my_lateFees,
                 my_lateFeesCount
    
             }
        );


        // set dubara global varable *****************************************************
        this.my_totalBalanceRemaining = my_totalBalanceRemaining;
        this.my_payoffAmount = my_payoffAmount;
        this.my_planAmount = my_planAmount;
        // this.my_nextPaymentDate = nextPaymentDate;
        this.my_totalPayments = my_totalPayments;
        this.my_remainingPayments = my_remainingPayments;
        this.my_missingPayments = my_missingPayments;
        this.my_lateFeesCount = my_lateFeesCount;
        this.my_lateFees = my_lateFees;
        this.my_principalAmount = my_principalAmount;
        this.my_recurringAmount = my_recurringAmount;
        this.my_downPaymentAmount = my_downPaymentAmount;
        this.my_interestRate = my_interestRate;
        //this.my_donatedAmount = donatedAmount;



    }

    async handleContributionLink(rowText: string, amount: number) {
        console.log(`>>> Specialized Handler: handleContributionLink ($${amount})`);
        expect.soft(amount).toBeGreaterThan(0);
    }

    private async appendTransactionsToExcel(contractId: string, transactions: any[]) {
        const fs = require('fs');
        const path = require('path');
        const xlsx = require('node-xlsx');

        const dirPath = path.join(process.cwd(), 'test-contract-data');
        const filePath = path.join(dirPath, `${contractId}.xlsx`);

        let existingData: any[][] = [];
        
        if (fs.existsSync(filePath)) {
            const sheets = xlsx.parse(fs.readFileSync(filePath));
            if (sheets.length > 0) {
                existingData = sheets[0].data; 
            }
        } else {
             // Create summary headers if file doesn't exist
             existingData = [[ 'Type', 'Contract ID', '... (Summary Data Missing)' ]];
        }

        // Check for existing Transaction History and remove it
        const transHistoryIndex = existingData.findIndex(row => row && row[0] === 'Transaction History');
        if (transHistoryIndex !== -1) {
            // Remove everything starting from Transaction History
            // Also try to remove the empty row before it if it exists
            let cutIndex = transHistoryIndex;
            if (cutIndex > 0 && (existingData[cutIndex-1].length === 0 || !existingData[cutIndex-1][0])) {
                cutIndex--;
            }
            existingData = existingData.slice(0, cutIndex);
        }

        // Add Gap
        existingData.push([]);
        existingData.push(['Transaction History']);
        existingData.push(['Date', 'Amount', 'Description', 'Full Text']);

        // Add Transactions
        transactions.forEach(t => {
            existingData.push([t.date, t.amount, t.description, t.fullText]);
        });

        const buffer = xlsx.build([{ name: 'Contract Data', data: existingData }]);
        fs.writeFileSync(filePath, buffer);
        console.log(`Updated Excel with Transactions: ${filePath}`);
    }
}
