import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Package, ShieldCheck, PlusCircle, ExternalLink, 
  MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Inbox 
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('POSTED'); // 'POSTED' or 'CLAIMS'

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
              boxShadow: '0 8px 20px var(--primary-glow)',
            }}>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {user?.fullName || user?.email?.split('@')[0]}
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {user?.email} • <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Campus Member</span>
              </p>
            </div>
          </div>

          <Link to="/post-item" className="btn btn-primary">
            <PlusCircle size={18} />
            Post New Item
          </Link>
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
                <div key={item.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
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

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
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
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                      <MapPin size={14} color="var(--secondary)" />
                      <span>{item.location}</span>
                    </div>

                    <Link
                      to={`/items/${item.id}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Manage & Claims <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
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
                <div
                  key={claim.id}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
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

                  <Link
                    to={`/items/${claim.itemId}`}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    View Item Details <ExternalLink size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
