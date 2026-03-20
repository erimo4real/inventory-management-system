import SiteService from '../services/SiteService.js';

export const getSites = async (req, res, next) => {
  try {
    const sites = await SiteService.getAll();
    res.json(sites);
  } catch (err) {
    console.error('[Controller getSites] ERROR:', err.message);
    next(err);
  }
};

export const getSiteById = async (req, res, next) => {
  try {
    const site = await SiteService.getById(req.params.id);
    res.json(site);
  } catch (err) {
    console.error('[Controller getSiteById] ERROR:', err.message);
    next(err);
  }
};

export const createSite = async (req, res, next) => {
  try {
    const site = await SiteService.create(req.body);
    res.status(201).json(site);
  } catch (err) {
    console.error('[Controller createSite] ERROR:', err.message);
    next(err);
  }
};

export const updateSite = async (req, res, next) => {
  try {
    const site = await SiteService.update(req.params.id, req.body);
    res.json(site);
  } catch (err) {
    console.error('[Controller updateSite] ERROR:', err.message);
    next(err);
  }
};

export const deleteSite = async (req, res, next) => {
  try {
    await SiteService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('[Controller deleteSite] ERROR:', err.message);
    next(err);
  }
};

export const getUserSites = async (req, res, next) => {
  try {
    const sites = await SiteService.getUserSites(req.user.id);
    res.json(sites);
  } catch (err) {
    console.error('[Controller getUserSites] ERROR:', err.message);
    next(err);
  }
};

export const addUserToSite = async (req, res, next) => {
  try {
    const { user_id, site_id, role } = req.body;
    const result = await SiteService.addUserToSite(user_id, site_id, role || 'staff');
    res.status(201).json(result);
  } catch (err) {
    console.error('[Controller addUserToSite] ERROR:', err.message);
    next(err);
  }
};

export const removeUserFromSite = async (req, res, next) => {
  try {
    const { user_id, site_id } = req.body;
    await SiteService.removeUserFromSite(user_id, site_id);
    res.status(204).send();
  } catch (err) {
    console.error('[Controller removeUserFromSite] ERROR:', err.message);
    next(err);
  }
};

export const getSiteUsers = async (req, res, next) => {
  try {
    const users = await SiteService.getSiteUsers(req.params.id);
    res.json(users);
  } catch (err) {
    console.error('[Controller getSiteUsers] ERROR:', err.message);
    next(err);
  }
};
