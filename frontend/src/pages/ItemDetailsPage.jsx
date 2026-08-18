import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';
import { useAuth } from '../context/AuthContext';
import ClaimModal from '../components/ClaimModal';
import { 
  MapPin, Calendar, User, Tag, ArrowLeft, ShieldAlert, CheckCircle, 
  XCircle, Clock, FileText, AlertCircle, Trash2, Edit3 
} from 'lucide-react';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch Item details
  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(API_ENDPOINTS.ITEM_BY_ID(id));
      setItem(response.data);

      // If current user is the poster or admin, fetch submitted claims
      const isOwner = user && response.data.postedBy?.email === user.email;
      const isAdmin = user && user.role === 'ADMIN';

      if (isOwner || isAdmin) {
        fetchClaims();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Item not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.CLAIMS_BY_ITEM(id));
      setClaims(response.data.content || []);
    } catch (err) {
      console.error('Failed to load claims for item:', err);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id, user]);

  // Handle Approve or Reject
  const handleReviewClaim = async (claimId, newStatus) => {
    setActionLoading(true);
    try {
      await axiosClient.patch(API_ENDPOINTS.UPDATE_CLAIM_STATUS(claimId), {
        status: newStatus,
      });

      setSuccessMessage(`Claim successfully ${newStatus.toLowerCase()}!`);
      // Refresh item and claims state
      fetchItemDetails();
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update claim status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 0.8s linear infinite',
        }}></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--danger)' }}>{error || 'Item not found'}</h2>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Explore Feed
        </Link>
      </div>
    );
  }

  const isOwner = user && item.postedBy?.email === user.email;
  const isLost = item.type === 'LOST';
  const isOpen = item.status === 'OPEN';

  const formattedDate = item.dateReported
    ? new Date(item.dateReported).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown Date';

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Back Link */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            transition: 'var(--transition)',
          }}
        >
          <ArrowLeft size={16} /> Back to Feed
        </Link>

        {/* Success Banner */}
        {successMessage && (
          <div style={{
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            color: 'var(--success)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <CheckCircle size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main Grid: Details Left, Meta/Actions Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}>
          {/* Left Column: Image & Description */}
          <div className="glass-panel" style={{ padding: '2rem', overflow: 'hidden' }}>
            {item.imageUrl && (
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                maxHeight: '400px',
                marginBottom: '2rem',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
              }}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span className={isLost ? 'badge badge-lost' : 'badge badge-found'}>
                {item.type}
              </span>
              <span className={
                item.status === 'RESOLVED' ? 'badge badge-resolved' :
                item.status === 'CLAIMED' ? 'badge badge-claimed' : 'badge badge-open'
              }>
                {item.status}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                {item.category}
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              {item.title}
            </h1>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Item Description
              </h4>
              <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {item.description}
              </p>
            </div>
          </div>

          {/* Right Column: Meta Info & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Meta Card */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                Campus Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', fontSize: '0.925rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Location</span>
                    <strong style={{ color: 'var(--text-main)' }}>{item.location}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Calendar size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Date Reported</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formattedDate}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <User size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Reported By</span>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {item.postedBy?.fullName || item.postedBy?.email}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                {isOwner ? (
                  <div style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: '#c7d2fe',
                  }}>
                    ✨ You posted this item. You can review submitted claims below.
                  </div>
                ) : isOpen ? (
                  isAuthenticated ? (
                    <button
                      onClick={() => setClaimModalOpen(true)}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                    >
                      <ShieldAlert size={18} />
                      Claim This Item
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                    >
                      Log in to Submit Claim
                    </Link>
                  )
                ) : (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                  }}>
                    🔒 This item has been marked as <strong>{item.status}</strong>.
                  </div>
                )}
              </div>
            </div>

            {/* Poster's Claims Review Management Panel */}
            {isOwner && (
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  Submitted Claims ({claims.length})
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Review proof submitted by students. Approving a claim will mark this item as CLAIMED.
                </p>

                {claims.length === 0 ? (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                    No claims submitted for this item yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {claims.map((claim) => (
                      <div
                        key={claim.id}
                        style={{
                          background: 'rgba(9, 13, 22, 0.6)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.1rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {claim.claimant?.fullName || claim.claimant?.email}
                          </span>
                          <span className={
                            claim.status === 'APPROVED' ? 'badge badge-approved' :
                            claim.status === 'REJECTED' ? 'badge badge-rejected' : 'badge badge-pending'
                          }>
                            {claim.status}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                          "{claim.proofDescription}"
                        </p>

                        {claim.proofImageUrl && (
                          <a
                            href={claim.proofImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--secondary)',
                              display: 'inline-block',
                              marginBottom: '0.75rem',
                              textDecoration: 'underline',
                            }}
                          >
                            View Attached Proof Photo ↗
                          </a>
                        )}

                        {claim.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button
                              onClick={() => handleReviewClaim(claim.id, 'APPROVED')}
                              disabled={actionLoading}
                              className="btn btn-success"
                              style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button
                              onClick={() => handleReviewClaim(claim.id, 'REJECTED')}
                              disabled={actionLoading}
                              className="btn btn-danger"
                              style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim Submission Modal */}
      {claimModalOpen && (
        <ClaimModal
          itemId={item.id}
          itemTitle={item.title}
          onClose={() => setClaimModalOpen(false)}
          onSuccess={() => {
            setClaimModalOpen(false);
            setSuccessMessage('Your claim has been submitted successfully! The poster will review your proof.');
            fetchItemDetails();
          }}
        />
      )}
    </div>
  );
};

export default ItemDetailsPage;
