import React from 'react';
import WorkoutTracker from '../components/LifeAdmin/WorkoutTracker/WorkoutTracker';
import '../pages/Page.css';

const WorkoutPage=()=> {
    return(
        <div className="page-container">
            <h1>My Workouts</h1>
            <WorkoutTracker />
        </div>
    );
};
export default WorkoutPage;