import SiteRepository from '../repositories/SiteRepository.js';

const siteRepo = new SiteRepository();

export default class SiteService {
  static async getAll() {
    return await siteRepo.findAll();
  }

  static async getById(id) {
    const site = await siteRepo.findById(id);
    if (!site) {
      const error = new Error('Site not found');
      error.status = 404;
      throw error;
    }
    return site;
  }

  static async getBySlug(slug) {
    const site = await siteRepo.findBySlug(slug);
    if (!site) {
      const error = new Error('Site not found');
      error.status = 404;
      throw error;
    }
    return site;
  }

  static async create(data) {
    if (!data.name || data.name.trim() === '') {
      const error = new Error('Site name is required');
      error.status = 400;
      throw error;
    }
    if (!data.slug || data.slug.trim() === '') {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    return await siteRepo.create(data);
  }

  static async update(id, data) {
    const existing = await siteRepo.findById(id);
    if (!existing) {
      const error = new Error('Site not found');
      error.status = 404;
      throw error;
    }
    return await siteRepo.update(id, data);
  }

  static async delete(id) {
    const existing = await siteRepo.findById(id);
    if (!existing) {
      const error = new Error('Site not found');
      error.status = 404;
      throw error;
    }
    return await siteRepo.delete(id);
  }

  static async getUserSites(userId) {
    return await siteRepo.getUserSites(userId);
  }

  static async addUserToSite(userId, siteId, role = 'staff') {
    return await siteRepo.addUserToSite(userId, siteId, role);
  }

  static async removeUserFromSite(userId, siteId) {
    await siteRepo.removeUserFromSite(userId, siteId);
  }

  static async getSiteUsers(siteId) {
    return await siteRepo.getSiteUsers(siteId);
  }
}
