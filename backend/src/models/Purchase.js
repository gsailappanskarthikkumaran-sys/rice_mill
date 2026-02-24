const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    itemType: { type: String, default: 'Paddy' },
    variety: { type: String, default: 'Common' }, // Grade A, Common
    numberOfBags: { type: Number },
    weightPerBag: { type: Number }, // Usually 75kg
    quantity: { type: Number, required: true }, // Total Quintals
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    mandiFee: { type: Number, default: 0 },
    gatePassNo: { type: String },
    gstRate: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Completed' }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
