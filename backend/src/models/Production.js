const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    inputPaddy: { type: Number, required: true },
    outputRice: { type: Number, required: true },
    husk: { type: Number, required: true },
    wastage: { type: Number, required: true },
    productionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Production', productionSchema);
