import prisma from '../../../shared/db.js';

/**
 * The Librarian: Handles all database interactions for Financial Accounts.
 */
const accountRepository = {
    /**
     * Find an account by its unique ID (or Tiller ID).
     */
    findById: async (id) => {
        return await prisma.financialAccount.findUnique({
            where: { id },
        });
    },

    /**
     * Get all accounts, optionally filtering by type.
     */
    findAll: async () => {
        return await prisma.financialAccount.findMany({
            orderBy: { lastUpdated: 'desc' },
        });
    },

    /**
     * Upsert (Update if exists, Create if new) an account.
     * This is crucial for Tiller imports where we might re-import the same account.
     */
    save: async (accountData) => {
        return await prisma.financialAccount.upsert({
            where: { id: accountData.id },
            update: {
                balance: accountData.balance,
                lastUpdated: new Date(),
            },
            create: {
                id: accountData.id,
                name: accountData.name,
                institution: accountData.institution,
                type: accountData.type,
                balance: accountData.balance,
            },
        });
    },
};

export default accountRepository;
