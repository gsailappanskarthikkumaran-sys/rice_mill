const Farmer = require('../models/Farmer');

// @desc    Get all farmers for a tenant
// @route   GET /api/farmers
// @access  Private
exports.getFarmers = async (req, res, next) => {
    try {
        const farmers = await Farmer.find({ tenantId: req.tenantId });
        res.status(200).json(farmers);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a farmer
// @route   POST /api/farmers
// @access  Private
exports.createFarmer = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;
        const farmer = await Farmer.create(req.body);
        res.status(201).json(farmer);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a farmer
// @route   PUT /api/farmers/:id
// @access  Private
exports.updateFarmer = async (req, res, next) => {
    try {
        const farmer = await Farmer.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }
        res.status(200).json(farmer);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a farmer
// @route   DELETE /api/farmers/:id
// @access  Private
exports.deleteFarmer = async (req, res, next) => {
    try {
        const farmer = await Farmer.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }
        res.status(200).json({ message: 'Farmer removed' });
    } catch (error) {
        next(error);
    }
};
