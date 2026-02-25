const Production = require('../models/Production');
const Stock = require('../models/Stock');

// @desc    Record production (Paddy -> Rice/Husk/Wastage)
// @route   POST /api/production
// @access  Private
exports.createProduction = async (req, res, next) => {
    try {
        const { inputPaddy, outputRice, husk, wastage } = req.body;

        // Check for sufficient Paddy Stock
        const stock = await Stock.findOne({ tenantId: req.tenantId });
        if (!stock || stock.paddyStock < inputPaddy) {
            return res.status(400).json({
                error: 'Insufficient Paddy stock',
                currentStock: stock ? stock.paddyStock : 0,
                required: inputPaddy
            });
        }

        req.body.tenantId = req.tenantId;
        const production = await Production.create(req.body);

        // Update Stock (Atomic Updates)
        await Stock.findOneAndUpdate(
            { tenantId: req.tenantId },
            {
                $inc: {
                    paddyStock: -inputPaddy,
                    riceStock: outputRice,
                    huskStock: husk
                }
            }
        );

        res.status(201).json(production);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all production logs for a tenant
// @route   GET /api/production
// @access  Private
exports.getProductions = async (req, res, next) => {
    try {
        const productions = await Production.find({ tenantId: req.tenantId })
            .sort({ productionDate: -1 });
        res.status(200).json(productions);
    } catch (error) {
        next(error);
    }
};
