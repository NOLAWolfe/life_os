import React, { useState, useEffect } from 'react';
import './MealPlanner.css';

const MealPlanner = () => {
    const [recipes, setRecipes] = useState([]);
    const [mealPlan, setMealPlan] = useState(null);
    const [newRecipeName, setNewRecipeName] = useState('');
    const [newRecipeIngredients, setNewRecipeIngredients] = useState('');

    useEffect(() => {
        fetch('/api/recipes')
            .then(res => res.json())
            .then(data => setRecipes(data))
            .catch(err => console.error("Failed to fetch recipes:", err));

        fetch('/api/meal-plan')
            .then(res => res.json())
            .then(data => setMealPlan(data))
            .catch(err => console.error("Failed to fetch meal plan:", err));
    }, []);

    const getRecipeName = (mealId) => {
        if (!recipes || !mealId) return "Rest Day";
        const recipe = recipes.find(r => r.id === mealId);
        return recipe ? recipe.name : "Unknown Meal";
    };

    const handleRecipeSubmit = async (e) => {
        e.preventDefault();
        const ingredientsArray = newRecipeIngredients.split(',').map(item => item.trim());
        if (!newRecipeName || ingredientsArray.length === 0) {
            alert("Please provide a recipe name and at least one ingredient.");
            return;
        }

        const newRecipe = {
            name: newRecipeName,
            ingredients: ingredientsArray,
        };

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecipe),
            });

            if (response.ok) {
                const savedRecipe = await response.json();
                setRecipes([...recipes, savedRecipe.recipe]);
                setNewRecipeName('');
                setNewRecipeIngredients('');
            } else {
                console.error("Failed to save recipe");
            }
        } catch (error) {
            console.error("Error saving recipe:", error);
        }
    };

    const handleRegeneratePlan = async () => {
        try {
            const response = await fetch('/api/meal-plan', { method: 'PUT' });
            if (response.ok) {
                const data = await response.json();
                setMealPlan(data.meal_plan);
            } else {
                console.error("Failed to regenerate meal plan");
            }
        } catch (error) {
            console.error("Error regenerating meal plan:", error);
        }
    };

    return (
        <div className="meal-planner-container">
            <h2>This Week's Meal Plan</h2>
            {mealPlan ? (
                <div className="meal-plan-view">
                    <div className="plan-header">
                        <div>
                            <p><strong>Start Date:</strong> {mealPlan.start_date}</p>
                            <p><strong>End Date:</strong> {mealPlan.end_date}</p>
                        </div>
                        <button onClick={handleRegeneratePlan} className="regenerate-btn">Regenerate Plan</button>
                    </div>
                    <div className="plan-days">
                        {mealPlan.days.map(day => (
                            <div key={day.date} className="day-card">
                                <h3>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                                <p>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                <div className="meal-name">
                                    {getRecipeName(day.meal_id)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Loading meal plan...</p>
            )}

            <div className="add-recipe-form">
                <h3>Add a New Recipe</h3>
                <form onSubmit={handleRecipeSubmit}>
                    <input
                        type="text"
                        value={newRecipeName}
                        onChange={e => setNewRecipeName(e.target.value)}
                        placeholder="Recipe Name"
                        required
                    />
                    <input
                        type="text"
                        value={newRecipeIngredients}
                        onChange={e => setNewRecipeIngredients(e.target.value)}
                        placeholder="Ingredients (comma-separated)"
                        required
                    />
                    <button type="submit">Add Recipe</button>
                </form>
            </div>

            <div className="recipe-list">
                <h3>Available Recipes</h3>
                <ul>
                    {recipes.map(recipe => (
                        <li key={recipe.id}>
                            <strong>{recipe.name}</strong>: {recipe.ingredients.join(', ')}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MealPlanner;
