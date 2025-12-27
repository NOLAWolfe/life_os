import express from 'express';
import contentService from '../core/contentService.js';
import prisma from '../../../shared/db.js';
import AppError from '../../../shared/AppError.js';

const router = express.Router();

// GET /api/social/content
router.get('/', async (req, res, _next) => {
    try {
        const content = await contentService.getAllContent();
        res.json(content);
    } catch {
        _next(new AppError('Failed to fetch content items', 500));
    }
});

// POST /api/social/content
router.post('/', async (req, res, _next) => {
    try {
        const item = await prisma.contentItem.create({ data: req.body });
        res.json(item);
    } catch {
        _next(new AppError('Failed to create content item', 500));
    }
});

// PATCH /api/social/content/:id
router.patch('/:id', async (req, res, _next) => {
    try {
        const updatedItem = await contentService.updateContent(req.params.id, req.body);
        res.json(updatedItem);
    } catch {
        _next(new AppError('Failed to update content item', 500));
    }
});

// DELETE /api/social/content/:id
router.delete('/:id', async (req, res, _next) => {
    try {
        await contentService.deleteContent(req.params.id);
        res.status(204).send();
    } catch {
        _next(new AppError('Failed to delete content item', 500));
    }
});

export default router;
