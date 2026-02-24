import React, { useState, useEffect } from 'react';
// v2.0.1 - Admin tenant management update
import api from '../utils/api';
import { Plus, Building2, User, Mail, ShieldCheck } from 'lucide-react';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        millName: '',
        ownerName: '',
        email: '',
        password: '',
        subscriptionStatus: 'active'
    });

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const res = await api.get('/tenants');
            setTenants(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tenants', formData);
            setFormData({ millName: '', ownerName: '', email: '', password: '', subscriptionStatus: 'active' });
            setIsAdding(false);
            fetchTenants();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error adding tenant');
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Tenant (Mill) Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage multi-tenant mill accounts and owners</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setIsAdding(!isAdding)}
                >
                    <Plus size={18} />
                    <span>{isAdding ? 'View Mills' : 'Add New Mill'}</span>
                </button>
            </div>

            {isAdding ? (
                <div className="glass-card form-card">
                    <h3 style={{ marginBottom: '24px' }}>Register New Mill Tenant</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Rice Mill Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter mill/business name"
                                className="form-control"
                                value={formData.millName}
                                onChange={(e) => setFormData({ ...formData, millName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Owner Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter primary contact name"
                                className="form-control"
                                value={formData.ownerName}
                                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Owner Email</label>
                            <input
                                required
                                type="email"
                                placeholder="Used for login and notifications"
                                className="form-control"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Initial Login Password</label>
                            <input
                                required
                                type="password"
                                placeholder="Enter strong password"
                                className="form-control"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                            Onboard Mill Tenant
                        </button>
                    </form>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mill Name</th>
                                <th>Owner</th>
                                <th>Account Email</th>
                                <th>Status</th>
                                <th>Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((t) => (
                                <tr key={t._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Building2 size={20} />
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{t.millName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <User size={14} />
                                            {t.ownerName}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                            <Mail size={14} />
                                            {t.email}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: t.subscriptionStatus === 'active' ? '#10b98120' : '#ef444420',
                                            color: t.subscriptionStatus === 'active' ? '#10b981' : '#ef4444'
                                        }}>
                                            {(t.subscriptionStatus || 'active').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {tenants.length === 0 && (
                        <div style={{ padding: '80px', textAlign: 'center' }}>
                            <ShieldCheck size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>No mill tenants registered. SuperAdmin only.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Tenants;
