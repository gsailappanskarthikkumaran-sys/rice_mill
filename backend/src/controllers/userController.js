const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all users for a tenant
// @route   GET /api/users
// @access  Private
exports.getUsers = async (req, res, next) => {
    try {
        const query = { tenantId: req.tenantId };

        // Safety: Non-SuperAdmins should never see SuperAdmin details
        if (req.user.role !== 'SuperAdmin') {
            query.role = { $ne: 'SuperAdmin' };
        }

        const users = await User.find(query).select('-password');
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
        const query = { _id: req.params.id, tenantId: req.tenantId };

        // Safety: Non-SuperAdmins cannot modify SuperAdmin accounts
        if (req.user.role !== 'SuperAdmin') {
            query.role = { $ne: 'SuperAdmin' };
        }

        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ error: 'User not found or access denied' });
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
        const query = { _id: req.params.id, tenantId: req.tenantId };

        // Safety: Non-SuperAdmins cannot delete SuperAdmin accounts
        if (req.user.role !== 'SuperAdmin') {
            query.role = { $ne: 'SuperAdmin' };
        }

        const user = await User.findOneAndDelete(query);
        if (!user) {
            return res.status(404).json({ error: 'User not found or access denied' });
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
        const query = { _id: req.params.id, tenantId: req.tenantId };

        // Safety: Non-SuperAdmins cannot toggle SuperAdmin accounts
        if (req.user.role !== 'SuperAdmin') {
            query.role = { $ne: 'SuperAdmin' };
        }

        const user = await User.findOne(query);
        if (!user) {
            return res.status(404).json({ error: 'User not found or access denied' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
    } catch (error) {
        next(error);
    }
};
