/**
 * Service for identifying unmapped transactions and managing mapping rules.
 * "The Sorting Hat"
 */

export const getOrphanedTransactions = (transactions, currentRules) => {
    if (!transactions || transactions.length === 0) return [];

    // 1. Flatten all current keywords from rules
    // rules format: { 'node-id': ['keyword1', 'keyword2'] }
    const allKeywords = Object.values(currentRules).flat().map(k => k.toLowerCase());

    // 2. Filter transactions that match NO keywords
    const orphans = transactions.filter(t => {
        if (t.type !== 'debit') return false; // We care mostly about money LEAVING (Bills)
        const desc = t.name.toLowerCase();
        
        // Return TRUE if it matches NOTHING
        const isMapped = allKeywords.some(keyword => desc.includes(keyword));
        return !isMapped;
    });

    // 3. Group and Aggregate Orphans
    const groupingMap = new Map();

    orphans.forEach(t => {
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
                example: t.name
            });
        }
        
        const group = groupingMap.get(key);
        group.count += 1;
        group.totalAmount += t.amount;
        group.dates.push(t.date);
    });

    // 4. Convert to Array and Score
    // We want high-frequency OR high-value items
    const rankedOrphans = Array.from(groupingMap.values())
        .map(item => ({
            ...item,
            averageAmount: item.totalAmount / item.count,
            lastDate: item.dates.sort().pop()
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
