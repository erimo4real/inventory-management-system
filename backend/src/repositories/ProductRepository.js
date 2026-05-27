import pool from '../config/db.js';

export default class ProductRepository {
  async findAll({ siteId, query, category, lowStock, skip = 0, limit = 100 }) {
    let sql = `
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      WHERE p.is_active = true AND p.site_id = $1
    `;
    let countSql = `
      SELECT COUNT(*) as total 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      WHERE p.is_active = true AND p.site_id = $1
    `;
    const params = [siteId];
    const countParams = [siteId];
    let paramCount = 2;

    if (query) {
      const clause = ` AND (p.name ILIKE $${paramCount} OR p.sku ILIKE $${paramCount} OR p.barcode ILIKE $${paramCount})`;
      sql += clause;
      countSql += clause;
      params.push(`%${query}%`);
      countParams.push(`%${query}%`);
      paramCount++;
    }

    if (category) {
      const clause = ` AND p.category = $${paramCount}`;
      sql += clause;
      countSql += clause;
      params.push(category);
      countParams.push(category);
      paramCount++;
    }

    if (lowStock) {
      const clause = ` AND p.quantity <= p.low_stock_threshold`;
      sql += clause;
      countSql += clause;
    }

    sql += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, skip);

    const [dataResult, countResult] = await Promise.all([
      pool.query(sql, params),
      pool.query(countSql, countParams)
    ]);

    return { rows: dataResult.rows, total: parseInt(countResult.rows[0].total) };
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
    const { name, sku, category, quantity, price, supplier_id, low_stock_threshold, description, barcode, image_url } = data;
    const result = await pool.query(
      `INSERT INTO products (site_id, name, sku, category, quantity, price, supplier_id, low_stock_threshold, description, barcode, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [siteId, name, sku, category, quantity || 0, price || 0, supplier_id, low_stock_threshold || 10, description, barcode, image_url]
    );
    return result.rows[0];
  }

  async update(id, data, siteId) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'sku', 'category', 'quantity', 'price', 'supplier_id', 
      'low_stock_threshold', 'description', 'barcode', 'is_active', 'image_url', 'image_public_id'];

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

  async findByIdForUpdate(client, id, siteId) {
    const result = await client.query(
      'SELECT id, quantity, name, sku FROM products WHERE id = $1 AND site_id = $2 AND is_active = true FOR UPDATE',
      [id, siteId]
    );
    return result.rows[0];
  }

  async updateQuantity(client, id, quantity, siteId) {
    await client.query(
      'UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND site_id = $3',
      [quantity, id, siteId]
    );
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
