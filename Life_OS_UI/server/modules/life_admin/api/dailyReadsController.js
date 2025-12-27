import express from 'express';
import dailyReadsRepository from '../data/dailyReadsRepository.js';

const router = express.Router();

// GET /api/life-admin/meals/daily-reads
router.get('/', async (req, res) => {
    try {
        const reads = await dailyReadsRepository.findAll();
        res.json(reads);
    } catch {
        res.status(500).json({ error: 'Failed to fetch reads' });
    }
});

router.post('/', async (req, res) => {
    try {
        const read = await dailyReadsRepository.save(req.body);
        res.json(read);
    } catch {
        res.status(500).json({ error: 'Failed to create read' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const read = await dailyReadsRepository.update(req.params.id, req.body);
        res.json(read);
    } catch {
        res.status(500).json({ error: 'Failed to update read' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await dailyReadsRepository.delete(req.params.id);
        res.json({ message: 'Read deleted' });
    } catch {
        res.status(500).json({ error: 'Failed to delete read' });
    }
});

export default router;