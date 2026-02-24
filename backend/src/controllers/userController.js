const User = require('../models/User');

// @desc    Get all users for a tenant
// @route   GET /api/users
// @access  Private
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ tenantId: req.tenantId })
            .select('-password');
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private (MillOwner or SuperAdmin)
exports.createUser = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;
        const user = await User.create(req.body);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle user active status
// @route   PATCH /api/users/:id/toggle
// @access  Private (MillOwner or SuperAdmin)
exports.toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id, tenantId: req.tenantId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
    } catch (error) {
        next(error);
    }
};
