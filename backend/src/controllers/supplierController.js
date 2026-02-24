const Supplier = require('../models/Supplier');

// @desc    Get all suppliers for the tenant
// @route   GET /api/suppliers
// @access  Private
exports.getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find({ tenantId: req.tenantId });
        res.status(200).json(suppliers);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Private
exports.createSupplier = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;
        const supplier = await Supplier.create(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        next(error);
    }
};
// Add update/delete as needed
