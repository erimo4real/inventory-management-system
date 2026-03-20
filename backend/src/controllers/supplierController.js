import SupplierService from '../services/SupplierService.js';

export const getSuppliers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const suppliers = await SupplierService.getAll(search, req.siteId);
    res.json(suppliers);
  } catch (err) {
    console.error('[Controller getSuppliers] ERROR:', err.message);
    next(err);
  }
};

export const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await SupplierService.getById(req.params.id, req.siteId);
    res.json(supplier);
  } catch (err) {
    console.error('[Controller getSupplierById] ERROR:', err.message);
    next(err);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const supplier = await SupplierService.create(req.body, req.siteId, req.user.id, req);
    res.status(201).json(supplier);
  } catch (err) {
    console.error('[Controller createSupplier] ERROR:', err.message);
    next(err);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await SupplierService.update(req.params.id, req.body, req.siteId, req.user.id, req);
    res.json(supplier);
  } catch (err) {
    console.error('[Controller updateSupplier] ERROR:', err.message);
    next(err);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    await SupplierService.delete(req.params.id, req.siteId, req.user.id, req);
    res.status(204).send();
  } catch (err) {
    console.error('[Controller deleteSupplier] ERROR:', err.message);
    next(err);
  }
};
