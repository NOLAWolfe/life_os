import contentRepository from '../data/contentRepository.js';

const contentService = {
    getAllContent: async () => {
        return await contentRepository.findAll();
    },

    createContent: async (contentData) => {
        // Validation logic can go here
        return await contentRepository.create(contentData);
    },

    updateContent: async (id, updateData) => {
        return await contentRepository.update(id, updateData);
    },

    deleteContent: async (id) => {
        return await contentRepository.delete(id);
    }
};

export default contentService;
