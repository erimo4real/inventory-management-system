import AuditService from '../services/AuditService.js';

export const getSiteAuditLogs = async (req, res, next) => {
  try {
    const { skip = 0, limit = 50, entity_type, user_id, action, start_date, end_date } = req.query;
    
    const logs = await AuditService.getSiteAuditLogs(req.siteId, {
      skip: parseInt(skip),
      limit: parseInt(limit),
      entity_type,
      user_id: user_id ? parseInt(user_id) : null,
      action,
      start_date,
      end_date
    });
    
    res.json(logs);
  } catch (err) {
    console.error('[Controller getSiteAuditLogs] ERROR:', err.message);
    next(err);
  }
};

export const getEntityHistory = async (req, res, next) => {
  try {
    const { entity_type, entity_id } = req.params;
    const logs = await AuditService.getEntityHistory(entity_type, parseInt(entity_id), req.siteId);
    res.json(logs);
  } catch (err) {
    console.error('[Controller getEntityHistory] ERROR:', err.message);
    next(err);
  }
};

export const getAuditStats = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const stats = await AuditService.getStats(req.siteId, parseInt(days));
    res.json(stats);
  } catch (err) {
    console.error('[Controller getAuditStats] ERROR:', err.message);
    next(err);
  }
};
