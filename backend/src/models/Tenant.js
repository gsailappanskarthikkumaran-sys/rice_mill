const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    millName: { type: String, required: true },
    ownerName: { type: String, required: true },
    address: String,
    contactNumber: { type: String, required: true },
    subscriptionPlan: { type: String, enum: ['Basic', 'Premium'], default: 'Basic' },
    status: { type: String, enum: ['Active', 'Inactive', 'Deactivated'], default: 'Active' },
    slug: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
