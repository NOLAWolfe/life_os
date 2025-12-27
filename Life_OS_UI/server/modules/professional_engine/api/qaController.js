import express from 'express';
import qaService from '../core/qaService.js';

const router = express.Router();

// --- User Stories ---
router.get('/stories', async (req, res) => {
    try {
        const stories = await qaService.getUserStories();
        res.json(stories);
    } catch {
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

router.post('/stories', async (req, res) => {
    try {
        const story = await qaService.createUserStory(req.body);
        res.json(story);
    } catch {
        res.status(500).json({ error: 'Failed to create story' });
    }
});

// --- Bugs ---
router.get('/bugs', async (req, res) => {
    try {
        const bugs = await qaService.getBugs();
        res.json(bugs);
    } catch {
        res.status(500).json({ error: 'Failed to fetch bugs' });
    }
});

router.post('/bugs', async (req, res) => {
    try {
        const bug = await qaService.createBug(req.body);
        res.json(bug);
    } catch {
        res.status(500).json({ error: 'Failed to create bug' });
    }
});

export default router;
