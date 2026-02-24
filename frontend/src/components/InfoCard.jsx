import React from 'react';
import './InfoCard.css';
import { TrendingUp, TrendingDown } from 'lucide-react';

const InfoCard = ({ title, value, icon: Icon, trend, trendValue }) => {
    const isPositive = trend === 'up';

    return (
        <div className="info-card fade-in">
            <div className="info-card-icon">
                <Icon size={24} />
            </div>
            <div>
                <h3 className="info-card-title">{title}</h3>
                <p className="info-card-value">{value}</p>
            </div>
            <div className="info-card-footer">
                <span className={`badge-trend ${isPositive ? 'badge-up' : 'badge-down'}`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {trendValue}%
                </span>
                <span>vs last month</span>
            </div>
        </div>
    );
};

export default InfoCard;
