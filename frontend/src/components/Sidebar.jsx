import { LayoutDashboard, ShoppingCart, Tractor, Package, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Paddy Purchase', icon: Tractor, path: '/purchase' },
        { name: 'Production', icon: Package, path: '/production' },
        { name: 'Sales', icon: ShoppingCart, path: '/sales' },
        { name: 'Stocks', icon: Package, path: '/stocks' },
        { name: 'Suppliers', icon: Users, path: '/suppliers' },
        { name: 'Users', icon: Users, path: '/users', roles: ['TenantAdmin'] },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="sidebar">
            <div style={{ padding: '24px', fontSize: '24px', fontWeight: 'bold', borderBottom: '1px solid var(--slate-800)', color: 'var(--primary-400)' }}>
                RiceMill ERP
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    (!item.roles || item.roles.includes(user?.role)) && (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <item.icon style={{ width: '20px', height: '20px', marginRight: '12px' }} />
                            <span>{item.name}</span>
                        </NavLink>
                    )
                ))}
            </nav>
            <div style={{ padding: '24px', borderTop: '1px solid var(--slate-800)' }}>
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--slate-400)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        width: '100%'
                    }}
                    onMouseOver={(e) => e.target.style.color = 'var(--red-500)'}
                    onMouseOut={(e) => e.target.style.color = 'var(--slate-400)'}
                >
                    <LogOut style={{ width: '20px', height: '20px', marginRight: '12px' }} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
