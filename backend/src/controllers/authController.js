const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (and tenant)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { millName, ownerName, contactNumber, email, password, companySlug } = req.body;

        // Create Tenant first
        const tenant = await Tenant.create({
            millName,
            ownerName,
            contactNumber,
            slug: companySlug || millName.toLowerCase().replace(/ /g, '-')
        });

        // Create Admin User for this tenant (MillOwner)
        const user = await User.create({
            tenantId: tenant._id,
            name: ownerName,
            email,
            password,
            role: 'MillOwner'
        });

        res.status(201).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId
            }
        });
    } catch (error) {
        next(error);
    }
};
