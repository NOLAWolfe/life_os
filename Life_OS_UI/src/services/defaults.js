export const initialNodes = [
    // Tier 0: Income Placeholder
    {
        id: 'income',
        data: { label: '💰 Income (Paycheck)' },
        position: { x: 250, y: 0 },
        className: 'node-hub',
    },

    // Tier 3: Common Generic Bills (Suggestions for User)
    {
        id: 'mortgage',
        type: 'bill',
        data: { label: 'Mortgage/Rent' },
        position: { x: -50, y: 450 },
    },
    { id: 'auto-loan', type: 'bill', data: { label: 'Auto Loan' }, position: { x: 150, y: 450 } },
    { id: 'savings', type: 'bill', data: { label: 'Savings Goal' }, position: { x: 250, y: 450 } },
    {
        id: 'utilities',
        type: 'bill',
        data: { label: 'Utilities (Gas/Electric/Internet)' },
        position: { x: 350, y: 450 },
    },
    { id: 'subs', type: 'bill', data: { label: 'Subscriptions' }, position: { x: 450, y: 450 } },
];

export const initialEdges = [
    // No edges by default. We wait for real accounts to link to these.
];