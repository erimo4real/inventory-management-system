import pool from '../config/db.js';

export default class AuditLogRepository {
  async create(data) {
    const { site_id, user_id, action, entity_type, entity_id, old_data, new_data, ip_address } = data;
    const result = await pool.query(
      `INSERT INTO audit_logs (site_id, user_id, action, entity_type, entity_id, old_data, new_data, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [site_id, user_id, action, entity_type, entity_id, 
       old_data ? JSON.stringify(old_data) : null, 
       new_data ? JSON.stringify(new_data) : null, 
       ip_address]
    );
    return result.rows[0];
  }

  async findBySite(siteId, { skip = 0, limit = 50, entity_type, user_id, action, start_date, end_date }) {
    let query = `
      SELECT al.*, u.name as user_name, u.email as user_email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.site_id = $1
    `;
    const params = [siteId];
    let paramIndex = 2;

    if (entity_type) {
      query += ` AND al.entity_type = $${paramIndex}`;
      params.push(entity_type);
      paramIndex++;
    }

    if (user_id) {
      query += ` AND al.user_id = $${paramIndex}`;
      params.push(user_id);
      paramIndex++;
    }

    if (action) {
      query += ` AND al.action = $${paramIndex}`;
      params.push(action);
      paramIndex++;
    }

    if (start_date) {
      query += ` AND al.created_at >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      query += ` AND al.created_at <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }

    query += ` ORDER BY al.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, skip);

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findByEntity(entityType, entityId, siteId) {
    const result = await pool.query(
      `SELECT al.*, u.name as user_name
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       WHERE al.entity_type = $1 AND al.entity_id = $2 AND al.site_id = $3
       ORDER BY al.created_at DESC`,
      [entityType, entityId, siteId]
    );
    return result.rows;
  }

  async getStats(siteId, { days = 30 }) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_actions,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT entity_type) as entity_types,
        COUNT(*) FILTER (WHERE action = 'CREATE') as creates,
        COUNT(*) FILTER (WHERE action = 'UPDATE') as updates,
        COUNT(*) FILTER (WHERE action = 'DELETE') as deletes
      FROM audit_logs 
      WHERE site_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'
    `, [siteId]);
    return result.rows[0];
  }
}
