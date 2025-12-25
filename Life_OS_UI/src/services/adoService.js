// --- Azure DevOps (ADO) API Service ---
// Replaced mock data with local file-based API calls.

/**
 * Fetches user stories.
 */
export const getMyUserStories = async () => {
    try {
        const response = await fetch('/api/professional/stories');
        if (!response.ok) throw new Error('Failed to fetch stories');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

/**
 * Fetches bugs.
 */
export const getMyBugs = async () => {
    try {
        const response = await fetch('/api/professional/bugs');
        if (!response.ok) throw new Error('Failed to fetch bugs');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

/**
 * Adds a new user story.
 */
export const addUserStory = async (story) => {
    try {
        const response = await fetch('/api/professional/stories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(story),
        });
        if (!response.ok) throw new Error('Failed to add story');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

/**
 * Adds a new bug.
 */
export const addBug = async (bug) => {
    try {
        const response = await fetch('/api/professional/bugs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bug),
        });
        if (!response.ok) throw new Error('Failed to add bug');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

const adoService = {
    getMyUserStories,
    getMyBugs,
    addUserStory,
    addBug,
};

export default adoService;
