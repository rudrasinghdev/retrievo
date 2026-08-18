import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, PlusCircle, LayoutDashboard, LogOut, LogIn, UserPlus, Menu, X, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
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

        {/* Desktop Navigation */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: 600,
              fontSize: '0.925rem',
              color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition)',
            }}
          >
            Explore Feed
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'var(--transition)',
              }}
            >
              <LayoutDashboard size={17} />
              My Dashboard
            </Link>
          )}
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
          <Link to="/post-item" className="btn btn-primary" style={{ padding: '0.55rem 1.15rem', fontSize: '0.875rem' }}>
            <PlusCircle size={17} />
            Post Item
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-ghost"
                title="Log Out"
                style={{ padding: '0.5rem', borderRadius: '50%' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.875rem' }}>
                <LogIn size={16} />
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.55rem 1.15rem', fontSize: '0.875rem' }}>
                <UserPlus size={16} />
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
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-main)' }}
          >
            Explore Feed
          </Link>
          <Link
            to="/post-item"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <PlusCircle size={18} />
            Post Item
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
                Log Out ({user?.email})
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
