import ReportService from '../services/ReportService.js';

export const getDailySummary = async (req, res, next) => {
  try {
    const { date } = req.query;
    const reportDate = date ? new Date(date) : new Date();
    const summary = await ReportService.getDailySummary(req.siteId, reportDate);
    res.json(summary);
  } catch (err) {
    console.error('[Controller getDailySummary] ERROR:', err.message);
    next(err);
  }
};

export const getProductReport = async (req, res, next) => {
  try {
    const report = await ReportService.getProductReport(req.siteId, req.query);
    res.json(report);
  } catch (err) {
    console.error('[Controller getProductReport] ERROR:', err.message);
    next(err);
  }
};

export const getInventoryReport = async (req, res, next) => {
  try {
    const report = await ReportService.getInventoryReport(req.siteId);
    res.json(report);
  } catch (err) {
    console.error('[Controller getInventoryReport] ERROR:', err.message);
    next(err);
  }
};

export const getTransactionReport = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const report = await ReportService.getTransactionReport(req.siteId, parseInt(days));
    res.json(report);
  } catch (err) {
    console.error('[Controller getTransactionReport] ERROR:', err.message);
    next(err);
  }
};

export const getClientReport = async (req, res, next) => {
  try {
    const report = await ReportService.getClientReport(req.siteId);
    res.json(report);
  } catch (err) {
    console.error('[Controller getClientReport] ERROR:', err.message);
    next(err);
  }
};

export const getVendorReport = async (req, res, next) => {
  try {
    const report = await ReportService.getVendorReport(req.siteId);
    res.json(report);
  } catch (err) {
    console.error('[Controller getVendorReport] ERROR:', err.message);
    next(err);
  }
};

export const getUserActivityReport = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const report = await ReportService.getUserActivityReport(req.siteId, parseInt(days));
    res.json(report);
  } catch (err) {
    console.error('[Controller getUserActivityReport] ERROR:', err.message);
    next(err);
  }
};

export const getMonthlyTrends = async (req, res, next) => {
  try {
    const { months = 6 } = req.query;
    const report = await ReportService.getMonthlyTrends(req.siteId, parseInt(months));
    res.json(report);
  } catch (err) {
    console.error('[Controller getMonthlyTrends] ERROR:', err.message);
    next(err);
  }
};

export const getCompleteReport = async (req, res, next) => {
  try {
    const { date } = req.query;
    const reportDate = date ? new Date(date) : new Date();
    const report = await ReportService.getCompleteReport(req.siteId, reportDate);
    res.json(report);
  } catch (err) {
    console.error('[Controller getCompleteReport] ERROR:', err.message);
    next(err);
  }
};

export const exportReport = async (req, res, next) => {
  try {
    const { date } = req.query;
    const reportDate = date ? new Date(date) : new Date();
    const report = await ReportService.getCompleteReport(req.siteId, reportDate);
    const formatted = ReportService.formatReportForExport(report);
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=report-${reportDate.toISOString().split('T')[0]}.txt`);
    res.send(formatted);
  } catch (err) {
    console.error('[Controller exportReport] ERROR:', err.message);
    next(err);
  }
};
