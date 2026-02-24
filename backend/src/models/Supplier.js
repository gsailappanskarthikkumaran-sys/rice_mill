const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: String,
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
