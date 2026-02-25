import React, { useState, useEffect } from 'react';
// v2.0.2 - Added Stock Adjustment Modal
import api from '../utils/api';
import { Box, Package, RefreshCw, TrendingUp, Edit3, X, Save } from 'lucide-react';

const Stocks = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rawStockData, setRawStockData] = useState(null);
    const [isAdjusting, setIsAdjusting] = useState(false);
    const [adjustmentData, setAdjustmentData] = useState({
        paddyStock: 0,
        riceStock: 0,
        huskStock: 0
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/stocks');
            const data = res.data;
            setRawStockData(data);

            setAdjustmentData({
                paddyStock: data.paddyStock || 0,
                riceStock: data.riceStock || 0,
                huskStock: data.huskStock || 0
            });

            // Transform single stock object into array for the grid UI
            const formattedStocks = [
                { id: 'paddy', itemName: 'Paddy Stock', totalQuantity: data.paddyStock || 0, updatedAt: data.updatedAt },
                { id: 'rice', itemName: 'Processed Rice', totalQuantity: data.riceStock || 0, updatedAt: data.updatedAt },
                { id: 'husk', itemName: 'Husk Stock', totalQuantity: data.huskStock || 0, updatedAt: data.updatedAt }
            ];

            setStocks(Array.isArray(formattedStocks) ? formattedStocks : []);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            setStocks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAdjustSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await api.put('/stocks', adjustmentData);
            await fetchStocks();
            setIsAdjusting(false);
        } catch (error) {
            console.error('Error adjusting stocks:', error);
            alert('Failed to update stock. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Inventory Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time stock levels and manual corrections</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setIsAdjusting(true)}
                        className="btn-primary"
                        style={{ background: 'var(--primary)', color: 'white', border: 'none' }}
                    >
                        <Edit3 size={18} />
                        <span>Adjust Stock</span>
                    </button>
                    <button
                        onClick={fetchStocks}
                        className="btn-primary"
                        style={{ background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                    >
                        <RefreshCw size={18} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                {stocks.map((stock) => (
                    <div key={stock.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box size={24} />
                            </div>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: stock.totalQuantity > 1000 ? '#10b98120' : '#f59e0b20',
                                color: stock.totalQuantity > 1000 ? '#10b981' : '#f59e0b'
                            }}>
                                {stock.totalQuantity < 0 ? 'Negative Stock' : (stock.totalQuantity > 1000 ? 'High Stock' : 'Low Stock')}
                            </span>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{stock.itemName}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total available quantity</p>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: stock.totalQuantity < 0 ? '#ef4444' : 'inherit' }}>
                                {stock.totalQuantity.toLocaleString()}
                            </h2>
                            <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>KG</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                            <TrendingUp size={14} />
                            <span>Last updated: {new Date(stock.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}

                {stocks.length === 0 && (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '80px', textAlign: 'center' }}>
                        <Package size={64} color="var(--text-light)" style={{ marginBottom: '24px' }} />
                        <h3>No Inventory Data</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '8px auto 0' }}>Your stock levels will automatically update when you record purchases and production batches.</p>
                    </div>
                )}
            </div>

            {/* Adjustment Modal */}
            {isAdjusting && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="glass-card" style={{ width: '450px', padding: '32px', position: 'relative' }}>
                        <button
                            onClick={() => setIsAdjusting(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ marginBottom: '8px' }}>Manual Stock Correction</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem' }}>Update your inventory levels to match physical stock.</p>

                        <form onSubmit={handleAdjustSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Paddy Stock (KG)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={adjustmentData.paddyStock}
                                    onChange={(e) => setAdjustmentData({ ...adjustmentData, paddyStock: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Rice Stock (KG)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={adjustmentData.riceStock}
                                    onChange={(e) => setAdjustmentData({ ...adjustmentData, riceStock: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>Husk Stock (KG)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={adjustmentData.huskStock}
                                    onChange={(e) => setAdjustmentData({ ...adjustmentData, huskStock: Number(e.target.value) })}
                                    required
                                />
                            </div>

                            <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsAdjusting(false)}
                                    className="btn-primary"
                                    style={{ flex: 1, background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ flex: 1 }}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stocks;
