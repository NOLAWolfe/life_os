// --- Spotify API Service ---
// This file will contain all the logic for interacting with the Spotify API.
// For now, it contains placeholder functions that return mock data.

const mockTopTracks = [
    { id: '1', name: 'Song One', artist: 'Artist A' },
    { id: '2', name: 'Song Two', artist: 'Artist B' },
    { id: '3', name: 'Song Three', artist: 'Artist C' },
];

const mockRecommendations = {
    seeds: [{ id: 'seed1', type: 'artist' }],
    tracks: [
        { id: 'rec1', name: 'Recommended Song 1', artist: 'Artist X' },
        { id: 'rec2', name: 'Recommended Song 2', artist: 'Artist Y' },
    ],
};

/**
 * Fetches the user's top tracks.
 * (Currently returns mock data)
 */
export const getTopTracks = async () => {
    console.log("Fetching top tracks (mock)");
    return Promise.resolve(mockTopTracks);
};

/**
 * Fetches recommendations based on seeds (artists, tracks, genres).
 * (Currently returns mock data)
 * @param {object} seed - The seed object for recommendations.
 */
export const getRecommendations = async (seed) => {
    console.log("Fetching recommendations for seed:", seed, "(mock)");
    return Promise.resolve(mockRecommendations);
};

/**
 * Creates a new playlist for the user.
 * (Currently a placeholder)
 * @param {string} name - The name of the playlist.
 * @param {string[]} trackUris - An array of track URIs to add to the playlist.
 */
export const createPlaylist = async (name, trackUris) => {
    console.log("Creating playlist:", { name, trackUris }, "(mock)");
    return Promise.resolve({
        id: `playlist_${Date.now()}`,
        name: name,
        external_urls: { spotify: '#' },
    });
};

/**
 * Analyzes a setlist for key and BPM flow.
 * (Currently returns mock data)
 * @param {string} tracklist - A string of track names, one per line.
 */
export const analyzeSetlist = async (tracklist) => {
    console.log("Analyzing setlist (mock):", tracklist);
    const feedback = [
        "Track 2 -> Track 3: Major key clash (4A -> 8B). This will sound jarring.",
        "Track 4: BPM jump is too aggressive (+15 BPM). Smooth it out.",
        "Overall energy level is flat. Consider adding a peak-time track earlier.",
    ];
    return Promise.resolve(feedback);
};

const spotifyService = {
    getTopTracks,
    getRecommendations,
    createPlaylist,
    analyzeSetlist,
};

export default spotifyService;
