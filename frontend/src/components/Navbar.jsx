import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Search } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', maxWidth: '448px', width: '100%', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', width: '16px', height: '16px', color: 'var(--slate-400)' }} />
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="input-field"
                    style={{ paddingLeft: '40px', backgroundColor: 'var(--slate-100)', border: 'none' }}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button style={{ color: 'var(--slate-500)', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                    <Bell style={{ width: '20px', height: '20px' }} />
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: 'var(--red-600)', borderRadius: '50%', border: '2px solid white' }}></span>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--slate-200)', paddingLeft: '24px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--slate-800)' }}>{user?.name}</p>
                        <p style={{ fontSize: '12px', color: 'var(--slate-500)', textTransform: 'capitalize' }}>
                            {user?.role?.replace(/([A-Z])/g, ' $1')}
                        </p>
                    </div>
                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User style={{ width: '24px', height: '24px' }} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
