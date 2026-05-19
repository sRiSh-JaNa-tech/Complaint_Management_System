// src/pages/ComplaintList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, RotateCcw, Eye, ClipboardList,
  FileText, Clock, Loader2, CheckCircle2, XCircle,
} from 'lucide-react';
import API from '../api/axios';

const CATEGORIES = [
  'Water Supply', 'Electricity', 'Roads & Transport',
  'Sanitation & Garbage', 'Public Safety', 'Healthcare', 'Education', 'Other',
];

function statusBadgeClass(status) {
  switch (status) {
    case 'In Progress': return 'badge badge-inprogress';
    case 'Resolved':    return 'badge badge-resolved';
    case 'Rejected':    return 'badge badge-rejected';
    default:            return 'badge badge-pending';
  }
}

export default function ComplaintList() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('');
  const [error, setError]           = useState('');

  const fetchComplaints = useCallback(async (loc = '', cat = '') => {
    setLoading(true); setError('');
    try {
      let res;
      if (loc.trim()) {
        res = await API.get(`/complaints/search?location=${encodeURIComponent(loc.trim())}`);
      } else if (cat) {
        res = await API.get(`/complaints?category=${encodeURIComponent(cat)}`);
      } else {
        res = await API.get('/complaints');
      }
      setComplaints(res.data);
    } catch {
      setError('Failed to fetch complaints. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleSearch = (e) => { e.preventDefault(); setCategory(''); fetchComplaints(search, ''); };
  const handleCategoryChange = (e) => { const v = e.target.value; setCategory(v); setSearch(''); fetchComplaints('', v); };
  const handleClear = () => { setSearch(''); setCategory(''); fetchComplaints('', ''); };

  const total      = complaints.length;
  const pending    = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved   = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">All Complaints</div>
          <div className="topbar-sub">View, filter and manage all submitted complaints</div>
        </div>
        <ClipboardList size={20} color="var(--primary)" />
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total',       value: total,      Icon: FileText,    bg: 'var(--primary-light)', col: 'var(--primary)' },
            { label: 'Pending',     value: pending,    Icon: Clock,       bg: 'var(--warning-bg)',    col: 'var(--warning)' },
            { label: 'In Progress', value: inProgress, Icon: Loader2,     bg: 'var(--info-bg)',       col: 'var(--info)' },
            { label: 'Resolved',    value: resolved,   Icon: CheckCircle2,bg: 'var(--success-bg)',    col: 'var(--success)' },
          ].map(({ label, value, Icon, bg, col }) => (
            <div className="stat-card" key={label}>
              <div className="stat-icon" style={{ background: bg, color: col }}><Icon size={20} /></div>
              <div>
                <div className="stat-value" style={{ color: col }}>{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: 220 }}>
            <div className="search-wrapper" style={{ flex: 1 }}>
              <Search size={15} />
              <input id="location-search" className="form-control" type="text"
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by location…" />
            </div>
            <button id="search-btn" type="submit" className="btn btn-primary">
              <Search size={14} /> Search
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select id="category-filter" className="form-control" style={{ width: 190 }}
              value={category} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {(search || category) && (
            <button className="btn btn-outline btn-sm" onClick={handleClear}>
              <RotateCcw size={13} /> Clear
            </button>
          )}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}><XCircle size={15} /> {error}</div>}

        {loading ? (
          <div className="empty-state">
            <span className="spinner spinner-dark" style={{ width: 32, height: 32, borderWidth: 3 }} />
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FileText size={28} /></div>
            <h3>No complaints found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c, i) => (
                  <tr key={c._id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{i + 1}</td>
                    <td>
                      <div className="td-title">
                        {c.title}
                        <p>{c.name} · {c.email}</p>
                      </div>
                    </td>
                    <td><span className="category-chip">{c.category}</span></td>
                    <td style={{ color: 'var(--text-sub)', fontSize: '0.875rem' }}>{c.location}</td>
                    <td><span className={statusBadgeClass(c.status)}>{c.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/complaints/${c._id}`)}>
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
