import express from 'express';
import mealRepository from '../data/mealRepository.js';

const router = express.Router();

// --- RECIPES ---
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await mealRepository.getAllRecipes();
        // Parse JSON ingredients for the frontend
        const parsed = recipes.map((r) => ({
            ...r,
            ingredients: JSON.parse(r.ingredients || '[]'),
        }));
        res.json(parsed);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

router.post('/recipes', async (req, res) => {
    try {
        const { name, ingredients, consumer, tags } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const recipe = await mealRepository.createRecipe(name, ingredients, consumer, tags);
        res.json(recipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

router.delete('/recipes/:id', async (req, res) => {
    try {
        await mealRepository.deleteRecipe(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
});

// --- WEEKLY PLANS ---
// GET /api/life-admin/meals/plan?date=2025-12-22
router.get('/plan', async (req, res) => {
    try {
        const dateStr = req.query.date;
        if (!dateStr) return res.status(400).json({ error: 'Date is required (YYYY-MM-DD)' });

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return res.status(400).json({ error: 'Invalid date' });

        const plan = await mealRepository.getPlanForWeek(date);

        if (!plan) return res.json(null);

        res.json({
            ...plan,
            data: JSON.parse(plan.data || '{}'),
        });
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ error: 'Failed to fetch plan' });
    }
});

router.post('/plan', async (req, res) => {
    try {
        const { date, data } = req.body;
        if (!date || !data) return res.status(400).json({ error: 'Date and Data required' });

        const weekStart = new Date(date);
        const updated = await mealRepository.upsertPlan(weekStart, data);

        res.json(updated);
    } catch (error) {
        console.error('Error saving plan:', error);
        res.status(500).json({ error: 'Failed to save plan' });
    }
});

export default router;
