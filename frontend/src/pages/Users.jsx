import React, { useState, useEffect } from 'react';
// v2.0.1 - Staff management safety update
import api from '../utils/api';
import { Users as UsersIcon, UserPlus, Shield, Mail, Lock, CheckCircle, XCircle } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Operator'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            setIsAdding(false);
            setFormData({ name: '', email: '', password: '', role: 'Operator' });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.msg || 'Failed to create user');
        }
    };

    const toggleStatus = async (userId) => {
        try {
            await api.patch(`/users/${userId}/toggle`);
            fetchUsers();
        } catch (error) {
            alert('Failed to update user status');
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading staff records...</div>;

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Staff Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage user accounts, roles and system access</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary"
                >
                    {isAdding ? <UsersIcon size={18} /> : <UserPlus size={18} />}
                    <span>{isAdding ? 'View All Staff' : 'Add New User'}</span>
                </button>
            </div>

            {isAdding ? (
                <div className="glass-card form-card">
                    <h3 style={{ marginBottom: '24px' }}>Register New User</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter staff name"
                                className="form-control"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                required
                                type="email"
                                placeholder="Used for system login"
                                className="form-control"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                required
                                type="password"
                                placeholder="Enter strong password"
                                className="form-control"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>System Role</label>
                            <select
                                className="form-control"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="MillOwner">Mill Owner (Full Admin)</option>
                                <option value="Accountant">Accountant (Sales/Purchase Focus)</option>
                                <option value="Operator">Operator (Production Focus)</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                            Create User Account
                        </button>
                    </form>
                </div>
            ) : (
                <div className="stats-grid">
                    {users.map((u) => (
                        <div key={u._id} className="glass-card" style={{ padding: '24px', position: 'relative', opacity: u.isActive ? 1 : 0.6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Shield size={24} />
                                </div>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: u.isActive ? '#10b98120' : '#ef444420',
                                    color: u.isActive ? '#10b981' : '#ef4444'
                                }}>
                                    {u.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <h3 style={{ fontSize: '1.125rem', marginBottom: '4px' }}>{u.name}</h3>
                            <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '16px' }}>{u.role}</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    <Mail size={14} /> {u.email}
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                <button
                                    onClick={() => toggleStatus(u._id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: u.isActive ? '#ef4444' : '#10b981',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    {u.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                    {u.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                                    Edit Settings
                                </button>
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center' }}>
                            <UsersIcon size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>No staff accounts registered.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Users;
