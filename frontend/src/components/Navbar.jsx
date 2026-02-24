import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="navbar">
            <div>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    Welcome back, <span style={{ color: 'var(--text-main)' }}>{user?.name}</span>
                </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Bell size={20} />
                </button>
                <div className="user-profile">
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                            {user?.role}
                        </p>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
