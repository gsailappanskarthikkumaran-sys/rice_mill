const Stock = require('../models/Stock');

// @desc    Get current stock for the tenant
// @route   GET /api/stocks
// @access  Private
exports.getStocks = async (req, res, next) => {
    try {
        let stock = await Stock.findOne({ tenantId: req.tenantId });

        // If no stock record exists yet, create one
        if (!stock) {
            stock = await Stock.create({ tenantId: req.tenantId });
        }

        res.status(200).json(stock);
    } catch (error) {
        next(error);
    }
};

// @desc    Update stock levels manually (Adjustment)
// @route   PUT /api/stocks
// @access  Private (MillOwner/SuperAdmin)
exports.updateStocks = async (req, res, next) => {
    try {
        const { paddyStock, riceStock, huskStock } = req.body;

        const stock = await Stock.findOneAndUpdate(
            { tenantId: req.tenantId },
            {
                $set: {
                    ...(paddyStock !== undefined && { paddyStock }),
                    ...(riceStock !== undefined && { riceStock }),
                    ...(huskStock !== undefined && { huskStock })
                }
            },
            { new: true, runValidators: true, upsert: true }
        );

        res.status(200).json(stock);
    } catch (error) {
        next(error);
    }
};
