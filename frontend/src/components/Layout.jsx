import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user, loading } = useAuth();

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main className="page-container fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
