const User = require('../models/User');
const bcrypt = require('bcryptjs');

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


// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private (MillOwner or SuperAdmin)
exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, role, password } = req.body;
        const user = await User.findOne({ _id: req.params.id, tenantId: req.tenantId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(200).json(userResponse);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (MillOwner or SuperAdmin)
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User removed' });
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
