import React, { useState, useEffect } from 'react';
// v2.0.1 - Refactored for clean API interaction
import api from '../utils/api';
import { Cpu, Save, History, Box } from 'lucide-react';

const Production = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState({
        inputPaddy: '',
        outputRice: '',
        husk: '',
        wastage: '',
        productionDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/production');
            setBatches(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setBatches([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/production', formData);
            setIsAdding(false);
            setFormData({
                inputPaddy: '',
                outputRice: '',
                husk: '',
                wastage: '',
                productionDate: new Date().toISOString().split('T')[0]
            });
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to record production batch';
            alert(msg);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Milling Operations</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Log paddy processing and output details</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary"
                >
                    {isAdding ? <History size={18} /> : <Cpu size={18} />}
                    <span>{isAdding ? 'View Batch History' : 'New Batch'}</span>
                </button>
            </div>

            {isAdding ? (
                <div className="glass-card form-card">
                    <h3 style={{ marginBottom: '24px' }}>Log Production Batch</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Production Date</label>
                            <input
                                required
                                type="date"
                                value={formData.productionDate}
                                onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Input Paddy (kg)</label>
                            <input
                                required
                                type="number"
                                placeholder="0.00"
                                value={formData.inputPaddy}
                                onChange={(e) => setFormData({ ...formData, inputPaddy: e.target.value })}
                                className="form-control"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Output Rice (kg)</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.outputRice}
                                    onChange={(e) => setFormData({ ...formData, outputRice: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Husk (kg)</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.husk}
                                    onChange={(e) => setFormData({ ...formData, husk: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Wastage (kg)</label>
                            <input
                                required
                                type="number"
                                placeholder="0.00"
                                value={formData.wastage}
                                onChange={(e) => setFormData({ ...formData, wastage: e.target.value })}
                                className="form-control"
                            />
                        </div>

                        <div style={{ background: 'var(--primary-light)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Recovery Rate</p>
                            <h2 style={{ color: 'var(--primary)' }}>
                                {formData.inputPaddy > 0 ? ((formData.outputRice / formData.inputPaddy) * 100).toFixed(1) : 0}%
                            </h2>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            <Save size={18} /> Record Batch
                        </button>
                    </form>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Input (Paddy)</th>
                                <th>Output (Rice)</th>
                                <th>Husk</th>
                                <th>Yield %</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {batches.map((b) => (
                                <tr key={b._id}>
                                    <td>{new Date(b.productionDate).toLocaleDateString()}</td>
                                    <td>{b.inputPaddy} kg</td>
                                    <td style={{ fontWeight: 600, color: 'var(--success)' }}>{b.outputRice} kg</td>
                                    <td>{b.husk} kg</td>
                                    <td style={{ fontWeight: 700 }}>
                                        {((b.outputRice / b.inputPaddy) * 100).toFixed(1)}%
                                    </td>
                                    <td>
                                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: '#10b98120', color: '#10b981' }}>
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {batches.length === 0 && (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <Box size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>No production batches found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Production;
