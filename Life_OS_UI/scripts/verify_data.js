import prisma from '../server/shared/db.js';

async function verifyData() {
    try {
        console.log('🕵️‍♂️ Council Verification Protocol Initiated...\n');

        // 1. Count Transactions
        const txCount = await prisma.transaction.count();
        const lateralCount = await prisma.transaction.count({ where: { isLateral: true } });
        console.log(`📊 TRANSACTIONS: ${txCount} Total`);
        console.log(`   - Lateral/Transfers: ${lateralCount} (Excluded from Income)`);

        // 2. Count Accounts
        const accCount = await prisma.financialAccount.count();
        const hubs = await prisma.financialAccount.findMany({ where: { type: 'checking' } });
        console.log(`🏦 ACCOUNTS: ${accCount} Synced`);
        console.log(`   - Hubs Detected: ${hubs.map((h) => h.name).join(', ')}`);

        // 3. Count Debts (The New Stuff)
        const debtCount = await prisma.debtItem.count();
        const debts = await prisma.debtItem.findMany({
            orderBy: { interestRate: 'desc' },
            take: 3,
        });
        console.log(`💣 DEBT ITEMS: ${debtCount} Synced`);
        if (debts.length > 0) {
            console.log(`   - Top Interest Rates:`);
            debts.forEach((d) =>
                console.log(`     • ${d.name}: ${(d.interestRate * 100).toFixed(2)}%`)
            );
        }
    } catch (error) {
        console.error('❌ Verification Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyData();
