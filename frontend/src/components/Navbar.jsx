import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAiModal } from '../context/AiModalContext';
import { Search, PlusCircle, LayoutDashboard, LogOut, LogIn, UserPlus, Menu, X, Shield, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { openAiModal } = useAiModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass-nav)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--primary-glow)',
          }}>
            <Search size={20} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Retrievo
          </span>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.9rem' }} className="desktop-nav">
          {/* SmartMatch AI Pill */}
          <button
            type="button"
            onClick={openAiModal}
            className="btn"
            style={{
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              padding: '0.45rem 0.95rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
              e.currentTarget.style.color = '#a5b4fc';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Sparkles size={15} />
            <span>SmartMatch AI</span>
          </button>

          {/* Post Item Primary CTA */}
          <Link to="/post-item" className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
            <PlusCircle size={16} />
            Report Item
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginLeft: '0.25rem' }}>
              {/* User Name Pill (Clicking navigates directly to Dashboard) */}
              <Link
                to="/dashboard"
                title="Open My Dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  background: isActive('/dashboard') ? 'rgba(99, 102, 241, 0.22)' : 'rgba(255, 255, 255, 0.05)',
                  border: isActive('/dashboard') ? '1px solid rgba(99, 102, 241, 0.55)' : '1px solid var(--border-subtle)',
                  padding: '0.35rem 0.85rem 0.35rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                  boxShadow: isActive('/dashboard') ? '0 0 14px rgba(99, 102, 241, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.18)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActive('/dashboard') ? 'rgba(99, 102, 241, 0.22)' : 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = isActive('/dashboard') ? 'rgba(99, 102, 241, 0.55)' : 'var(--border-subtle)';
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)',
                }}>
                  {(user?.fullName || user?.email || 'U')[0].toUpperCase()}
                </div>
                <span style={{ fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.fullName || user?.email?.split('@')[0] || 'User'}
                </span>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 0.95rem', fontSize: '0.85rem' }}>
                <LogIn size={15} />
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
                <UserPlus size={15} />
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn btn-ghost"
          style={{ padding: '0.5rem', display: 'flex' }}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openAiModal();
            }}
            className="btn"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              color: '#ffffff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Sparkles size={16} />
            SmartMatch AI
          </button>

          <Link
            to="/post-item"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <PlusCircle size={18} />
            Report Item
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <LayoutDashboard size={18} />
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ width: '100%' }}
              >
                <LogOut size={18} />
                Log Out ({user?.fullName || user?.email})
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <LogIn size={18} />
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Inject Media Queries directly for clean responsiveness */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          button[aria-label="Toggle Navigation"] {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
