import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Building2, Plus, Layout, Palette, Save, Moon, Sun, Monitor, Trash2, Edit, X } from 'lucide-react';
import { applyTheme } from '../utils/theme';

const Settings = () => {
    // Theme State
    const [theme, setTheme] = useState({
        primaryColor: '#4361ee',
        radius: '8px',
        mode: 'light'
    });

    // Tenant State
    const [tenant, setTenant] = useState({
        millName: '',
        ownerName: '',
        address: '',
        contactNumber: '',
        gstNumber: '',
        email: '',
        website: ''
    });
    const [loadingTenant, setLoadingTenant] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme) setTheme(JSON.parse(savedTheme));
        fetchBranches();
        fetchTenantData();
    }, []);

    const fetchTenantData = async () => {
        try {
            setLoadingTenant(true);
            const res = await api.get('/auth/me');
            if (res.data?.tenantId) {
                // The /auth/me route in my previous implementation returned tenantId as an object if populated
                // Let's ensure we handle both cases or assume it's populated now
                const tData = res.data.tenantId;
                setTenant({
                    millName: tData.millName || '',
                    ownerName: tData.ownerName || '',
                    address: tData.address || '',
                    contactNumber: tData.contactNumber || '',
                    gstNumber: tData.gstNumber || '',
                    email: tData.email || '',
                    website: tData.website || ''
                });
            }
        } catch (error) {
            console.error('Error fetching tenant data:', error);
        } finally {
            setLoadingTenant(false);
        }
    };

    const handleTenantUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/tenants/me', tenant);
            alert('Mill details updated successfully!');
            fetchTenantData();
        } catch (error) {
            alert('Failed to update mill details');
        }
    };

    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            setBranches(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleApplyTheme = () => {
        applyTheme(theme.primaryColor, theme.radius);
        localStorage.setItem('app-theme', JSON.stringify(theme));
        alert('Theme applied successfully!');
    };

    const handleEditBranch = (branch) => {
        setBranchData({
            name: branch.name,
            location: branch.location,
            contact: branch.contact
        });
        setSelectedBranchId(branch._id);
        setIsEditingBranch(true);
        setIsAddingBranch(true);
    };

    const handleDeleteBranch = async (id) => {
        if (!window.confirm('Delete this branch?')) return;
        try {
            await api.delete(`/branches/${id}`);
            fetchBranches();
        } catch (err) {
            alert('Failed to delete branch');
        }
    };

    const handleBranchSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditingBranch) {
                await api.put(`/branches/${selectedBranchId}`, branchData);
            } else {
                await api.post('/branches', branchData);
            }
            setIsAddingBranch(false);
            setIsEditingBranch(false);
            setSelectedBranchId(null);
            setBranchData({ name: '', location: '', contact: '' });
            fetchBranches();
        } catch (error) {
            alert(error.response?.data?.msg || 'Failed to save branch');
        }
    };

    const toggleBranchView = () => {
        if (isAddingBranch) {
            setIsAddingBranch(false);
            setIsEditingBranch(false);
            setBranchData({ name: '', location: '', contact: '' });
            setSelectedBranchId(null);
        } else {
            setIsAddingBranch(true);
        }
    };

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>System Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Configure your mill branches and application appearance</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                {/* Branch Management */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Building2 className="text-primary" />
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Mill Branches</h2>
                        </div>
                        <button
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                            onClick={toggleBranchView}
                        >
                            {isAddingBranch ? <X size={16} /> : <Plus size={16} />}
                            {isAddingBranch ? 'Cancel' : 'Add Branch'}
                        </button>
                    </div>

                    {isAddingBranch ? (
                        <form onSubmit={handleBranchSubmit} style={{ marginBottom: '32px', background: 'var(--bg-light)', padding: '24px', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>{isEditingBranch ? 'Edit Branch' : 'New Branch Details'}</h3>
                            <div className="form-group">
                                <label>Branch Name</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={branchData.name}
                                    onChange={(e) => setBranchData({ ...branchData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={branchData.location}
                                    onChange={(e) => setBranchData({ ...branchData, location: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Number</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={branchData.contact}
                                    onChange={(e) => setBranchData({ ...branchData, contact: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                {isEditingBranch ? 'Update Branch' : 'Create Branch'}
                            </button>
                        </form>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {branches.map(branch => (
                                <div key={branch._id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-card)'
                                }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{branch.name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{branch.location} • {branch.contact}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEditBranch(branch)}
                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBranch(branch._id)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {branches.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No branches configured.</p>}
                        </div>
                    )}
                </div>

                {/* Aesthetic Settings & Mill Branding */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Mill Branding Section */}
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <Building2 className="text-primary" />
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Mill Branding</h2>
                        </div>
                        <form onSubmit={handleTenantUpdate}>
                            <div className="form-group">
                                <label>Mill Name</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={tenant.millName}
                                    onChange={(e) => setTenant({ ...tenant, millName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Proprietor Name</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={tenant.ownerName}
                                    onChange={(e) => setTenant({ ...tenant, ownerName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>GSTIN / Registration No.</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 22AAAAA0000A1Z5"
                                    className="form-control"
                                    value={tenant.gstNumber}
                                    onChange={(e) => setTenant({ ...tenant, gstNumber: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Business Address</label>
                                <textarea
                                    className="form-control"
                                    style={{ height: '80px', resize: 'none' }}
                                    value={tenant.address}
                                    onChange={(e) => setTenant({ ...tenant, address: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>Contact Phone</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        value={tenant.contactNumber}
                                        onChange={(e) => setTenant({ ...tenant, contactNumber: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Business Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={tenant.email}
                                        onChange={(e) => setTenant({ ...tenant, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                                <Save size={18} /> Update Mill Profile
                            </button>
                        </form>
                    </div>

                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <Palette className="text-primary" />
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Design System</h2>
                        </div>

                        <div className="form-group">
                            <label>Primary Brand Color</label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    value={theme.primaryColor}
                                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                                    style={{ width: '50px', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    value={theme.primaryColor}
                                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Interface Roundness</label>
                            <select
                                className="form-control"
                                value={theme.radius}
                                onChange={(e) => setTheme({ ...theme, radius: e.target.value })}
                            >
                                <option value="0px">Sharp (0px)</option>
                                <option value="4px">Sleek (4px)</option>
                                <option value="8px">Standard (8px)</option>
                                <option value="12px">Rounded (12px)</option>
                                <option value="20px">Soft (20px)</option>
                            </select>
                        </div>

                        <button onClick={handleApplyTheme} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            <Save size={18} /> Apply Visual Changes
                        </button>
                    </div>

                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <Layout className="text-primary" />
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Display Mode</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <button
                                className={`btn-secondary ${theme.mode === 'light' ? 'active' : ''}`}
                                onClick={() => setTheme({ ...theme, mode: 'light' })}
                                style={{ justifyContent: 'center', opacity: theme.mode === 'light' ? 1 : 0.6 }}
                            >
                                <Sun size={18} /> Light
                            </button>
                            <button
                                className={`btn-secondary ${theme.mode === 'dark' ? 'active' : ''}`}
                                onClick={() => setTheme({ ...theme, mode: 'dark' })}
                                style={{ justifyContent: 'center', opacity: theme.mode === 'dark' ? 1 : 0.6 }}
                            >
                                <Moon size={18} /> Dark
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
