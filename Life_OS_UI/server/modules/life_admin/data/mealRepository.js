import prisma from '../../../shared/db.js';

const mealRepository = {
    // --- RECIPES ---
    getAllRecipes: async () => {
        return await prisma.recipe.findMany({
            orderBy: { name: 'asc' },
        });
    },

    createRecipe: async (name, ingredients, consumer = 'All', tags = '') => {
        // Ensure ingredients is stored as a JSON string
        const safeIngredients = Array.isArray(ingredients)
            ? JSON.stringify(ingredients)
            : ingredients;

        return await prisma.recipe.create({
            data: {
                name,
                ingredients: safeIngredients,
                consumer,
                tags,
            },
        });
    },

    deleteRecipe: async (id) => {
        return await prisma.recipe.delete({
            where: { id },
        });
    },

    // --- WEEKLY PLANS ---
    getPlanForWeek: async (weekStartDate) => {
        return await prisma.weeklyPlan.findFirst({
            where: { weekStart: weekStartDate },
        });
    },

    upsertPlan: async (weekStartDate, data) => {
        const existing = await prisma.weeklyPlan.findFirst({
            where: { weekStart: weekStartDate },
        });

        if (existing) {
            return await prisma.weeklyPlan.update({
                where: { id: existing.id },
                data: { data: JSON.stringify(data) },
            });
        } else {
            return await prisma.weeklyPlan.create({
                data: {
                    weekStart: weekStartDate,
                    data: JSON.stringify(data),
                },
            });
        }
    },
};

export default mealRepository;
