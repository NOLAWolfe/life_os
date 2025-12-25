import React, { useState, useEffect } from 'react';
import spotifyService from '../services/spotifyService';
import '../pages/Page.css';
import './CreativePage.css';

const SocialHubPage = () => {
    const [topTracks, setTopTracks] = useState([]);

    useEffect(() => {
        spotifyService.getTopTracks().then((tracks) => {
            setTopTracks(tracks);
        });
    }, []);

    return (
        <div className="page-container">
            <header className="page-header mb-6">
                <h1>Social Hub</h1>
                <p>Monitor your social presence and brand engagement.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
                    <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
                        🎵 Spotify Engagement
                    </h3>
                    <ul className="space-y-2">
                        {topTracks.map((track) => (
                            <li key={track.id} className="text-sm text-[var(--text-secondary)]">
                                <strong className="text-[var(--text-primary)]">{track.name}</strong>{' '}
                                by {track.artist}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] border-dashed">
                    <h3 className="text-lg font-bold mb-4 text-[var(--text-tertiary)] text-center">
                        Brand Stats (Placeholder)
                    </h3>
                    <p className="text-sm text-center text-[var(--text-tertiary)] italic">
                        Instagram/TikTok integration planned for next quarter.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SocialHubPage;
