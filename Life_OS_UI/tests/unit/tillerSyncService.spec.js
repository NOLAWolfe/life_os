import { describe, it, expect } from 'vitest';
import tillerSyncService from '../../server/modules/financial_engine/core/tillerSyncService';

describe('Tiller Sync Service (Logic Engine)', () => {
    
    // --- SIDE HUSTLE DETECTION ---
    describe('checkIsSideHustle', () => {
        it('should detect DJ Income (Navy Fed + Cash App)', () => {
            const row = {
                'Institution': 'Navy Federal Credit Union',
                'Account': 'Checking',
                'Description': 'Cash App Transfer from John Doe',
                'Category': 'Transfer'
            };
            expect(tillerSyncService.checkIsSideHustle(row)).toBe(true);
        });

        it('should detect DJ Income (Navy Fed + Venmo)', () => {
            const row = {
                'Institution': 'Navy Federal',
                'Account': 'Checking',
                'Description': 'Venmo Cashout',
                'Category': 'Income'
            };
            expect(tillerSyncService.checkIsSideHustle(row)).toBe(true);
        });

        it('should NOT flag normal Cash App usage on other cards', () => {
            const row = {
                'Institution': 'Chase Bank',
                'Account': 'Credit Card',
                'Description': 'Cash App Transfer',
                'Category': 'Transfer'
            };
            expect(tillerSyncService.checkIsSideHustle(row)).toBe(false);
        });
    });

    // --- LATERAL TRANSFER DETECTION ---
    describe('checkIsLateral', () => {
        it('should detect explicit Transfer category', () => {
            const row = {
                'Description': 'Random Transaction',
                'Category': 'Transfer'
            };
            expect(tillerSyncService.checkIsLateral(row)).toBe(true);
        });

        it('should detect Credit Card Payments', () => {
            const row = {
                'Description': 'Payment to Chase Card',
                'Category': 'Credit Card Payment'
            };
            expect(tillerSyncService.checkIsLateral(row)).toBe(true);
        });

        it('should detect Zelle transfers based on description', () => {
            const row = {
                'Description': 'Zelle Transfer to Savings',
                'Category': 'Uncategorized'
            };
            expect(tillerSyncService.checkIsLateral(row)).toBe(true);
        });

        it('should NOT flag legitimate expenses', () => {
            const row = {
                'Description': 'Grocery Store',
                'Category': 'Groceries'
            };
            expect(tillerSyncService.checkIsLateral(row)).toBe(false);
        });
    });

    // --- MAPPING LOGIC ---
    describe('mapTillerRowToTransaction', () => {
        it('should correctly map a raw row to the internal schema', () => {
            const row = {
                'Transaction ID': 'txn_123',
                'Date': '2025-12-23',
                'Description': 'Navy Fed Cash App',
                'Amount': '$1,000.00',
                'Category': 'Income',
                'Institution': 'Navy Federal',
                'Account': 'Checking'
            };
            
            const result = tillerSyncService.mapTillerRowToTransaction(row, 'acc_123');

            expect(result.id).toBe('txn_123');
            expect(result.amount).toBe(1000);
            expect(result.type).toBe('credit'); // Positive amount = credit
            expect(result.isSideHustle).toBe(true); // Should catch the DJ income
        });

        it('should handle negative amounts (debits)', () => {
            const row = {
                'Transaction ID': 'txn_456',
                'Date': '2025-12-23',
                'Description': 'Walmart',
                'Amount': '-$50.00',
                'Category': 'Groceries'
            };
            
            const result = tillerSyncService.mapTillerRowToTransaction(row, 'acc_123');

            expect(result.amount).toBe(-50);
            expect(result.type).toBe('debit');
        });
    });
});
