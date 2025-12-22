import transactionRepository from '../data/transactionRepository.js';
import accountRepository from '../data/accountRepository.js';

/**
 * The Manager: Handles business logic for Transactions.
 */
const transactionService = {
    /**
     * Get recent transactions for the dashboard.
     */
    getDashboardTransactions: async () => {
        return await transactionRepository.findAll();
    },

    /**
     * Core Logic: Determines if a transaction is a "Side Hustle".
     * This logic is provider-agnostic (works for Tiller or Plaid).
     */
    detectSideHustle: (name, accountName, institution) => {
        const desc = (name || '').toLowerCase();
        const acc = (accountName || '').toLowerCase();
        const inst = (institution || '').toLowerCase();
        
        // Logic: Navy Federal + Cash App/Venmo = Likely DJ Income
        if (inst.includes('navy federal') || acc.includes('navy federal')) {
            if (desc.includes('cash app') || desc.includes('venmo')) {
                return true;
            }
        }
        return false;
    },

    /**
     * Core Logic: Determines if a transaction is "Lateral Movement".
     */
    detectLateralMovement: (name, category) => {
        const desc = (name || '').toLowerCase();
        const cat = (category || '').toLowerCase();
        const userName = (process.env.VITE_USER_NAME || '').toLowerCase(); 
        const userNameAlt = (process.env.VITE_USER_NAME_ALT || '').toLowerCase();

        // 1. Explicit Category
        if (cat.includes('transfer') || cat.includes('credit card payment') || cat.includes('payment')) return true;

        // 2. Self-Transfer keywords
        if (userName && desc.includes(userName)) return true;
        if (userNameAlt && desc.includes(userNameAlt)) return true;
        
        const lateralKeywords = ['online transfer', 'transfer from', 'transfer to', 'internal transfer', 'zelle transfer', 'venmo transfer'];
        if (lateralKeywords.some(kw => desc.includes(kw))) return true;

        return false;
    },

    /**
     * Adapter: Imports Tiller CSV Data.
     */
    importTillerTransactions: async (rawTransactions) => {
        const results = { success: 0, failed: 0 };

        for (const raw of rawTransactions) {
            try {
                // 1. Normalize Data (Map CSV columns to Schema)
                const dateVal = raw['Date'];
                const amountVal = raw['Amount'];
                const descVal = raw['Description'] || raw['Full Description'];
                const accountName = raw['Account'];
                
                if (!dateVal || !amountVal || !descVal) continue;

                // Improved amount cleaning to handle (100.00) as -100.00
                let strVal = String(amountVal).trim();
                const isNegative = strVal.includes('(') || strVal.includes('-');
                const cleaned = strVal.replace(/[^0-9.]/g, "");
                let amount = cleaned === "" ? 0 : parseFloat(cleaned);
                if (isNegative) amount = -amount;

                if (isNaN(amount)) continue;

                // Generate ID if Tiller didn't provide one
                const id = raw['Transaction ID'] || `tiller_${dateVal}_${amount}_${descVal.replace(/\s+/g, '')}`;

                // 2. Run Business Logic
                const category = raw['Category'] || 'Uncategorized';
                const isSideHustle = transactionService.detectSideHustle(descVal, accountName, raw['Institution']);
                const isLateral = transactionService.detectLateralMovement(descVal, category);

                // 3. Resolve Account Relation (Optional but good)
                // We try to find the account ID to link foreign key
                // For Tiller, we might need to lookup by name if ID isn't in this row
                
                const transactionData = {
                    id: id,
                    date: dateVal,
                    description: descVal,
                    amount: Math.abs(amount), // Store absolute value
                    type: amount < 0 ? 'debit' : 'credit',
                    category: category,
                    isLateral: isLateral,
                    isSideHustle: isSideHustle,
                    // accountId: ... (We can implement lookup later)
                };

                // 4. Save (Upsert)
                await transactionRepository.save(transactionData);
                results.success++;
            } catch (error) {
                console.error("Failed to save transaction:", error);
                results.failed++;
            }
        }
        return results;
    }
};

export default transactionService;
