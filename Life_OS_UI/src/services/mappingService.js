/**
 * Service for identifying unmapped transactions and managing mapping rules.
 * "The Sorting Hat"
 */

export const getOrphanedTransactions = (transactions, currentRules) => {
    if (!transactions || transactions.length === 0) return [];

    // 1. Flatten all current keywords from rules
    // rules format: { 'node-id': ['keyword1', 'keyword2'] }
    const allKeywords = Object.values(currentRules)
        .flat()
        .map((k) => k.toLowerCase());

    // 2. Filter transactions that match NO keywords
    const orphans = transactions.filter((t) => {
        if (t.type !== 'debit') return false; // We care mostly about money LEAVING (Bills)
        const desc = t.name.toLowerCase();

        // Return TRUE if it matches NOTHING
        const isMapped = allKeywords.some((keyword) => desc.includes(keyword));
        return !isMapped;
    });

    // 3. Group and Aggregate Orphans
    const groupingMap = new Map();

    orphans.forEach((t) => {
        // Simple normalization: first 15 chars often capture the merchant name
        // e.g., "NETFLIX.COM CA 12345" -> "NETFLIX.COM"
        // Better yet, just group by the raw name for now to be precise,
        // or a slightly cleaned version. Let's use exact name for accuracy first.
        const key = t.name;

        if (!groupingMap.has(key)) {
            groupingMap.set(key, {
                name: key,
                count: 0,
                totalAmount: 0,
                dates: [],
                accounts: new Set(),
                institutions: new Set(),
                example: t.name,
                latestTransaction: t,
            });
        }

        const group = groupingMap.get(key);
        group.count += 1;
        group.totalAmount += t.amount;
        group.dates.push(t.date);
        if (t.accountName) group.accounts.add(t.accountName);
        if (t.institution) group.institutions.add(t.institution);

        // Update latest transaction if this one is newer
        if (new Date(t.date) > new Date(group.latestTransaction.date)) {
            group.latestTransaction = t;
        }
    });

    // 4. Convert to Array and Score
    // We want high-frequency OR high-value items
    const rankedOrphans = Array.from(groupingMap.values())
        .map((item) => ({
            ...item,
            averageAmount: item.totalAmount / item.count,
            lastDate: item.dates.sort().pop(),
            accountList: Array.from(item.accounts),
            institutionList: Array.from(item.institutions),
        }))
        // Filter out noise: single-time small transactions?
        // Let's keep them but sort them lower.
        .sort((a, b) => {
            // Sort by occurrence count first, then total value
            if (b.count !== a.count) return b.count - a.count;
            return b.totalAmount - a.totalAmount;
        });

    return rankedOrphans;
};

/**
 * Recursively extracts all bill nodes from a list of ReactFlow nodes.
 * Handles both top-level bill nodes and those nested within billGroup nodes.
 */
export const getAllBillNodes = (nodes) => {
    if (!nodes) return [];

    let bills = [];
    nodes.forEach((node) => {
        // Check if it's a bill node
        if (node.type === 'bill' || node.className?.includes('node-bill')) {
            bills.push(node);
        }

        // If it's a group, check its contained nodes
        if (node.type === 'billGroup' && node.data?.containedNodes) {
            // Recursive call for nested groups if they ever exist,
            // or just add the contained nodes.
            bills.push(...getAllBillNodes(node.data.containedNodes));
        }
    });

    return bills;
};

/**
 * Helper to generate a standardized "Rule Keyword" from a transaction description.
 * e.g., "Spotify USA 829283" -> "spotify"
 */
export const suggestKeyword = (transactionName) => {
    if (!transactionName) return '';
    // Simple heuristic: Take the first word, or if it's "Payment", take the second.
    const parts = transactionName.split(' ');
    const candidate = parts[0].length > 2 ? parts[0] : parts.slice(0, 2).join(' ');
    return candidate.toLowerCase().replace(/[^a-z0-9]/g, ''); // Remove special chars
};
