import categoryService from '../services/categoryService.js';

class CategoryController {
  async getAll(req, res, next) {
    try {
      const { type } = req.query;
      const categories = await categoryService.getAll(req.siteId, type);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const category = await categoryService.getById(
        req.params.id,
        req.siteId
      );
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const category = await categoryService.create(
        req.body,
        req.siteId,
        req.user.id,
        req
      );
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const category = await categoryService.update(
        req.params.id,
        req.body,
        req.siteId,
        req.user.id,
        req
      );
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await categoryService.delete(req.params.id, req.siteId, req.user.id, req);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await categoryService.getStats(req.siteId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
