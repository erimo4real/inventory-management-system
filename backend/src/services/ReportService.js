import ReportRepository from '../repositories/ReportRepository.js';

const reportRepo = new ReportRepository();

export default class ReportService {
  static async getDailySummary(siteId, date = new Date()) {
    const productSummary = await reportRepo.getDailyProductSummary(siteId, date);
    const transactionSummary = await reportRepo.getDailyTransactionSummary(siteId, date);
    
    return {
      date,
      products: productSummary,
      transactions: transactionSummary
    };
  }

  static async getProductReport(siteId, options = {}) {
    const { includeLowStock = true, includeCategories = true } = options;
    
    const report = {
      summary: await reportRepo.getDailyProductSummary(siteId)
    };
    
    if (includeLowStock) {
      report.low_stock = await reportRepo.getLowStockProducts(siteId);
    }
    
    if (includeCategories) {
      report.by_category = await reportRepo.getProductCategorySummary(siteId);
    }
    
    return report;
  }

  static async getInventoryReport(siteId) {
    return await reportRepo.getInventoryValuation(siteId);
  }

  static async getTransactionReport(siteId, days = 30) {
    return await reportRepo.getRecentTransactions(siteId, days);
  }

  static async getClientReport(siteId) {
    return await reportRepo.getClientSummary(siteId);
  }

  static async getVendorReport(siteId) {
    return await reportRepo.getVendorSummary(siteId);
  }

  static async getUserActivityReport(siteId, days = 30) {
    return await reportRepo.getUserActivitySummary(siteId, days);
  }

  static async getMonthlyTrends(siteId, months = 6) {
    return await reportRepo.getMonthlyTrends(siteId, months);
  }

  static async getCompleteReport(siteId, date = new Date()) {
    return await reportRepo.getCompleteDailyReport(siteId, date);
  }

  static formatReportForExport(report) {
    const lines = [];
    
    lines.push('========================================');
    lines.push('INVENTORY MANAGEMENT SYSTEM - DAILY REPORT');
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push('========================================');
    lines.push('');
    
    lines.push('--- PRODUCTS SUMMARY ---');
    if (report.products) {
      lines.push(`Total Active Products: ${report.products.total_active_products || 0}`);
      lines.push(`Total Stock: ${report.products.total_stock || 0}`);
      lines.push(`Total Value: $${parseFloat(report.products.total_value || 0).toFixed(2)}`);
      lines.push(`Low Stock Items: ${report.products.low_stock_count || 0}`);
      lines.push(`Out of Stock: ${report.products.out_of_stock_count || 0}`);
    }
    
    lines.push('');
    lines.push('--- TRANSACTIONS SUMMARY ---');
    if (report.transactions) {
      lines.push(`Stock In: ${report.transactions.stock_in_count || 0} (${report.transactions.total_quantity_in || 0} units)`);
      lines.push(`Stock Out: ${report.transactions.stock_out_count || 0} (${report.transactions.total_quantity_out || 0} units)`);
      lines.push(`Adjustments: ${report.transactions.adjustments_count || 0}`);
      lines.push(`Total Transactions: ${report.transactions.total_transactions || 0}`);
    }
    
    lines.push('');
    lines.push('--- LOW STOCK PRODUCTS ---');
    if (report.products?.low_stock_products?.length > 0) {
      lines.push('SKU | Product | Current | Threshold | Shortage');
      report.products.low_stock_products.forEach(p => {
        lines.push(`${p.sku} | ${p.name} | ${p.quantity} | ${p.low_stock_threshold} | ${p.shortage}`);
      });
    } else {
      lines.push('No low stock items');
    }
    
    lines.push('');
    lines.push('--- CLIENTS & VENDORS ---');
    if (report.clients) {
      lines.push(`Total Clients: ${report.clients.total_clients || 0}`);
      lines.push(`New This Month: ${report.clients.new_this_month || 0}`);
    }
    if (report.vendors) {
      lines.push(`Total Vendors: ${report.vendors.total_vendors || 0}`);
      lines.push(`Categories: ${report.vendors.total_categories || 0}`);
    }
    
    lines.push('');
    lines.push('========================================');
    lines.push('END OF REPORT');
    lines.push('========================================');
    
    return lines.join('\n');
  }
}
