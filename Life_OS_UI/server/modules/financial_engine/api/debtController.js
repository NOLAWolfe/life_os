import express from 'express';
import debtRepository from '../data/debtRepository.js';

const router = express.Router();

// GET /api/finance/debts
router.get('/', async (req, res) => {
    try {
        const debts = await debtRepository.getAll();
        res.json(debts);
    } catch (error) {
        console.error('Error fetching debts:', error);
        res.status(500).json({ error: 'Failed to fetch debts' });
    }
});

export default router;
