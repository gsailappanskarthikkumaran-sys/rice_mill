import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Wheat, Lock, Mail, ArrowRight } from 'lucide-react';

import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card fade-in">
                <div className="login-header">
                    <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--primary)', borderRadius: '16px', marginBottom: '24px' }}>
                        <Wheat size={32} color="white" />
                    </div>
                    <h1 className="login-title">Welcome</h1>
                    <p className="login-subtitle">Sign in to the Rice Mill Management System</p>
                </div>

                {error && (
                    <div style={{ marginBottom: '24px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            required
                            className="login-input"
                            placeholder="admin@ricemill.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            required
                            className="login-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary login-btn"
                    >
                        Sign In <ArrowRight size={20} />
                    </button>
                </form>

                <div className="login-footer">
                    Need help? <Link to="/support">Contact support</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
