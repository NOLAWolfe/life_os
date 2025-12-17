import React from 'react';
import './TodoTracker.css';

const modules = [
  {
    name: 'Business & Finance',
    todos: [
      'Integrate transaction history from Plaid',
      'Build charts for spending analysis',
      'Create savings plan tracker',
      'Develop credit management dashboard',
      'Adapt for business financing (future)',
    ],
  },
  {
    name: 'Health Hub',
    todos: [
      'Transition workout/meal scripts to UI forms',
      'Add calorie and macro tracking to Meal Planner',
      'Visualize workout consistency on a calendar',
    ],
  },
  {
    name: 'Creative & Social',
    todos: [
      'Build UI for DJ World crate generation',
      'Implement Apple Music "wishlist" (Blocked by Apple Developer fee)',
      'Create UI for Content Idea Generator',
    ],
  },
    {
    name: 'Platform',
    todos: [
      'Implement simple User/Pass login system',
      'Develop contextual themes (e.g., "Workout Mode")',
      'Integrate all modules into a unified dashboard',
    ],
  },
];

const TodoTracker = () => {
  return (
    <div className="todo-tracker-container">
      <h2>Life.io Roadmap</h2>
      <div className="modules-grid">
        {modules.map((module) => (
          <div key={module.name} className="module-card">
            <h3>{module.name}</h3>
            <ul>
              {module.todos.map((todo, index) => (
                <li key={index}>{todo}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoTracker;
