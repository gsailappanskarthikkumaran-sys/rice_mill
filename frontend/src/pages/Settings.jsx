import React, { useState, useEffect } from 'react';
// v2.0.1 - Configuration safety update
import api from '../utils/api';
import { Settings as SettingsIcon, Plus, Building2, MapPin, Loader2, Save } from 'lucide-react';
import './Modules.css';

const Settings = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', location: '', contact: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            setBranches(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/branches', formData);
            setFormData({ name: '', location: '', contact: '' });
            setIsAdding(false);
            fetchBranches();
        } catch (err) {
            setError(err.response?.data?.msg || 'Error adding branch');
        }
    };

    if (loading) return (
        <div className="loading-state">
            <Loader2 className="animate-spin" />
            <p>Loading application settings...</p>
        </div>
    );

    return (
        <div className="module-container fade-in">
            <div className="module-header">
                <h1 className="module-title">Application Settings</h1>
                <p className="module-subtitle">Manage branches, mill locations, and system configuration</p>
            </div>

            <div className="stats-container">
                <div className="module-card glass-card" style={{ flex: 1 }}>
                    <h2 className="card-title">Branch Management</h2>
                    <p className="module-subtitle" style={{ marginBottom: '20px' }}>Add and manage your rice mill branch locations</p>

                    <button
                        className="btn-primary"
                        style={{ marginBottom: '20px', width: 'fit-content' }}
                        onClick={() => setIsAdding(!isAdding)}
                    >
                        <Plus size={18} /> {isAdding ? 'Cancel' : 'Add New Branch'}
                    </button>

                    {isAdding && (
                        <div className="fade-in" style={{ marginBottom: '30px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                            {error && <p className="error-message" style={{ marginBottom: '20px' }}>{error}</p>}
                            <form onSubmit={handleSubmit} className="module-form">
                                <div className="form-group">
                                    <label className="input-label">Branch Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Main Mill, Storage A, etc."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Contact Number</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-full">
                                    <label className="input-label">Location/Address</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-full" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <button type="submit" className="btn-primary">Save Branch</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="branches-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {branches.map((branch) => (
                            <div key={branch._id} className="module-card" style={{ padding: '20px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <div className="icon-container" style={{ margin: 0, padding: '8px' }}>
                                        <Building2 size={20} color="var(--primary)" />
                                    </div>
                                    <span className="badge badge-success">Active</span>
                                </div>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{branch.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <MapPin size={14} /> {branch.location}
                                </p>
                                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn-primary" style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '5px 12px', fontSize: '13px' }}>
                                        Edit Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="module-card glass-card" style={{ width: '350px' }}>
                    <h2 className="card-title">System Info</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="form-group">
                            <label className="input-label">Currency Symbol</label>
                            <input type="text" className="input-field" defaultValue="₹" disabled />
                        </div>
                        <div className="form-group">
                            <label className="input-label">Tax Rate (%)</label>
                            <input type="text" className="input-field" defaultValue="5" disabled />
                        </div>
                        <div className="form-group">
                            <label className="input-label">Measurement Unit</label>
                            <input type="text" className="input-field" defaultValue="Quintals (q)" disabled />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                * Some settings are restricted to Tenant Administrators only.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
