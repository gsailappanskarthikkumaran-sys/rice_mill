import React from 'react';
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    ShoppingCart,
    Tractor,
    Package
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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

const Dashboard = () => {
    const stats = [
        { label: 'Total Revenue', value: '₹12.55 Lakh', change: '+12.5%', color: 'var(--primary-600)', bg: 'var(--primary-50)', icon: TrendingUp },
        { label: 'Paddy Stock (Raw)', value: '2,450 Qtl', change: '-2.4%', color: 'var(--orange-600)', bg: 'var(--orange-50)', icon: Tractor },
        { label: 'Rice Stock (Steam)', value: '1,120 Qtl', change: '+5.2%', color: 'var(--green-600)', bg: 'var(--primary-50)', icon: Package },
        { label: 'Monthly Sales', value: '₹4.20 Lakh', change: '+18.2%', color: 'var(--purple-600)', bg: 'var(--primary-50)', icon: ShoppingCart },
    ];

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue (₹)',
                data: [40, 55, 45, 70, 65, 85],
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="flex-between">
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--slate-900)' }}>Mill Analytics (Indian Standards)</h1>
                    <p style={{ color: 'var(--slate-500)' }}>Welcome back, track your stock in Quintals and Bags.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary">Mandi Report</button>
                    <button className="btn btn-primary">New Purchase (Paddy)</button>
                </div>
            </div>

            <div className="grid-stats">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card">
                        <div className="flex-between">
                            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: stat.bg, color: stat.color, display: 'flex' }}>
                                <stat.icon style={{ width: '24px', height: '24px' }} />
                            </div>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: stat.change.startsWith('+') ? 'var(--green-600)' : 'var(--red-600)'
                            }}>
                                {stat.change}
                                {stat.change.startsWith('+') ? <ArrowUpRight style={{ width: '12px', height: '12px', marginLeft: '2px' }} /> : <ArrowDownRight style={{ width: '12px', height: '12px', marginLeft: '2px' }} />}
                            </span>
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <h3 style={{ color: 'var(--slate-500)', fontSize: '14px', fontWeight: '500' }}>{stat.label}</h3>
                            <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--slate-900)', marginTop: '4px' }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--slate-900)', marginBottom: '24px' }}>Revenue Growth (Lakh ₹)</h3>
                    <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--slate-900)', marginBottom: '24px' }}>Milling Yield (Average)</h3>
                    <div style={{ maxWidth: '240px', margin: '0 auto' }}>
                        <Doughnut
                            data={{
                                labels: ['Rice', 'Broken', 'Husk', 'Bran'],
                                datasets: [{
                                    data: [67, 4, 20, 9],
                                    backgroundColor: ['#0ea5e9', '#f97316', '#10b981', '#8b5cf6'],
                                }]
                            }}
                            options={{ responsive: true, cutout: '70%' }}
                        />
                    </div>
                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--slate-500)' }}>
                        Standard Out-turn: 67%
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
