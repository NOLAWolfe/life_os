import express from 'express';
import accountService from '../core/accountService.js';
import AppError from '../../../shared/AppError.js';

const router = express.Router();

// GET /api/finance/accounts
router.get('/', async (req, res, next) => {
    try {
        const accounts = await accountService.getDashboardAccounts();
        res.json(accounts);
    } catch (error) {
        next(new AppError('Failed to fetch accounts', 500));
    }
});

// POST /api/finance/accounts/upload
// Receives the raw JSON array parsed from the CSV by the frontend
// (In a full enterprise app, we'd upload the file and parse it here, 
// but to keep the frontend changes minimal, we'll accept the JSON for now)
router.post('/upload', async (req, res, next) => {
    try {
        const rawAccounts = req.body;
        if (!Array.isArray(rawAccounts)) {
            return next(new AppError('Invalid data format. Expected array.', 400));
        }

        const result = await accountService.importTillerAccounts(rawAccounts);
        res.json({ message: "Import complete", ...result });
    } catch (error) {
        next(new AppError('Failed to import accounts', 500));
    }
});

export default router;
