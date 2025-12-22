import prisma from '../../../shared/db.js';

/**
 * The Librarian: Handles all database interactions for Transactions.
 */
const transactionRepository = {
    /**
     * Finds all transactions, sorted by date.
     */
    findAll: async (filters = {}) => {
        return await prisma.transaction.findMany({
            where: filters,
            orderBy: { date: 'desc' },
            include: { account: true }
        });
    },

    /**
     * Upsert a transaction. 
     * This is the "Magic Function" for live data.
     * If Plaid sends an update for an existing ID, we update it.
     * If it's new, we create it.
     */
    save: async (data) => {
        return await prisma.transaction.upsert({
            where: { id: data.id },
            update: {
                description: data.description,
                amount: data.amount,
                category: data.category,
                isLateral: data.isLateral,
                isSideHustle: data.isSideHustle
            },
            create: {
                id: data.id,
                date: new Date(data.date),
                description: data.description,
                amount: data.amount,
                type: data.type,
                category: data.category,
                isLateral: data.isLateral,
                isSideHustle: data.isSideHustle,
                accountId: data.accountId
            }
        });
    }
};

export default transactionRepository;
