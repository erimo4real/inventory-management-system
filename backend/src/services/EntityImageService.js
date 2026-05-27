import UploadService from './UploadService.js';
import ProductRepository from '../repositories/ProductRepository.js';
import SupplierRepository from '../repositories/SupplierRepository.js';
import ClientRepository from '../repositories/ClientRepository.js';
import VendorRepository from '../repositories/VendorRepository.js';
import SiteRepository from '../repositories/SiteRepository.js';

const repos = {
  product: { repo: new ProductRepository(), urlField: 'image_url', pubField: 'image_public_id', folder: 'products' },
  supplier: { repo: new SupplierRepository(), urlField: 'image_url', pubField: 'image_public_id', folder: 'suppliers' },
  client: { repo: new ClientRepository(), urlField: 'image_url', pubField: 'image_public_id', folder: 'clients' },
  vendor: { repo: new VendorRepository(), urlField: 'image_url', pubField: 'image_public_id', folder: 'vendors' },
  site: { repo: new SiteRepository(), urlField: 'logo_url', pubField: 'logo_public_id', folder: 'sites' }
};

export default class EntityImageService {
  static async updateImage(entityType, entityId, file, siteId) {
    const config = repos[entityType];
    if (!config) {
      const error = new Error(`Unknown entity type: ${entityType}`);
      error.status = 400;
      throw error;
    }

    const current = entityType === 'site'
      ? await config.repo.findById(entityId)
      : await config.repo.findById(entityId, siteId);
    if (!current) {
      const error = new Error(`${entityType} not found`);
      error.status = 404;
      throw error;
    }

    const oldPublicId = current[config.pubField];
    if (oldPublicId) {
      try {
        await UploadService.deleteImage(oldPublicId);
      } catch (err) {
        console.error(`[EntityImageService] Failed to delete old ${entityType} image:`, err.message);
      }
    }

    const result = await UploadService.uploadImage(file, { folder: config.folder });
    const updateData = {};
    updateData[config.urlField] = result.url;
    updateData[config.pubField] = result.public_id;

    await config.repo.update(entityId, updateData, siteId);

    return { url: result.url, public_id: result.public_id };
  }

  static async deleteImage(entityType, entityId, siteId) {
    const config = repos[entityType];
    if (!config) {
      const error = new Error(`Unknown entity type: ${entityType}`);
      error.status = 400;
      throw error;
    }

    const current = entityType === 'site'
      ? await config.repo.findById(entityId)
      : await config.repo.findById(entityId, siteId);
    if (!current || !current[config.pubField]) return { deleted: false };

    await UploadService.deleteImage(current[config.pubField]);
    const updateData = {};
    updateData[config.urlField] = null;
    updateData[config.pubField] = null;

    await config.repo.update(entityId, updateData, siteId);

    return { deleted: true };
  }
}