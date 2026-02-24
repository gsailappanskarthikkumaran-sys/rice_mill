import React, { useState, useEffect } from 'react';
// v2.0.1 - Refactored to handle object response
import api from '../utils/api';
import { Box, Package, RefreshCw, TrendingUp } from 'lucide-react';

const Stocks = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/stocks');
            const data = res.data;

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

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Inventory Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time stock levels for paddy and processed rice</p>
                </div>
                <button
                    onClick={fetchStocks}
                    className="btn-primary"
                    style={{ background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                >
                    <RefreshCw size={18} />
                    <span>Refresh Stock</span>
                </button>
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
                                {stock.totalQuantity > 1000 ? 'High Stock' : 'Low Stock'}
                            </span>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{stock.itemName}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total available quantity</p>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{stock.totalQuantity.toLocaleString()}</h2>
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
        </div>
    );
};

export default Stocks;
