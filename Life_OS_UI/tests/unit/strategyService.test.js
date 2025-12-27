import { describe, it, expect } from 'vitest';
import strategyService from '../../src/services/strategyService';

describe('strategyService - Hottest Dollar Engine', () => {
    
    it('should correctly calculate a GROWTH surplus', () => {
        const incomeStreams = [
            { name: 'Job', monthlyAvg: 5000 },
            { name: 'Side Hustle', monthlyAvg: 1000 }
        ];
        const totalCommitments = 4000; // Rent, Loans, Bills

        const result = strategyService.calculateHottestDollar(incomeStreams, totalCommitments);

        expect(result.totalIncome).toBe(6000);
        expect(result.surplus).toBe(2000);
        expect(result.amount).toBe(2000);
        expect(result.status).toBe('GROWTH');
        expect(result.isDeficit).toBe(false);
    });

    it('should correctly identify a CRITICAL deficit', () => {
        const incomeStreams = [
            { name: 'Job', monthlyAvg: 3000 }
        ];
        const totalCommitments = 3500; // Spending more than earning

        const result = strategyService.calculateHottestDollar(incomeStreams, totalCommitments);

        expect(result.surplus).toBe(-500);
        expect(result.amount).toBe(0); // Hottest dollar can't be negative for attack
        expect(result.status).toBe('CRITICAL');
        expect(result.isDeficit).toBe(true);
    });

    it('should handle empty data gracefully', () => {
        const result = strategyService.calculateHottestDollar([], 0);
        expect(result.totalIncome).toBe(0);
        expect(result.surplus).toBe(0);
        expect(result.status).toBe('CRITICAL'); // Zero surplus is critical in 10X logic
    });

    it('should flag STABLE status for small positive surplus', () => {
        const result = strategyService.calculateHottestDollar([{ monthlyAvg: 2000 }], 1800);
        expect(result.status).toBe('STABLE');
        expect(result.amount).toBe(200);
    });
});
