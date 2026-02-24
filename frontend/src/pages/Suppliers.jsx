import React, { useState, useEffect } from 'react';
// v2.0.1 - Robust supplier directory fetching
import api from '../utils/api';
import { Plus, Truck, Phone, MapPin, Search } from 'lucide-react';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', contact: '', address: '' });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/suppliers');
            setSuppliers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setSuppliers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/suppliers', formData);
            setFormData({ name: '', contact: '', address: '' });
            setIsAdding(false);
            fetchSuppliers();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error adding supplier');
        }
    };

    if (loading) {
        return (
            <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div className="loader"></div>
                <p style={{ color: 'var(--text-muted)' }}>Loading Suppliers...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Supplier Directory</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage material suppliers and service providers</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setIsAdding(!isAdding)}
                >
                    <Plus size={18} />
                    <span>{isAdding ? 'View List' : 'Add Supplier'}</span>
                </button>
            </div>

            {isAdding ? (
                <div className="glass-card form-card">
                    <h3 style={{ marginBottom: '24px' }}>Register New Supplier</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Supplier/Company Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter company name"
                                className="form-control"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Number</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter contact phone"
                                className="form-control"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                required
                                type="text"
                                placeholder="Warehouse/Office location"
                                className="form-control"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                            Save Supplier Profile
                        </button>
                    </form>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Contact</th>
                                <th>Location</th>
                                <th>Registered On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(suppliers || []).map((s) => (
                                <tr key={s._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {s.name.charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{s.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <Phone size={14} />
                                            {s.contact}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <MapPin size={14} />
                                            {s.address}
                                        </div>
                                    </td>
                                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {suppliers.length === 0 && (
                        <div style={{ padding: '80px', textAlign: 'center' }}>
                            <Truck size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>No suppliers listed. Start by adding one.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Suppliers;
