const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [{
        itemName: String,
        variety: String,
        numberOfBags: Number,
        quantity: Number, // in Quintals
        price: Number,
        total: Number,
        hsnCode: String
    }],
    totalAmount: { type: Number, required: true },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    vehicleNo: { type: String },
    paymentStatus: { type: String, enum: ['Paid', 'Partial', 'Unpaid'], default: 'Paid' }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
