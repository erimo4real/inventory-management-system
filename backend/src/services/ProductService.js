import ProductRepository from '../repositories/ProductRepository.js';
import AuditService from './AuditService.js';

const productRepo = new ProductRepository();

export default class ProductService {
  static async createProduct(data, siteId, userId, req) {
    const existing = await productRepo.findBySku(data.sku, siteId);
    if (existing) {
      const error = new Error('SKU already exists');
      error.status = 400;
      throw error;
    }
    
    const result = await productRepo.create(data, siteId);
    
    await AuditService.logCreate(siteId, userId, 'PRODUCT', result.id, result, req);
    
    return result;
  }

  static async updateProduct(id, data, siteId, userId, req) {
    const existing = await productRepo.findById(id, siteId);
    if (!existing) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    
    if (data.sku && data.sku !== existing.sku) {
      const skuExists = await productRepo.findBySku(data.sku, siteId);
      if (skuExists) {
        const error = new Error('SKU already exists');
        error.status = 400;
        throw error;
      }
    }
    
    const result = await productRepo.update(id, data, siteId);
    
    await AuditService.logUpdate(siteId, userId, 'PRODUCT', id, existing, result, req);
    
    return result;
  }

  static async deleteProduct(id, siteId, userId, req) {
    const existing = await productRepo.findById(id, siteId);
    if (!existing) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    
    const result = await productRepo.delete(id, siteId);
    
    await AuditService.logDelete(siteId, userId, 'PRODUCT', id, existing, req);
    
    return result;
  }

  static async getProduct(id, siteId) {
    const product = await productRepo.findById(id, siteId);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    
    return product;
  }

  static async listProducts(filters, siteId) {
    return await productRepo.findAll({ ...filters, siteId });
  }

  static async getCategories(siteId) {
    return await productRepo.findCategories(siteId);
  }

  static async getLowStockProducts(siteId) {
    return await productRepo.findLowStock(siteId);
  }

  static async getStats(siteId) {
    return await productRepo.getStats(siteId);
  }
}
