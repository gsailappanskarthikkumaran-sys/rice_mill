import { LayoutDashboard, ShoppingCart, Tractor, Package, Users, Building2, LogOut, Truck, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Tenants (Mills)', icon: Building2, path: '/tenants', roles: ['SuperAdmin'] },
        { name: 'Farmers', icon: Users, path: '/farmers' },
        { name: 'Suppliers', icon: Truck, path: '/suppliers' },
        { name: 'Paddy Purchase', icon: Tractor, path: '/purchase' },
        { name: 'Production', icon: Package, path: '/production' },
        { name: 'Sales', icon: ShoppingCart, path: '/sales' },
        { name: 'Stocks', icon: Package, path: '/stocks' },
        { name: 'Users', icon: Users, path: '/users', roles: ['SuperAdmin', 'MillOwner'] },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <span>RICEMILL ERP</span>
            </div>
            <div className="sidebar-nav">
                {menuItems.map((item) => (
                    (!item.roles || item.roles.includes(user?.role)) && (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <item.icon size={20} className="icon" />
                            <span>{item.name}</span>
                        </NavLink>
                    )
                ))}
            </div>
            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
