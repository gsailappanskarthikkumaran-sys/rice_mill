const Purchase = require('../models/Purchase');
const Stock = require('../models/Stock');

// @desc    Create a purchase and update stock
// @route   POST /api/purchases
// @access  Private
exports.createPurchase = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;
        const purchase = await Purchase.create(req.body);

        // Update Stock (Atomic Increment)
        await Stock.findOneAndUpdate(
            { tenantId: req.tenantId },
            { $inc: { paddyStock: req.body.weight } },
            { upsert: true, new: true }
        );

        res.status(201).json(purchase);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all purchases
// @route   GET /api/purchases
// @access  Private
exports.getPurchases = async (req, res, next) => {
    try {
        const purchases = await Purchase.find({ tenantId: req.tenantId })
            .populate('farmerId', 'farmerName village')
            .sort({ date: -1 });
        res.status(200).json(purchases);
    } catch (error) {
        next(error);
    }
};
