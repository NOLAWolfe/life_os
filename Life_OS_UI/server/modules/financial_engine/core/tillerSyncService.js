import transactionRepository from '../data/transactionRepository.js';
import accountRepository from '../data/accountRepository.js';
import debtRepository from '../data/debtRepository.js'; // Ensure this exists or use prisma directly

/**
 * Tiller Sync Service
 * The Bridge between Google Sheets and our Prisma Database.
 */
const tillerSyncService = {
    // --- Utilities ---
    cleanMoney: (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.toString().replace(/[$,]/g, ''));
    },

    /**
     * Standard Tiller Columns for Transactions:
     * Date, Description, Category, Amount, Account, Account #, Institution, Transaction ID
     */
    mapTillerRowToTransaction: (row, accountId) => {
        return {
            id: row['Transaction ID'] || `ext-${Date.now()}-${Math.random()}`,
            date: new Date(row['Date']),
            description: row['Description'],
            amount: tillerSyncService.cleanMoney(row['Amount']),
            category: row['Category'] || 'Uncategorized',
            type: tillerSyncService.cleanMoney(row['Amount']) < 0 ? 'debit' : 'credit',
            accountId: accountId,
            isLateral: row['Category']?.toLowerCase().includes('transfer') || 
                       row['Description']?.toLowerCase().includes('zelle') || false
        };
    },

    /**
     * Standard Tiller Columns for Balance History:
     * Date, Account, Institution, Balance, Account ID
     */
    syncBalances: async (balanceRows) => {
        console.log(`📊 Syncing balances for ${balanceRows.length} accounts...`);
        for (const row of balanceRows) {
            try {
                await accountRepository.save({
                    id: row['Account ID'] || row['Account'],
                    name: row['Account'],
                    institution: row['Institution'],
                    balance: tillerSyncService.cleanMoney(row['Balance']) || 0,
                    type: row['Type'] ? row['Type'].toLowerCase() : 'unknown',
                    class: row['Class'] ? row['Class'].toLowerCase() : 'unknown'
                });
            } catch (err) {
                console.error(`❌ Failed to sync balance for ${row['Account']}:`, err.message);
            }
        }
    },

    syncTransactions: async (transactionRows) => {
        console.log(`🚀 Syncing ${transactionRows.length} transactions...`);
        let syncedCount = 0;

        for (const row of transactionRows) {
            try {
                // Ensure account exists (Tiller usually provides Account ID or Name)
                const accountId = row['Account ID'] || row['Account'];
                
                // We don't overwrite balance here, just ensure the record exists
                await accountRepository.save({
                    id: accountId,
                    name: row['Account'] || 'Unknown Account',
                    institution: row['Institution'] || 'Unknown'
                });

                const txData = tillerSyncService.mapTillerRowToTransaction(row, accountId);
                await transactionRepository.save(txData);
                syncedCount++;
            } catch (err) {
                console.error(`❌ Failed to sync txn: ${row['Description']}`, err.message);
            }
        }

        return { totalProcessed: transactionRows.length, successfullySynced: syncedCount };
    },

    /**
     * Parses raw rows from the "Debt Payoff Planner" sheet.
     * Expected Array Format (derived from analysis):
     * [Check, AccountName, Spacer, Rate, MinPmt, Rank, StartBal, CurrBal, ...]
     * Indices: 1=Name, 3=Rate, 4=MinPmt, 7=CurrBal
     */
    syncDebtPlanner: async (debtRows) => {
        console.log(`🛡️ Syncing ${debtRows.length} debt items...`);
        let syncedCount = 0;

        for (const row of debtRows) {
            try {
                // Skip empty or header rows
                if (!row[1] || row[1] === 'Account') continue;

                const name = row[1];
                const rate = parseFloat(row[3]);
                const minPayment = parseFloat(row[4]);
                const balance = parseFloat(row[7]);

                // Basic validation
                if (!name || isNaN(rate) || isNaN(minPayment)) continue;

                // Create or Update DebtItem
                // We'll use name as a fuzzy ID since we don't have Account ID in this view
                // Ideally, we'd link to FinancialAccount later.
                await debtRepository.save({
                    name: name,
                    interestRate: rate,
                    minPayment: minPayment,
                    balance: balance,
                    category: 'credit_card', // Default, logic can improve
                    priority: parseInt(row[5]) || 0
                });
                syncedCount++;
            } catch (err) {
                console.error(`❌ Failed to sync debt item: ${row[1]}`, err.message);
            }
        }
        return { totalProcessed: debtRows.length, successfullySynced: syncedCount };
    }
};

export default tillerSyncService;