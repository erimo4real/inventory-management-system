import pool from '../config/db.js';
import InventoryRepository from '../repositories/InventoryRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import AuditService from './AuditService.js';

const inventoryRepo = new InventoryRepository();
const productRepo = new ProductRepository();

export default class InventoryService {
  static async stockIn(data, siteId, userId, req) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const productResult = await client.query(
        'SELECT quantity, name, sku FROM products WHERE id = $1 AND site_id = $2 AND is_active = true FOR UPDATE',
        [data.product_id, siteId]
      );
      
      if (productResult.rows.length === 0) {
        throw { message: 'Product not found', status: 404 };
      }
      
      const product = productResult.rows[0];
      const previousQuantity = product.quantity;
      const newQuantity = previousQuantity + parseInt(data.quantity);
      
      await client.query(
        'UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND site_id = $3',
        [newQuantity, data.product_id, siteId]
      );
      
      const transaction = await inventoryRepo.createTransaction({
        product_id: data.product_id,
        type: 'IN',
        quantity: parseInt(data.quantity),
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        note: data.note,
        performed_by: userId,
        reference_id: data.reference_id
      }, siteId);
      
      await AuditService.logCreate(siteId, userId, 'INVENTORY_IN', transaction.id, {
        product: product.name,
        sku: product.sku,
        quantity_added: data.quantity,
        new_quantity: newQuantity,
        note: data.note
      }, req);
      
      await client.query('COMMIT');
      return transaction;
      
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[InventoryService stockIn] ERROR:', err.message);
      throw err;
    } finally {
      client.release();
    }
  }

  static async stockOut(data, siteId, userId, req) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const productResult = await client.query(
        'SELECT quantity, name, sku FROM products WHERE id = $1 AND site_id = $2 AND is_active = true FOR UPDATE',
        [data.product_id, siteId]
      );
      
      if (productResult.rows.length === 0) {
        throw { message: 'Product not found', status: 404 };
      }
      
      const product = productResult.rows[0];
      const previousQuantity = product.quantity;
      const newQuantity = Math.max(0, previousQuantity - parseInt(data.quantity));
      
      await client.query(
        'UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND site_id = $3',
        [newQuantity, data.product_id, siteId]
      );
      
      const transaction = await inventoryRepo.createTransaction({
        product_id: data.product_id,
        type: 'OUT',
        quantity: parseInt(data.quantity),
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        note: data.note,
        performed_by: userId,
        reference_id: data.reference_id
      }, siteId);
      
      await AuditService.logCreate(siteId, userId, 'INVENTORY_OUT', transaction.id, {
        product: product.name,
        sku: product.sku,
        quantity_removed: data.quantity,
        new_quantity: newQuantity,
        note: data.note
      }, req);
      
      await client.query('COMMIT');
      return transaction;
      
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async adjustStock(productId, data, siteId, userId, req) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const productResult = await client.query(
        'SELECT quantity, name, sku FROM products WHERE id = $1 AND site_id = $2 AND is_active = true FOR UPDATE',
        [productId, siteId]
      );
      
      if (productResult.rows.length === 0) {
        throw { message: 'Product not found', status: 404 };
      }
      
      const product = productResult.rows[0];
      const previousQuantity = product.quantity;
      const { new_quantity, note } = data;
      
      await client.query(
        'UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND site_id = $3',
        [new_quantity, productId, siteId]
      );
      
      const transaction = await inventoryRepo.createTransaction({
        product_id: productId,
        type: 'ADJUST',
        quantity: new_quantity - previousQuantity,
        previous_quantity: previousQuantity,
        new_quantity: new_quantity,
        note: note,
        performed_by: userId
      }, siteId);
      
      await AuditService.logUpdate(siteId, userId, 'INVENTORY_ADJUST', transaction.id, 
        { product: product.name, sku: product.sku, quantity: previousQuantity },
        { product: product.name, sku: product.sku, quantity: new_quantity, note },
        req);
      
      await client.query('COMMIT');
      return transaction;
      
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async getProductHistory(productId, siteId, filters) {
    return await inventoryRepo.findHistoryByProduct(productId, siteId, filters);
  }

  static async getRecentTransactions(siteId, filters) {
    return await inventoryRepo.findRecent(siteId, filters);
  }

  static async getDashboardStats(siteId) {
    const stats = await productRepo.getStats(siteId);
    const recentTransactions = await inventoryRepo.getRecentWithLimit(siteId, 10);
    return { ...stats, recent_transactions: recentTransactions };
  }
}
