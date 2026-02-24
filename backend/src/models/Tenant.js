const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    subscriptionPlan: { type: String, enum: ['basic', 'premium', 'enterprise'], default: 'basic' },
    address: String,
    contactEmail: String
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
