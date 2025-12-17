import React, { useState, useEffect } from 'react';
import './MealPlanner.css';

const MealPlanner = () => {
    const [recipes, setRecipes] = useState([]);
    const [mealPlan, setMealPlan] = useState(null);

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

    return (
        <div className="meal-planner-container">
            <h2>This Week's Meal Plan</h2>
            {mealPlan ? (
                <div className="meal-plan-view">
                    <div className="plan-header">
                        <p><strong>Start Date:</strong> {mealPlan.start_date}</p>
                        <p><strong>End Date:</strong> {mealPlan.end_date}</p>
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
