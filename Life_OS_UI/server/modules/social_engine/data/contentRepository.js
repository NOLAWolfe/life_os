import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const contentRepository = {
    findAll: async () => {
        return await prisma.contentItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
    },

    findById: async (id) => {
        return await prisma.contentItem.findUnique({ where: { id } });
    },

    create: async (data) => {
        return await prisma.contentItem.create({ data });
    },

    update: async (id, data) => {
        return await prisma.contentItem.update({
            where: { id },
            data
        });
    },

    delete: async (id) => {
        return await prisma.contentItem.delete({ where: { id } });
    }
};

export default contentRepository;
