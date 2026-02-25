import React from 'react';
import ReactDOM from 'react-dom';
import { X, Printer, Download, Building2, Phone, Mail, Globe } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, invoice, tenant }) => {
    if (!isOpen || !invoice) return null;

    const handlePrint = () => {
        window.print();
    };

    const modalContent = (
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
            zIndex: 9999, // Extremely high to stay on top
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
                <div id="printable-invoice" style={{ padding: '40px' }}>
                    {/* Header */}
                    <div className="invoice-header-box" style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #4361ee', paddingBottom: '30px' }}>
                        <h1 style={{ margin: '0 0 5px 0', fontSize: '32px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                            {tenant?.millName || 'RICEMILL ERP'}
                        </h1>
                        <p style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 700, color: '#4361ee' }}>
                            Proprietor: {tenant?.ownerName || 'Mill Owner'}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', color: '#475569', flexWrap: 'wrap' }}>
                            {tenant?.address && <span><strong>Add:</strong> {tenant.address}</span>}
                            <span><strong>Mob:</strong> {tenant?.contactNumber || 'N/A'}</span>
                            {tenant?.gstNumber && <span><strong>GSTIN:</strong> {tenant.gstNumber}</span>}
                        </div>

                        <div className="bill-to-section" style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div style={{ textAlign: 'left' }}>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', fontWeight: 700 }}>Bill To</h4>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{invoice.customerName}</h3>
                                <p style={{ margin: '0', color: '#64748b', fontSize: '13px' }}>Customer Reference</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h2 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#4361ee', letterSpacing: '0.1em', fontWeight: 800 }}>TAX INVOICE</h2>
                                <p style={{ margin: '0', fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>#INV-{invoice._id?.slice(-6).toUpperCase()}</p>
                                <p style={{ margin: '0', fontSize: '13px', color: '#64748b' }}>Date: <strong>{new Date(invoice.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong></p>
                            </div>
                        </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', fontWeight: 700 }}>Summary</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                            <span>Total Qty:</span>
                            <strong>{invoice.riceQuantity} kg</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span>Total Amount:</span>
                            <strong>₹{invoice.totalAmount.toLocaleString()}</strong>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="items-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 15px', color: '#475569', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Item Description</th>
                            <th style={{ padding: '12px 15px', color: '#475569', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
                            <th style={{ padding: '12px 15px', color: '#475569', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>Rate</th>
                            <th style={{ padding: '12px 15px', textAlign: 'right', color: '#475569', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '20px 15px' }}>
                                <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>Premium Polished Rice</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Standard Grain Size | Sorted | Cleaned</div>
                            </td>
                            <td style={{ padding: '20px 15px', textAlign: 'center', fontWeight: 600 }}>{invoice.riceQuantity} kg</td>
                            <td style={{ padding: '20px 15px', textAlign: 'center', fontWeight: 600 }}>₹{invoice.pricePerKg?.toFixed(2)}</td>
                            <td style={{ padding: '20px 15px', textAlign: 'right', fontWeight: 700 }}>₹{(invoice.riceQuantity * invoice.pricePerKg).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Totals */}
                <div className="totals-section" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', padding: '0 40px' }}>
                    <div style={{ width: '300px', background: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                            <span style={{ color: '#64748b' }}>Taxable Value</span>
                            <span style={{ fontWeight: 600 }}>₹{(invoice.riceQuantity * invoice.pricePerKg).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '13px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                            <span style={{ color: '#64748b' }}>GST ({invoice.gstPercentage}%)</span>
                            <span style={{ fontWeight: 600, color: '#ef4444' }}>+ ₹{(invoice.totalAmount - (invoice.riceQuantity * invoice.pricePerKg)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontWeight: 800, fontSize: '15px', color: '#1e293b', textTransform: 'uppercase' }}>Grand Total</span>
                            <span style={{ fontWeight: 900, fontSize: '22px', color: '#4361ee' }}>₹{invoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="footer-section" style={{ marginTop: '80px', padding: '30px 40px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '50px' }}>
                        <div>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 700, color: '#334155' }}>Terms & Conditions</h4>
                            <ul style={{ margin: '0', padding: '0 0 0 15px', fontSize: '11px', color: '#64748b', lineHeight: '1.8' }}>
                                <li>This is a computer generated document and does not require a signature.</li>
                                <li>Goods once sold will not be taken back or exchanged.</li>
                                <li>All disputes are subject to local jurisdiction.</li>
                            </ul>
                        </div>
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <div style={{ height: '60px' }}></div>
                            <div style={{ borderTop: '2px solid #0f172a', paddingTop: '10px' }}>
                                <p style={{ margin: '0', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a' }}>For {tenant?.millName || 'RICEMILL'}</p>
                                <p style={{ margin: '0', fontSize: '11px', color: '#64748b' }}>Authorized Signatory</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print {
                        @page {
                            margin: 0.5cm;
                            size: A4;
                        }
                        /* Hide background content completely */
                        body > *:not(.modal-overlay) {
                            display: none !important;
                        }
                        /* Reset modal overlay for printing */
                        .modal-overlay {
                            position: static !important;
                            display: block !important;
                            background: white !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            width: 100% !important;
                            height: auto !important;
                            overflow: visible !important;
                        }
                        /* Reset container for printing */
                        .invoice-container {
                            position: static !important;
                            display: block !important;
                            width: 100% !important;
                            height: auto !important;
                            max-height: none !important;
                            overflow: visible !important;
                            box-shadow: none !important;
                            border: none !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            border-radius: 0 !important;
                        }
                        /* Compact spacing for single-page fit */
                        #printable-invoice {
                            padding: 20px 0 !important;
                        }
                        .invoice-header-box {
                            margin-bottom: 15px !important;
                            padding-bottom: 10px !important;
                        }
                        .invoice-header-box h1 {
                            font-size: 24px !important;
                        }
                        .bill-to-section {
                            margin-top: 10px !important;
                        }
                        .items-table {
                            margin-bottom: 10px !important;
                        }
                        .items-table td, .items-table th {
                            padding: 8px 10px !important;
                        }
                        .totals-section {
                            margin-top: 10px !important;
                        }
                        .footer-section {
                            margin-top: 25px !important;
                            padding-top: 15px !important;
                        }

                        /* Hide UI buttons */
                        .no-print {
                            display: none !important;
                        }
                        /* Ensure text colors print */
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                        /* Prevent cutting off elements */
                        .invoice-container, #printable-invoice {
                            page-break-after: auto;
                            page-break-inside: avoid;
                        }
                    }
                `}} />
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default InvoiceModal;
