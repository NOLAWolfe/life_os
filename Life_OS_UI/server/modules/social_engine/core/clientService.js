import * as repo from '../data/clientRepository.js';

export const getClients = async () => {
  return await repo.getAllClients();
};

export const addClient = async (clientData) => {
  // TODO: Add Zod validation here if not done in UI
  return await repo.createClient(clientData);
};

export const modifyClient = async (id, clientData) => {
  return await repo.updateClient(id, clientData);
};

export const removeClient = async (id) => {
  return await repo.deleteClient(id);
};
