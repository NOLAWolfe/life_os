import prisma from '../../../shared/db.js';

const dailyReadsRepository = {
    getAll: async () => {
        return await prisma.dailyRead.findMany({
            orderBy: { title: 'asc' },
        });
    },

    create: async (data) => {
        return await prisma.dailyRead.create({
            data: {
                title: data.title,
                author: data.author,
                type: data.type,
                status: data.status || 'in_progress',
                progress: data.progress || 0,
                total: data.total || 100,
                link: data.link,
                notes: data.notes,
            },
        });
    },

    update: async (id, data) => {
        return await prisma.dailyRead.update({
            where: { id: parseInt(id) },
            data,
        });
    },

    delete: async (id) => {
        return await prisma.dailyRead.delete({
            where: { id: parseInt(id) },
        });
    },
};

export default dailyReadsRepository;
