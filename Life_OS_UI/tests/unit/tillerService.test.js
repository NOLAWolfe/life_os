import { describe, it, expect } from 'vitest';
import { processIncomeData } from '../../src/services/tillerService';

describe('tillerService - Income Processor', () => {
    
    it('should filter out lateral transfers from income', () => {
        const transactions = [
            { name: 'Salary', amount: 5000, type: 'credit', category: 'Income', isLateral: false },
            { name: 'Transfer from Savings', amount: 1000, type: 'credit', category: 'Transfer', isLateral: true },
            { name: 'Rent', amount: 2000, type: 'debit', category: 'Housing', isLateral: false }
        ];

        const result = processIncomeData(transactions);

        // Should only have 1 stream (Salary)
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Income');
        expect(result[0].total).toBe(5000);
    });

    it('should accurately average income over multiple months', () => {
        const today = new Date();
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(today.getDate() - 60);

        const transactions = [
            { date: today.toISOString(), amount: 3000, type: 'credit', category: 'Income', isLateral: false },
            { date: sixtyDaysAgo.toISOString(), amount: 3000, type: 'credit', category: 'Income', isLateral: false }
        ];

        const result = processIncomeData(transactions);
        
        // 60 days is approx 1.97 months. 6000 / 1.97 = ~3045
        // Since we anchor to 'today', the result depends on exactly when it runs, 
        // but it should be significantly less than 6000.
        expect(result[0].monthlyAvg).toBeLessThan(3100);
        expect(result[0].monthlyAvg).toBeGreaterThan(2900);
    });

    it('should prioritize Side Hustle classification', () => {
        const transactions = [
            { name: 'Venmo DJ Set', amount: 500, type: 'credit', category: 'Other', isSideHustle: true }
        ];

        const result = processIncomeData(transactions);
        expect(result[0].name).toBe('DJ Business / Side Hustle');
    });
});
