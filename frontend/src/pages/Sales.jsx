import React, { useState, useEffect } from 'react';
// v2.0.1 - Data robustness update
import api from '../utils/api';
import { FileText, Plus, Save, History, Calculator, Trash2 } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [tenant, setTenant] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        customerName: '',
        riceQuantity: '',
        pricePerKg: '',
        gstPercentage: 5,
        paymentStatus: 'Pending',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
        fetchTenantInfo();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/sales');
            setSales(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTenantInfo = async () => {
        try {
            // Note: Assuming there's a route to get current tenant or it's returned with login
            // For now, let's try to get it from settings/profile if it exists
            const res = await api.get('/auth/me');
            if (res.data?.tenantId) {
                // If we need more details, we might need a specific tenant fetch
                // But usually, user profile has tenant details
                setTenant(res.data.tenantId);
            }
        } catch (error) {
            console.error('Error fetching tenant info:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/sales/${id}/status`, { paymentStatus: newStatus });
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? Total amount will be reverted to stock.')) return;
        try {
            await api.delete(`/sales/${id}`);
            fetchData();
        } catch (err) {
            alert('Failed to delete record');
        }
    };

    const calculateTotal = (data) => {
        const subtotal = (Number(data.riceQuantity) || 0) * (Number(data.pricePerKg) || 0);
        const tax = subtotal * (Number(data.gstPercentage) / 100);
        return subtotal + tax;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sales', formData);
            setIsAdding(false);
            setFormData({
                customerName: '',
                riceQuantity: '',
                pricePerKg: '',
                gstPercentage: 5,
                paymentStatus: 'Pending',
                date: new Date().toISOString().split('T')[0]
            });
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to create invoice';
            alert(msg);
        }
    };

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    const currentTotal = calculateTotal(formData);
    const filteredSales = sales.filter(s =>
        s.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Sales & Invoicing</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Generate invoices and track customer payments</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {!isAdding && (
                        <div className="search-container" style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search customer..."
                                className="form-control"
                                style={{ width: '250px', paddingLeft: '40px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <History size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        </div>
                    )}
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="btn-primary"
                    >
                        {isAdding ? <History size={18} /> : <Plus size={18} />}
                        <span>{isAdding ? 'Invoice History' : 'New Invoice'}</span>
                    </button>
                </div>
            </div>

            {isAdding ? (
                <div className="glass-card form-card">
                    <h3 style={{ marginBottom: '24px' }}>New Sales Invoice</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter customer name"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Invoice Date</label>
                            <input
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="form-control"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Rice Quantity (kg)</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.riceQuantity}
                                    onChange={(e) => setFormData({ ...formData, riceQuantity: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Price per kg</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.pricePerKg}
                                    onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>GST Percentage (%)</label>
                            <select
                                value={formData.gstPercentage}
                                onChange={(e) => setFormData({ ...formData, gstPercentage: e.target.value })}
                                className="form-control"
                            >
                                <option value="0">0% (GST Exempt)</option>
                                <option value="5">5% (Standard Rice)</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Payment Status</label>
                            <select
                                value={formData.paymentStatus}
                                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                className="form-control"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Partial">Partial</option>
                            </select>
                        </div>

                        <div style={{ background: '#0f172a', color: 'white', padding: '24px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', opacity: 0.8 }}>
                                <span>Subtotal</span>
                                <span>₹{((formData.riceQuantity || 0) * (formData.pricePerKg || 0)).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '16px', opacity: 0.8 }}>
                                <span>GST ({formData.gstPercentage}%)</span>
                                <span>₹{(calculateTotal(formData) - (formData.riceQuantity * formData.pricePerKg)).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600 }}>Grand Total</span>
                                <h2 style={{ color: 'var(--primary)', fontWeight: 800 }}>₹{currentTotal.toLocaleString()}</h2>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            <Calculator size={18} /> Finalize & Save Invoice
                        </button>
                    </form>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Quantity</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map((s) => (
                                <tr key={s._id}>
                                    <td>{new Date(s.date).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 600 }}>{s.customerName}</td>
                                    <td>{s.riceQuantity} kg</td>
                                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{s.totalAmount?.toLocaleString()}</td>
                                    <td>
                                        <select
                                            value={s.paymentStatus}
                                            onChange={(e) => handleStatusChange(s._id, e.target.value)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                border: 'none',
                                                cursor: 'pointer',
                                                background: s.paymentStatus === 'Paid' ? '#10b98120' : s.paymentStatus === 'Partial' ? '#f59e0b20' : '#ef444420',
                                                color: s.paymentStatus === 'Paid' ? '#10b981' : s.paymentStatus === 'Partial' ? '#f59e0b' : '#ef4444'
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Partial">Partial</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <button
                                                onClick={() => handleViewInvoice(s)}
                                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                                            >
                                                View PDF
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSales.length === 0 && (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <FileText size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>{searchTerm ? 'No results found for search.' : 'No sales records found.'}</p>
                        </div>
                    )}
                </div>
            )}

            <InvoiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                invoice={selectedInvoice}
                tenant={tenant}
            />
        </div>
    );
};

export default Sales;
