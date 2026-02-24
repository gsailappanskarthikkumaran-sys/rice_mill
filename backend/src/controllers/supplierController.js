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
// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private
exports.updateSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
exports.deleteSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.status(200).json({ message: 'Supplier removed' });
    } catch (error) {
        next(error);
    }
};
