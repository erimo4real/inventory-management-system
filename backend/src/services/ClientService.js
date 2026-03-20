import ClientRepository from '../repositories/ClientRepository.js';
import AuditService from './AuditService.js';

const clientRepo = new ClientRepository();

export default class ClientService {
  static async getAll(search = null, siteId) {
    return await clientRepo.findAll(siteId, search);
  }

  static async getById(id, siteId) {
    const client = await clientRepo.findById(id, siteId);
    if (!client) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }
    return client;
  }

  static async getStats(siteId) {
    return await clientRepo.getStats(siteId);
  }

  static async create(data, siteId, userId, req) {
    if (!data.name || data.name.trim() === '') {
      const error = new Error('Client name is required');
      error.status = 400;
      throw error;
    }
    const result = await clientRepo.create(data, siteId);
    await AuditService.logCreate(siteId, userId, 'CLIENT', result.id, result, req);
    return result;
  }

  static async update(id, data, siteId, userId, req) {
    const existing = await clientRepo.findById(id, siteId);
    if (!existing) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }
    const result = await clientRepo.update(id, data, siteId);
    await AuditService.logUpdate(siteId, userId, 'CLIENT', id, existing, result, req);
    return result;
  }

  static async delete(id, siteId, userId, req) {
    const existing = await clientRepo.findById(id, siteId);
    if (!existing) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }
    const result = await clientRepo.delete(id, siteId);
    await AuditService.logDelete(siteId, userId, 'CLIENT', id, existing, req);
    return result;
  }
}
