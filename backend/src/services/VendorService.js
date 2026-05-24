import VendorRepository from '../repositories/VendorRepository.js';
import AuditService from './AuditService.js';

const vendorRepo = new VendorRepository();

export default class VendorService {
  static async getAll(search = null, category = null, siteId) {
    return await vendorRepo.findAll(siteId, search, category);
  }

  static async getById(id, siteId) {
    const vendor = await vendorRepo.findById(id, siteId);
    if (!vendor) {
      const error = new Error('Vendor not found');
      error.status = 404;
      throw error;
    }
    return vendor;
  }

  static async getStats(siteId) {
    return await vendorRepo.getStats(siteId);
  }

  static async getCategories(siteId) {
    return await vendorRepo.getCategories(siteId);
  }

  static async create(data, siteId, userId, req) {
    if (!data.name || data.name.trim() === '') {
      const error = new Error('Vendor name is required');
      error.status = 400;
      throw error;
    }
    const result = await vendorRepo.create(data, siteId);
    await AuditService.logCreate(siteId, userId, 'VENDOR', result.id, result, req);
    return result;
  }

  static async update(id, data, siteId, userId, req) {
    const existing = await vendorRepo.findById(id, siteId);
    if (!existing) {
      const error = new Error('Vendor not found');
      error.status = 404;
      throw error;
    }
    const result = await vendorRepo.update(id, data, siteId);
    await AuditService.logUpdate(siteId, userId, 'VENDOR', id, existing, result, req);
    return result;
  }

  static async delete(id, siteId, userId, req) {
    const existing = await vendorRepo.findById(id, siteId);
    if (!existing) {
      const error = new Error('Vendor not found');
      error.status = 404;
      throw error;
    }
    const result = await vendorRepo.delete(id, siteId);
    await AuditService.logDelete(siteId, userId, 'VENDOR', id, existing, req);
    return result;
  }
}
