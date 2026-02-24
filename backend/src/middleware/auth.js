const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, isActive: true });

        if (!user) throw new Error();

        req.user = user;
        req.tenantId = user.tenantId; // Automatically set tenantId from user

        // Multi-tenant isolation: Attach tenantId to query filters
        req.tenantFilter = user.role === 'SuperAdmin' ? {} : { tenantId: user.tenantId };

        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
