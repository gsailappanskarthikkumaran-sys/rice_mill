import React, { useState, useEffect } from 'react';
// v2.0.1 - Robust analytics fetching
import api from '../utils/api';
import {
    TrendingUp,
    ShoppingCart,
    Tractor,
    Package,
    Loader2
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

import InfoCard from '../components/InfoCard';

const Dashboard = () => {
    const [data, setData] = useState({
        stocks: { paddyStock: 0, riceStock: 0, huskStock: 0 },
        sales: { totalRevenue: 0, totalQuantity: 0, count: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [stockRes, salesRes] = await Promise.all([
                    api.get('/stocks').catch(err => ({ data: { paddyStock: 0, riceStock: 0, huskStock: 0 } })),
                    api.get('/sales/analytics').catch(err => ({ data: { totalRevenue: 0, totalQuantity: 0, count: 0 } }))
                ]);
                setData({
                    stocks: (stockRes && stockRes.data) ? stockRes.data : { paddyStock: 0, riceStock: 0, huskStock: 0 },
                    sales: (salesRes && salesRes.data) ? salesRes.data : { totalRevenue: 0, totalQuantity: 0, count: 0 }
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        {
            title: 'Total Revenue',
            value: `₹${((data.sales?.totalRevenue || 0) / 1000).toFixed(2)}K`,
            trend: 'up',
            trendValue: 0,
            icon: TrendingUp
        },
        {
            title: 'Paddy Stock',
            value: `${data.stocks?.paddyStock || 0} kg`,
            trend: 'none',
            trendValue: 0,
            icon: Tractor
        },
        {
            title: 'Rice Stock',
            value: `${data.stocks?.riceStock || 0} kg`,
            trend: 'none',
            trendValue: 0,
            icon: Package
        },
        {
            title: 'Sales Count',
            value: data.sales?.count || 0,
            trend: 'none',
            trendValue: 0,
            icon: ShoppingCart
        },
    ];

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue (₹)',
                data: [40, 55, 45, 70, 65, ((data.sales?.totalRevenue || 0) / 1000) || 0],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    if (loading) {
        return (
            <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Syncing Dashboard Data...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="dashboard-header flex-between" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '8px' }}>Mill Performance Overview</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time procurement, production, and sales metrics</p>
                </div>
            </div>

            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                {stats.map((stat) => (
                    <InfoCard key={stat.title} {...stat} />
                ))}
            </div>

            <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>Revenue Performance</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>Monthly growth and projections</p>
                    <div style={{ height: '300px' }}>
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { borderDash: [5, 5] }, ticks: { callback: (v) => `₹${v}K` } },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '24px' }}>Stock Distribution</h3>
                    <div style={{ height: '240px', position: 'relative' }}>
                        <Doughnut
                            data={{
                                labels: ['Rice', 'Paddy', 'Husk'],
                                datasets: [{
                                    data: [data.stocks?.riceStock || 0, data.stocks?.paddyStock || 0, data.stocks?.huskStock || 0],
                                    backgroundColor: ['#4361ee', '#10b981', '#f59e0b'],
                                    borderWidth: 0,
                                    hoverOffset: 15
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: '75%',
                                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
                            }}
                        />
                    </div>
                    <div style={{ marginTop: '32px', textAlign: 'center', background: 'var(--primary-light)', padding: '16px', borderRadius: '12px' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)' }}>
                            Current Inventory Balance: {(((data.stocks?.riceStock || 0) + (data.stocks?.paddyStock || 0) + (data.stocks?.huskStock || 0)) / 1000).toFixed(1)} Tons
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
