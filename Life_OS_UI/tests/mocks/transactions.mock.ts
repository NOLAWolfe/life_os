// tests/mocks/transactions.mock.ts
export const MOCK_ORPHAN_TRANSACTIONS = [
    {
        id: 'txn-1',
        date: new Date().toISOString(),
        description: 'STARBUCKS #1234',
        amount: -5.75,
        type: 'debit',
        category: 'Uncategorized',
        accountId: 'acc-checking',
        isLateral: false,
        isSideHustle: false,
    },
    {
        id: 'txn-2',
        date: new Date().toISOString(),
        description: 'UNKNOWN VENDOR #555',
        amount: -25.00,
        type: 'debit',
        category: 'Uncategorized',
        accountId: 'acc-credit',
        isLateral: false,
        isSideHustle: false,
    }
];
