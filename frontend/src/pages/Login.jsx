import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Wheat, Lock, Mail, ArrowRight } from 'lucide-react';

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
        <div className="auth-screen">
            <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'var(--primary-600)',
                        borderRadius: '16px',
                        marginBottom: '16px',
                        boxShadow: '0 10px 15px -3px var(--primary-200)'
                    }}>
                        <Wheat style={{ color: 'white', width: '32px', height: '32px' }} />
                    </div>
                    <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: 'var(--slate-900)' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--slate-500)', marginTop: '8px' }}>Sign in to manage your rice mill business</p>
                </div>

                <div className="card" style={{ padding: '32px', shadow: 'var(--shadow-xl)' }}>
                    {error && (
                        <div style={{
                            marginBottom: '24px',
                            padding: '16px',
                            backgroundColor: 'var(--red-50)',
                            color: 'var(--red-600)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            border: '1px solid var(--red-100)'
                        }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: 'var(--slate-400)' }} />
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="admin@ricemill.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: 'var(--slate-400)' }} />
                                <input
                                    type="password"
                                    required
                                    className="input-field"
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontSize: '16px'
                            }}
                        >
                            <span>Sign In</span>
                            <ArrowRight style={{ width: '20px', height: '20px' }} />
                        </button>
                    </form>
                </div>
                <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--slate-500)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: '600', textDecoration: 'none' }}>Get Started</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
