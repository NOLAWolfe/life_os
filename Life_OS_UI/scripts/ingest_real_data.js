
const API_URL = 'http://localhost:4001/api/finance/txns/sync';

const data = {
    transactions: [
        // --- DECEMBER 2025 ---
        { "Date": "12/16/2025", "Description": "Interest Charge:purchases", "Category": "Interest", "Amount": -107.11, "Account": "QuicksilverOne", "Institution": "Capital One", "Transaction ID": "694342f290616ccb77fa39c0", "Account ID": "694342f2b1c45759f665b765" },
        { "Date": "12/16/2025", "Description": "Holiday Stationstore 52", "Category": "Transportation", "Amount": -28.24, "Account": "HSC", "Institution": "Chase", "Transaction ID": "6943426290616ccb77fa0db8", "Account ID": "69434249b1c45759f665b28d" },
        { "Date": "12/15/2025", "Description": "Huntington Payroll", "Category": "Paycheck", "Amount": 2787.50, "Account": "HSC", "Institution": "Chase", "Transaction ID": "6943426290616ccb77fa0dbc", "Account ID": "69434249b1c45759f665b28d" },
        { "Date": "12/16/2025", "Description": "Zelle Deposit", "Category": "Transfer", "Amount": 1050.00, "Account": "EveryDay Checking", "Institution": "Navy Federal", "Transaction ID": "694342b290616ccb77fa238c", "Account ID": "694342aab1c45759f665b650" },
        { "Date": "12/12/2025", "Description": "Capital One Autopay", "Category": "Loan Repayment", "Amount": 25.00, "Account": "Platinum", "Institution": "Capital One", "Transaction ID": "694342f290616ccb77fa39e6", "Account ID": "694342f1b1c45759f665b750" },
        
        // --- NOVEMBER 2025 ---
        { "Date": "11/28/2025", "Description": "Huntington Payroll", "Category": "Paycheck", "Amount": 2787.50, "Account": "HSC", "Institution": "Chase", "Transaction ID": "6943426290616ccb77fa0dec", "Account ID": "69434249b1c45759f665b28d" },
        { "Date": "11/28/2025", "Description": "Zelle Deposit", "Category": "Transfer", "Amount": 1050.00, "Account": "EveryDay Checking", "Institution": "Navy Federal", "Transaction ID": "694342b290616ccb77fa2397", "Account ID": "694342aab1c45759f665b650" },
        { "Date": "11/14/2025", "Description": "Huntington Payroll", "Category": "Paycheck", "Amount": 2787.50, "Account": "HSC", "Institution": "Chase", "Transaction ID": "6943426290616ccb77fa0e16", "Account ID": "69434249b1c45759f665b28d" },
        { "Date": "11/17/2025", "Description": "Zelle Deposit", "Category": "Transfer", "Amount": 1050.00, "Account": "EveryDay Checking", "Institution": "Navy Federal", "Transaction ID": "694342b290616ccb77fa23a1", "Account ID": "694342aab1c45759f665b650" },
        
        // --- OCTOBER 2025 ---
        { "Date": "10/31/2025", "Description": "Huntington Payroll", "Category": "Paycheck", "Amount": 2787.49, "Account": "HSC", "Institution": "Chase", "Transaction ID": "6943426290616ccb77fa0e4d", "Account ID": "69434249b1c45759f665b28d" },
        { "Date": "10/16/2025", "Description": "Zelle Deposit", "Category": "Transfer", "Amount": 1050.00, "Account": "EveryDay Checking", "Institution": "Navy Federal", "Transaction ID": "694347555a0f8519cf01f615", "Account ID": "694342aab1c45759f665b650" },
        { "Date": "10/15/2025", "Description": "Huntington Payroll", "Category": "Paycheck", "Amount": 2787.50, "Account": "HSC", "Institution": "Chase", "Transaction ID": "694347555a0f8519cf01f64c", "Account ID": "69434249b1c45759f665b28d" },
        { "Date": "10/01/2025", "Description": "Zelle Deposit", "Category": "Transfer", "Amount": 1050.00, "Account": "EveryDay Checking", "Institution": "Navy Federal", "Transaction ID": "694347555a0f8519cf01f61f", "Account ID": "694342aab1c45759f665b650" },

        // --- SEPTEMBER 2025 ---
        { "Date": "09/30/2025", "Description": "Huntington Payroll", "Category": "Paycheck", "Amount": 2787.50, "Account": "HSC", "Institution": "Chase", "Transaction ID": "694347555a0f8519cf01f67b", "Account ID": "69434249b1c45759f665b28d" }
    ],
    balances: [
        { "Account": "EveryDay Checking", "Institution": "Navy Federal", "Balance": 1040.64, "Account ID": "694342aab1c45759f665b650", "Type": "Checking", "Class": "Asset" },
        { "Account": "HSC", "Institution": "Chase", "Balance": 764.42, "Account ID": "69434249b1c45759f665b28d", "Type": "Checking", "Class": "Asset" },
        { "Account": "Used Vehicle Loan", "Institution": "Navy Federal", "Balance": 23164.57, "Account ID": "694342aab1c45759f665b626", "Type": "Loan", "Class": "Liability" },
        { "Account": "QuicksilverOne", "Institution": "Capital One", "Balance": 4310.42, "Account ID": "694342f2b1c45759f665b765", "Type": "Credit", "Class": "Liability" }
    ],
    debts: [
        [true, "QuicksilverOne", null, 0.292, 206, 1, 4310, 4310.42],
        [true, "Used Vehicle Loan", null, 0.087, 756, 5, 23165, 23164.57],
        [true, "Visa Platinum", null, 0.18, 183, 2, 7398, 7397.56]
    ]
};

async function run() {
    console.log('📡 Pushing Deep History to Vantage OS...');
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        console.log('✅ Sync Complete:', result);
    } catch (e) {
        console.error('❌ Sync Failed:', e);
    }
}

run();
