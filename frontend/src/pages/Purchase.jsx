import React, { useState, useEffect } from 'react';
// v2.0.1 - Cleanup legacy API calls
import api from '../utils/api';
import { Plus, Save, History, Truck } from 'lucide-react';

const Purchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState({
        farmerId: '',
        weight: '',
        moisture: '',
        rate: '',
        totalAmount: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pRes, fRes] = await Promise.all([
                api.get('/purchases'),
                api.get('/farmers')
            ]);
            setPurchases(Array.isArray(pRes.data) ? pRes.data : []);
            setFarmers(Array.isArray(fRes.data) ? fRes.data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setPurchases([]);
            setFarmers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCalculate = (data) => {
        const total = (Number(data.weight) || 0) * (Number(data.rate) || 0);
        setFormData({ ...data, totalAmount: total });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/purchases', formData);
            setIsAdding(false);
            setFormData({ farmerId: '', weight: '', moisture: '', rate: '', totalAmount: 0 });
            fetchData();
        } catch (error) {
            alert('Failed to record purchase');
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Paddy Purchase</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Track paddy procurement and farmer payments</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary"
                >
                    {isAdding ? <History size={18} /> : <Plus size={18} />}
                    <span>{isAdding ? 'View Purchase Log' : 'New Entry'}</span>
                </button>
            </div>

            {isAdding ? (
                <div className="glass-card form-card">
                    <h3 style={{ marginBottom: '24px' }}>New Purchase Entry</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Farmer</label>
                            <select
                                required
                                value={formData.farmerId}
                                onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                                className="form-control"
                            >
                                <option value="">Select Farmer</option>
                                {farmers.map(f => <option key={f._id} value={f._id}>{f.farmerName}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Weight (kg)</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => handleCalculate({ ...formData, weight: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Moisture %</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.moisture}
                                    onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Rate (per kg)</label>
                            <input
                                required
                                type="number"
                                value={formData.rate}
                                onChange={(e) => handleCalculate({ ...formData, rate: e.target.value })}
                                className="form-control"
                            />
                        </div>

                        <div style={{ background: 'var(--primary-light)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Amount</p>
                            <h2 style={{ color: 'var(--primary)' }}>₹{formData.totalAmount.toLocaleString()}</h2>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            <Save size={18} /> Record Purchase
                        </button>
                    </form>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Farmer</th>
                                <th>Weight</th>
                                <th>Rate</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((p) => (
                                <tr key={p._id}>
                                    <td>{new Date(p.date).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{p.farmerId?.farmerName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.farmerId?.village}</div>
                                    </td>
                                    <td>{p.weight} kg</td>
                                    <td>₹{p.rate}/kg</td>
                                    <td style={{ fontWeight: 700 }}>₹{p.totalAmount.toLocaleString()}</td>
                                    <td>
                                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: '#10b98120', color: '#10b981' }}>
                                            Record Saved
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {purchases.length === 0 && (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <Truck size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>No purchase records found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Purchase;
