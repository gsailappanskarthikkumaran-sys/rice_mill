import React, { useState, useEffect } from 'react';
// v2.0.1 - Robust directory fetching
import api from '../utils/api';
import { Plus, Users, Phone, MapPin, Search } from 'lucide-react';

const Farmers = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ farmerName: '', phoneNumber: '', village: '' });

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/farmers');
            setFarmers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/farmers', formData);
            setFormData({ farmerName: '', phoneNumber: '', village: '' });
            setIsAdding(false);
            fetchFarmers();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error adding farmer');
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Farmer Directory</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage paddy suppliers and their details</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setIsAdding(!isAdding)}
                >
                    <Plus size={18} />
                    <span>{isAdding ? 'View List' : 'Add Farmer'}</span>
                </button>
            </div>

            {isAdding ? (
                <div className="glass-card form-card">
                    <h3 style={{ marginBottom: '24px' }}>Register New Farmer</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Farmer Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter full name"
                                className="form-control"
                                value={formData.farmerName}
                                onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                required
                                type="text"
                                placeholder="10-digit mobile number"
                                className="form-control"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Village</label>
                            <input
                                required
                                type="text"
                                placeholder="Primary location"
                                className="form-control"
                                value={formData.village}
                                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                            Save Farmer Profile
                        </button>
                    </form>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Farmer Name</th>
                                <th>Phone Number</th>
                                <th>Village</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {farmers.map((f) => (
                                <tr key={f._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {f.farmerName.charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{f.farmerName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <Phone size={14} />
                                            {f.phoneNumber}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <MapPin size={14} />
                                            {f.village}
                                        </div>
                                    </td>
                                    <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {farmers.length === 0 && (
                        <div style={{ padding: '80px', textAlign: 'center' }}>
                            <Users size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>No farmers found. Start by adding one.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Farmers;
