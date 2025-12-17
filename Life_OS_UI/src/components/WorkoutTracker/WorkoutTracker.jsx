import React, { useState, useEffect } from 'react';
import './WorkoutTracker.css';

const WorkoutTracker = () => {
    const [templates, setTemplates] = useState({});
    const [logs, setLogs] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        fetch('/api/workout-templates')
            .then(res => res.json())
            .then(data => setTemplates(data))
            .catch(err => console.error("Failed to fetch workout templates:", err));

        fetch('/api/workout-logs')
            .then(res => res.json())
            .then(data => setLogs(data.sort((a, b) => new Date(b.date) - new Date(a.date)))) // Sort logs by date descending
            .catch(err => console.error("Failed to fetch workout logs:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTemplate || !duration) {
            alert("Please select a workout and enter the duration.");
            return;
        }

        const newLog = {
            template_name: selectedTemplate,
            date: new Date().toISOString().split('T')[0],
            duration_minutes: parseInt(duration, 10),
            // In a real app, you'd have a more detailed form to fill this out
            exercises: templates[selectedTemplate]?.exercises.map(ex => ({ name: ex, sets: [] })) || []
        };

        try {
            const response = await fetch('/api/workout-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLog),
            });

            if (response.ok) {
                const savedLog = await response.json();
                setLogs([savedLog.log, ...logs]);
                setSelectedTemplate('');
                setDuration('');
            } else {
                console.error("Failed to save workout log");
            }
        } catch (error) {
            console.error("Error saving workout log:", error);
        }
    };

    return (
        <div className="workout-tracker-container">
            <h2>Workout Tracker</h2>
            
            <div className="workout-logging-form">
                <h3>Log a New Workout</h3>
                <form onSubmit={handleSubmit}>
                    <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} required>
                        <option value="">-- Select a Workout --</option>
                        {Object.keys(templates).map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        placeholder="Duration (in minutes)"
                        required
                    />
                    <button type="submit">Log Workout</button>
                </form>
            </div>

            <div className="workout-history">
                <h3>Workout History</h3>
                {logs.map(log => (
                    <div key={log.id} className="log-entry">
                        <h4>{log.template_name} - {log.date} ({log.duration_minutes} mins)</h4>
                        <ul>
                            {log.exercises.map((ex, index) => (
                                <li key={index}>
                                    <strong>{ex.name}</strong>
                                    {ex.sets.length > 0 ? (
                                        <ul className="sets-list">
                                            {ex.sets.map(set => (
                                                <li key={set.set}>
                                                    Set {set.set}: {set.reps} reps @ {set.weight_lbs} lbs (Intensity: {set.intensity}/5)
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="no-sets-data">No specific set data logged for this exercise.</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutTracker;