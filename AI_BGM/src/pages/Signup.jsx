// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckSquare, Cpu, Mail, SlidersHorizontal } from 'lucide-react';
import API from '../api/axios';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/signup', {
        name: form.name, email: form.email, password: form.password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <CheckSquare size={16} />,       text: 'Register and track complaints in one place' },
    { icon: <Cpu size={16} />,               text: 'AI detects urgency and assigns departments' },
    { icon: <Mail size={16} />,              text: 'Automatic response messages for complainants' },
    { icon: <SlidersHorizontal size={16} />, text: 'Filter & search across all complaints' },
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
            Join the<br />
            <span>AI-Powered</span><br />
            Platform
          </h1>
          <p>
            Create your account to start submitting and tracking complaints
            with AI-assisted prioritisation and department routing.
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
            <h2>Create account</h2>
            <p>Fill in your details to get started</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <input id="name" className="form-control" type="text" name="name"
                value={form.name} onChange={handleChange} placeholder="Rahul Kumar" required autoFocus />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email address</label>
              <input id="signup-email" className="form-control" type="email" name="email"
                value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <input id="signup-password" className="form-control" type="password" name="password"
                value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm">Confirm password</label>
              <input id="confirm" className="form-control" type="password" name="confirm"
                value={form.confirm} onChange={handleChange} placeholder="Re-enter password" required />
            </div>

            <button id="signup-btn" type="submit" className="btn btn-primary btn-full btn-lg"
              disabled={loading} style={{ marginTop: '0.25rem' }}>
              {loading ? <><span className="spinner" /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
