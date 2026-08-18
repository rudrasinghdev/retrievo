import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, Link2 } from 'lucide-react';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

const ImageUploadBox = ({ imageUrl, onImageUploaded, onImageRemoved, label = "Item Photo" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setError('Image size must be less than 8MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const secureUrl = await uploadImageToCloudinary(file);
      onImageUploaded(secureUrl);
    } catch (err) {
      console.error('Cloudinary upload failed:', err);
      setError(err.message || 'Failed to upload photo. Please check your network.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please drop an image file (.png, .jpg, .jpeg, .webp).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image size must be less than 8MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const secureUrl = await uploadImageToCloudinary(file);
      onImageUploaded(secureUrl);
    } catch (err) {
      console.error('Cloudinary drop upload failed:', err);
      setError(err.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>{label} (Optional)</label>
        <button
          type="button"
          onClick={() => {
            setUseUrlMode(!useUrlMode);
            setError(null);
          }}
          className="btn-ghost"
          style={{ fontSize: '0.75rem', color: 'var(--primary-light)', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
        >
          {useUrlMode ? '📁 Upload File Instead' : '🔗 Or Paste Image URL'}
        </button>
      </div>

      {error && (
        <div style={{
          color: 'var(--danger)',
          fontSize: '0.8rem',
          marginBottom: '0.5rem',
        }}>
          {error}
        </div>
      )}

      {useUrlMode ? (
        <input
          type="url"
          className="form-input"
          placeholder="https://images.unsplash.com/... or direct image link"
          value={imageUrl || ''}
          onChange={(e) => onImageUploaded(e.target.value)}
        />
      ) : (
        <div>
          {imageUrl ? (
            /* Uploaded Preview Card */
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(16, 23, 38, 0.8)',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <img
                src={imageUrl}
                alt="Uploaded Preview"
                style={{
                  width: '72px',
                  height: '72px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  ✓ Image Uploaded to Cloud
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginTop: '0.2rem',
                }}>
                  {imageUrl}
                </p>
              </div>
              <button
                type="button"
                onClick={onImageRemoved}
                className="btn btn-ghost"
                style={{ padding: '0.4rem', borderRadius: '50%', color: 'var(--danger)' }}
                title="Remove photo"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            /* Dropzone / File Picker */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem 1rem',
                textAlign: 'center',
                background: 'rgba(16, 23, 38, 0.4)',
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                if (!uploading) e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                if (!uploading) e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                style={{ display: 'none' }}
                disabled={uploading}
              />

              {uploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Loader2 size={28} className="spin" style={{ color: 'var(--primary)' }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                    Uploading photo to Cloudinary CDN...
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Optimizing and compressing image
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <UploadCloud size={30} style={{ color: 'var(--primary-light)' }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
                    Click to browse or drop an image here
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Supports JPG, PNG, WEBP (Max 8MB)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadBox;
