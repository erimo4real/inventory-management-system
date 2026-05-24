import ClientService from '../services/ClientService.js';

export const getClients = async (req, res, next) => {
  try {
    const { search } = req.query;
    const clients = await ClientService.getAll(search, req.siteId);
    res.json(clients);
  } catch (err) {
    console.error('[Controller getClients] ERROR:', err.message);
    next(err);
  }
};

export const getClientById = async (req, res, next) => {
  try {
    const client = await ClientService.getById(req.params.id, req.siteId);
    res.json(client);
  } catch (err) {
    console.error('[Controller getClientById] ERROR:', err.message);
    next(err);
  }
};

export const getClientStats = async (req, res, next) => {
  try {
    const stats = await ClientService.getStats(req.siteId);
    res.json(stats);
  } catch (err) {
    console.error('[Controller getClientStats] ERROR:', err.message);
    next(err);
  }
};

export const createClient = async (req, res, next) => {
  try {
    const client = await ClientService.create(req.body, req.siteId, req.user.id, req);
    res.status(201).json(client);
  } catch (err) {
    console.error('[Controller createClient] ERROR:', err.message);
    next(err);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const client = await ClientService.update(req.params.id, req.body, req.siteId, req.user.id, req);
    res.json(client);
  } catch (err) {
    console.error('[Controller updateClient] ERROR:', err.message);
    next(err);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    await ClientService.delete(req.params.id, req.siteId, req.user.id, req);
    res.status(204).send();
  } catch (err) {
    console.error('[Controller deleteClient] ERROR:', err.message);
    next(err);
  }
};
