const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    weight: { type: Number, required: true }, // kg
    moisture: { type: Number, required: true }, // %
    rate: { type: Number, required: true }, // per kg
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
