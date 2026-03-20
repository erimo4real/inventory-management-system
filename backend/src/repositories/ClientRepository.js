import pool from '../config/db.js';

export default class ClientRepository {
  async findAll(siteId, search = null) {
    let query = 'SELECT * FROM clients WHERE is_active = true AND site_id = $1';
    const params = [siteId];

    if (search) {
      query += ` AND (name ILIKE $2 OR company_name ILIKE $2 OR email ILIKE $2 OR phone ILIKE $2)`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id, siteId) {
    const result = await pool.query('SELECT * FROM clients WHERE id = $1 AND site_id = $2', [id, siteId]);
    return result.rows[0];
  }

  async getStats(siteId) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_clients,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_this_month
      FROM clients WHERE is_active = true AND site_id = $1
    `, [siteId]);
    return result.rows[0];
  }

  async create(data, siteId) {
    const { name, company_name, contact_person, email, phone, address, city, country, notes } = data;
    const result = await pool.query(
      `INSERT INTO clients (site_id, name, company_name, contact_person, email, phone, address, city, country, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [siteId, name, company_name, contact_person, email, phone, address, city, country, notes]
    );
    return result.rows[0];
  }

  async update(id, data, siteId) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'company_name', 'contact_person', 'email', 'phone', 'address', 'city', 'country', 'notes', 'is_active'];

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
      `UPDATE clients SET ${fields.join(', ')} WHERE id = $${paramCount} AND site_id = $${paramCount + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id, siteId) {
    const result = await pool.query(
      'UPDATE clients SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND site_id = $2 RETURNING id',
      [id, siteId]
    );
    return result.rows[0];
  }
}
