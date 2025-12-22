import express from 'express';
import transactionService from '../core/transactionService.js';

const router = express.Router();

console.log("Initializing Transaction Controller Routes...");

// GET /api/finance/transactions
router.get('/', async (req, res) => {
    console.log("GET /api/finance/transactions hit");
    try {
        const transactions = await transactionService.getDashboardTransactions();
        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// POST /api/finance/transactions/upload
router.post('/upload', async (req, res) => {
    try {
        const rawTransactions = req.body;
        if (!Array.isArray(rawTransactions)) {
            return res.status(400).json({ error: "Invalid data format." });
        }

        const result = await transactionService.importTillerTransactions(rawTransactions);
        res.json({ message: "Import complete", ...result });
    } catch (error) {
        console.error("Error importing transactions:", error);
        res.status(500).json({ error: "Failed to import transactions" });
    }
});

export default router;
