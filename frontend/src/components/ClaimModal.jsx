import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';
import { X, ShieldAlert, CheckCircle, AlertCircle, Image, FileText } from 'lucide-react';

const ClaimModal = ({ itemId, itemTitle, onClose, onSuccess }) => {
  const [proofDescription, setProofDescription] = useState('');
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (proofDescription.trim().length < 10) {
      setError('Proof description must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await axiosClient.post(API_ENDPOINTS.SUBMIT_CLAIM(itemId), {
        proofDescription: proofDescription.trim(),
        proofImageUrl: proofImageUrl.trim() || null,
      });

      onSuccess(response.data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : 'Failed to submit claim. Please try again.');
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>Submit Claim</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              For: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{itemTitle}</span>
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        {/* Info Note */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          fontSize: '0.85rem',
          color: '#c7d2fe',
        }}>
          <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            Provide unique identifying marks (serial numbers, lock-screen wallpaper, stickers, or invoice details) so the finder can verify your ownership.
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertCircle size={16} />
            <span>{typeof error === 'object' ? JSON.stringify(error) : error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Proof Description *</span>
              <span style={{ fontSize: '0.75rem', color: proofDescription.length >= 10 ? 'var(--success)' : 'var(--text-subtle)' }}>
                {proofDescription.length}/1000 (min 10)
              </span>
            </label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="E.g., The case has a small dent on the left hinge and a red sticker. Serial number starts with A204..."
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              required
              maxLength={1000}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Proof Image URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/receipt-photo.jpg"
              value={proofImageUrl}
              onChange={(e) => setProofImageUrl(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={submitting || proofDescription.trim().length < 10}
            >
              {submitting ? 'Submitting...' : 'Confirm Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimModal;
