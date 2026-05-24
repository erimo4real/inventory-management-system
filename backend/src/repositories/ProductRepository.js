import pool from '../config/db.js';

export default class ProductRepository {
  async findAll({ siteId, query, category, lowStock, skip = 0, limit = 100 }) {
    let sql = `
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      WHERE p.is_active = true AND p.site_id = $1
    `;
    const params = [siteId];
    let paramCount = 2;

    if (query) {
      sql += ` AND (p.name ILIKE $${paramCount} OR p.sku ILIKE $${paramCount} OR p.barcode ILIKE $${paramCount})`;
      params.push(`%${query}%`);
      paramCount++;
    }

    if (category) {
      sql += ` AND p.category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (lowStock) {
      sql += ` AND p.quantity <= p.low_stock_threshold`;
    }

    sql += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, skip);

    const result = await pool.query(sql, params);
    return result.rows;
  }

  async findById(id, siteId) {
    const result = await pool.query(
      `SELECT p.*, s.name as supplier_name 
       FROM products p 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       WHERE p.id = $1 AND p.site_id = $2`,
      [id, siteId]
    );
    return result.rows[0];
  }

  async create(data, siteId) {
    const { name, sku, category, quantity, price, supplier_id, low_stock_threshold, description, barcode } = data;
    const result = await pool.query(
      `INSERT INTO products (site_id, name, sku, category, quantity, price, supplier_id, low_stock_threshold, description, barcode)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [siteId, name, sku, category, quantity || 0, price || 0, supplier_id, low_stock_threshold || 10, description, barcode]
    );
    return result.rows[0];
  }

  async update(id, data, siteId) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'sku', 'category', 'quantity', 'price', 'supplier_id', 
      'low_stock_threshold', 'description', 'barcode', 'is_active'];

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
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} AND site_id = $${paramCount + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id, siteId) {
    const result = await pool.query(
      'UPDATE products SET is_active = false WHERE id = $1 AND site_id = $2 RETURNING id',
      [id, siteId]
    );
    return result.rows[0];
  }

  async findCategories(siteId) {
    const result = await pool.query(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND is_active = true AND site_id = $1 ORDER BY category',
      [siteId]
    );
    return result.rows.map(r => r.category);
  }

  async findLowStock(siteId) {
    const result = await pool.query(
      `SELECT p.*, s.name as supplier_name 
       FROM products p 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       WHERE p.quantity <= p.low_stock_threshold AND p.is_active = true AND p.site_id = $1
       ORDER BY p.quantity ASC`,
      [siteId]
    );
    return result.rows;
  }

  async findBySku(sku, siteId) {
    const result = await pool.query('SELECT * FROM products WHERE sku = $1 AND site_id = $2', [sku, siteId]);
    return result.rows[0];
  }

  async getStats(siteId) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        COALESCE(SUM(quantity), 0) as total_stock,
        COUNT(*) FILTER (WHERE quantity <= low_stock_threshold) as low_stock_count,
        COALESCE(SUM(quantity * price), 0) as total_value
      FROM products WHERE is_active = true AND site_id = $1
    `, [siteId]);
    return result.rows[0];
  }
}
