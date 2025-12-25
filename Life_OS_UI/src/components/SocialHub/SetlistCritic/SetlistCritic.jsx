import React, { useState } from 'react';
import spotifyService from '../../../services/spotifyService';
import './SetlistCritic.css';

const SetlistCritic = () => {
    const [tracklist, setTracklist] = useState('');
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tracklist) {
            alert('Please enter a tracklist to analyze.');
            return;
        }
        setLoading(true);
        const result = await spotifyService.analyzeSetlist(tracklist);
        setFeedback(result);
        setLoading(false);
    };

    return (
        <div className="setlist-critic-widget">
            <h3>Setlist Critic</h3>
            <p>Enter your setlist below (one track per line) for analysis.</p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={tracklist}
                    onChange={(e) => setTracklist(e.target.value)}
                    placeholder="Song 1 by Artist A&#10;Song 2 by Artist B&#10;Song 3 by Artist C"
                    rows="10"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Setlist'}
                </button>
            </form>
            {feedback.length > 0 && (
                <div className="feedback-container">
                    <h4>Analysis Results:</h4>
                    <ul>
                        {feedback.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SetlistCritic;
