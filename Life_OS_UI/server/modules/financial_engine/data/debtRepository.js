import prisma from '../../../shared/db.js';

const debtRepository = {
    save: async (debtItem) => {
        // We use 'name' as a unique identifier for upsert since we don't have a stable ID from the spreadsheet view
        // Ideally, we should match by closest Account ID, but name is safer for now.
        return await prisma.debtItem.upsert({
            where: { id: `debt-${debtItem.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}` },
            update: {
                balance: debtItem.balance,
                interestRate: debtItem.interestRate,
                minPayment: debtItem.minPayment,
                priority: debtItem.priority,
                category: debtItem.category
            },
            create: {
                id: `debt-${debtItem.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
                name: debtItem.name,
                balance: debtItem.balance,
                interestRate: debtItem.interestRate,
                minPayment: debtItem.minPayment,
                priority: debtItem.priority,
                category: debtItem.category
            }
        });
    },

    getAll: async () => {
        return await prisma.debtItem.findMany();
    }
};

export default debtRepository;
