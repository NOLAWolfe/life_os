import React, { useState, useEffect } from 'react';
import spotifyService from '../services/spotifyService';
import SetlistCritic from '../components/SocialHub/SetlistCritic/SetlistCritic';
import '../pages/Page.css';
import './CreativePage.css';

const CreativePage = () => {
    const [topTracks, setTopTracks] = useState([]);

    useEffect(() => {
        spotifyService.getTopTracks().then(tracks => {
            setTopTracks(tracks);
        });
    }, []);

    return (
        <div className="page-container">
            <h1>Creative Hub</h1>
            <p>This page will host your creative tools, starting with a Spotify assistant.</p>
            
            <div className="creative-grid">
                <div className="spotify-widget">
                    <h3>Your Top Tracks (Mock Data)</h3>
                    <ul>
                        {topTracks.map(track => (
                            <li key={track.id}>
                                <strong>{track.name}</strong> by {track.artist}
                            </li>
                        ))}
                    </ul>
                </div>
                <SetlistCritic />
            </div>
        </div>
    );
};

export default CreativePage;
