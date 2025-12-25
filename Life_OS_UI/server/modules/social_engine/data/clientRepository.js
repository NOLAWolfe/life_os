import prisma from '../../../shared/db.js';

export const getAllClients = async () => {
  return await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: { invoices: true }
  });
};

export const createClient = async (data) => {
  return await prisma.client.create({
    data
  });
};

export const updateClient = async (id, data) => {
  return await prisma.client.update({
    where: { id },
    data
  });
};

export const deleteClient = async (id) => {
  return await prisma.client.delete({
    where: { id }
  });
};
