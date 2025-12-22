import accountRepository from '../data/accountRepository.js';

/**
 * The Manager: Handles business logic for Financial Accounts.
 */
const accountService = {
    /**
     * Retrieves all accounts for the dashboard.
     */
    getDashboardAccounts: async () => {
        return await accountRepository.findAll();
    },

    /**
     * Processes a list of raw Tiller account objects and saves them.
     * @param {Array} rawAccounts - The parsed rows from the CSV
     */
    importTillerAccounts: async (rawAccounts) => {
        const results = { success: 0, failed: 0 };

        for (const raw of rawAccounts) {
            try {
                // Sanitize and Map
                // Logic pulled from old tillerService.js
                const cleanBalance = (val) => {
                    if (val === undefined || val === null || val === "") return 0;
                    let strVal = String(val).trim();
                    const isNegative = strVal.includes('(') || strVal.includes('-');
                    const cleaned = strVal.replace(/[^0-9.]/g, "");
                    const num = cleaned === "" ? 0 : parseFloat(cleaned);
                    return isNegative ? -num : num;
                };

                const name = raw['Account'] || raw['Name'] || 'Unnamed Account';
                const institution = raw['Institution'] || 'N/A';
                
                // Robust ID generation matching frontend tillerService.js
                let accountId = raw['Account Id'] || raw['Account ID'] || raw['Account #'];
                if (!accountId) {
                    const slug = (name + institution).toLowerCase().replace(/[^a-z0-9]/g, '');
                    accountId = `gen_id_${slug}`;
                }

                const accountData = {
                    id: accountId,
                    name: name,
                    institution: institution,
                    type: (raw['Type'] || 'Other').toLowerCase(),
                    balance: cleanBalance(raw['Last Balance'] || raw['Balance'])
                };

                await accountRepository.save(accountData);
                results.success++;
            } catch (error) {
                console.error("Failed to save account:", error);
                results.failed++;
            }
        }
        return results;
    }
};

export default accountService;
