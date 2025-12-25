import prisma from '../../../shared/db.js';

export const getAllInvoices = async () => {
    return await prisma.invoice.findMany({
        orderBy: { date: 'desc' },
        include: { client: true },
    });
};

export const createInvoice = async (data) => {
    // Generate sequential number if not provided (simple version)
    // In a real app, we'd look up the last number and increment.
    // For V1, we'll let the service handle or pass it in.
    return await prisma.invoice.create({
        data,
    });
};

export const updateInvoice = async (id, data) => {
    return await prisma.invoice.update({
        where: { id },
        data,
    });
};

export const deleteInvoice = async (id) => {
    return await prisma.invoice.delete({
        where: { id },
    });
};
