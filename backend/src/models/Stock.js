const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    paddyStock: { type: Number, default: 0, min: 0 },
    riceStock: { type: Number, default: 0, min: 0 },
    huskStock: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

// Ensure one stock document per tenant
stockSchema.index({ tenantId: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
