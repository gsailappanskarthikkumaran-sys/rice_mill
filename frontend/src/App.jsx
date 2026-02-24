import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Placeholder components
const Purchase = () => <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">Paddy Purchase Module</div>;
const Production = () => <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">Production Module</div>;
const Sales = () => <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">Sales & Invoice Module</div>;
const Stocks = () => <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">Stock Management</div>;
const Suppliers = () => <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">Supplier Management</div>;
const Users = () => <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">User Management</div>;
const Settings = () => <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">Settings Module</div>;

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/purchase" element={<Purchase />} />
                        <Route path="/production" element={<Production />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/stocks" element={<Stocks />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
