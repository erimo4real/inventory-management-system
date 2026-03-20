import categoryService from '../services/categoryService.js';

class CategoryController {
  async getAll(req, res) {
    try {
      const { type } = req.query;
      const categories = await categoryService.getAll(req.siteId, type);
      res.json(categories);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const category = await categoryService.getById(
        req.params.id,
        req.siteId
      );
      res.json(category);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const category = await categoryService.create(
        req.body,
        req.siteId,
        req.userId
      );
      res.status(201).json(category);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const category = await categoryService.update(
        req.params.id,
        req.body,
        req.siteId,
        req.userId
      );
      res.json(category);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await categoryService.delete(req.params.id, req.siteId, req.userId);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  }

  async getStats(req, res) {
    try {
      const stats = await categoryService.getStats(req.siteId);
      res.json(stats);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ error: error.message });
    }
  }
}

export default new CategoryController();
