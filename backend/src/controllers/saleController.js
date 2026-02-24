const Sale = require('../models/Sale');
const Stock = require('../models/Stock');

// @desc    Create a sale and update stock
// @route   POST /api/sales
// @access  Private
exports.createSale = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;

        // Calculate GST if not provided
        if (!req.body.taxAmount && (req.body.cgst || req.body.sgst || req.body.igst)) {
            req.body.taxAmount = (req.body.cgst || 0) + (req.body.sgst || 0) + (req.body.igst || 0);
        }

        const sale = await Sale.create(req.body);

        // Update Stock for each item sold (Variety Aware)
        for (const item of req.body.items) {
            await Stock.findOneAndUpdate(
                {
                    tenantId: req.tenantId,
                    branchId: req.body.branchId,
                    itemName: item.itemName,
                    variety: item.variety || 'Standard'
                },
                {
                    $inc: {
                        quantity: -item.quantity,
                        bags: -(item.numberOfBags || 0)
                    }
                }
            );
        }

        res.status(201).json(sale);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Sales with aggregation for analytics
// @route   GET /api/sales/analytics
exports.getAnalytics = async (req, res, next) => {
    try {
        const stats = await Sale.aggregate([
            { $match: { tenantId: req.tenantId } },
            {
                $group: {
                    _id: '$branchId',
                    totalRevenue: { $sum: '$grandTotal' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};
