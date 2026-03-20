import pool from '../config/db.js';

export default class SupplierRepository {
  async findAll(siteId, search = null) {
    let query = 'SELECT * FROM suppliers WHERE is_active = true AND site_id = $1';
    const params = [siteId];

    if (search) {
      query += ` AND (name ILIKE $2 OR email ILIKE $2 OR phone ILIKE $2)`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY name';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id, siteId) {
    const result = await pool.query('SELECT * FROM suppliers WHERE id = $1 AND site_id = $2', [id, siteId]);
    return result.rows[0];
  }

  async create(data, siteId) {
    const { name, contact_person, email, phone, address } = data;
    const result = await pool.query(
      `INSERT INTO suppliers (site_id, name, contact_person, email, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [siteId, name, contact_person, email, phone, address]
    );
    return result.rows[0];
  }

  async update(id, data, siteId) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'contact_person', 'email', 'phone', 'address', 'is_active'];

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramCount++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    values.push(siteId);

    const result = await pool.query(
      `UPDATE suppliers SET ${fields.join(', ')} WHERE id = $${paramCount} AND site_id = $${paramCount + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id, siteId) {
    const result = await pool.query(
      'UPDATE suppliers SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND site_id = $2 RETURNING id',
      [id, siteId]
    );
    return result.rows[0];
  }
}
