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
import { upload, uploadImage, uploadImages, deleteImage } from '../controllers/uploadController.js';
import { authenticate, authorize, requireSite, ROLES } from '../middleware/auth.js';

const router = express.Router();

// ========== Public Routes (No Auth Required) ==========
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// ========== Protected Routes (Auth Required) ==========
router.use(authenticate);

// ========== Auth Routes ==========
router.get('/auth/me', authController.getCurrentUser);
router.post('/auth/change-password', authController.changePassword);

// ========== Sites Routes (Admin only) ==========
router.get('/sites', siteController.getSites);
router.get('/sites/my', siteController.getUserSites);
router.get('/sites/:id', siteController.getSiteById);
router.post('/sites', authorize(ROLES.ADMIN), siteController.createSite);
router.put('/sites/:id', authorize(ROLES.ADMIN), siteController.updateSite);
router.delete('/sites/:id', authorize(ROLES.ADMIN), siteController.deleteSite);
router.get('/sites/:id/users', siteController.getSiteUsers);
router.post('/sites/add-user', authorize(ROLES.ADMIN), siteController.addUserToSite);
router.post('/sites/remove-user', authorize(ROLES.ADMIN), siteController.removeUserFromSite);

// ========== Upload Routes (Require Site) ==========
router.post('/upload/image', requireSite, upload.single('image'), uploadImage);
router.post('/upload/images', requireSite, upload.array('images', 10), uploadImages);
router.delete('/upload/image', requireSite, deleteImage);

// ========== Products (Role-based, Require Site) ==========
router.get('/products', requireSite, productController.getProducts);
router.get('/products/categories', requireSite, productController.getCategories);
router.get('/products/low-stock', requireSite, productController.getLowStockProducts);
router.get('/products/:id', requireSite, productController.getProductById);
router.post('/products', authorize(ROLES.ADMIN, ROLES.MANAGER), productController.createProduct);
router.put('/products/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), productController.updateProduct);
router.delete('/products/:id', authorize(ROLES.ADMIN), productController.deleteProduct);

// ========== Inventory (Role-based, Require Site) ==========
router.post('/inventory/in', authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), inventoryController.stockIn);
router.post('/inventory/out', authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF), inventoryController.stockOut);
router.post('/inventory/adjust/:product_id', authorize(ROLES.ADMIN, ROLES.MANAGER), inventoryController.adjustStock);
router.get('/inventory/history/:product_id', requireSite, inventoryController.getProductHistory);
router.get('/inventory/history', requireSite, inventoryController.getRecentTransactions);
router.get('/inventory/stats', requireSite, inventoryController.getDashboardStats);

// ========== Suppliers (Role-based, Require Site) ==========
router.get('/suppliers', requireSite, supplierController.getSuppliers);
router.get('/suppliers/:id', requireSite, supplierController.getSupplierById);
router.post('/suppliers', authorize(ROLES.ADMIN, ROLES.MANAGER), supplierController.createSupplier);
router.put('/suppliers/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), supplierController.updateSupplier);
router.delete('/suppliers/:id', authorize(ROLES.ADMIN), supplierController.deleteSupplier);

// ========== Dashboard (Require Site) ==========
router.get('/dashboard/stats', requireSite, inventoryController.getDashboardStats);

// ========== Users (Require Site, Admin/Manager) ==========
router.get('/users', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), userController.getUsers);
router.get('/users/:id', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), userController.getUserById);
router.post('/users', requireSite, authorize(ROLES.ADMIN), userController.createUser);
router.put('/users/:id', requireSite, authorize(ROLES.ADMIN), userController.updateUser);
router.delete('/users/:id', requireSite, authorize(ROLES.ADMIN), userController.deleteUser);

// ========== Clients (Role-based, Require Site) ==========
router.get('/clients', requireSite, clientController.getClients);
router.get('/clients/stats', requireSite, clientController.getClientStats);
router.get('/clients/:id', requireSite, clientController.getClientById);
router.post('/clients', authorize(ROLES.ADMIN, ROLES.MANAGER), clientController.createClient);
router.put('/clients/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), clientController.updateClient);
router.delete('/clients/:id', authorize(ROLES.ADMIN), clientController.deleteClient);

// ========== Vendors (Role-based, Require Site) ==========
router.get('/vendors', requireSite, vendorController.getVendors);
router.get('/vendors/stats', requireSite, vendorController.getVendorStats);
router.get('/vendors/categories', requireSite, vendorController.getVendorCategories);
router.get('/vendors/:id', requireSite, vendorController.getVendorById);
router.post('/vendors', authorize(ROLES.ADMIN, ROLES.MANAGER), vendorController.createVendor);
router.put('/vendors/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), vendorController.updateVendor);
router.delete('/vendors/:id', authorize(ROLES.ADMIN), vendorController.deleteVendor);

// ========== Audit Logs (Require Site) ==========
router.get('/audit/logs', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), auditController.getSiteAuditLogs);
router.get('/audit/logs/stats', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), auditController.getAuditStats);
router.get('/audit/entity/:entity_type/:entity_id', requireSite, authorize(ROLES.ADMIN, ROLES.MANAGER), auditController.getEntityHistory);

export default router;
