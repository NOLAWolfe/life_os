import { z } from 'zod';

export const TransactionSchema = z.object({
    id: z.string(),
    date: z.string().or(z.date()),
    name: z.string(),
    amount: z.number(),
    type: z.enum(['debit', 'credit']),
    category: z.string().optional(),
    accountName: z.string(),
    isLateral: z.boolean().default(false),
});

export const AccountSchema = z.object({
    account_id: z.string(),
    name: z.string(),
    type: z.string().optional(),
    group: z.string().optional(),
    class: z.string().optional(),
    balances: z.object({
        current: z.number(),
        available: z.number().optional(),
    }),
});

export const DebtSchema = z.object({
    name: z.string(),
    currentBalance: z.number(),
    interestRate: z.number(),
    minPayment: z.number(),
    payoffMonth: z.string().optional(),
    active: z.boolean().default(true),
});
