// src/components/Layout.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FilePlus, ClipboardList, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  
  // Safely parse the user object from localStorage
  let user = {};
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      user = JSON.parse(storedUser) || {};
    }
  } catch (err) {
    console.error('Failed to parse user from localStorage:', err);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Safely generate initials
  const initials = user && typeof user.name === 'string' && user.name.trim()
    ? user.name
        .trim()
        .split(/\s+/)
        .map((n) => n ? n[0] : '')
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {/* Logo / Brand */}
        <div className="sidebar-logo">
          <img
            src="/customer-satisfaction.png"
            alt="Complaint Management System Logo"
            style={{ width: 36, height: 36, borderRadius: 9, objectFit: 'contain', flexShrink: 0 }}
          />
          <div>
            <div className="sidebar-logo-text">Complaint</div>
            <div className="sidebar-logo-sub">Management System</div>
          </div>
        </div>

        {/* Nav */}
        <div className="sidebar-section-label">Menu</div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <FilePlus size={17} />
            Register Complaint
          </NavLink>
          <NavLink to="/complaints" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <ClipboardList size={17} />
            All Complaints
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-section-label" style={{ marginTop: 0, marginBottom: '0.6rem' }}>Account</div>
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user.name || 'User'}</div>
              <div className="user-role">Registered User</div>
            </div>
          </div>
          <button className="nav-link" style={{ color: '#f87171', width: '100%' }} onClick={handleLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
