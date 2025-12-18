import Papa from 'papaparse';

/**
 * Fetches and parses the Tiller CSV data from the Google Sheet export.
 */
export const getTillerData = async (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            download: false, // Changed to false as we're now passing a File object
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                console.error("Error parsing Tiller CSV:", error);
                reject(error);
            }
        });
    });
};

/**
 * Processes the raw Tiller data into a more usable format.
 * - Extracts unique accounts and their balances.
 * - Returns a list of transactions with more detail.
 */
export const processTillerData = (data) => {
    const accountsMap = new Map();
    const transactions = [];

    for (const row of data) {
        // Skip rows that don't have essential data
        if (!row.Date || !row.Amount || !row.Account || !row.Description) {
            continue;
        }

        const rawAmount = row.Amount.replace(/[^0-9.-]+/g, ""); // Clean amount string
        const amount = parseFloat(rawAmount);

        if (isNaN(amount)) {
            console.warn("Skipping row due to invalid amount:", row);
            continue;
        }

        // Process Accounts
        const accountName = row.Account;
        if (!accountsMap.has(accountName)) {
            accountsMap.set(accountName, {
                account_id: row['Account ID'] || row['Account #'] || accountName, // Use Account ID if available
                name: accountName,
                institution: row.Institution || 'N/A', // Add institution
                balances: { current: 0 },
                subtype: 'checking', // Default subtype, can be enhanced
            });
        }
        accountsMap.get(accountName).balances.current += amount;

        // Process Transactions
        transactions.push({
            transaction_id: row['Transaction ID'] || `tiller_${row.Date}_${row.Amount}_${row.Description}`, // Use Tiller's ID if available
            date: row.Date,
            name: row['Full Description'] || row.Description, // Use full description if available
            amount: Math.abs(amount),
            category: row.Category ? [row.Category] : ['Uncategorized'],
            tags: [], // Tags not directly in this CSV, keep empty for now
            note: row.Note || '', // Assuming 'Note' might be available or empty
            type: amount < 0 ? 'debit' : 'credit',
            accountName: accountName,
            institution: row.Institution || 'N/A',
        });
    }

    return {
        accounts: Array.from(accountsMap.values()),
        transactions: transactions.sort((a, b) => new Date(b.date) - new Date(a.date)), // Sort by most recent
    };
};

/**
 * Fetches and parses a Tiller CSV from a URL (e.g., in the public folder).
 * Supports optional header disabling for complex templates.
 */
export const fetchAndParseCsv = async (url, hasHeader = true) => {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: hasHeader,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                console.error(`Error fetching/parsing CSV from ${url}:`, error);
                reject(error);
            }
        });
    });
};

/**
 * Processes the raw Tiller Debt Payoff data.
 * This template is complex, so we look for the specific table starting with "Account" header.
 */
export const processDebtData = (data) => {
    const debtAccounts = [];
    let isDebtTable = false;

    for (const row of data) {
        // Data is now an array because we'll parse without headers
        const values = Array.isArray(row) ? row : Object.values(row);
        
        // Find the start of the debt table
        // We look for the row that has "Account" in column 1 and "Interest Rate" in column 3
        if (values[1] === "Account" && (values[3] === "Interest Rate" || values[4] === "Min Monthly Payment")) {
            isDebtTable = true;
            continue;
        }

        if (isDebtTable) {
            // If the first column (TRUE/FALSE) and second column (Account) are empty, we've reached the end
            if ((!values[0] || values[0] === "") && (!values[1] || values[1] === "")) {
                if (debtAccounts.length > 0) break; // End of table
                continue;
            }

            const accountName = values[1];
            if (accountName === "Account" || !accountName) continue;

            // Helper to clean currency/percentage strings
            const cleanNum = (val) => {
                if (val === undefined || val === null || val === "") return 0;
                // If it's already a number, return it
                if (typeof val === 'number') return val;
                // Clean string and parse
                const cleaned = String(val).replace(/[^0-9.-]+/g, "");
                return cleaned === "" ? 0 : parseFloat(cleaned);
            };

            // Mapping based on the observed CSV structure for the primary debt table (columns 0-12)
            debtAccounts.push({
                active: String(values[0]).toUpperCase() === "TRUE" || values[0] === "✅",
                name: accountName,
                interestRate: cleanNum(values[3]),
                minPayment: cleanNum(values[4]),
                rank: cleanNum(values[5]),
                startingBalance: cleanNum(values[6]),
                currentBalance: cleanNum(values[7]),
                monthlyInterest: cleanNum(values[9]),
                payoffMonth: values[10],
                totalInterest: cleanNum(values[11]),
                recommendedPayment: cleanNum(values[12])
            });
        }
    }

    return debtAccounts;
};

/**
 * Processes the raw Tiller Accounts data.
 */
export const processAccountsData = (data) => {
    return data.map(row => {
        // Clean amount string
        const cleanNum = (val) => {
            if (!val) return 0;
            // Handle if it's already a number or a string
            const strVal = String(val);
            return parseFloat(strVal.replace(/[^0-9.-]+/g, ""));
        };

        const accountId = row['Account Id'] || row['Account ID'] || row['Account #'];
        const name = row.Account || row['Account Name'];

        return {
            account_id: accountId,
            name: name,
            institution: row.Institution || 'N/A',
            type: row.Type || 'Unknown',
            balances: { 
                current: cleanNum(row['Last Balance'] || row['Balance']) 
            },
            lastUpdate: row['Last Update'] || 'Unknown',
            group: row.Group || 'Other',
            class: row.Class || 'N/A'
        };
    }).filter(acc => acc.name && acc.account_id);
};

const tillerService = {
    getTillerData,
    processTillerData,
    processDebtData,
    processAccountsData,
    fetchAndParseCsv
};

export default tillerService;
