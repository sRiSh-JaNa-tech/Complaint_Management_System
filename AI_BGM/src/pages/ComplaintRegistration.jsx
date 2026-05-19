// src/pages/ComplaintRegistration.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, CheckCircle, AlertCircle } from 'lucide-react';
import API from '../api/axios';

const CATEGORIES = [
  'Water Supply', 'Electricity', 'Roads & Transport',
  'Sanitation & Garbage', 'Public Safety', 'Healthcare', 'Education', 'Other',
];
const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
const INITIAL  = { name: '', email: '', title: '', description: '', category: '', location: '', status: 'Pending' };

export default function ComplaintRegistration() {
  const navigate = useNavigate();
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  // Auto-fill logged-in user details to save time and prevent manual entry errors
  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        const user = JSON.parse(storedUser);
        if (user && (user.name || user.email)) {
          setForm((prev) => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
          }));
        }
      }
    } catch (err) {
      console.error('Failed to pre-populate user details:', err);
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim())       { setError('Complaint title is required.'); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }
    if (!form.category)           { setError('Please select a category.'); return; }

    setLoading(true);
    try {
      await API.post('/complaints', form);
      setSuccess(true);
      setForm(INITIAL);
      setTimeout(() => { setSuccess(false); navigate('/complaints'); }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Register Complaint</div>
          <div className="topbar-sub">Submit a new public complaint for review</div>
        </div>
        <FilePlus size={20} color="var(--primary)" />
      </div>

      <div className="page-body">
        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckCircle size={16} /> Complaint submitted successfully! Redirecting…
          </div>
        )}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="detail-card" style={{ maxWidth: 860 }}>
          <form onSubmit={handleSubmit}>
            <div className="reg-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="c-name">
                  Full Name <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input id="c-name" className="form-control" type="text" name="name"
                  value={form.name} onChange={handleChange} placeholder="Rahul Kumar" required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="c-email">
                  Email Address <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input id="c-email" className="form-control" type="email" name="email"
                  value={form.email} onChange={handleChange} placeholder="rahul@gmail.com" required />
              </div>

              <div className="form-group reg-full">
                <label className="form-label" htmlFor="c-title">
                  Complaint Title <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input id="c-title" className="form-control" type="text" name="title"
                  value={form.title} onChange={handleChange}
                  placeholder="e.g. Water Leakage Issue near Market Area" required />
              </div>

              <div className="form-group reg-full">
                <label className="form-label" htmlFor="c-desc">
                  Complaint Description <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <textarea id="c-desc" className="form-control" name="description" rows={5}
                  value={form.description} onChange={handleChange}
                  placeholder="Describe the issue in detail — what happened, when, and how it affects you…"
                  required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="c-cat">
                  Category <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <select id="c-cat" className="form-control" name="category"
                  value={form.category} onChange={handleChange} required>
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="c-loc">
                  Location <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input id="c-loc" className="form-control" type="text" name="location"
                  value={form.location} onChange={handleChange}
                  placeholder="e.g. Ghaziabad, Sector 14" required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="c-status">Complaint Status</label>
                <select id="c-status" className="form-control" name="status"
                  value={form.status} onChange={handleChange}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
              <button id="submit-complaint-btn" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Submitting…</>
                  : <><FilePlus size={16} /> Submit Complaint</>}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setForm(INITIAL)}>
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
