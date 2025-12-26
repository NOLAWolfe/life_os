const API_URL = 'http://localhost:4001/api/finance/txns/sync';

const data = {
    transactions: [
        { "Date": "12/16/2025", "Description": "Interest Charge:purchases", "Category": "Interest", "Amount": -107.11, "Account": "QuicksilverOne", "Institution": "Capital One", "Transaction ID": "694342f290616ccb77fa39c0", "Account ID": "694342f2b1c45759f665b765" },
        { "Date": "12/16/2025", "Description": "Holiday Stationstore 52", "Category": "Transportation", "Amount": -28.24, "Account": "HSC", "Institution": "Chase", "Transaction ID": "6943426290616ccb77fa0db8", "Account ID": "69434249b1c45759f665b28d" },
        { "Date": "12/15/2025", "Description": "Huntington Payroll", "Category": "Paycheck", "Amount": 2787.50, "Account": "HSC", "Institution": "Chase", "Transaction ID": "6943426290616ccb77fa0dbc", "Account ID": "69434249b1c45759f665b28d" },
        { "Date": "12/16/2025", "Description": "Zelle Deposit", "Category": "Transfer", "Amount": 1050.00, "Account": "EveryDay Checking", "Institution": "Navy Federal", "Transaction ID": "694342b290616ccb77fa238c", "Account ID": "694342aab1c45759f665b650" }
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
    console.log('📡 Pushing Strategic Data to Vantage OS (Port 4001)...');
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