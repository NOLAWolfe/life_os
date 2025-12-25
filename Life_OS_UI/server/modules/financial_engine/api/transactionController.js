import express from 'express';
import transactionService from '../core/transactionService.js';
import tillerSyncService from '../core/tillerSyncService.js';

const router = express.Router();

console.log('Initializing Transaction Controller Routes...');

// GET /api/finance/transactions
router.get('/', async (req, res) => {
    console.log('GET /api/finance/transactions hit');
    try {
        const transactions = await transactionService.getDashboardTransactions();
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// POST /api/finance/transactions/upload
router.post('/upload', async (req, res) => {
    try {
        const rawTransactions = req.body;
        if (!Array.isArray(rawTransactions)) {
            return res.status(400).json({ error: 'Invalid data format.' });
        }

        const result = await transactionService.importTillerTransactions(rawTransactions);
        res.json({ message: 'Import complete', ...result });
    } catch (error) {
        console.error('Error importing transactions:', error);
        res.status(500).json({ error: 'Failed to import transactions' });
    }
});

// POST /api/finance/txns/sync
// Receives raw rows from the Google Sheets MCP and processes them
router.post('/sync', async (req, res) => {
    try {
        const { transactions, balances, debts } = req.body;

        const results = {};

        if (balances && Array.isArray(balances)) {
            await tillerSyncService.syncBalances(balances);
            results.balances = 'Synced';
        }

        if (transactions && Array.isArray(transactions)) {
            const txResult = await tillerSyncService.syncTransactions(transactions);
            results.transactions = txResult;
        }

        if (debts && Array.isArray(debts)) {
            const debtResult = await tillerSyncService.syncDebtPlanner(debts);
            results.debts = debtResult;
        }

        res.json({ message: 'Tiller Sync Complete', details: results });
    } catch (error) {
        console.error('Error during Tiller sync:', error);
        res.status(500).json({ error: 'Tiller Sync Failed' });
    }
});

export default router;
