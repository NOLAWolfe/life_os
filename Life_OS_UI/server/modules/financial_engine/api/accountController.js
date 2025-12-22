import express from 'express';
import accountService from '../core/accountService.js';

const router = express.Router();

// GET /api/finance/accounts
router.get('/', async (req, res) => {
    try {
        const accounts = await accountService.getDashboardAccounts();
        res.json(accounts);
    } catch (error) {
        console.error("Error fetching accounts:", error);
        res.status(500).json({ error: "Failed to fetch accounts" });
    }
});

// POST /api/finance/accounts/upload
// Receives the raw JSON array parsed from the CSV by the frontend
// (In a full enterprise app, we'd upload the file and parse it here, 
// but to keep the frontend changes minimal, we'll accept the JSON for now)
router.post('/upload', async (req, res) => {
    try {
        const rawAccounts = req.body;
        if (!Array.isArray(rawAccounts)) {
            return res.status(400).json({ error: "Invalid data format. Expected array." });
        }

        const result = await accountService.importTillerAccounts(rawAccounts);
        res.json({ message: "Import complete", ...result });
    } catch (error) {
        console.error("Error importing accounts:", error);
        res.status(500).json({ error: "Failed to import accounts" });
    }
});

export default router;
