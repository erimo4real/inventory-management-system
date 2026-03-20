import pool from '../config/db.js';

export default class InventoryRepository {
  async createTransaction(data, siteId) {
    const { product_id, type, quantity, previous_quantity, new_quantity, note, performed_by, reference_id } = data;
    const result = await pool.query(
      `INSERT INTO inventory_transactions (site_id, product_id, type, quantity, previous_quantity, new_quantity, note, performed_by, reference_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [siteId, product_id, type, quantity, previous_quantity, new_quantity, note, performed_by, reference_id]
    );
    return result.rows[0];
  }

  async updateProductQuantity(productId, newQuantity, siteId) {
    await pool.query(
      'UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND site_id = $3',
      [newQuantity, productId, siteId]
    );
  }

  async getProductQuantity(productId, siteId) {
    const result = await pool.query(
      'SELECT quantity FROM products WHERE id = $1 AND site_id = $2 AND is_active = true',
      [productId, siteId]
    );
    return result.rows[0]?.quantity;
  }

  async getProductForUpdate(productId, siteId) {
    const result = await pool.query(
      'SELECT quantity FROM products WHERE id = $1 AND site_id = $2 AND is_active = true FOR UPDATE',
      [productId, siteId]
    );
    return result.rows[0];
  }

  async findHistoryByProduct(productId, siteId, { skip = 0, limit = 100 }) {
    const result = await pool.query(
      `SELECT t.*, p.name as product_name, p.sku as product_sku
       FROM inventory_transactions t
       JOIN products p ON t.product_id = p.id
       WHERE t.product_id = $1 AND t.site_id = $2
       ORDER BY t.created_at DESC
       LIMIT $3 OFFSET $4`,
      [productId, siteId, limit, skip]
    );
    return result.rows;
  }

  async findRecent(siteId, { days = 30, skip = 0, limit = 100 }) {
    const result = await pool.query(
      `SELECT t.*, p.name as product_name, p.sku as product_sku
       FROM inventory_transactions t
       JOIN products p ON t.product_id = p.id
       WHERE t.site_id = $1 AND t.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
       ORDER BY t.created_at DESC
       LIMIT $2 OFFSET $3`,
      [siteId, limit, skip]
    );
    return result.rows;
  }

  async getRecentWithLimit(siteId, limit = 10) {
    const result = await pool.query(
      `SELECT t.*, p.name as product_name, u.name as performed_by_name
       FROM inventory_transactions t
       JOIN products p ON t.product_id = p.id
       LEFT JOIN users u ON t.performed_by = u.id
       WHERE t.site_id = $1
       ORDER BY t.created_at DESC
       LIMIT $2`,
      [siteId, limit]
    );
    return result.rows;
  }
}
