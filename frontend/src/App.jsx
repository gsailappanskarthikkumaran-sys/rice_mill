import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Purchase from './pages/Purchase';
import Production from './pages/Production';
import Sales from './pages/Sales';
import Stocks from './pages/Stocks';
import Users from './pages/Users';
import Farmers from './pages/Farmers';
import Tenants from './pages/Tenants'; // For SuperAdmin
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';

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
                        <Route path="/farmers" element={<Farmers />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/tenants" element={<Tenants />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
