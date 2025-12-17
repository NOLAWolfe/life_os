import React from 'react';
import MealPlanner from '../components/MealPlanner/MealPlanner';
import '../pages/Page.css';

const MealPlannerPage = () => {
    return (
        <div className="page-container">
            <h1>My Meal Plan</h1>
            <MealPlanner />
        </div>
    );
};

export default MealPlannerPage;
