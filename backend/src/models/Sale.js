const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    customerName: { type: String, required: true },
    riceQuantity: { type: Number, required: true },
    pricePerKg: { type: Number, required: true },
    gstPercentage: { type: Number, default: 18 },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid', 'Partial', 'Pending'], default: 'Unpaid' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
