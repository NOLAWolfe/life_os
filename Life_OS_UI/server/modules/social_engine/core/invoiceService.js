import * as repo from '../data/invoiceRepository.js';
import prisma from '../../../shared/db.js';

const generateInvoiceNumber = async () => {
    const year = new Date().getFullYear();
    // Find the last invoice created this year
    const lastInvoice = await prisma.invoice.findFirst({
        where: { number: { startsWith: `INV-${year}` } },
        orderBy: { number: 'desc' },
    });

    let nextNum = 1;
    if (lastInvoice) {
        const parts = lastInvoice.number.split('-');
        if (parts.length === 3) {
            nextNum = parseInt(parts[2], 10) + 1;
        }
    }

    return `INV-${year}-${String(nextNum).padStart(3, '0')}`;
};

export const getInvoices = async () => {
    return await repo.getAllInvoices();
};

export const addInvoice = async (invoiceData) => {
    // Auto-generate number if not provided
    if (!invoiceData.number) {
        invoiceData.number = await generateInvoiceNumber();
    }

    // Ensure items is a string (if passed as object)
    if (typeof invoiceData.items === 'object') {
        invoiceData.items = JSON.stringify(invoiceData.items);
    }

    return await repo.createInvoice(invoiceData);
};

export const modifyInvoice = async (id, invoiceData) => {
    if (typeof invoiceData.items === 'object') {
        invoiceData.items = JSON.stringify(invoiceData.items);
    }
    return await repo.updateInvoice(id, invoiceData);
};

export const removeInvoice = async (id) => {
    return await repo.deleteInvoice(id);
};
