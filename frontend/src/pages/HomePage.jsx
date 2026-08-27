import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS, CATEGORIES, ITEM_TYPES } from '../api/apiEndpoints';
import ItemCard from '../components/ItemCard';
import { useAiModal } from '../context/AiModalContext';
import { Search, PlusCircle, Filter, RotateCcw, ChevronLeft, ChevronRight, Inbox, Sparkles, Bot } from 'lucide-react';

const HomePage = () => {
  const { openAiModal } = useAiModal();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 9;

  // Debounce search query by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // Reset to first page on search change
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Items from Backend
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        sort: 'createdAt,desc',
      };

      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedType !== 'ALL') params.type = selectedType;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;

      const response = await axiosClient.get(API_ENDPOINTS.ITEMS, { params });
      setItems(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedType, selectedCategory, selectedStatus]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedType('ALL');
    setSelectedCategory('');
    setSelectedStatus('');
    setPage(0);
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        padding: '4.5rem 0 3rem 0',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#a5b4fc',
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={16} color="var(--primary)" />
            Official NITJ Campus Lost & Found Hub
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: '1.15',
            marginBottom: '1.25rem',
            letterSpacing: '-0.03em',
          }}>
            Find What's Lost.{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Return What's Found.
            </span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            maxWidth: '620px',
            margin: '0 auto 2.5rem auto',
            lineHeight: '1.6',
          }}>
            A high-trust community connecting students and faculty to track, verify, and recover misplaced items across campus in real time.
          </p>

          {/* Search Bar & SmartMatch AI Action */}
          <div style={{
            maxWidth: '780px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(20, 29, 48, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.45rem 0.55rem 0.45rem 1.25rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              gap: '0.75rem',
            }}>
              <Search size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search keywords (e.g. AirPods, Calculator, Umbrella)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  width: '100%',
                  fontSize: '0.95rem',
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="btn btn-ghost"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                >
                  Clear
                </button>
              )}

              {/* Glowing SmartMatch AI Button */}
              <button
                type="button"
                onClick={openAiModal}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 0 18px rgba(99, 102, 241, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              >
                <Sparkles size={15} />
                <span>SmartMatch AI</span>
              </button>
            </div>

            {/* Sub-helper hint */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
              flexWrap: 'wrap',
            }}>
              <span>💡 Looking for something specific?</span>
              <button
                type="button"
                onClick={openAiModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a5b4fc',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.825rem',
                  padding: 0,
                }}
              >
                Describe it in plain English & let AI match it ✨
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Feed Section */}
      <div className="container">
        {/* Controls Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          marginBottom: '2rem',
          padding: '1.25rem',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}>
          {/* Type Segmented Tabs (ALL / LOST / FOUND) */}
          <div style={{
            display: 'flex',
            background: 'rgba(9, 13, 22, 0.7)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            {ITEM_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => { setSelectedType(t.value); setPage(0); }}
                style={{
                  background: selectedType === t.value ? 'var(--primary)' : 'transparent',
                  color: selectedType === t.value ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
              className="form-select"
              style={{ width: 'auto', minWidth: '160px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
              className="form-select"
              style={{ width: 'auto', minWidth: '140px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open Only</option>
              <option value="CLAIMED">Claimed</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            {(search || selectedType !== 'ALL' || selectedCategory || selectedStatus) && (
              <button
                onClick={handleResetFilters}
                className="btn btn-ghost"
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.825rem' }}
                title="Reset Filters"
              >
                <RotateCcw size={15} />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-main)' }}>{totalElements}</strong> items
          </p>
          <Link to="/post-item" className="btn btn-primary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}>
            <PlusCircle size={15} />
            Post New Item
          </Link>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  height: '340px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}
              />
            ))}
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 0.8; }
              }
            `}</style>
          </div>
        ) : items.length === 0 ? (
          <div className="glass-panel" style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Inbox size={32} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>No Items Found</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
              No lost or found items matched your search criteria. Try clearing some filters or post a new item.
            </p>
            <button onClick={handleResetFilters} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '3.5rem',
          }}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="btn btn-secondary"
              style={{ opacity: page === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Page <strong style={{ color: 'var(--text-main)' }}>{page + 1}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="btn btn-secondary"
              style={{ opacity: page >= totalPages - 1 ? 0.4 : 1 }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
