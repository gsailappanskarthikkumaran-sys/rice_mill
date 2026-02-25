const Sale = require('../models/Sale');
const Stock = require('../models/Stock');

// @desc    Create a sale and update stock
// @route   POST /api/sales
// @access  Private
exports.createSale = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;

        // Backend calculation for security and data integrity
        if (!req.body.totalAmount) {
            const subtotal = (Number(req.body.riceQuantity) || 0) * (Number(req.body.pricePerKg) || 0);
            const gstAmount = subtotal * ((Number(req.body.gstPercentage) || 0) / 100);
            req.body.totalAmount = subtotal + gstAmount;
        }

        const sale = await Sale.create(req.body);

        // Check for sufficient Rice Stock
        const stock = await Stock.findOne({ tenantId: req.tenantId });
        if (!stock || stock.riceStock < req.body.riceQuantity) {
            // Revert the sale if stock is insufficient (Transaction-like behavior)
            await Sale.findByIdAndDelete(sale._id);
            return res.status(400).json({
                error: 'Insufficient Rice stock',
                currentStock: stock ? stock.riceStock : 0,
                required: req.body.riceQuantity
            });
        }

        // Update Stock (Atomic Decrement)
        await Stock.findOneAndUpdate(
            { tenantId: req.tenantId },
            { $inc: { riceStock: -req.body.riceQuantity } }
        );

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
                    _id: '$tenantId',
                    totalRevenue: { $sum: '$totalAmount' },
                    totalQuantity: { $sum: '$riceQuantity' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(stats[0] || { totalRevenue: 0, totalQuantity: 0, count: 0 });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all sales logs for a tenant
// @route   GET /api/sales
// @access  Private
exports.getSales = async (req, res, next) => {
    try {
        const sales = await Sale.find({ tenantId: req.tenantId })
            .sort({ date: -1 });
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
};
// @desc    Delete a sale and revert stock
// @route   DELETE /api/sales/:id
// @access  Private
exports.deleteSale = async (req, res, next) => {
    try {
        const sale = await Sale.findOne({ _id: req.params.id, tenantId: req.tenantId });
        if (!sale) {
            return res.status(404).json({ error: 'Sale record not found' });
        }

        // Revert Stock
        await Stock.findOneAndUpdate(
            { tenantId: req.tenantId },
            { $inc: { riceStock: sale.riceQuantity } }
        );

        await Sale.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Sale record deleted and stock reverted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Update sale payment status
// @route   PATCH /api/sales/:id/status
// @access  Private
exports.updateSaleStatus = async (req, res, next) => {
    try {
        const { paymentStatus } = req.body;
        const sale = await Sale.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            { paymentStatus },
            { new: true, runValidators: true }
        );

        if (!sale) {
            return res.status(404).json({ error: 'Sale record not found' });
        }

        res.status(200).json(sale);
    } catch (error) {
        next(error);
    }
};
