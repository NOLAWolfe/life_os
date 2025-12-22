import Papa from 'papaparse';

/**
 * Fetches and parses the Tiller CSV data from the Google Sheet export.
 */
export const getTillerData = async (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            download: false,
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
 * Dynamic column mapping for robustness.
 */
export const processDebtData = (data) => {
    const debtAccounts = [];
    let headerMap = null;

    for (const row of data) {
        const values = Array.isArray(row) ? row : Object.values(row);

        // Detect Header Row
        if (!headerMap && values.includes("Account") && (values.includes("Interest Rate") || values.includes("Min Monthly Payment"))) {
            headerMap = {};
            values.forEach((header, index) => {
                if (header) headerMap[header.trim()] = index;
            });
            continue; 
        }

        if (headerMap) {
            const getVal = (colName) => {
                const idx = headerMap[colName];
                return idx !== undefined ? values[idx] : undefined;
            };

            const accountName = getVal("Account");
            if (!accountName || accountName === "Account") continue;

            // Stop if we hit an empty row after data starts
            if (!accountName && debtAccounts.length > 0) break;

            const cleanNum = (val) => {
                if (val === undefined || val === null || val === "") return 0;
                if (typeof val === 'number') return val;
                const cleaned = String(val).replace(/[^0-9.-]+/g, "");
                return cleaned === "" ? 0 : parseFloat(cleaned);
            };

            // Clean "Group Id:" names
            let displayName = accountName;
            if (accountName.startsWith("Group Id:")) {
                // "Group Id:Ae - xxxx79ae (BDB5)" -> "Student Loan (Group Ae)"
                const groupPart = accountName.split('-')[0].replace("Group Id:", "").trim();
                displayName = `Student Loan (Group ${groupPart})`;
            }

            // Checkmark column is often unnamed or the first column
            const activeVal = values[0]; 

            debtAccounts.push({
                active: String(activeVal).toUpperCase() === "TRUE" || activeVal === "✅",
                name: displayName,
                originalName: accountName,
                interestRate: cleanNum(getVal("Interest Rate")),
                minPayment: cleanNum(getVal("Min Monthly Payment")),
                rank: cleanNum(getVal("Rank")),
                startingBalance: cleanNum(getVal("Starting Balance")),
                currentBalance: cleanNum(getVal("Current Balance")),
                monthlyInterest: cleanNum(getVal("Monthly Interest")),
                payoffMonth: getVal("Paid Off Month"), // Tiller's projection
                totalInterest: cleanNum(getVal("Est Total Interest")),
                recommendedPayment: cleanNum(getVal("Recommended Payment"))
            });
        }
    }

    return debtAccounts;
};

// --- Transaction Identification Helpers ---

const checkIsSideHustle = (t) => {
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

const checkIsLateral = (t, userName, userNameAlt) => {
    const desc = (t.name || '').toLowerCase();
    const cat = (t.category && t.category[0] ? t.category[0] : '').toLowerCase();

    // 1. Explicit Category
    if (cat === 'transfers' || cat === 'credit card payment') return true;

    // 2. Self-Transfer (Zelle/Venmo to self)
    if (userName && desc.includes(userName)) return true;
    if (userNameAlt && desc.includes(userNameAlt)) return true;

    // 3. Common Bank Transfer keywords
    if (desc.includes('online transfer') || desc.includes('transfer from') || desc.includes('transfer to')) return true;

    return false;
};

/**
 * Processes the raw Tiller data into a more usable format.
 * - Extracts unique accounts and their balances.
 * - Returns a list of transactions with more detail.
 * - Flags transactions as Side Hustle or Lateral Transfer.
 */
export const processTillerData = (data) => {
    const accountsMap = new Map();
    const transactions = [];

    const userName = import.meta.env.VITE_USER_NAME?.toLowerCase();
    const userNameAlt = import.meta.env.VITE_USER_NAME_ALT?.toLowerCase();

    for (const row of data) {
        const date = findVal(row, ['Date']);
        const amountStr = findVal(row, ['Amount']);
        const account = findVal(row, ['Account']);
        const description = findVal(row, ['Description', 'Full Description']);
        
        if (!date || !amountStr || !account || !description) {
            continue;
        }

        const rawAmount = amountStr.replace(/[^0-9.-]+/g, ""); 
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
                subtype: 'checking', 
            });
        }
        accountsMap.get(accountName).balances.current += amount;

        // Process Transactions
        const categoryVal = findVal(row, ['Category']) || 'Uncategorized';
        
        const transactionObj = {
            transaction_id: findVal(row, ['Transaction ID']) || `tiller_${date}_${amountStr}_${description}`,
            date: date,
            name: description,
            amount: Math.abs(amount),
            category: [categoryVal],
            tags: [], 
            note: row.Note || '', 
            type: amount < 0 ? 'debit' : 'credit',
            accountName: accountName,
            institution: findVal(row, ['Institution']) || 'N/A',
        };

        // Determine Meta-Types
        transactionObj.isSideHustle = checkIsSideHustle(transactionObj);
        transactionObj.isLateral = checkIsLateral(transactionObj, userName, userNameAlt);

        transactions.push(transactionObj);
    }

    return {
        accounts: Array.from(accountsMap.values()),
        transactions: transactions.sort((a, b) => new Date(b.date) - new Date(a.date)), 
    };
};

