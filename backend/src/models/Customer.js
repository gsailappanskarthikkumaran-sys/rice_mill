const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: String,
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
