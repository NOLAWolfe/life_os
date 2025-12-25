import prisma from '../../../shared/db.js';

/**
 * QA Repository
 * Data access layer for User Stories and Bugs.
 */
const qaRepository = {
    // --- User Stories ---
    findAllStories: async () => {
        return await prisma.userStory.findMany({
            orderBy: { createdAt: 'desc' },
        });
    },

    saveStory: async (data) => {
        if (data.id) {
            return await prisma.userStory.update({
                where: { id: parseInt(data.id) },
                data: {
                    title: data.title,
                    description: data.description,
                    state: data.state,
                    assignedTo: data.assignedTo,
                    acceptanceCriteria: data.acceptanceCriteria,
                },
            });
        }
        return await prisma.userStory.create({
            data: {
                title: data.title,
                description: data.description,
                state: data.state || 'New',
                assignedTo: data.assignedTo,
                acceptanceCriteria: data.acceptanceCriteria,
            },
        });
    },

    deleteStory: async (id) => {
        return await prisma.userStory.delete({
            where: { id: parseInt(id) },
        });
    },

    // --- Bugs ---
    findAllBugs: async () => {
        return await prisma.bug.findMany({
            orderBy: { createdAt: 'desc' },
        });
    },

    saveBug: async (data) => {
        if (data.id) {
            return await prisma.bug.update({
                where: { id: parseInt(data.id) },
                data: {
                    title: data.title,
                    state: data.state,
                    severity: parseInt(data.severity),
                },
            });
        }
        return await prisma.bug.create({
            data: {
                title: data.title,
                state: data.state || 'Active',
                severity: parseInt(data.severity) || 3,
            },
        });
    },

    deleteBug: async (id) => {
        return await prisma.bug.delete({
            where: { id: parseInt(id) },
        });
    },
};

export default qaRepository;