/**
 * Processes the raw Tiller Accounts data.
 */
export const processAccountsData = (data) => {
    console.log("Processing Accounts Data, raw rows:", data.length);

    const processed = data.map(row => {
        const cleanNum = (val) => {
            if (!val) return 0;
            const strVal = String(val);
            return parseFloat(strVal.replace(/[^0-9.-]+/g, ""));
        };

        const rawType = findVal(row, ['Type']) || 'Other';
        const type = rawType.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

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
            class: findVal(row, ['Class']) || 'N/A'
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
 * Uses pre-calculated isSideHustle and isLateral flags.
 * Calculates True Monthly Average (Total / Months in Dataset).
 */
export const processIncomeData = (transactions) => {
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) return [];

    // Calculate Date Range in Months
    const dates = transactions.map(t => new Date(t.date)).filter(d => !isNaN(d));
    let monthsDivisor = 1;
    if (dates.length > 1) {
        const newest = new Date(Math.max(...dates));
        const oldest = new Date(Math.min(...dates));
        const diffInMs = newest - oldest;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        monthsDivisor = Math.max(diffInDays / 30.44, 1);
    }

    const incomeTransactions = transactions.filter(t => {
        if (t.type !== 'credit') return false;

        // 1. Always keep detected Side Hustles (even if they were labeled 'Transfer')
        if (t.isSideHustle) return true;

        // 2. Filter out Lateral Transfers
        if (t.isLateral) return false;

        return true;
    });
    
    const streamsMap = new Map();

    incomeTransactions.forEach(t => {
        let source = t.category[0] || 'Uncategorized Income';

        if (t.isSideHustle) {
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
            average: stream.total / stream.count, // Avg per transaction
            monthlyAvg: stream.total / monthsDivisor // True Monthly Avg
        }))
        .sort((a, b) => b.total - a.total);
};

/**
 * Calculates monthly cash flow (Income vs Expenses).
 * Explicitly excludes Lateral Transfers from both columns.
 */
export const calculateCashFlow = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return { income: 0, expenses: 0, surplus: 0, months: 0 };
    }

    const dates = transactions.map(t => new Date(t.date)).filter(d => !isNaN(d));
    if (dates.length < 2) return { income: 0, expenses: 0, surplus: 0, months: 1 };

    const newest = new Date(Math.max(...dates));
    const oldest = new Date(Math.min(...dates));
    const diffInMs = newest - oldest;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const months = Math.max(diffInDays / 30.44, 1);

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
        if (t.type === 'credit') {
            if (t.isSideHustle) {
                totalIncome += t.amount;
            } else if (!t.isLateral) {
                totalIncome += t.amount;
            }
        } else if (t.type === 'debit') {
            // Only count if NOT a lateral transfer
            if (!t.isLateral) {
                totalExpenses += t.amount;
            }
        }
    });

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
            ...row, 
            category: category,
            Category: category,
            group: findVal(row, ['Group']) || 'Uncategorized',
            type: findVal(row, ['Type']) || 'Expense',
            Type: findVal(row, ['Type']) || 'Expense',
            isHidden: (findVal(row, ['Hide', 'Hide From Reports']) || '').toLowerCase() === 'hide'
        };
    }).filter(c => c !== null);
};

/**
 * API Integration: Fetch all accounts from SQLite.
 */
export const fetchAccountsFromDb = async () => {
    const res = await fetch('/api/finance/accounts');
    if (!res.ok) throw new Error('Failed to fetch accounts from DB');
    return await res.json();
};

/**
 * API Integration: Fetch all transactions from SQLite.
 */
export const fetchTransactionsFromDb = async () => {
    const res = await fetch('/api/finance/txns');
    if (!res.ok) throw new Error('Failed to fetch transactions from DB');
    return await res.json();
};

/**
 * API Integration: Upload parsed account data to backend.
 */
export const uploadAccountsToDb = async (accounts) => {
    const res = await fetch('/api/finance/accounts/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accounts)
    });
    return await res.json();
};

/**
 * API Integration: Upload parsed transaction data to backend.
 */
export const uploadTransactionsToDb = async (transactions) => {
    const res = await fetch('/api/finance/txns/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactions)
    });
    return await res.json();
};

const tillerService = {
    getTillerData,
    processTillerData,
    processDebtData,
    processAccountsData,
    processCategoriesData,
    processIncomeData,
    calculateCashFlow,
    fetchAndParseCsv,
    fetchAccountsFromDb,
    fetchTransactionsFromDb,
    uploadAccountsToDb,
    uploadTransactionsToDb
};

export default tillerService;