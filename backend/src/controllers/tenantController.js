const Tenant = require('../models/Tenant');
const User = require('../models/User');

// @desc    Get all tenants (Rice Mills)
// @route   GET /api/tenants
// @access  Private/SuperAdmin
exports.getTenants = async (req, res, next) => {
    try {
        const tenants = await Tenant.find({});
        res.status(200).json(tenants);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new Rice Mill (Tenant)
// @route   POST /api/tenants
// @access  Private/SuperAdmin
exports.createTenant = async (req, res, next) => {
    try {
        const tenant = await Tenant.create(req.body);
        res.status(201).json(tenant);
    } catch (error) {
        next(error);
    }
};

// @desc    Update Rice Mill details
// @route   PUT /api/tenants/:id
// @access  Private/SuperAdmin
exports.updateTenant = async (req, res, next) => {
    try {
        const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
        res.status(200).json(tenant);
    } catch (error) {
        next(error);
    }
};

// @desc    Update current tenant details
// @route   PUT /api/tenants/me
// @access  Private/MillOwner
exports.updateMyTenant = async (req, res, next) => {
    try {
        const tenant = await Tenant.findByIdAndUpdate(req.tenantId, req.body, {
            new: true,
            runValidators: true
        });
        if (!tenant) return res.status(404).json({ error: 'Tenant info not found' });
        res.status(200).json(tenant);
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle Tenant Status
// @route   PATCH /api/tenants/:id/status
// @access  Private/SuperAdmin
exports.toggleTenantStatus = async (req, res, next) => {
    try {
        const tenant = await Tenant.findById(req.params.id);
        if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

        tenant.status = tenant.status === 'Active' ? 'Deactivated' : 'Active';
        await tenant.save();

        res.status(200).json(tenant);
    } catch (error) {
        next(error);
    }
};
