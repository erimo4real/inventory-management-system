import SupplierRepository from '../repositories/SupplierRepository.js';
import AuditService from './AuditService.js';

const supplierRepo = new SupplierRepository();

export default class SupplierService {
  static async getAll(search = null, siteId) {
    return await supplierRepo.findAll(siteId, search);
  }

  static async getById(id, siteId) {
    const supplier = await supplierRepo.findById(id, siteId);
    if (!supplier) {
      const error = new Error('Supplier not found');
      error.status = 404;
      throw error;
    }
    return supplier;
  }

  static async create(data, siteId, userId, req) {
    const result = await supplierRepo.create(data, siteId);
    await AuditService.logCreate(siteId, userId, 'SUPPLIER', result.id, result, req);
    return result;
  }

  static async update(id, data, siteId, userId, req) {
    const existing = await supplierRepo.findById(id, siteId);
    if (!existing) {
      const error = new Error('Supplier not found');
      error.status = 404;
      throw error;
    }
    const result = await supplierRepo.update(id, data, siteId);
    await AuditService.logUpdate(siteId, userId, 'SUPPLIER', id, existing, result, req);
    return result;
  }

  static async delete(id, siteId, userId, req) {
    const existing = await supplierRepo.findById(id, siteId);
    if (!existing) {
      const error = new Error('Supplier not found');
      error.status = 404;
      throw error;
    }
    const result = await supplierRepo.delete(id, siteId);
    await AuditService.logDelete(siteId, userId, 'SUPPLIER', id, existing, req);
    return result;
  }
}
