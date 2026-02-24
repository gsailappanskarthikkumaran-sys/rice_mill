const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const { getFarmers, createFarmer, updateFarmer, deleteFarmer } = require('../controllers/farmerController');
const { createPurchase, getPurchases } = require('../controllers/purchaseController');
const { getBranches, createBranch, updateBranch } = require('../controllers/branchController');
const { getSuppliers, createSupplier } = require('../controllers/supplierController');
const { createProduction, getProductions } = require('../controllers/productionController');
const { createSale, getAnalytics, getSales } = require('../controllers/saleController');
const { getStocks } = require('../controllers/stockController');
const { getUsers, createUser, toggleUserStatus } = require('../controllers/userController');
const { getTenants, createTenant, updateTenant, toggleTenantStatus } = require('../controllers/tenantController');

const router = express.Router();

// Tenant Management (SuperAdmin Only)
router.get('/tenants', auth, authorize('SuperAdmin'), getTenants);
router.post('/tenants', auth, authorize('SuperAdmin'), createTenant);
router.put('/tenants/:id', auth, authorize('SuperAdmin'), updateTenant);
router.patch('/tenants/:id/status', auth, authorize('SuperAdmin'), toggleTenantStatus);

// Farmer Routes
router.get('/farmers', auth, getFarmers);
router.post('/farmers', auth, createFarmer);
router.put('/farmers/:id', auth, updateFarmer);
router.delete('/farmers/:id', auth, deleteFarmer);

// Purchase Routes
router.get('/purchases', auth, getPurchases);
router.post('/purchases', auth, createPurchase);

// Production Routes
router.get('/production', auth, getProductions);
router.post('/production', auth, createProduction);

// Sales Routes
router.get('/sales', auth, getSales);
router.post('/sales', auth, createSale);
router.get('/sales/analytics', auth, getAnalytics);

// Stock Routes
router.get('/stocks', auth, getStocks);

// User Management Routes
router.get('/users', auth, authorize('SuperAdmin', 'MillOwner'), getUsers);
router.post('/users', auth, authorize('SuperAdmin', 'MillOwner'), createUser);
router.patch('/users/:id/toggle', auth, authorize('SuperAdmin', 'MillOwner'), toggleUserStatus);

// Branch Routes
router.get('/branches', auth, getBranches);
router.post('/branches', auth, authorize('MillOwner'), createBranch);
router.put('/branches/:id', auth, authorize('MillOwner'), updateBranch);

// Supplier Routes
router.get('/suppliers', auth, getSuppliers);
router.post('/suppliers', auth, createSupplier);

module.exports = router;
