import express from 'express';
import * as userRepository from '../data/userRepository.js';
import AppError from '../../../shared/AppError.js';

const router = express.Router();

// GET /api/system/user/:id
router.get('/:id', async (req, res, next) => {
    try {
        const user = await userRepository.getUserById(req.params.id);
        if (!user) return next(new AppError('User not found', 404));

        let installedTools = [];
        let dashboardLayout = {};

        try {
            installedTools = user.installedTools ? JSON.parse(user.installedTools) : [];
        } catch (e) {
            console.error('Failed to parse installedTools:', e);
        }

        try {
            dashboardLayout = user.dashboardLayout ? JSON.parse(user.dashboardLayout) : {};
        } catch (e) {
            console.error('Failed to parse dashboardLayout:', e);
        }

        // Parse JSON strings back to objects
        const response = {
            ...user,
            installedTools,
            dashboardLayout,
        };

        res.json({ status: 'success', data: response });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/system/user/:id/preferences
router.patch('/:id/preferences', async (req, res, next) => {
    try {
        const { installedTools, dashboardLayout } = req.body;
        const user = await userRepository.updateUserPreferences(req.params.id, {
            installedTools,
            dashboardLayout,
        });

        res.json({ status: 'success', data: user });
    } catch (err) {
        next(err);
    }
});

// POST /api/system/user/:id/accept-terms
router.post('/:id/accept-terms', async (req, res, next) => {
    try {
        await userRepository.acceptTerms(req.params.id);
        res.json({ status: 'success', message: 'Terms accepted' });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/system/user/:id
router.delete('/:id', async (req, res, next) => {
    try {
        await userRepository.deleteUser(req.params.id);
        res.json({ status: 'success', message: 'User deleted' });
    } catch (err) {
        next(err);
    }
});

export default router;
