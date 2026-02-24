const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    riceVariety: { type: String, enum: ['Raw', 'Steam', 'Parboiled'], required: true },
    millingType: { type: String, enum: ['Private', 'CMR'], default: 'Private' },
    paddyUsed: { type: Number, required: true }, // in Quintals
    riceProduced: { type: Number, required: true }, // in Quintals
    brokenRiceProduced: { type: Number, default: 0 },
    huskProduced: { type: Number, default: 0 },
    branProduced: { type: Number, default: 0 },
    productionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Production', productionSchema);
