import VendorService from '../services/VendorService.js';

export const getVendors = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const vendors = await VendorService.getAll(search, category, req.siteId);
    res.json(vendors);
  } catch (err) {
    console.error('[Controller getVendors] ERROR:', err.message);
    next(err);
  }
};

export const getVendorById = async (req, res, next) => {
  try {
    const vendor = await VendorService.getById(req.params.id, req.siteId);
    res.json(vendor);
  } catch (err) {
    console.error('[Controller getVendorById] ERROR:', err.message);
    next(err);
  }
};

export const getVendorStats = async (req, res, next) => {
  try {
    const stats = await VendorService.getStats(req.siteId);
    res.json(stats);
  } catch (err) {
    console.error('[Controller getVendorStats] ERROR:', err.message);
    next(err);
  }
};

export const getVendorCategories = async (req, res, next) => {
  try {
    const categories = await VendorService.getCategories(req.siteId);
    res.json(categories);
  } catch (err) {
    console.error('[Controller getVendorCategories] ERROR:', err.message);
    next(err);
  }
};

export const createVendor = async (req, res, next) => {
  try {
    const vendor = await VendorService.create(req.body, req.siteId, req.user.id, req);
    res.status(201).json(vendor);
  } catch (err) {
    console.error('[Controller createVendor] ERROR:', err.message);
    next(err);
  }
};

export const updateVendor = async (req, res, next) => {
  try {
    const vendor = await VendorService.update(req.params.id, req.body, req.siteId, req.user.id, req);
    res.json(vendor);
  } catch (err) {
    console.error('[Controller updateVendor] ERROR:', err.message);
    next(err);
  }
};

export const deleteVendor = async (req, res, next) => {
  try {
    await VendorService.delete(req.params.id, req.siteId, req.user.id, req);
    res.status(204).send();
  } catch (err) {
    console.error('[Controller deleteVendor] ERROR:', err.message);
    next(err);
  }
};
