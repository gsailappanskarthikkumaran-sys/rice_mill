const Branch = require('../models/Branch');

// @desc    Get all branches for the tenant
// @route   GET /api/branches
// @access  Private
exports.getBranches = async (req, res, next) => {
    try {
        const branches = await Branch.find({ tenantId: req.tenantId });
        res.status(200).json(branches);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a branch
// @route   POST /api/branches
// @access  Private (TenantAdmin)
exports.createBranch = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;
        const branch = await Branch.create(req.body);
        res.status(201).json(branch);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a branch
// @route   PUT /api/branches/:id
// @access  Private (TenantAdmin)
exports.updateBranch = async (req, res, next) => {
    try {
        let branch = await Branch.findOne({ _id: req.params.id, tenantId: req.tenantId });

        if (!branch) {
            return res.status(404).json({ error: 'Branch not found' });
        }

        branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(branch);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a branch
// @route   DELETE /api/branches/:id
// @access  Private (TenantAdmin)
exports.deleteBranch = async (req, res, next) => {
    try {
        const branch = await Branch.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!branch) {
            return res.status(404).json({ error: 'Branch not found' });
        }
        res.status(200).json({ message: 'Branch removed' });
    } catch (error) {
        next(error);
    }
};
