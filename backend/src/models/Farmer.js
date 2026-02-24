const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    farmerName: { type: String, required: true },
    mobile: { type: String, required: true },
    village: { type: String },
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Farmer', farmerSchema);
