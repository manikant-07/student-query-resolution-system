import React, { useState } from 'react';

/**
 * Professional Initials & Profile Avatar Component
 * Displays real Google profile photo if available, or a clean, neutral institutional initials avatar.
 * NEVER renders random stock photos.
 */
export function UserAvatar({ 
  user = null, 
  profile = null, 
  name = '', 
  photoUrl = null, 
  size = 'md',
  className = '',
  style = {} 
}) {
  const [imgError, setImgError] = useState(false);

  // Determine actual display name
  const resolvedName = (
    name ||
    profile?.full_name ||
    user?.displayName ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    profile?.email ||
    'Student'
  ).trim();

  // Determine actual photo URL
  const resolvedPhoto = !imgError ? (
    photoUrl ||
    profile?.avatar_url ||
    user?.photoURL ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null
  ) : null;

  // Extract neutral initials (e.g., "John Doe" -> "JD", "Manikant" -> "M")
  const getInitials = (str) => {
    if (!str) return 'U';
    // If it's an email address, take first letter
    if (str.includes('@')) {
      return str.charAt(0).toUpperCase();
    }
    const parts = str.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(resolvedName);

  // Dimensions based on size
  const sizeMap = {
    xs: { width: 24, height: 24, fontSize: '0.65rem' },
    sm: { width: 30, height: 30, fontSize: '0.75rem' },
    md: { width: 38, height: 38, fontSize: '0.875rem' },
    lg: { width: 50, height: 50, fontSize: '1.1rem' },
    xl: { width: 64, height: 64, fontSize: '1.35rem' },
  };

  const dim = sizeMap[size] || sizeMap.md;

  if (resolvedPhoto) {
    return (
      <img
        src={resolvedPhoto}
        alt={resolvedName}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={className}
        style={{
          width: dim.width,
          height: dim.height,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1.5px solid var(--border)',
          flexShrink: 0,
          background: 'var(--bg-subtle)',
          ...style,
        }}
      />
    );
  }

  // Institutional Initials Avatar (Deep Forest Green theme)
  return (
    <div
      className={className}
      title={resolvedName}
      style={{
        width: dim.width,
        height: dim.height,
        borderRadius: '50%',
        background: 'var(--primary)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: dim.fontSize,
        letterSpacing: '0.02em',
        border: '1.5px solid rgba(255, 255, 255, 0.2)',
        flexShrink: 0,
        userSelect: 'none',
        ...style,
      }}
    >
      {initials}
    </div>
  );
}

