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

// Helper to find a value using multiple potential keys, handling deduplication suffixes
const findVal = (row, keys) => {
    for (const key of keys) {
        if (row[key] !== undefined && row[key] !== "") return row[key];
        // Check suffixes _1 to _5
        for (let i = 1; i <= 5; i++) {
            const suffixed = `${key}_${i}`;
            if (row[suffixed] !== undefined && row[suffixed] !== "") return row[suffixed];
        }
    }
    return undefined;
};

/**
 * Fetches and parses a Tiller CSV from a URL (e.g., in the public folder).
 * Supports optional header disabling for complex templates.
 */
export const fetchAndParseCsv = async (url, hasHeader = true) => {
    return new Promise((resolve, reject) => {
        const headers = {};
        Papa.parse(url, {
            download: true,
            header: hasHeader,
            skipEmptyLines: true,
            transformHeader: (header) => {
                if (!hasHeader) return header;
                // Deduplicate headers by appending index if needed
                const cleanHeader = header.trim();
                if (headers[cleanHeader]) {
                    headers[cleanHeader]++;
                    return `${cleanHeader}_${headers[cleanHeader]}`;
                }
                headers[cleanHeader] = 1;
                return cleanHeader;
            },
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
 * Processes the raw Tiller data into a more usable format.
 * - Extracts unique accounts and their balances.
 * - Returns a list of transactions with more detail.
 */
export const processTillerData = (data) => {
    const accountsMap = new Map();
    const transactions = [];

    for (const row of data) {
        const date = findVal(row, ['Date']);
        const amountStr = findVal(row, ['Amount']);
        const account = findVal(row, ['Account']);
        const description = findVal(row, ['Description', 'Full Description']);
        
        // Skip rows that don't have essential data
        if (!date || !amountStr || !account || !description) {
            continue;
        }

        const rawAmount = amountStr.replace(/[^0-9.-]+/g, ""); // Clean amount string
        const amount = parseFloat(rawAmount);

        if (isNaN(amount)) {
            console.warn("Skipping row due to invalid amount:", row);
            continue;
        }

        // Process Accounts
        const accountName = account;
        if (!accountsMap.has(accountName)) {
            const accountId = findVal(row, ['Account ID', 'Account #']) || accountName;
            const institution = findVal(row, ['Institution']) || 'N/A';
            
            accountsMap.set(accountName, {
                account_id: accountId,
                name: accountName,
                institution: institution,
                balances: { current: 0 },
                subtype: 'checking', // Default subtype, can be enhanced
            });
        }
        accountsMap.get(accountName).balances.current += amount;

        // Process Transactions
        const categoryVal = findVal(row, ['Category']) || 'Uncategorized';
        transactions.push({
            transaction_id: findVal(row, ['Transaction ID']) || `tiller_${date}_${amountStr}_${description}`,
            date: date,
            name: description,
            amount: Math.abs(amount),
            category: [categoryVal],
            tags: [], // Tags not directly in this CSV, keep empty for now
            note: row.Note || '', 
            type: amount < 0 ? 'debit' : 'credit',
            accountName: accountName,
            institution: findVal(row, ['Institution']) || 'N/A',
        });
    }

    return {
        accounts: Array.from(accountsMap.values()),
        transactions: transactions.sort((a, b) => new Date(b.date) - new Date(a.date)), // Sort by most recent
    };
};

/**
 * Processes the raw Tiller Accounts data.
 */
export const processAccountsData = (data) => {
    console.log("Processing Accounts Data, raw rows:", data.length);

    const processed = data.map(row => {
        // Clean amount string
        const cleanNum = (val) => {
            if (!val) return 0;
            const strVal = String(val);
            return parseFloat(strVal.replace(/[^0-9.-]+/g, ""));
        };

        const rawType = findVal(row, ['Type']) || 'Other';
        const type = rawType.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

        // Fix: Define accountId and name from the row
        const accountId = findVal(row, ['Account Id', 'Account ID', 'Account #', 'Unique Account Identifier']);
        const name = findVal(row, ['Account', 'Name']) || 'Unnamed Account';
        const balanceVal = findVal(row, ['Last Balance', 'Balance']);

        return {
            account_id: accountId,
            name: name,
            institution: findVal(row, ['Institution']) || 'N/A',
            type: type,
            balances: { 
                current: cleanNum(balanceVal) 
            },
            lastUpdate: findVal(row, ['Last Update']) || 'Unknown',
            group: findVal(row, ['Group']) || 'Other',
            class: findVal(row, ['Class']) || 'N/A' // Class often duplicated, this helper is crucial
        };
    }).filter(acc => {
        const isValid = acc.name && acc.account_id;
        if (!isValid) console.warn("Invalid Account Row:", acc);
        return isValid;
    });

    console.log("Processed Accounts:", processed.length);
    return processed;
};

/**
 * Extracts income streams from transactions.
 * Income is defined as transactions with type 'credit' (positive amounts).
 * Excludes internal transfers and credit card payments.
 * Smartly categorizes Side Hustle income (e.g. DJ Business).
 */
export const processIncomeData = (transactions) => {
    if (!transactions || !Array.isArray(transactions)) return [];

    const userName = import.meta.env.VITE_USER_NAME?.toLowerCase();
    const userNameAlt = import.meta.env.VITE_USER_NAME_ALT?.toLowerCase();

    // Helper to detect Side Hustle
    const isSideHustle = (t) => {
        const desc = (t.name || '').toLowerCase();
        const acc = (t.accountName || '').toLowerCase();
        const inst = (t.institution || '').toLowerCase();
        
        // Navy Federal + Cash App/Venmo = Likely DJ Income
        if (inst.includes('navy federal') || acc.includes('navy federal')) {
            if (desc.includes('cash app') || desc.includes('venmo')) {
                return true;
            }
        }
        return false;
    };

    // Helper to detect Self-Transfer
    const isSelfTransfer = (t) => {
        const desc = (t.name || '').toLowerCase();
        
        // Filter Zelle self-transfers using both primary and alt names
        if (userName && desc.includes(userName)) return true;
        if (userNameAlt && desc.includes(userNameAlt)) return true;
        
        return false;
    };

    const incomeTransactions = transactions.filter(t => {
        if (t.type !== 'credit') return false;

        // 1. Always keep detected Side Hustles (even if they were labeled 'Transfer')
        if (isSideHustle(t)) return true;

        // 2. Filter out explicit Transfers
        if (t.category.includes('Transfers') || t.category.includes('Credit Card Payment')) {
            return false;
        }

        // 3. Filter out Self-Transfers based on PII Name
        if (isSelfTransfer(t)) {
            return false;
        }

        return true;
    });
    
    const streamsMap = new Map();

    incomeTransactions.forEach(t => {
        let source = t.category[0] || 'Uncategorized Income';

        // Override Category for Side Hustles
        if (isSideHustle(t)) {
            source = 'DJ Business / Side Hustle';
        }
        
        if (!streamsMap.has(source)) {
            streamsMap.set(source, {
                name: source,
                total: 0,
                count: 0,
                transactions: []
            });
        }
        
        const stream = streamsMap.get(source);
        stream.total += t.amount;
        stream.count += 1;
        stream.transactions.push(t);
    });

    return Array.from(streamsMap.values())
        .map(stream => ({
            ...stream,
            average: stream.total / stream.count
        }))
        .sort((a, b) => b.total - a.total);
};

/**
 * Calculates monthly cash flow (Income vs Expenses) based on the transaction date range.
 * Returns annualized numbers and monthly averages.
 */
export const calculateCashFlow = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return { income: 0, expenses: 0, surplus: 0, months: 0 };
    }

    const userName = import.meta.env.VITE_USER_NAME?.toLowerCase();
    const userNameAlt = import.meta.env.VITE_USER_NAME_ALT?.toLowerCase();

    // 1. Determine Date Range
    const dates = transactions.map(t => new Date(t.date)).filter(d => !isNaN(d));
    if (dates.length < 2) return { income: 0, expenses: 0, surplus: 0, months: 1 };

    const newest = new Date(Math.max(...dates));
    const oldest = new Date(Math.min(...dates));
    const diffInMs = newest - oldest;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const months = Math.max(diffInDays / 30.44, 1);

    // 2. Sum Income and Expenses
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
        const desc = (t.name || '').toLowerCase();
        const acc = (t.accountName || '').toLowerCase();
        const inst = (t.institution || '').toLowerCase();
        const isTransferCat = t.category.includes('Transfers') || t.category.includes('Credit Card Payment');
        
        // Smart Logic Re-used
        const isSideHustle = (inst.includes('navy federal') || acc.includes('navy federal')) && 
                             (desc.includes('cash app') || desc.includes('venmo'));
        
        const isSelfTransfer = (userName && desc.includes(userName)) || 
                               (userNameAlt && desc.includes(userNameAlt));

        if (t.type === 'credit') {
            if (isSideHustle) {
                totalIncome += t.amount; // Always count side hustle
            } else if (!isTransferCat && !isSelfTransfer) {
                totalIncome += t.amount; // Count other legitimate income
            }
        } else if (t.type === 'debit') {
            if (!isTransferCat) {
                totalExpenses += t.amount;
            }
        }
    });

    // 3. Calculate Averages
    const monthlyIncome = totalIncome / months;
    const monthlyExpenses = totalExpenses / months;

    return {
        monthlyIncome,
        monthlyExpenses,
        surplus: monthlyIncome - monthlyExpenses,
        months
    };
};

/**
 * Processes the raw Tiller Categories data.
 */
export const processCategoriesData = (data) => {
    return data.map(row => {
        const category = findVal(row, ['Category', 'Name']);
        if (!category) return null;

        return {
            ...row, // Spread original row to preserve "Jan 2025", "Feb 2025" etc. columns
            category: category,
            Category: category, // Uppercase alias for component compatibility
            group: findVal(row, ['Group']) || 'Uncategorized',
            type: findVal(row, ['Type']) || 'Expense',
            Type: findVal(row, ['Type']) || 'Expense', // Uppercase alias
            isHidden: (findVal(row, ['Hide', 'Hide From Reports']) || '').toLowerCase() === 'hide'
        };
    }).filter(c => c !== null);
};

const tillerService = {
    getTillerData,
    processTillerData,
    processDebtData,
    processAccountsData,
    processCategoriesData,
    processIncomeData,
    calculateCashFlow,
    fetchAndParseCsv
};

export default tillerService;
