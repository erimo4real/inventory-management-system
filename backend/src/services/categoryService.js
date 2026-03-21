import categoryRepository from '../repositories/categoryRepository.js';
import AuditService from './AuditService.js';

class CategoryService {
  async getAll(siteId, type) {
    return await categoryRepository.findAll(siteId, type);
  }

  async getById(id, siteId) {
    const category = await categoryRepository.findById(id, siteId);
    if (!category) {
      throw { status: 404, message: 'Category not found' };
    }
    return category;
  }

  async create(categoryData, siteId, userId) {
    const existing = await categoryRepository.findByName(
      categoryData.name,
      categoryData.type,
      siteId
    );
    if (existing) {
      throw { status: 400, message: 'Category with this name already exists' };
    }

    const category = await categoryRepository.create(categoryData, siteId);
    
    await AuditService.log({
      userId,
      siteId,
      action: 'CREATE',
      entityType: 'category',
      entityId: category.id,
      newData: category
    });

    return category;
  }

  async update(id, categoryData, siteId, userId) {
    const existing = await categoryRepository.findById(id, siteId);
    if (!existing) {
      throw { status: 404, message: 'Category not found' };
    }

    if (categoryData.name && categoryData.name !== existing.name) {
      const duplicate = await categoryRepository.findByName(
        categoryData.name,
        existing.type,
        siteId
      );
      if (duplicate) {
        throw { status: 400, message: 'Category with this name already exists' };
      }
    }

    const category = await categoryRepository.update(id, categoryData, siteId);

    await AuditService.log({
      userId,
      siteId,
      action: 'UPDATE',
      entityType: 'category',
      entityId: id,
      oldData: existing,
      newData: category
    });

    return category;
  }

  async delete(id, siteId, userId) {
    const existing = await categoryRepository.findById(id, siteId);
    if (!existing) {
      throw { status: 404, message: 'Category not found' };
    }

    const deleted = await categoryRepository.delete(id, siteId);

    await AuditService.log({
      userId,
      siteId,
      action: 'DELETE',
      entityType: 'category',
      entityId: id,
      oldData: existing
    });

    return deleted;
  }

  async getStats(siteId) {
    return await categoryRepository.getStats(siteId);
  }
}

export default new CategoryService();
