import React from 'react';
import { X, Printer, Download, Building2, Phone, Mail, Globe } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, invoice, tenant }) => {
    if (!isOpen || !invoice) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="invoice-container glass-card" style={{
                width: '850px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'white',
                color: '#1e293b',
                padding: '0',
                borderRadius: '16px',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {/* Modal Header/Actions - Hidden on Print */}
                <div className="no-print" style={{
                    padding: '15px 30px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px'
                }}>
                    <h3 style={{ margin: 0, color: '#475569' }}>Invoice Preview</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={handlePrint} className="btn-primary" style={{ height: '36px', padding: '0 16px' }}>
                            <Printer size={16} /> Print/Save PDF
                        </button>
                        <button onClick={onClose} style={{ background: '#e2e8f0', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                            <X size={20} color="#64748b" />
                        </button>
                    </div>
                </div>

                {/* Printable Area */}
                <div id="printable-invoice" style={{ padding: '60px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Building2 size={24} color="white" />
                                </div>
                                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.025em' }}>
                                    {tenant?.millName || 'RICE MILL'}
                                </h1>
                            </div>
                            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                                <p style={{ margin: '0' }}>Proprietor: {tenant?.ownerName || 'Mill Owner'}</p>
                                <p style={{ margin: '0' }}>Contact: {tenant?.contactNumber || 'N/A'}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ margin: '0 0 10px 0', fontSize: '36px', color: '#cbd5e1', fontWeight: 900 }}>INVOICE</h2>
                            <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>#INV-{invoice._id?.slice(-6).toUpperCase()}</p>
                            <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>Date: {new Date(invoice.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div style={{ marginBottom: '60px' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Bill To</h4>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: 700 }}>{invoice.customerName}</h3>
                        <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>Customer Reference</p>
                    </div>

                    {/* Items Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ padding: '12px 0', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Description</th>
                                <th style={{ padding: '12px 0', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Qty</th>
                                <th style={{ padding: '12px 0', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Unit Price</th>
                                <th style={{ padding: '12px 0', textAlign: 'right', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '24px 0' }}>
                                    <div style={{ fontWeight: 600, fontSize: '16px' }}>Premium Polished Rice</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Hygienically processed and packed</div>
                                </td>
                                <td style={{ padding: '24px 0' }}>{invoice.riceQuantity} kg</td>
                                <td style={{ padding: '24px 0' }}>₹{invoice.pricePerKg?.toFixed(2)}</td>
                                <td style={{ padding: '24px 0', textAlign: 'right', fontWeight: 600 }}>₹{(invoice.riceQuantity * invoice.pricePerKg).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ width: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                                <span style={{ color: '#64748b' }}>Subtotal</span>
                                <span style={{ fontWeight: 600 }}>₹{(invoice.riceQuantity * invoice.pricePerKg).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                                <span style={{ color: '#64748b' }}>GST ({invoice.gstPercentage}%)</span>
                                <span style={{ fontWeight: 600 }}>₹{(invoice.totalAmount - (invoice.riceQuantity * invoice.pricePerKg)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '20px',
                                borderTop: '2px solid #f1f5f9',
                                paddingTop: '20px'
                            }}>
                                <span style={{ fontWeight: 700, fontSize: '18px' }}>Total Amount</span>
                                <span style={{ fontWeight: 800, fontSize: '24px', color: '#4361ee' }}>₹{invoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Notes */}
                    <div style={{ marginTop: '100px', borderTop: '1px solid #f1f5f9', paddingTop: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#475569' }}>Notes & Instructions</h4>
                                <p style={{ margin: '0', fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                                    1. This is a computer generated invoice and does not require a physical signature.<br />
                                    2. Payments should be made within 7 days from the invoice date.<br />
                                    3. Please mention the invoice number in your bank transfer reference.
                                </p>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <div style={{ height: '1px', width: '200px', background: '#cbd5e1', marginBottom: '10px' }}></div>
                                <p style={{ margin: '0', fontSize: '13px', fontWeight: 600 }}>Authorized Signatory</p>
                            </div>
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        .no-print { display: none !important; }
                        body * { visibility: hidden; }
                        #printable-invoice, #printable-invoice * { visibility: visible; }
                        #printable-invoice {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 20px !important;
                            visibility: visible !important;
                        }
                    }
                `}} />
            </div>
        </div>
    );
};

export default InvoiceModal;
