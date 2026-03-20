import ProductService from '../services/ProductService.js';

export const getProducts = async (req, res, next) => {
  try {
    const { query, category, low_stock, skip = 0, limit = 100 } = req.query;
    
    const products = await ProductService.listProducts({
      query,
      category,
      lowStock: low_stock === 'true',
      skip: parseInt(skip),
      limit: parseInt(limit)
    }, req.siteId);
    
    res.json(products);
  } catch (err) {
    console.error('[Controller getProducts] ERROR:', err.message);
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductService.getProduct(req.params.id, req.siteId);
    res.json(product);
  } catch (err) {
    console.error('[Controller getProductById] ERROR:', err.message);
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await ProductService.createProduct(req.body, req.siteId, req.user.id, req);
    res.status(201).json(product);
  } catch (err) {
    console.error('[Controller createProduct] ERROR:', err.message);
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body, req.siteId, req.user.id, req);
    res.json(product);
  } catch (err) {
    console.error('[Controller updateProduct] ERROR:', err.message);
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await ProductService.deleteProduct(req.params.id, req.siteId, req.user.id, req);
    res.status(204).send();
  } catch (err) {
    console.error('[Controller deleteProduct] ERROR:', err.message);
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await ProductService.getCategories(req.siteId);
    res.json({ categories });
  } catch (err) {
    console.error('[Controller getCategories] ERROR:', err.message);
    next(err);
  }
};

export const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await ProductService.getLowStockProducts(req.siteId);
    res.json(products);
  } catch (err) {
    console.error('[Controller getLowStockProducts] ERROR:', err.message);
    next(err);
  }
};
