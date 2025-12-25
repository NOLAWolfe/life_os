import React, { useState, useEffect } from 'react';
import './TodoTracker.css';

const initialModules = [
    {
        name: 'Business & Finance',
        todos: [
            { text: 'Integrate transaction history from Plaid', completed: false },
            { text: 'Build charts for spending analysis', completed: false },
            { text: 'Create savings plan tracker', completed: false },
            { text: 'Develop credit management dashboard', completed: false },
            { text: 'Adapt for business financing (future)', completed: false },
        ],
    },
    {
        name: 'Health Hub',
        todos: [
            { text: 'Transition workout/meal scripts to UI forms', completed: false },
            {
                text: 'Add calorie and macro tracking to Meal Planner',
                completed: false,
            },
            { text: 'Visualize workout consistency on a calendar', completed: false },
        ],
    },
    {
        name: 'Creative & Social',
        todos: [
            { text: 'Build UI for DJ World crate generation', completed: false },
            {
                text: 'Implement Apple Music "wishlist" (Blocked by Apple Developer fee)',
                completed: false,
            },
            { text: 'Create UI for Content Idea Generator', completed: false },
        ],
    },
    {
        name: 'Platform',
        todos: [
            { text: 'Implement simple User/Pass login system', completed: false },
            {
                text: 'Develop contextual themes (e.g., "Workout Mode")',
                completed: false,
            },
            {
                text: 'Integrate all modules into a unified dashboard',
                completed: false,
            },
        ],
    },
    {
        name: 'Personal',
        todos: [
            { text: 'Take time reading the next Chapter of current Book', completed: false },
            {
                text: 'General Clearning',
                completed: false,
            },
            {
                text: 'Continue working on Generative AI Certification',
                completed: false,
            },
        ],
    },
];

const TodoTracker = () => {
    const [modules, setModules] = useState(() => {
        const saved = localStorage.getItem('life_os_roadmap');
        if (saved) {
            return JSON.parse(saved);
        }
        return initialModules;
    });

    const [newTaskInput, setNewTaskInput] = useState({}); // Stores input value per module
    const [showInput, setShowInput] = useState({}); // Stores visibility toggle per module

    useEffect(() => {
        localStorage.setItem('life_os_roadmap', JSON.stringify(modules));
    }, [modules]);

    const toggleTodo = (moduleIndex, todoIndex) => {
        const newModules = [...modules];
        newModules[moduleIndex].todos[todoIndex].completed =
            !newModules[moduleIndex].todos[todoIndex].completed;
        setModules(newModules);
    };

    const handleAddTask = (moduleIndex) => {
        const text = newTaskInput[moduleIndex];
        if (!text || text.trim() === '') return;

        const newModules = [...modules];
        newModules[moduleIndex].todos.push({ text: text, completed: false });
        setModules(newModules);
        setNewTaskInput({ ...newTaskInput, [moduleIndex]: '' }); // Clear input
        // Optional: Keep input open or close it. Keeping it open for multiple adds.
    };

    const toggleInputVisibility = (index) => {
        setShowInput({ ...showInput, [index]: !showInput[index] });
    };

    const calculateProgress = (todos) => {
        if (!todos.length) return 0;
        const completedCount = todos.filter((t) => t.completed).length;
        return (completedCount / todos.length) * 100;
    };

    return (
        <div className="todo-tracker-container">
            <h2>Life.io Roadmap</h2>
            <div className="modules-grid">
                {modules.map((module, mIndex) => {
                    const progress = calculateProgress(module.todos);
                    return (
                        <div key={module.name} className="module-card">
                            <div className="module-header">
                                <h3>{module.name}</h3>
                                <span className="progress-text">{Math.round(progress)}%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <ul>
                                {module.todos.map((todo, tIndex) => (
                                    <li key={tIndex} className={todo.completed ? 'completed' : ''}>
                                        <label className="todo-item">
                                            <input
                                                type="checkbox"
                                                checked={todo.completed}
                                                onChange={() => toggleTodo(mIndex, tIndex)}
                                            />
                                            <span className="todo-text">{todo.text || todo}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>

                            <div className="add-task-section">
                                {showInput[mIndex] ? (
                                    <div className="add-task-input-group">
                                        <input
                                            type="text"
                                            placeholder="New task..."
                                            value={newTaskInput[mIndex] || ''}
                                            onChange={(e) =>
                                                setNewTaskInput({
                                                    ...newTaskInput,
                                                    [mIndex]: e.target.value,
                                                })
                                            }
                                            onKeyDown={(e) =>
                                                e.key === 'Enter' && handleAddTask(mIndex)
                                            }
                                        />
                                        <button
                                            onClick={() => handleAddTask(mIndex)}
                                            className="add-btn"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => toggleInputVisibility(mIndex)}
                                            className="cancel-btn"
                                        >
                                            x
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => toggleInputVisibility(mIndex)}
                                        className="show-add-btn"
                                    >
                                        + Add Item
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TodoTracker;
