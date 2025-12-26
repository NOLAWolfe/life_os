import express from 'express';
import dailyReadsRepository from '../data/dailyReadsRepository.js';
import AppError from '../../../shared/AppError.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const reads = await dailyReadsRepository.getAll();
        res.json(reads);
    } catch (error) {
        next(new AppError('Failed to fetch daily reads', 500));
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newItem = await dailyReadsRepository.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        next(new AppError('Failed to create daily read', 500));
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const updatedItem = await dailyReadsRepository.update(req.params.id, req.body);
        res.json(updatedItem);
    } catch (error) {
        next(new AppError('Failed to update daily read', 500));
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await dailyReadsRepository.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(new AppError('Failed to delete daily read', 500));
    }
});

export default router;
