import express from 'express';
import * as productController from '../controllers/productController.js';
import * as inventoryController from '../controllers/inventoryController.js';
import * as supplierController from '../controllers/supplierController.js';
import * as clientController from '../controllers/clientController.js';
import * as vendorController from '../controllers/vendorController.js';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';
import * as siteController from '../controllers/siteController.js';
import * as auditController from '../controllers/auditController.js';
import * as reportController from '../controllers/reportController.js';
import categoryController from '../controllers/categoryController.js';
import { upload, uploadImage, uploadImages, deleteImage } from '../controllers/uploadController.js';
import * as profileController from '../controllers/profileController.js';
import * as entityImageController from '../controllers/entityImageController.js';
import { initializeSystem } from '../controllers/setupController.js';
import { authenticate, authorize, requireSite, ROLES } from '../middleware/auth.js';
import AuditService from '../services/AuditService.js';
import * as aiController from '../controllers/aiController.js';
import { validateProduct, validateSupplier, validateInventory, validateEntityInput, validateCategory, validateSite, validateSiteUser } from '../middleware/validation.js';

const router = express.Router();

// ========== Public Routes (No Auth Required) ==========
router.post('/setup/initialize', initializeSystem);
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// ========== Logout (Auth not required since we clear cookie) ==========
router.post('/auth/logout', authController.logout);

// ========== Protected Routes (Auth Required) ==========
router.use(authenticate);

// ========== Auth Routes ==========
router.get('/auth/me', authController.getCurrentUser);
router.post('/auth/change-password', authController.changePassword);

// ========== Profile Routes ==========
router.put('/profile/avatar', upload.single('avatar'), profileController.updateAvatar);

// ========== Sites Routes (Admin/Manager only) ==========
router.get('/sites', authorize(ROLES.ADMIN, ROLES.MANAGER), siteController.getSites);
router.get('/sites/my', siteController.getUserSites);
router.get('/sites/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), siteController.getSiteById);
router.post('/sites', authorize(ROLES.ADMIN), validateSite, siteController.createSite);
router.put('/sites/:id', authorize(ROLES.ADMIN), validateSite, siteController.updateSite);
router.delete('/sites/:id', authorize(ROLES.ADMIN), siteController.deleteSite);
router.get('/sites/:id/users', authorize(ROLES.ADMIN, ROLES.MANAGER), siteController.getSiteUsers);
router.post('/sites/add-user', authorize(ROLES.ADMIN), validateSiteUser, siteController.addUserToSite);
router.post('/sites/remove-user', authorize(ROLES.ADMIN), validateSiteUser, siteController.removeUserFromSite);

// ========== Upload Routes (Require Site) ==========
router.post('/upload/image', requireSite, upload.single('image'), uploadImage);
router.post('/upload/images', requireSite, upload.array('images', 10), uploadImages);
router.delete('/upload/image', requireSite, deleteImage);

// ========== Entity Image Routes (Require Site, Manager+) ==========
router.put('/:entityType(product|supplier|client|vendor)/:entityId/image', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), upload.single('image'), entityImageController.uploadEntityImage);
router.delete('/:entityType(product|supplier|client|vendor)/:entityId/image', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), entityImageController.deleteEntityImage);
router.put('/sites/:entityId/logo', requireSite, authorize(ROLES.ADMIN), upload.single('image'), (req, res, next) => { req.params.entityType = 'site'; entityImageController.uploadEntityImage(req, res, next); });
router.delete('/sites/:entityId/logo', requireSite, authorize(ROLES.ADMIN), (req, res, next) => { req.params.entityType = 'site'; entityImageController.deleteEntityImage(req, res, next); });

// ========== Products (Role-based, Require Site) ==========
router.get('/products', requireSite, productController.getProducts);
router.get('/products/categories', requireSite, productController.getCategories);
router.get('/products/low-stock', requireSite, productController.getLowStockProducts);
router.get('/products/:id', requireSite, productController.getProductById);
router.post('/products', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateProduct, productController.createProduct);
router.put('/products/:id', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateProduct, productController.updateProduct);
router.delete('/products/:id', requireSite, authorize(ROLES.ADMIN), productController.deleteProduct);

