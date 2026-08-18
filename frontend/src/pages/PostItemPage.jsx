import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS, CATEGORIES } from '../api/apiEndpoints';
import { PlusCircle, ArrowLeft, AlertCircle, Sparkles, MapPin, Calendar, Tag, Image, FileText } from 'lucide-react';
import ImageUploadBox from '../components/ImageUploadBox';

const PostItemPage = () => {
  const navigate = useNavigate();

  const [type, setType] = useState('FOUND');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ELECTRONICS');
  const [location, setLocation] = useState('');
  const [dateReported, setDateReported] = useState(new Date().toISOString().slice(0, 16));
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        category,
        type,
        dateReported: new Date(dateReported).toISOString(),
        imageUrl: imageUrl.trim() || null,
      };

      const response = await axiosClient.post(API_ENDPOINTS.ITEMS, payload);
      navigate(`/items/${response.data.id}`);
    } catch (err) {
      console.error('Failed to post item:', err);
      const errorMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : 'Failed to post item. Please verify all fields.');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '750px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginBottom: '1.75rem',
            transition: 'var(--transition)',
          }}
        >
          <ArrowLeft size={16} /> Back to Feed
        </Link>

        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Report a Lost or Found Item
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Provide accurate details so the campus community can identify and claim the item.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              color: 'var(--danger)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <AlertCircle size={18} />
              <span>{typeof error === 'object' ? JSON.stringify(error) : error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Type Selector Tabs (LOST vs FOUND) */}
            <div className="form-group">
              <label className="form-label">Report Type *</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '0.25rem',
              }}>
                <button
                  type="button"
                  onClick={() => setType('FOUND')}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: type === 'FOUND' ? '2px solid var(--success)' : '1px solid var(--border-subtle)',
                    background: type === 'FOUND' ? 'var(--success-bg)' : 'rgba(16, 23, 38, 0.6)',
                    color: type === 'FOUND' ? 'var(--success)' : 'var(--text-muted)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  🟢 I FOUND an Item
                </button>

                <button
                  type="button"
                  onClick={() => setType('LOST')}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: type === 'LOST' ? '2px solid var(--danger)' : '1px solid var(--border-subtle)',
                    background: type === 'LOST' ? 'var(--danger-bg)' : 'rgba(16, 23, 38, 0.6)',
                    color: type === 'LOST' ? 'var(--danger)' : 'var(--text-muted)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  🔴 I LOST an Item
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Item Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="E.g., Boat Rockerz 450 Bluetooth Headphone (Black)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            {/* Category & Location Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Campus Location *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="E.g. Library 2nd Floor / IT Dept Lab 3"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Date Reported */}
            <div className="form-group">
              <label className="form-label">Date & Time Lost/Found *</label>
              <input
                type="datetime-local"
                className="form-input"
                value={dateReported}
                onChange={(e) => setDateReported(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Detailed Description *</span>
                <span style={{ fontSize: '0.75rem', color: description.length >= 10 ? 'var(--success)' : 'var(--text-subtle)' }}>
                  {description.length}/1000 (min 10 chars)
                </span>
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Describe color, brand, condition, unique scratches, or contents inside..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={1000}
              />
            </div>

            {/* Image Upload Box */}
            <ImageUploadBox
              imageUrl={imageUrl}
              onImageUploaded={(url) => setImageUrl(url)}
              onImageRemoved={() => setImageUrl('')}
              label="Item Photo"
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || description.trim().length < 10 || !title.trim()}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '1.25rem' }}
            >
              <PlusCircle size={18} />
              {loading ? 'Publishing Report...' : 'Publish Item Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostItemPage;
