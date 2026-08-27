import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import { 
  LayoutDashboard, Package, ShieldCheck, PlusCircle, ExternalLink, 
  MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Inbox,
  Edit3, Phone, LogOut
} from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('POSTED'); // 'POSTED' or 'CLAIMS'
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [myItems, setMyItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'POSTED') {
        const response = await axiosClient.get(API_ENDPOINTS.MY_ITEMS, {
          params: { page: 0, size: 50, sort: 'createdAt,desc' },
        });
        setMyItems(response.data.content || []);
      } else {
        const response = await axiosClient.get(API_ENDPOINTS.MY_CLAIMS, {
          params: { page: 0, size: 50, sort: 'createdAt,desc' },
        });
        setMyClaims(response.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  return (
    <div style={{ padding: '3.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Profile Header Card */}
        <div className="glass-panel" style={{
          padding: '2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 8px 20px var(--primary-glow)',
            }}>
              {(user?.fullName || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {user?.fullName || user?.email?.split('@')[0]}
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {user?.email} • <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Campus Member</span>
                {user?.phoneNumber && (
                  <span style={{ marginLeft: '0.5rem', color: 'var(--text-subtle)' }}>
                    • 📞 {user.phoneNumber}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
            >
              <Edit3 size={16} />
              Edit Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
              title="Log out of your account"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
          gap: '1.5rem',
        }}>
          <button
            onClick={() => setActiveTab('POSTED')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'POSTED' ? '3px solid var(--primary)' : '3px solid transparent',
              padding: '0.85rem 0.5rem',
              fontSize: '1rem',
              fontWeight: 700,
              color: activeTab === 'POSTED' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            <Package size={18} />
            My Posted Items
          </button>

          <button
            onClick={() => setActiveTab('CLAIMS')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'CLAIMS' ? '3px solid var(--primary)' : '3px solid transparent',
              padding: '0.85rem 0.5rem',
              fontSize: '1rem',
              fontWeight: 700,
              color: activeTab === 'CLAIMS' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            <ShieldCheck size={18} />
            My Submitted Claims
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{
              width: '36px',
              height: '36px',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 0.8s linear infinite',
            }}></div>
          </div>
        ) : activeTab === 'POSTED' ? (
          /* My Posted Items View */
          myItems.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <Inbox size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Items Posted Yet</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                You haven't reported any lost or found items on campus.
              </p>
              <Link to="/post-item" className="btn btn-primary">
                <PlusCircle size={16} /> Report Item
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {myItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/items/${item.id}`}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.45), 0 0 20px rgba(99, 102, 241, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className={item.type === 'LOST' ? 'badge badge-lost' : 'badge badge-found'}>
                      {item.type}
                    </span>
                    <span className={
                      item.status === 'RESOLVED' ? 'badge badge-resolved' :
                      item.status === 'CLAIMED' ? 'badge badge-claimed' : 'badge badge-open'
                    }>
                      {item.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    {item.title}
                  </h3>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1.25rem',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flexGrow: 1,
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.825rem',
                    color: 'var(--text-subtle)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} color="var(--secondary)" />
                      <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.location}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          /* My Submitted Claims View */
          myClaims.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <Inbox size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Claims Submitted</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                You haven't submitted ownership claims for any items yet.
              </p>
              <Link to="/" className="btn btn-secondary">
                Explore Feed
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {myClaims.map((claim) => (
                <Link
                  key={claim.id}
                  to={`/items/${claim.itemId}`}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span className={
                        claim.status === 'APPROVED' ? 'badge badge-approved' :
                        claim.status === 'REJECTED' ? 'badge badge-rejected' : 'badge badge-pending'
                      }>
                        {claim.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                        Claim ID #{claim.id}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      Claim for: <span style={{ color: 'var(--primary)' }}>{claim.itemTitle || `Item #${claim.itemId}`}</span>
                    </h3>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      <strong>Your Proof:</strong> "{claim.proofDescription}"
                    </p>
                  </div>

                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                    View Item Details →
                  </span>
                </Link>
              ))}
            </div>
          )
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