// ========== Inventory (Role-based, Require Site) ==========
router.post('/inventory/in', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), validateInventory, inventoryController.stockIn);
router.post('/inventory/out', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), validateInventory, inventoryController.stockOut);
router.post('/inventory/adjust/:product_id', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateInventory, inventoryController.adjustStock);
router.get('/inventory/history/:product_id', requireSite, inventoryController.getProductHistory);
router.get('/inventory/history', requireSite, inventoryController.getRecentTransactions);
router.get('/inventory/stats', requireSite, inventoryController.getDashboardStats);

// ========== Suppliers (Role-based, Require Site) ==========
router.get('/suppliers', requireSite, supplierController.getSuppliers);
router.get('/suppliers/:id', requireSite, supplierController.getSupplierById);
router.post('/suppliers', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateSupplier, supplierController.createSupplier);
router.put('/suppliers/:id', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateSupplier, supplierController.updateSupplier);
router.delete('/suppliers/:id', requireSite, authorize(ROLES.ADMIN), supplierController.deleteSupplier);

// ========== Dashboard (Require Site) ==========
router.get('/dashboard/stats', requireSite, inventoryController.getDashboardStats);

// ========== Users (Require Site, Admin/Manager) ==========
router.get('/users', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), userController.getUsers);
router.get('/users/:id', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), userController.getUserById);
router.post('/users', requireSite, authorize(ROLES.ADMIN), userController.createUser);
router.put('/users/:id', requireSite, authorize(ROLES.ADMIN), userController.updateUser);
router.delete('/users/:id', requireSite, authorize(ROLES.ADMIN), userController.deleteUser);
router.put('/users/:id/avatar', requireSite, authorize(ROLES.ADMIN), upload.single('avatar'), userController.updateUserAvatar);

// ========== Clients (Role-based, Require Site) ==========
router.get('/clients', requireSite, clientController.getClients);
router.get('/clients/stats', requireSite, clientController.getClientStats);
router.get('/clients/:id', requireSite, clientController.getClientById);
router.post('/clients', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateEntityInput, clientController.createClient);
router.put('/clients/:id', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateEntityInput, clientController.updateClient);
router.delete('/clients/:id', requireSite, authorize(ROLES.ADMIN), clientController.deleteClient);

// ========== Vendors (Role-based, Require Site) ==========
router.get('/vendors', requireSite, vendorController.getVendors);
router.get('/vendors/stats', requireSite, vendorController.getVendorStats);
router.get('/vendors/categories', requireSite, vendorController.getVendorCategories);
router.get('/vendors/:id', requireSite, vendorController.getVendorById);
router.post('/vendors', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateEntityInput, vendorController.createVendor);
router.put('/vendors/:id', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateEntityInput, vendorController.updateVendor);
router.delete('/vendors/:id', requireSite, authorize(ROLES.ADMIN), vendorController.deleteVendor);

// ========== Categories (Role-based, Require Site) ==========
router.get('/categories', requireSite, categoryController.getAll);
router.get('/categories/stats', requireSite, categoryController.getStats);
router.get('/categories/:id', requireSite, categoryController.getById);
router.post('/categories', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateCategory, categoryController.create);
router.put('/categories/:id', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), validateCategory, categoryController.update);
router.delete('/categories/:id', requireSite, authorize(ROLES.ADMIN), categoryController.delete);

// ========== Audit Logs (Require Site) ==========
router.get('/audit/logs', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), auditController.getSiteAuditLogs);
router.get('/audit/logs/stats', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), auditController.getAuditStats);
router.get('/audit/entity/:entity_type/:entity_id', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), auditController.getEntityHistory);

// ========== Reports (Require Site, Admin/Manager) ==========
router.get('/reports/daily', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), reportController.getDailySummary);
router.get('/reports/products', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), reportController.getProductReport);
router.get('/reports/inventory', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), reportController.getInventoryReport);
router.get('/reports/transactions', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), reportController.getTransactionReport);
router.get('/reports/clients', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), reportController.getClientReport);
router.get('/reports/vendors', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), reportController.getVendorReport);
router.get('/reports/users', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), reportController.getUserActivityReport);
router.get('/reports/trends', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), reportController.getMonthlyTrends);
router.get('/reports/complete', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), reportController.getCompleteReport);
router.get('/reports/export', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), reportController.exportReport);

// ========== AI Insights (Require Site) ==========
router.get('/ai/predictions', requireSite, aiController.getPredictions);
router.get('/ai/forecast/:productId', requireSite, aiController.getDemandForecast);
router.get('/ai/anomalies', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), aiController.getAnomalies);
router.post('/ai/suggest-category', requireSite, aiController.suggestCategory);

export default router;
