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
import ProtectedRoute from './components/ProtectedRoute';

import { applyTheme } from './utils/theme';

function App() {
    React.useEffect(() => {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme) {
            try {
                const { primaryColor, radius } = JSON.parse(savedTheme);
                applyTheme(primaryColor, radius);
            } catch (err) {
                console.error('Failed to parse theme', err);
            }
        }
    }, []);

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />

                        <Route path="/purchase" element={
                            <ProtectedRoute allowedRoles={['SuperAdmin', 'MillOwner', 'Accountant']}>
                                <Purchase />
                            </ProtectedRoute>
                        } />

                        <Route path="/production" element={
                            <ProtectedRoute allowedRoles={['SuperAdmin', 'MillOwner', 'Operator']}>
                                <Production />
                            </ProtectedRoute>
                        } />

                        <Route path="/sales" element={
                            <ProtectedRoute allowedRoles={['SuperAdmin', 'MillOwner', 'Accountant']}>
                                <Sales />
                            </ProtectedRoute>
                        } />

                        <Route path="/stocks" element={
                            <ProtectedRoute allowedRoles={['SuperAdmin', 'MillOwner', 'Accountant', 'Operator']}>
                                <Stocks />
                            </ProtectedRoute>
                        } />

                        <Route path="/farmers" element={
                            <ProtectedRoute allowedRoles={['SuperAdmin', 'MillOwner', 'Accountant']}>
                                <Farmers />
                            </ProtectedRoute>
                        } />

                        <Route path="/suppliers" element={
                            <ProtectedRoute allowedRoles={['SuperAdmin', 'MillOwner', 'Accountant']}>
                                <Suppliers />
                            </ProtectedRoute>
                        } />

                        <Route path="/users" element={
                            <ProtectedRoute allowedRoles={['SuperAdmin', 'MillOwner']}>
                                <Users />
                            </ProtectedRoute>
                        } />

                        <Route path="/tenants" element={
                            <ProtectedRoute allowedRoles={['SuperAdmin']}>
                                <Tenants />
                            </ProtectedRoute>
                        } />

                        <Route path="/settings" element={
                            <ProtectedRoute allowedRoles={['SuperAdmin', 'MillOwner']}>
                                <Settings />
                            </ProtectedRoute>
                        } />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
