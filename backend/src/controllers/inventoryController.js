import InventoryService from '../services/InventoryService.js';

export const stockIn = async (req, res, next) => {
  try {
    const transaction = await InventoryService.stockIn(req.body, req.siteId, req.user.id, req);
    res.status(201).json(transaction);
  } catch (err) {
    console.error('[Controller stockIn] ERROR:', err.message);
    next(err);
  }
};

export const stockOut = async (req, res, next) => {
  try {
    const transaction = await InventoryService.stockOut(req.body, req.siteId, req.user.id, req);
    res.status(201).json(transaction);
  } catch (err) {
    console.error('[Controller stockOut] ERROR:', err.message);
    next(err);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const transaction = await InventoryService.adjustStock(req.params.product_id, req.body, req.siteId, req.user.id, req);
    res.json(transaction);
  } catch (err) {
    console.error('[Controller adjustStock] ERROR:', err.message);
    next(err);
  }
};

export const getProductHistory = async (req, res, next) => {
  try {
    const { skip = 0, limit = 100 } = req.query;
    const history = await InventoryService.getProductHistory(
      req.params.product_id, 
      req.siteId,
      { skip: parseInt(skip), limit: parseInt(limit) }
    );
    res.json(history);
  } catch (err) {
    console.error('[Controller getProductHistory] ERROR:', err.message);
    next(err);
  }
};

export const getRecentTransactions = async (req, res, next) => {
  try {
    const { days = 30, skip = 0, limit = 100 } = req.query;
    const transactions = await InventoryService.getRecentTransactions(req.siteId, {
      days: parseInt(days),
      skip: parseInt(skip),
      limit: parseInt(limit)
    });
    res.json(transactions);
  } catch (err) {
    console.error('[Controller getRecentTransactions] ERROR:', err.message);
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await InventoryService.getDashboardStats(req.siteId);
    res.json(stats);
  } catch (err) {
    console.error('[Controller getDashboardStats] ERROR:', err.message);
    next(err);
  }
};
