const Production = require('../models/Production');
const Stock = require('../models/Stock');

// @desc    Record production (Paddy -> Rice/Broken/Husk/Bran)
// @route   POST /api/production
// @access  Private
exports.createProduction = async (req, res, next) => {
    try {
        const {
            branchId,
            paddyVariety,
            riceVariety,
            paddyUsed,
            riceProduced,
            brokenRiceProduced,
            huskProduced,
            branProduced
        } = req.body;

        req.body.tenantId = req.tenantId;
        const production = await Production.create(req.body);

        // 1. Decrease Paddy Stock (specific variety)
        await Stock.findOneAndUpdate(
            { tenantId: req.tenantId, branchId, itemName: 'Paddy', variety: paddyVariety || 'Common' },
            { $inc: { quantity: -paddyUsed } }
        );

        // 2. Increase Rice Stock (specific variety)
        await Stock.findOneAndUpdate(
            { tenantId: req.tenantId, branchId, itemName: 'Rice', variety: riceVariety },
            { $inc: { quantity: riceProduced } },
            { upsert: true }
        );

        // 3. Increase Broken Rice Stock
        if (brokenRiceProduced) {
            await Stock.findOneAndUpdate(
                { tenantId: req.tenantId, branchId, itemName: 'Broken Rice', variety: riceVariety },
                { $inc: { quantity: brokenRiceProduced } },
                { upsert: true }
            );
        }

        // 4. Increase By-products stock
        if (huskProduced) {
            await Stock.findOneAndUpdate(
                { tenantId: req.tenantId, branchId, itemName: 'Husk', variety: 'Standard' },
                { $inc: { quantity: huskProduced } },
                { upsert: true }
            );
        }
        if (branProduced) {
            await Stock.findOneAndUpdate(
                { tenantId: req.tenantId, branchId, itemName: 'Bran', variety: 'Standard' },
                { $inc: { quantity: branProduced } },
                { upsert: true }
            );
        }

        res.status(201).json(production);
    } catch (error) {
        next(error);
    }
};
