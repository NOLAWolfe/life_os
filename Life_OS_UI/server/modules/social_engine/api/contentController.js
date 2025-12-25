import express from 'express';
import contentService from '../core/contentService.js';
import AppError from '../../../shared/AppError.js';

const router = express.Router();

// GET /api/social/content
router.get('/', async (req, res, next) => {
    try {
        const content = await contentService.getAllContent();
        res.json(content);
    } catch (error) {
        next(new AppError('Failed to fetch content items', 500));
    }
});

// POST /api/social/content
router.post('/', async (req, res, next) => {
    try {
        const newItem = await contentService.createContent(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        next(new AppError('Failed to create content item', 500));
    }
});

// PATCH /api/social/content/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const updatedItem = await contentService.updateContent(req.params.id, req.body);
        res.json(updatedItem);
    } catch (error) {
        next(new AppError('Failed to update content item', 500));
    }
});

// DELETE /api/social/content/:id
router.delete('/:id', async (req, res, next) => {
    try {
        await contentService.deleteContent(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(new AppError('Failed to delete content item', 500));
    }
});

export default router;
