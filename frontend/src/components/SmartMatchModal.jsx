import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';
import { Sparkles, Search, X, MapPin, Tag, ArrowRight, Loader2, Bot, Layers, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

const QUICK_PROMPTS = [
  "Navy blue steel hydroflask bottle in library",
  "Black over-ear Sony headphones near canteen",
  "Student ID card with lanyard near SAC",
  "Silver HP Pavilion laptop charger in LT-1",
];

const SmartMatchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [targetType, setTargetType] = useState('FOUND'); // 'FOUND' = search for items found by others, 'LOST' = search reported lost items
  const [minScore, setMinScore] = useState(0.6); // 60% similarity threshold
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // If user is searching "FOUND" items (i.e. they LOST something), backend target type is LOST
      // Backend opposite-type logic: querying with type=LOST filters database for FOUND items!
      const queryTypeParam = targetType === 'FOUND' ? 'LOST' : 'FOUND';

      const response = await axiosClient.get(API_ENDPOINTS.MATCH_ITEMS, {
        params: {
          query: query.trim(),
          type: queryTypeParam,
          minScore: minScore,
        },
      });

      setResults(response.data || []);
    } catch (err) {
      console.error('Vector match error:', err);
      setError('Could not complete AI match. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadge = (score) => {
    const percentage = Math.round(score * 100);
    if (percentage >= 80) {
      return {
        label: `${percentage}% Match`,
        bg: 'rgba(16, 185, 129, 0.18)',
        border: 'rgba(16, 185, 129, 0.4)',
        color: '#34d399',
        icon: <CheckCircle2 size={13} />,
      };
    } else if (percentage >= 65) {
      return {
        label: `${percentage}% Match`,
        bg: 'rgba(99, 102, 241, 0.18)',
        border: 'rgba(99, 102, 241, 0.4)',
        color: '#818cf8',
        icon: <Sparkles size={13} />,
      };
    } else {
      return {
        label: `${percentage}% Match`,
        bg: 'rgba(245, 158, 11, 0.18)',
        border: 'rgba(245, 158, 11, 0.4)',
        color: '#fbbf24',
        icon: <Compass size={13} />,
      };
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          background: 'linear-gradient(180deg, rgba(16, 23, 38, 0.98) 0%, rgba(9, 13, 22, 0.98) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(99, 102, 241, 0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            }}>
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                letterSpacing: '-0.02em',
              }}>
                SmartMatch AI
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                }}>
                  pgvector 1536-D
                </span>
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Describe what you lost or found in free-form English. Our vector engine will calculate similarity matches.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '0.4rem', borderRadius: '50%', color: 'var(--text-muted)' }}
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Mode Toggle */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(9, 13, 22, 0.7)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem',
        }}>
          <button
            type="button"
            onClick={() => { setTargetType('FOUND'); setResults(null); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'var(--transition)',
              background: targetType === 'FOUND' ? 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)' : 'transparent',
              color: targetType === 'FOUND' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: targetType === 'FOUND' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
            }}
          >
            <Search size={15} />
            I Lost Something (Find Found)
          </button>

          <button
            type="button"
            onClick={() => { setTargetType('LOST'); setResults(null); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'var(--transition)',
              background: targetType === 'LOST' ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' : 'transparent',
              color: targetType === 'LOST' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: targetType === 'LOST' ? '0 4px 12px rgba(6, 182, 212, 0.3)' : 'none',
            }}
          >
            <Layers size={15} />
            I Found Something (Find Lost)
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSearch}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Item Description & Location Clues</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Natural language accepted</span>
            </label>
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g., "Dark blue insulated water bottle with black cap left in the Central Library 2nd floor study area yesterday afternoon"'
              className="form-textarea"
              style={{
                fontSize: '0.925rem',
                lineHeight: '1.5',
                resize: 'vertical',
                background: 'rgba(9, 13, 22, 0.6)',
              }}
            />
          </div>

          {/* Quick Prompts */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.4rem', fontWeight: 600 }}>
              💡 Quick Examples:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setQuery(prompt)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.35)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              gap: '0.6rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              opacity: loading || !query.trim() ? 0.6 : 1,
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Computing 1536-D Vector Cosine Distance...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Find Matches with AI</span>
              </>
            )}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.875rem',
            color: 'var(--danger)',
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Results List */}
        {results !== null && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.65rem',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="var(--primary)" />
                Top Semantic Matches ({results.length})
              </h3>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Sorted by Cosine Similarity
              </span>
            </div>

            {results.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                background: 'rgba(9, 13, 22, 0.4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-subtle)',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem auto',
                }}>
                  <Search size={22} color="var(--text-subtle)" />
                </div>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>No Strong Matches Found</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto' }}>
                  No active {targetType.toLowerCase()} items met the similarity threshold. Try describing the item with more distinctive details (brand, color, material, location).
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {results.map((match) => {
                  const badge = getScoreBadge(match.similarityScore);
                  return (
                    <div
                      key={match.id}
                      className="glass-card"
                      style={{
                        padding: '1.15rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        background: 'rgba(20, 29, 48, 0.65)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {/* Top Row: Title + Score Badge */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span className={`badge badge-${match.type.toLowerCase()}`}>
                              {match.type}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                              #{match.id}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                            {match.title}
                          </h4>
                        </div>

                        {/* Similarity Badge */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          background: badge.bg,
                          border: `1px solid ${badge.border}`,
                          color: badge.color,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          {badge.icon}
                          {badge.label}
                        </div>
                      </div>

                      {/* Middle Row: Location & Category Metadata */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={14} color="var(--primary)" />
                          {match.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Tag size={14} color="var(--secondary)" />
                          {match.category}
                        </span>
                      </div>

                      {/* Description excerpt */}
                      <p style={{
                        fontSize: '0.825rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.5',
                        background: 'rgba(9, 13, 22, 0.4)',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        borderLeft: `2px solid ${badge.color}`,
                      }}>
                        {match.description}
                      </p>

                      {/* Bottom Action */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigate(`/items/${match.id}`);
                          }}
                          className="btn btn-primary"
                          style={{
                            padding: '0.45rem 0.95rem',
                            fontSize: '0.825rem',
                            gap: '0.4rem',
                          }}
                        >
                          <span>View Item Details</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <style>{`
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SmartMatchModal;
