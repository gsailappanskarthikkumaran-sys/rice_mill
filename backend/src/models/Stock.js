const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    itemName: { type: String, required: true }, // Paddy, Rice, Husk, Bran
    variety: { type: String, default: 'Standard' }, // Raw, Steam, Parboiled, etc.
    quantity: { type: Number, default: 0 },
    bags: { type: Number, default: 0 },
    unit: { type: String, default: 'Quintal' } // Standard Indian Unit
}, { timestamps: true });

// Compound index for unique stock item per branch and variety
stockSchema.index({ branchId: 1, itemName: 1, variety: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
