import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useFinancials } from '../../../contexts/FinancialContext';
import './MealPlanner.css';

const CONSUMERS = {
    USER: 'Neauxla',
    PARTNER: 'Partner',
    SHARED: 'Shared',
};

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MealPlanner = () => {
    const { user } = useUser();
    const { hottestDollar } = useFinancials();

    // UI State
    const [activeTab, setActiveTab] = useState(CONSUMERS.USER); // 'Neauxla', 'Partner', 'List'
    const [selectedDay, setSelectedDay] = useState(null); // For detail view/adding
    const [selectedMealType, setSelectedMealType] = useState('Dinner');

    // Data State
    const [recipes, setRecipes] = useState([]);
    const [weekPlan, setWeekPlan] = useState({});
    const [weekStart, setWeekStart] = useState('');
    const [loading, setLoading] = useState(true);

    const surplus = hottestDollar?.surplus || 0;
    const weeklyBudget = Math.max(0, surplus / 4); // Basic estimation: 1/4 of surplus for week
    const isCritical = hottestDollar?.isDeficit;

    // Form State
    const [newRecipeName, setNewRecipeName] = useState('');
    const [newRecipeIngredients, setNewRecipeIngredients] = useState('');
    const [newRecipeTags, setNewRecipeTags] = useState('');

    // --- UTILS ---
    const getCurrentWeekMonday = () => {
        const d = new Date();
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(d.setDate(diff));
        return monday.toISOString().split('T')[0];
    };

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const monday = getCurrentWeekMonday();
            setWeekStart(monday);

            try {
                const [recipesRes, planRes] = await Promise.all([
                    fetch('/api/life-admin/meals/recipes'),
                    fetch(`/api/life-admin/meals/plan?date=${monday}`),
                ]);

                if (recipesRes.ok) setRecipes(await recipesRes.json());

                if (planRes.ok) {
                    const planData = await planRes.json();
                    setWeekPlan(planData?.data || {});
                }
            } catch (err) {
                console.error('Failed to fetch meal data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    // --- ACTIONS ---
    const handleRecipeSubmit = async (e) => {
        e.preventDefault();
        if (!newRecipeName) return;

        const ingredientsArray = newRecipeIngredients
            .split(',')
            .map((i) => i.trim())
            .filter((i) => i);
        const newRecipe = {
            name: newRecipeName,
            ingredients: ingredientsArray,
            consumer: activeTab === 'List' ? CONSUMERS.SHARED : activeTab,
            tags: newRecipeTags,
        };

        try {
            const res = await fetch('/api/life-admin/meals/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecipe),
            });
            if (res.ok) {
                const saved = await res.json();
                setRecipes((prev) => [
                    ...prev,
                    { ...saved, ingredients: JSON.parse(saved.ingredients) },
                ]);
                setNewRecipeName('');
                setNewRecipeIngredients('');
                setNewRecipeTags('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const assignMeal = async (day, mealType, recipeId) => {
        const newPlan = { ...weekPlan };
        if (!newPlan[day]) newPlan[day] = {};
        if (!newPlan[day][activeTab]) newPlan[day][activeTab] = {};

        if (recipeId === 'clear') {
            delete newPlan[day][activeTab][mealType];
        } else {
            newPlan[day][activeTab][mealType] = recipeId;
        }

        setWeekPlan(newPlan);

        // Optimistic UI update, then save
        try {
            await fetch('/api/life-admin/meals/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: weekStart, data: newPlan }),
            });
        } catch (err) {
            console.error('Failed to save plan:', err);
        }
    };

    // --- GROCERY LOGIC ---
    const generateGroceryList = () => {
        const list = {};

        Object.values(weekPlan).forEach((dayObj) => {
            [CONSUMERS.USER, CONSUMERS.PARTNER].forEach((consumer) => {
                const dayMeals = dayObj[consumer];
                if (!dayMeals) return;

                Object.values(dayMeals).forEach((recipeId) => {
                    const recipe = recipes.find((r) => r.id === recipeId);
                    if (recipe && recipe.ingredients) {
                        recipe.ingredients.forEach((ing) => {
                            const clean = ing.toLowerCase();
                            list[clean] = (list[clean] || 0) + 1;
                        });
                    }
                });
            });
        });

        return Object.entries(list).sort();
    };

    // --- RENDER HELPERS ---
    const renderPlanGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DAYS.map((day) => {
                const dayPlan = weekPlan[day]?.[activeTab] || {};

                return (
                    <div
                        key={day}
                        className="meal-day-card bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-[var(--text-primary)]">{day}</h3>
                            <span className="text-xs text-[var(--text-secondary)]">
                                {activeTab === CONSUMERS.USER ? '🏋️' : '🩺'}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {MEAL_TYPES.map((type) => {
                                const currentRecipeId = dayPlan[type];
                                const currentRecipe = recipes.find((r) => r.id === currentRecipeId);

                                return (
                                    <div key={type} className="meal-slot">
                                        <p className="text-xs uppercase text-[var(--text-secondary)] font-bold mb-1">
                                            {type}
                                        </p>
                                        <select
                                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-sm px-2 py-1 text-[var(--text-primary)]"
                                            value={currentRecipeId || ''}
                                            onChange={(e) => assignMeal(day, type, e.target.value)}
                                        >
                                            <option value="">- Select -</option>
                                            {recipes
                                                .filter(
                                                    (r) =>
                                                        r.consumer === 'All' ||
                                                        r.consumer === activeTab
                                                )
                                                .map((r) => (
                                                    <option key={r.id} value={r.id}>
                                                        {r.name}
                                                    </option>
                                                ))}
                                            <option value="clear" className="text-red-400">
                                                (Clear Slot)
                                            </option>
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const renderGroceryList = () => {
        const list = generateGroceryList();
        return (
            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)] max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🛒 Combined Shopping List
                    <span className="text-sm font-normal text-[var(--text-secondary)] bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border-color)]">
                        {list.length} items
                    </span>
                </h3>
                {list.length === 0 ? (
                    <p className="text-[var(--text-secondary)] italic">
                        Plan some meals to generate a list.
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {list.map(([item, count]) => (
                            <li
                                key={item}
                                className="flex justify-between items-center bg-[var(--bg-primary)] px-3 py-2 rounded border border-[var(--border-color)]"
                            >
                                <span className="capitalize">{item}</span>
                                {count > 1 && (
                                    <span className="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full">
                                        {count}x
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    if (loading)
        return <div className="p-8 text-center animate-pulse">Loading Chef's Engine...</div>;

    return (
        <div className="meal-planner-container space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--accent-color)]">
                        Household Commander
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                        Week of {new Date(weekStart).toLocaleDateString()}
                    </p>
                </div>

                {/* Strategic Budget Alert */}
                <div className={`p-3 rounded-lg border flex items-center gap-3 ${isCritical ? 'bg-red-900/20 border-red-500/50' : 'bg-green-900/20 border-green-500/50'}`}>
                    <span className="text-xl">{isCritical ? '⚠️' : '💰'}</span>
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400 leading-tight">Weekly Grocery Attack</p>
                        <p className={`text-lg font-black leading-tight ${isCritical ? 'text-red-400' : 'text-green-400'}`}>
                            ${Math.round(weeklyBudget).toLocaleString()}
                        </p>
                        <p className="text-[9px] text-gray-500 italic">
                            {isCritical ? 'Surplus depleted. Keep it lean.' : 'Strategic surplus active.'}
                        </p>
                    </div>
                </div>

                {/* Profile Switcher */}
                <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-color)]">
                    <button
                        onClick={() => setActiveTab(CONSUMERS.USER)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === CONSUMERS.USER ? 'bg-blue-600 text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        🏋️ Neauxla (Perf)
                    </button>
                    <button
                        onClick={() => setActiveTab(CONSUMERS.PARTNER)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === CONSUMERS.PARTNER ? 'bg-teal-600 text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        🩺 Partner (Med)
                    </button>
                    <button
                        onClick={() => setActiveTab('List')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'List' ? 'bg-orange-600 text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        🛒 Grocery List
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            {activeTab === 'List' ? renderGroceryList() : renderPlanGrid()}

            {/* Quick Add Recipe (Available on Plan Views) */}
            {activeTab !== 'List' && (
                <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
                    <h3 className="text-lg font-bold mb-4">Add Quick Recipe</h3>
                    <form
                        onSubmit={handleRecipeSubmit}
                        className="flex flex-col md:flex-row gap-4 items-end bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]"
                    >
                        <div className="flex-1 w-full">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-1">
                                Recipe Name
                            </label>
                            <input
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-3 py-2 text-sm"
                                placeholder="e.g., Grilled Chicken Salad"
                                value={newRecipeName}
                                onChange={(e) => setNewRecipeName(e.target.value)}
                            />
                        </div>
                        <div className="flex-[2] w-full">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-1">
                                Ingredients (Comma Separated)
                            </label>
                            <input
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-3 py-2 text-sm"
                                placeholder="Chicken, Lettuce, Olive Oil..."
                                value={newRecipeIngredients}
                                onChange={(e) => setNewRecipeIngredients(e.target.value)}
                            />
                        </div>
                        <div className="w-32">
                            <button
                                type="submit"
                                className="w-full bg-[var(--accent-color)] hover:brightness-110 text-white py-2 rounded text-sm font-bold"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MealPlanner;
