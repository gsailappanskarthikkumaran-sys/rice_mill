const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const { getBranches, createBranch, updateBranch } = require('../controllers/branchController');
const { getSuppliers, createSupplier } = require('../controllers/supplierController');
const { createPurchase, getPurchases } = require('../controllers/purchaseController');
const { createProduction } = require('../controllers/productionController');
const { createSale, getAnalytics } = require('../controllers/saleController');

const router = express.Router();

// Branch Routes
router.get('/branches', auth, getBranches);
router.post('/branches', auth, authorize('TenantAdmin'), createBranch);
router.put('/branches/:id', auth, authorize('TenantAdmin'), updateBranch);

// Supplier Routes
router.get('/suppliers', auth, getSuppliers);
router.post('/suppliers', auth, createSupplier);

// Purchase Routes
router.get('/purchases', auth, getPurchases);
router.post('/purchases', auth, createPurchase);

// Production Routes
router.post('/production', auth, createProduction);

// Sales Routes
router.post('/sales', auth, createSale);
router.get('/sales/analytics', auth, getAnalytics);

module.exports = router;
