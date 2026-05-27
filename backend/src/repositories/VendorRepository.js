import pool from '../config/db.js';

export default class VendorRepository {
  async findAll(siteId, search = null, category = null, { skip = 0, limit = 100 } = {}) {
    let query = 'SELECT * FROM vendors WHERE is_active = true AND site_id = $1';
    let countQuery = 'SELECT COUNT(*) as total FROM vendors WHERE is_active = true AND site_id = $1';
    const params = [siteId];
    const countParams = [siteId];
    let paramIndex = 2;

    if (search) {
      const searchClause = ` AND (name ILIKE $${paramIndex} OR company_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`;
      query += searchClause;
      countQuery += searchClause;
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      const catClause = ` AND category = $${paramIndex}`;
      query += catClause;
      countQuery += catClause;
      params.push(category);
      countParams.push(category);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, skip);

    const [dataResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams)
    ]);

    return { rows: dataResult.rows, total: parseInt(countResult.rows[0].total) };
  }

  async findById(id, siteId) {
    const result = await pool.query('SELECT * FROM vendors WHERE id = $1 AND site_id = $2', [id, siteId]);
    return result.rows[0];
  }

  async getStats(siteId) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_vendors,
        COUNT(DISTINCT category) as total_categories,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_this_month
      FROM vendors WHERE is_active = true AND site_id = $1
    `, [siteId]);
    return result.rows[0];
  }

  async getCategories(siteId) {
    const result = await pool.query(
      'SELECT DISTINCT category FROM vendors WHERE is_active = true AND site_id = $1 AND category IS NOT NULL ORDER BY category',
      [siteId]
    );
    return result.rows.map(r => r.category);
  }

  async create(data, siteId) {
    const { name, company_name, contact_person, email, phone, address, city, country, category, tax_id, notes, image_url } = data;
    const result = await pool.query(
      `INSERT INTO vendors (site_id, name, company_name, contact_person, email, phone, address, city, country, category, tax_id, notes, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [siteId, name, company_name, contact_person, email, phone, address, city, country, category, tax_id, notes, image_url]
    );
    return result.rows[0];
  }

  async update(id, data, siteId) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'company_name', 'contact_person', 'email', 'phone', 'address', 'city', 'country', 'category', 'tax_id', 'notes', 'is_active', 'image_url', 'image_public_id'];

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
      `UPDATE vendors SET ${fields.join(', ')} WHERE id = $${paramCount} AND site_id = $${paramCount + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id, siteId) {
    const result = await pool.query(
      'UPDATE vendors SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND site_id = $2 RETURNING id',
      [id, siteId]
    );
    return result.rows[0];
  }
}
