// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Zap, Lock, BarChart3, AlertCircle } from 'lucide-react';
import API from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Brain size={16} />,    text: 'AI-powered complaint analysis & prioritisation' },
    { icon: <Zap size={16} />,      text: 'Real-time status tracking for every complaint' },
    { icon: <Lock size={16} />,     text: 'Secure JWT authentication with bcrypt encryption' },
    { icon: <BarChart3 size={16} />,text: 'Smart department routing & auto-responses' },
  ];

  return (
    <div className="auth-wrapper">
      {/* ── Left branded panel ── */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <img
              src="/customer-satisfaction.png"
              alt="Logo"
              style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'contain' }}
            />
            <div>
              <div className="auth-logo-text">Complaint Management System</div>
            </div>
          </div>

          <h1>
            Smart Complaint<br />
            <span>Management</span>
          </h1>
          <p>
            An AI-powered platform to register, track, and resolve citizen
            complaints efficiently — with intelligent analysis at every step.
          </p>

          <div className="auth-features">
            {features.map(({ icon, text }) => (
              <div className="auth-feature-item" key={text}>
                <div className="auth-feature-icon">{icon}</div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                id="email" className="form-control" type="email"
                name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password" className="form-control" type="password"
                name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required
              />
            </div>

            <button id="login-btn" type="submit" className="btn btn-primary btn-full btn-lg"
              disabled={loading} style={{ marginTop: '0.25rem' }}>
              {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-link">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
