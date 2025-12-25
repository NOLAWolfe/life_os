import qaRepository from '../data/qaRepository.js';

/**
 * QA Service
 * Orchestrates business logic for the Professional Hub.
 */
const qaService = {
    getUserStories: async () => {
        return await qaRepository.findAllStories();
    },

    createUserStory: async (storyData) => {
        // Here we could add logic to sync with external ADO Connectors in Phase 3
        return await qaRepository.saveStory(storyData);
    },

    getBugs: async () => {
        return await qaRepository.findAllBugs();
    },

    createBug: async (bugData) => {
        return await qaRepository.saveBug(bugData);
    },
};

export default qaService;
