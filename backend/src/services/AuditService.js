import AuditLogRepository from '../repositories/AuditLogRepository.js';

const auditRepo = new AuditLogRepository();

export default class AuditService {
  static async log({ siteId, userId, action, entityType, entityId, oldData, newData, req }) {
    const ipAddress = req?.ip || req?.connection?.remoteAddress || null;
    const userAgent = req?.headers?.['user-agent'] || null;
    
    return await auditRepo.create({
      site_id: siteId,
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_data: oldData,
      new_data: newData,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  static async getSiteAuditLogs(siteId, filters = {}) {
    return await auditRepo.findBySite(siteId, filters);
  }

  static async getEntityHistory(entityType, entityId, siteId) {
    return await auditRepo.findByEntity(entityType, entityId, siteId);
  }

  static async getStats(siteId, days = 30) {
    return await auditRepo.getStats(siteId, { days });
  }

  static async logLogin(siteId, userId, req) {
    return await this.log({
      siteId,
      userId,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: userId,
      req
    });
  }

  static async logLogout(siteId, userId, req) {
    return await this.log({
      siteId,
      userId,
      action: 'LOGOUT',
      entityType: 'USER',
      entityId: userId,
      req
    });
  }

  static async logCreate(siteId, userId, entityType, entityId, data, req) {
    return await this.log({
      siteId,
      userId,
      action: 'CREATE',
      entityType,
      entityId,
      newData: data,
      req
    });
  }

  static async logUpdate(siteId, userId, entityType, entityId, oldData, newData, req) {
    return await this.log({
      siteId,
      userId,
      action: 'UPDATE',
      entityType,
      entityId,
      oldData,
      newData,
      req
    });
  }

  static async logDelete(siteId, userId, entityType, entityId, data, req) {
    return await this.log({
      siteId,
      userId,
      action: 'DELETE',
      entityType,
      entityId,
      oldData: data,
      req
    });
  }
}
