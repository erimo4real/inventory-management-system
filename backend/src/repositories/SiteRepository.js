import pool from '../config/db.js';

export default class SiteRepository {
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM sites WHERE is_active = true ORDER BY name'
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM sites WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findBySlug(slug) {
    const result = await pool.query('SELECT * FROM sites WHERE slug = $1', [slug]);
    return result.rows[0];
  }

  async create(data) {
    const { name, slug, address, phone, email } = data;
    const result = await pool.query(
      `INSERT INTO sites (name, slug, address, phone, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, slug, address, phone, email]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'slug', 'address', 'phone', 'email', 'is_active'];

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramCount++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE sites SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      'UPDATE sites SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  async getUserSites(userId) {
    const result = await pool.query(
      `SELECT s.*, us.role as user_role, us.is_active as access_active
       FROM sites s
       INNER JOIN user_sites us ON s.id = us.site_id
       WHERE us.user_id = $1 AND s.is_active = true AND us.is_active = true
       ORDER BY s.name`,
      [userId]
    );
    return result.rows;
  }

  async addUserToSite(userId, siteId, role = 'staff') {
    const result = await pool.query(
      `INSERT INTO user_sites (user_id, site_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, site_id) DO UPDATE SET role = $3, is_active = true
       RETURNING *`,
      [userId, siteId, role]
    );
    return result.rows[0];
  }

  async removeUserFromSite(userId, siteId) {
    await pool.query(
      'UPDATE user_sites SET is_active = false WHERE user_id = $1 AND site_id = $2',
      [userId, siteId]
    );
  }

  async getSiteUsers(siteId) {
    const result = await pool.query(
      `SELECT u.*, us.role as site_role
       FROM users u
       INNER JOIN user_sites us ON u.id = us.user_id
       WHERE us.site_id = $1 AND u.is_active = true AND us.is_active = true
       ORDER BY u.name`,
      [siteId]
    );
    return result.rows;
  }
}
