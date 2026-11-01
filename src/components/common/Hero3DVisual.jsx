import React from 'react';
import { Sparkles, MessageSquare, CheckCircle2, Star } from 'lucide-react';

/**
 * Large 3D Glossy Objects Hero Visual for SolveHub
 * Features:
 * - 3D Glass Sphere with specular reflections & refraction glow
 * - Floating glossy 3D Question Mark
 * - Floating glass chat bubbles with live status indicators
 */
export function Hero3DVisual() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        height: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'var(--primary-glow)',
          filter: 'blur(60px)',
          animation: 'pulseGlow 5s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      {/* Main 3D Glossy Glass Sphere with Floating Question Mark */}
      <div className="glass-sphere-3d" style={{ zIndex: 2 }}>
        {/* Specular Glint Reflection */}
        <div className="sphere-specular" />

        {/* Floating 3D Question Mark */}
        <div className="floating-question-mark">?</div>
      </div>

      {/* Floating 3D Glass Bubble 1 (Top Left) */}
      <div
        className="glass-chat-bubble-3d"
        style={{
          top: '25px',
          left: '-20px',
          zIndex: 3,
          animationDelay: '0s',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#060D09',
            boxShadow: '0 0 12px var(--primary-glow)',
          }}
        >
          <Sparkles size={16} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            AI Smart Route
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Auto-assigned in 1.2s
          </div>
        </div>
      </div>

      {/* Floating 3D Glass Bubble 2 (Bottom Right) */}
      <div
        className="glass-chat-bubble-3d"
        style={{
          bottom: '35px',
          right: '-15px',
          zIndex: 3,
          animationDelay: '1.5s',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#060D09',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
          }}
        >
          <CheckCircle2 size={16} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Query Resolved
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B', fontSize: '0.7rem' }}>
            <Star size={11} fill="#F59E0B" />
            <Star size={11} fill="#F59E0B" />
            <Star size={11} fill="#F59E0B" />
            <Star size={11} fill="#F59E0B" />
            <Star size={11} fill="#F59E0B" />
            <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>5.0 Rating</span>
          </div>
        </div>
      </div>

      {/* Floating Mini Glass Bubble 3 (Bottom Left) */}
      <div
        className="glass-chat-bubble-3d"
        style={{
          bottom: '40px',
          left: '10px',
          zIndex: 3,
          padding: '0.55rem 0.95rem',
          animationDelay: '3s',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--primary)',
            boxShadow: '0 0 8px var(--primary)',
          }}
        />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          180+ Active Mentors
        </span>
      </div>
    </div>
  );
}
