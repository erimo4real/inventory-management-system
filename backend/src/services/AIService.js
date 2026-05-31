import pool from '../config/db.js';

const DAYS_LOOKBACK = 90;
const ANOMALY_STD_DEV = 2.5;

function movingAverage(values, window) {
  const result = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

function linearRegression(xs, ys) {
  const n = xs.length;
  if (n < 2) return { slope: 0, intercept: ys[0] || 0 };
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, b, i) => a + b * ys[i], 0);
  const sumX2 = xs.reduce((a, b) => a + b * b, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export default class AIService {
  static async getPredictions(siteId) {
    const products = await pool.query(
      `SELECT id, name, sku, quantity, low_stock_threshold, category
       FROM products WHERE is_active = true AND site_id = $1
       ORDER BY quantity ASC`,
      [siteId]
    );

    const predictions = [];
    for (const product of products.rows) {
      const txns = await pool.query(
        `SELECT created_at::date as day, SUM(quantity) as total_out
         FROM inventory_transactions
         WHERE product_id = $1 AND site_id = $2 AND type = 'OUT'
           AND created_at >= NOW() - INTERVAL '90 days'
         GROUP BY created_at::date
         ORDER BY day`,
        [product.id, siteId]
      );

      if (txns.rows.length === 0) {
        predictions.push({
          product_id: product.id,
          name: product.name,
          sku: product.sku,
          quantity: product.quantity,
          low_stock_threshold: product.low_stock_threshold,
          category: product.category,
          avg_daily_consumption: 0,
          days_until_empty: null,
          status: 'no_data'
        });
        continue;
      }

      const dailyOut = txns.rows.map(r => Number(r.total_out));
      const dates = txns.rows.map((_, i) => i);
      const avgConsumption = dailyOut.reduce((a, b) => a + b, 0) / DAYS_LOOKBACK;

      if (avgConsumption <= 0 || product.quantity <= 0) {
        predictions.push({
          product_id: product.id,
          name: product.name,
          sku: product.sku,
          quantity: product.quantity,
          low_stock_threshold: product.low_stock_threshold,
          category: product.category,
          avg_daily_consumption: 0,
          days_until_empty: product.quantity <= 0 ? 0 : null,
          status: product.quantity <= 0 ? 'out_of_stock' : 'no_consumption'
        });
        continue;
      }

      const reg = linearRegression(dates, dailyOut);
      const trend = reg.slope * dates.length;
      const adjustedConsumption = Math.max(0, avgConsumption + (trend / dates.length));
      const daysUntilEmpty = Math.round(product.quantity / adjustedConsumption);
      const willStockOut = daysUntilEmpty <= 30;

      predictions.push({
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        low_stock_threshold: product.low_stock_threshold,
        category: product.category,
        avg_daily_consumption: Math.round(avgConsumption * 100) / 100,
        days_until_empty: daysUntilEmpty,
        trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
        status: product.quantity <= product.low_stock_threshold ? 'low_stock'
             : willStockOut ? 'will_stock_out'
             : 'healthy'
      });
    }

    return {
      predictions: predictions.sort((a, b) => (a.days_until_empty ?? 999) - (b.days_until_empty ?? 999)),
      summary: {
        total: predictions.length,
        low_stock: predictions.filter(p => p.status === 'low_stock' || p.status === 'will_stock_out' || p.status === 'out_of_stock').length,
        out_of_stock: predictions.filter(p => p.status === 'out_of_stock').length,
        healthy: predictions.filter(p => p.status === 'healthy').length,
        no_data: predictions.filter(p => p.status === 'no_data' || p.status === 'no_consumption').length
      }
    };
  }

  static async getDemandForecast(siteId, productId) {
    const product = await pool.query(
      `SELECT id, name, sku, quantity, price, low_stock_threshold
       FROM products WHERE id = $1 AND site_id = $2 AND is_active = true`,
      [productId, siteId]
    );
    if (!product.rows[0]) return null;
    const p = product.rows[0];

    const txns = await pool.query(
      `SELECT created_at::date as day, SUM(quantity) as total_out
       FROM inventory_transactions
       WHERE product_id = $1 AND site_id = $2 AND type = 'OUT'
         AND created_at >= NOW() - INTERVAL '90 days'
       GROUP BY created_at::date
       ORDER BY day`,
      [productId, siteId]
    );

    const dailyOut = txns.rows.map(r => Number(r.total_out));
    const avgDaily = dailyOut.length > 0
      ? dailyOut.reduce((a, b) => a + b, 0) / DAYS_LOOKBACK
      : 0;

    const recent30 = dailyOut.slice(-30);
    const avgRecent30 = recent30.length > 0
      ? recent30.reduce((a, b) => a + b, 0) / Math.max(recent30.length, 30)
      : 0;

    const leadTimeDays = 7;
    const safetyStock = Math.round(avgDaily * leadTimeDays * 1.5);
    const reorderPoint = Math.round(avgDaily * leadTimeDays + safetyStock);
    const recommendedOrder = Math.max(
      Math.round(avgRecent30 * 30),
      reorderPoint - p.quantity
    );

    return {
      product_id: p.id,
      name: p.name,
      sku: p.sku,
      current_stock: p.quantity,
      avg_daily_consumption: Math.round(avgDaily * 100) / 100,
      avg_monthly_consumption: Math.round(avgRecent30),
      lead_time_days: leadTimeDays,
      safety_stock: safetyStock,
      reorder_point: reorderPoint,
      recommended_order_quantity: Math.max(recommendedOrder, 0),
      estimated_days_until_reorder: avgDaily > 0
        ? Math.round((p.quantity - reorderPoint) / avgDaily)
        : null
    };
  }

  static async getAnomalies(siteId) {
    const txns = await pool.query(
      `SELECT it.*, p.name as product_name, p.sku as product_sku, u.name as user_name
       FROM inventory_transactions it
       JOIN products p ON it.product_id = p.id
       LEFT JOIN users u ON it.performed_by = u.id
       WHERE it.site_id = $1 AND it.created_at >= NOW() - INTERVAL '30 days'
       ORDER BY it.created_at DESC`,
      [siteId]
    );

    const productStats = {};
    for (const txn of txns.rows) {
      if (!productStats[txn.product_id]) {
        productStats[txn.product_id] = { quantities: [], product_name: txn.product_name };
      }
      productStats[txn.product_id].quantities.push(Math.abs(Number(txn.quantity)));
    }

    const anomalies = [];
    for (const txn of txns.rows) {
      const stats = productStats[txn.product_id];
      if (!stats || stats.quantities.length < 3) continue;

      const qty = Math.abs(Number(txn.quantity));
      const mean = stats.quantities.reduce((a, b) => a + b, 0) / stats.quantities.length;
      const variance = stats.quantities.reduce((a, b) => a + (b - mean) ** 2, 0) / stats.quantities.length;
      const stdDev = Math.sqrt(variance);
      const zScore = stdDev > 0 ? (qty - mean) / stdDev : 0;

      if (Math.abs(zScore) > ANOMALY_STD_DEV) {
        anomalies.push({
          id: txn.id,
          product_id: txn.product_id,
          product_name: txn.product_name,
          product_sku: txn.product_sku,
          type: txn.type,
          quantity: Number(txn.quantity),
          previous_quantity: Number(txn.previous_quantity),
          new_quantity: Number(txn.new_quantity),
          note: txn.note,
          user_name: txn.user_name,
          created_at: txn.created_at,
          z_score: Math.round(zScore * 100) / 100,
          reason: Math.abs(zScore) > 4 ? 'highly_unusual'
                : txn.type === 'OUT' && qty > mean * 3 ? 'large_withdrawal'
                : txn.type === 'IN' && qty > mean * 3 ? 'large_deposit'
                : 'unusual'
        });
      }
    }

    return {
      anomalies: anomalies.sort((a, b) => Math.abs(b.z_score) - Math.abs(a.z_score)),
      total_anomalies: anomalies.length
    };
  }

  static async suggestCategory(siteId, productName, description) {
    const existing = await pool.query(
      `SELECT DISTINCT category FROM products
       WHERE site_id = $1 AND category IS NOT NULL AND is_active = true
       ORDER BY category`,
      [siteId]
    );
    const categories = existing.rows.map(r => r.category);
    if (categories.length === 0) return null;

    const name = (productName || '').toLowerCase();
    const desc = (description || '').toLowerCase();
    const text = `${name} ${desc}`;

    const scores = categories.map(cat => {
      const catLower = cat.toLowerCase();
      const catWords = catLower.split(/\s+/);
      let score = 0;

      if (text.includes(catLower)) score += 10;
      for (const word of catWords) {
        if (word.length < 3) continue;
        if (text.includes(word)) score += 5;
      }

      const keywordMap = {
        'electronics': ['computer', 'laptop', 'mouse', 'keyboard', 'screen', 'monitor', 'cable', 'charger', 'battery', 'phone', 'tablet', 'electronic'],
        'furniture': ['chair', 'table', 'desk', 'cabinet', 'shelf', 'drawer', 'bed', 'sofa', 'furniture'],
        'office supplies': ['paper', 'pen', 'pencil', 'stapler', 'tape', 'scissors', 'folder', 'binder', 'notebook', 'office'],
        'food': ['snack', 'drink', 'water', 'coffee', 'tea', 'food', 'beverage', 'canned', 'package'],
        'clothing': ['shirt', 'pants', 'jacket', 'shoe', 'hat', 'uniform', 'apparel', 'wear'],
        'cleaning': ['cleaner', 'soap', 'detergent', 'bleach', 'wipe', 'spray', 'cleaning'],
        'tools': ['hammer', 'screwdriver', 'drill', 'wrench', 'pliers', 'saw', 'tool', 'hardware'],
        'medical': ['mask', 'glove', 'bandage', 'syringe', 'medical', 'first aid', 'medicine'],
        'packaging': ['box', 'bag', 'wrap', 'tape', 'label', 'sticker', 'container', 'packaging']
      };

      for (const [category, keywords] of Object.entries(keywordMap)) {
        if (catLower.includes(category) || category.includes(catLower)) {
          for (const keyword of keywords) {
            if (text.includes(keyword)) score += 3;
          }
        }
      }

      return { category: cat, score };
    });

    scores.sort((a, b) => b.score - a.score);
    return scores[0].score > 0 ? scores[0].category : null;
  }
}