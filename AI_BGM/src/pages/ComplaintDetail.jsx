// src/pages/ComplaintDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Save, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../api/axios';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

function statusBadgeClass(status) {
  switch (status) {
    case 'In Progress': return 'badge badge-inprogress';
    case 'Resolved':    return 'badge badge-resolved';
    case 'Rejected':    return 'badge badge-rejected';
    default:            return 'badge badge-pending';
  }
}

function urgencyClass(u = '') {
  const l = u.toLowerCase();
  if (l === 'critical') return 'urgency-critical';
  if (l === 'high')     return 'urgency-high';
  if (l === 'medium')   return 'urgency-medium';
  return 'urgency-low';
}

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState({ text: '', ok: true });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult]   = useState(null);
  const [aiError, setAiError]     = useState('');

  /* ── Load complaint ── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/complaints/${id}`);
        setComplaint(data);
        setNewStatus(data.status);
      } catch {
        setError('Complaint not found or server error.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ── Update status ── */
  const handleSaveStatus = async () => {
    setSaving(true); setSaveMsg({ text: '', ok: true });
    try {
      const { data } = await API.put(`/complaints/${id}`, { status: newStatus });
      setComplaint(data);
      setSaveMsg({ text: 'Status updated successfully!', ok: true });
    } catch {
      setSaveMsg({ text: 'Failed to update status.', ok: false });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg({ text: '', ok: true }), 3000);
    }
  };

  /* ── AI Analysis ── */
  const handleAnalyze = async () => {
    setAiLoading(true); setAiError(''); setAiResult(null);
    try {
      const { data } = await API.post('/ai/analyze', {
        title:       complaint.title,
        description: complaint.description,
        category:    complaint.category,
        location:    complaint.location,
      });
      setAiResult(data);
    } catch {
      setAiError('AI analysis failed. Please check your Gemini API key in the backend .env file.');
    } finally {
      setAiLoading(false);
    }
  };

  /* ── Loading / error states ── */
  if (loading) return (
    <>
      <div className="topbar"><div className="topbar-title">Complaint Details</div></div>
      <div className="page-body empty-state">
        <span className="spinner spinner-dark" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    </>
  );
  if (error) return (
    <>
      <div className="topbar"><div className="topbar-title">Complaint Details</div></div>
      <div className="page-body">
        <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>
      </div>
    </>
  );

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate('/complaints')}>
          <ArrowLeft size={15} /> Back to complaints
        </button>
        <span className={statusBadgeClass(complaint.status)}>{complaint.status}</span>
      </div>

      <div className="page-body">
        <div className="detail-layout">
          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Complaint info */}
            <div className="detail-card">
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {complaint.title}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ID: {complaint._id}
              </p>

              <div className="detail-meta">
                {[
                  { label: 'Submitted by', val: complaint.name },
                  { label: 'Email',        val: complaint.email },
                  { label: 'Category',     val: complaint.category },
                  { label: 'Location',     val: complaint.location },
                  { label: 'Submitted on', val: new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
                ].map(({ label, val }) => (
                  <div className="detail-meta-item" key={label}>
                    <strong>{label}</strong>{val}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, marginBottom: '0.75rem' }}>
                Description
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--text-sub)', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                {complaint.description}
              </p>
            </div>

            {/* Status update */}
            <div className="detail-card">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
                Update Complaint Status
              </h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Select new status</label>
                <select id="status-select" className="form-control"
                  value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {saveMsg.text && (
                <div className={`alert ${saveMsg.ok ? 'alert-success' : 'alert-error'}`}
                  style={{ marginBottom: '1rem' }}>
                  {saveMsg.text}
                </div>
              )}

              <button id="save-status-btn" className="btn btn-primary"
                onClick={handleSaveStatus}
                disabled={saving || newStatus === complaint.status}>
                {saving
                  ? <><span className="spinner" /> Saving…</>
                  : <><Save size={15} /> Save Status</>}
              </button>
            </div>
          </div>

          {/* ── Right column: AI Analysis ── */}
          <div className="ai-panel">
            <div className="ai-panel-header">
              <Sparkles size={18} color="var(--primary)" />
              <h3 className="gradient-text">AI Analysis</h3>
            </div>

            {!aiResult && !aiLoading && (
              <>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.65 }}>
                  Use Gemini AI to detect urgency, suggest a responsible department,
                  generate a complaint summary, and draft an automatic response.
                </p>
                {aiError && (
                  <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={15} /> {aiError}
                  </div>
                )}
                <button id="analyze-btn" className="ai-trigger-btn" onClick={handleAnalyze}>
                  <Sparkles size={16} /> Analyse with AI
                </button>
              </>
            )}

            {aiLoading && (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <span className="spinner spinner-dark" style={{ width: 32, height: 32, borderWidth: 3 }} />
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Gemini is analysing the complaint…
                </p>
              </div>
            )}

            {aiResult && (
              <>
                <div className="ai-badge-row">
                  <div className="ai-badge-box">
                    <div className="label">Priority</div>
                    <div className={`value ${urgencyClass(aiResult.urgency)}`}>
                      {aiResult.urgency || 'N/A'}
                    </div>
                  </div>
                  <div className="ai-badge-box">
                    <div className="label">Department</div>
                    <div className="value" style={{ fontSize: '0.82rem' }}>
                      {aiResult.department || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="ai-section">
                  <h4>AI Summary</h4>
                  <p>{aiResult.summary || 'No summary generated.'}</p>
                </div>

                <div className="ai-section">
                  <h4>Auto-generated Response</h4>
                  <p className="ai-response-box">
                    &ldquo;{aiResult.autoResponse || 'No response generated.'}&rdquo;
                  </p>
                </div>

                <button className="ai-trigger-btn" onClick={handleAnalyze} style={{ marginTop: '0.5rem' }}>
                  <RefreshCw size={14} /> Re-analyse
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
