import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, User, Tag, Laptop, FileText, Watch, Briefcase, CreditCard, Box, ChevronRight } from 'lucide-react';

const CategoryIcon = ({ category, size = 16 }) => {
  switch (category) {
    case 'ELECTRONICS':
      return <Laptop size={size} />;
    case 'DOCUMENTS':
      return <FileText size={size} />;
    case 'ACCESSORIES':
      return <Watch size={size} />;
    case 'BAGS':
      return <Briefcase size={size} />;
    case 'ID_CARDS':
      return <CreditCard size={size} />;
    default:
      return <Box size={size} />;
  }
};

const ItemCard = ({ item }) => {
  const isLost = item.type === 'LOST';
  const isClaimed = item.status === 'CLAIMED';
  const isResolved = item.status === 'RESOLVED';

  const formattedDate = item.dateReported
    ? new Date(item.dateReported).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <Link to={`/items/${item.id}`} style={{ display: 'block' }}>
      <div className="glass-card" style={{
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Card Image or Gradient Placeholder */}
        <div style={{
          height: '180px',
          width: '100%',
          position: 'relative',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          overflow: 'hidden',
        }}>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isLost
                ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
            }}>
              <CategoryIcon category={item.category} size={48} />
            </div>
          )}

          {/* Type Badge (LOST / FOUND) */}
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <span className={isLost ? 'badge badge-lost' : 'badge badge-found'}>
              {item.type}
            </span>
          </div>

          {/* Status Badge */}
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <span className={
              isResolved ? 'badge badge-resolved' :
              isClaimed ? 'badge badge-claimed' : 'badge badge-open'
            }>
              {item.status}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {/* Category Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            color: 'var(--primary)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}>
            <CategoryIcon category={item.category} size={14} />
            {item.category}
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            lineHeight: '1.35',
            color: 'var(--text-main)',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.title}
          </h3>

          {/* Description snippet */}
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1,
          }}>
            {item.description}
          </p>

          {/* Meta Info: Location & Date */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="var(--secondary)" />
              <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.location}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
