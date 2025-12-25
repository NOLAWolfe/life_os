import { describe, it, expect } from 'vitest';
import debtService from '../../src/services/debtService';
import strategyService from '../../src/services/strategyService';
import { TransactionSchema, AccountSchema } from '../../src/services/schemas';

describe('Schemas', () => {
    it('should validate a correct transaction', () => {
        const validTxn = {
            id: 'txn-1',
            date: '2025-12-23',
            name: 'Test Txn',
            amount: 100,
            type: 'debit',
            accountName: 'Chase 8211',
        };
        const result = TransactionSchema.safeParse(validTxn);
        expect(result.success).toBe(true);
    });

    it('should fail on invalid transaction type', () => {
        const invalidTxn = {
            id: 'txn-1',
            date: '2025-12-23',
            name: 'Test Txn',
            amount: 100,
            type: 'invalid-type', // Must be 'debit' or 'credit'
            accountName: 'Chase 8211',
        };
        const result = TransactionSchema.safeParse(invalidTxn);
        expect(result.success).toBe(false);
    });
});

describe('debtService', () => {
    const mockAccounts = [
        { name: 'Card A', currentBalance: 1000, interestRate: 20, minPayment: 25 },
        { name: 'Card B', currentBalance: 500, interestRate: 10, minPayment: 15 },
    ];

    it('should calculate avalanche correctly (priority: high interest)', () => {
        const result = debtService.calculatePayoff(mockAccounts, 100, 'avalanche');
        expect(result.totalMonths).toBeLessThanOrEqual(13);
        expect(result.status).toBe('HEALTHY');
    });

    it('should calculate snowball correctly (priority: low balance)', () => {
        const result = debtService.calculatePayoff(mockAccounts, 100, 'snowball');
        expect(result.totalMonths).toBeLessThanOrEqual(13);
    });

    it('should detect negative amortization', () => {
        const predatoryDebt = [
            { name: 'Predatory Loan', currentBalance: 10000, interestRate: 30, minPayment: 50 },
        ];
        // 30% of 10,000 is 3,000/yr = 250/mo interest. Min payment 50 is not enough.
        const result = debtService.calculatePayoff(predatoryDebt, 0, 'avalanche');
        expect(result.status).toBe('NEGATIVE_AMORTIZATION');
        expect(result.isInfinite).toBe(true);
    });
});

describe('strategyService', () => {
    const mockTransactions = [
        { name: 'Netflix', amount: 15, accountName: 'Chase 8211', type: 'debit' },
        { name: 'Spotify', amount: 10, accountName: 'Navy Fed', type: 'debit' },
    ];

    const mockRules = {
        'node-netflix': ['netflix'],
        'node-spotify': ['spotify'],
    };

    const mockNodes = [
        { id: 'node-netflix', data: { label: 'Netflix' } },
        { id: 'node-spotify', data: { label: 'Spotify' } },
    ];

    const mockEdges = [
        { source: 'chase-8211', target: 'node-netflix' },
        { source: 'chase-8211', target: 'node-spotify' }, // WRONG: Spotify should be from Navy Fed
    ];

    it('should detect drift when transaction account mismatch mapping', () => {
        const issues = strategyService.detectDrift(
            mockTransactions,
            mockRules,
            mockNodes,
            mockEdges
        );
        // Spotify is in Navy Fed, but Edge says Chase. Chase mapping is ['chase', '8211'].
        // Expected: Drift issue for Spotify
        const spotifyIssue = issues.find((i) => i.nodeId === 'node-spotify');
        expect(spotifyIssue).toBeDefined();
        expect(spotifyIssue.message).toContain('Drift');
    });
});
