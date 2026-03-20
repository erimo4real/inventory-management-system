import pool from '../config/db.js';

export default class ReportRepository {
  async getDailyProductSummary(siteId, date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE created_at >= $2 AND created_at <= $3) as products_added_today,
        COUNT(*) FILTER (WHERE quantity <= low_stock_threshold AND is_active = true) as low_stock_count,
        COUNT(*) FILTER (WHERE quantity = 0 AND is_active = true) as out_of_stock_count,
        COUNT(*) FILTER (WHERE is_active = true) as total_active_products,
        COALESCE(SUM(quantity) FILTER (WHERE is_active = true), 0) as total_stock,
        COALESCE(SUM(quantity * price) FILTER (WHERE is_active = true), 0) as total_value
      FROM products
      WHERE site_id = $1
    `, [siteId, startOfDay, endOfDay]);
    return result.rows[0];
  }

  async getDailyTransactionSummary(siteId, date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE type = 'IN') as stock_in_count,
        COUNT(*) FILTER (WHERE type = 'OUT') as stock_out_count,
        COUNT(*) FILTER (WHERE type = 'ADJUST') as adjustments_count,
        COALESCE(SUM(quantity) FILTER (WHERE type = 'IN'), 0) as total_quantity_in,
        COALESCE(SUM(quantity) FILTER (WHERE type = 'OUT'), 0) as total_quantity_out,
        COUNT(*) as total_transactions
      FROM inventory_transactions
      WHERE site_id = $1 AND created_at >= $2 AND created_at <= $3
    `, [siteId, startOfDay, endOfDay]);
    return result.rows[0];
  }

  async getProductCategorySummary(siteId) {
    const result = await pool.query(`
      SELECT 
        COALESCE(category, 'Uncategorized') as category,
        COUNT(*) as product_count,
        COALESCE(SUM(quantity), 0) as total_stock,
        COALESCE(SUM(quantity * price), 0) as total_value
      FROM products
      WHERE site_id = $1 AND is_active = true
      GROUP BY category
      ORDER BY total_value DESC
    `, [siteId]);
    return result.rows;
  }

  async getLowStockProducts(siteId, limit = 20) {
    const result = await pool.query(`
      SELECT 
        p.id, p.name, p.sku, p.quantity, p.price, 
        p.low_stock_threshold, p.category,
        COALESCE(s.name, 'N/A') as supplier_name,
        (p.low_stock_threshold - p.quantity) as shortage
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.site_id = $1 AND p.is_active = true AND p.quantity <= p.low_stock_threshold
      ORDER BY p.quantity ASC
      LIMIT $2
    `, [siteId, limit]);
    return result.rows;
  }

  async getTopProducts(siteId, days = 30, limit = 10) {
    const result = await pool.query(`
      SELECT 
        p.id, p.name, p.sku, p.quantity, p.price,
        COUNT(t.id) as transaction_count,
        COALESCE(SUM(t.quantity) FILTER (WHERE t.type = 'OUT'), 0) as total_sold
      FROM products p
      LEFT JOIN inventory_transactions t ON p.id = t.product_id 
        AND t.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      WHERE p.site_id = $1 AND p.is_active = true
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT $2
    `, [siteId, limit]);
    return result.rows;
  }

  async getClientSummary(siteId) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_clients,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_this_month
      FROM clients
      WHERE site_id = $1 AND is_active = true
    `, [siteId]);
    return result.rows[0];
  }

  async getVendorSummary(siteId) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_vendors,
        COUNT(DISTINCT category) as total_categories,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_this_month
      FROM vendors
      WHERE site_id = $1 AND is_active = true
    `, [siteId]);
    return result.rows[0];
  }

  async getSupplierSummary(siteId) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_suppliers,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_this_month
      FROM suppliers
      WHERE site_id = $1 AND is_active = true
    `, [siteId]);
    return result.rows[0];
  }

  async getUserActivitySummary(siteId, days = 30) {
    const result = await pool.query(`
      SELECT 
        u.id, u.name, u.email, u.role,
        COUNT(al.id) as action_count,
        COUNT(al.id) FILTER (WHERE al.action = 'CREATE') as creates,
        COUNT(al.id) FILTER (WHERE al.action = 'UPDATE') as updates,
        COUNT(al.id) FILTER (WHERE al.action = 'DELETE') as deletes,
        MAX(al.created_at) as last_action
      FROM users u
      LEFT JOIN audit_logs al ON u.id = al.user_id 
        AND al.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      INNER JOIN user_sites us ON u.id = us.user_id AND us.site_id = $1 AND us.is_active = true
      WHERE u.is_active = true
      GROUP BY u.id
      ORDER BY action_count DESC
    `, [siteId]);
    return result.rows;
  }

  async getRecentTransactions(siteId, days = 7, limit = 50) {
    const result = await pool.query(`
      SELECT 
        t.id, t.type, t.quantity, t.previous_quantity, t.new_quantity,
        t.note, t.reference_id, t.created_at,
        p.name as product_name, p.sku as product_sku,
        u.name as performed_by_name
      FROM inventory_transactions t
      JOIN products p ON t.product_id = p.id
      LEFT JOIN users u ON t.performed_by = u.id
      WHERE t.site_id = $1 AND t.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      ORDER BY t.created_at DESC
      LIMIT $2
    `, [siteId, limit]);
    return result.rows;
  }

  async getMonthlyTrends(siteId, months = 6) {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as transaction_count,
        COUNT(*) FILTER (WHERE type = 'IN') as stock_in,
        COUNT(*) FILTER (WHERE type = 'OUT') as stock_out,
        COALESCE(SUM(quantity) FILTER (WHERE type = 'IN'), 0) as quantity_in,
        COALESCE(SUM(quantity) FILTER (WHERE type = 'OUT'), 0) as quantity_out
      FROM inventory_transactions
      WHERE site_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(months)} months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `, [siteId]);
    return result.rows;
  }

  async getCompleteDailyReport(siteId, date = new Date()) {
    const productSummary = await this.getDailyProductSummary(siteId, date);
    const transactionSummary = await this.getDailyTransactionSummary(siteId, date);
    const lowStockProducts = await this.getLowStockProducts(siteId, 20);
    const topProducts = await this.getTopProducts(siteId, 30, 10);
    const categorySummary = await this.getProductCategorySummary(siteId);
    const recentTransactions = await this.getRecentTransactions(siteId, 1, 100);
    const clientSummary = await this.getClientSummary(siteId);
    const vendorSummary = await this.getVendorSummary(siteId);
    const supplierSummary = await this.getSupplierSummary(siteId);
    const userActivity = await this.getUserActivitySummary(siteId, 30);
    const monthlyTrends = await this.getMonthlyTrends(siteId, 6);

    return {
      report_date: date,
      site_id: siteId,
      products: {
        ...productSummary,
        low_stock_products: lowStockProducts,
        top_products: topProducts,
        by_category: categorySummary
      },
      transactions: {
        ...transactionSummary,
        recent: recentTransactions
      },
      clients: clientSummary,
      vendors: vendorSummary,
      suppliers: supplierSummary,
      users: userActivity,
      trends: monthlyTrends
    };
  }

  async getInventoryValuation(siteId) {
    const result = await pool.query(`
      SELECT 
        COALESCE(category, 'Uncategorized') as category,
        COUNT(*) as product_count,
        COALESCE(SUM(quantity), 0) as total_quantity,
        COALESCE(SUM(quantity * price), 0) as total_value,
        AVG(price) as avg_price,
        MAX(price) as max_price,
        MIN(price) as min_price
      FROM products
      WHERE site_id = $1 AND is_active = true AND quantity > 0
      GROUP BY category
      ORDER BY total_value DESC
    `, [siteId]);
    return result.rows;
  }
}
