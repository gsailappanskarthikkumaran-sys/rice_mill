const Purchase = require('../models/Purchase');
const Stock = require('../models/Stock');

// @desc    Create a purchase and update stock
// @route   POST /api/purchases
// @access  Private
exports.createPurchase = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;
        const purchase = await Purchase.create(req.body);

        // Update Stock with variety awareness
        await Stock.findOneAndUpdate(
            {
                tenantId: req.tenantId,
                branchId: req.body.branchId,
                itemName: req.body.itemType || 'Paddy',
                variety: req.body.variety || 'Common'
            },
            {
                $inc: {
                    quantity: req.body.quantity,
                    bags: req.body.numberOfBags || 0
                }
            },
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
            .populate('branchId', 'name')
            .populate('supplierId', 'name');
        res.status(200).json(purchases);
    } catch (error) {
        next(error);
    }
};
