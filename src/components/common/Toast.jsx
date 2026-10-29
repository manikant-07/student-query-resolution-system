import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        maxWidth: '420px',
        width: '90%'
      }}
    >
      {toasts.map(toast => {
        let bg = 'var(--bg-card)';
        let border = 'var(--border)';
        let icon = <Info size={18} color="var(--primary)" />;

        if (toast.type === 'success') {
          border = '#10b981';
          icon = <CheckCircle2 size={18} color="#10b981" />;
        } else if (toast.type === 'error' || toast.type === 'warning') {
          border = '#ef4444';
          icon = <AlertCircle size={18} color="#ef4444" />;
        }

        return (
          <div
            key={toast.id}
            style={{
              background: bg,
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              boxShadow: 'var(--shadow-xl)',
              border: `1px solid ${border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              animation: 'slideUp 200ms ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {icon}
              <span style={{ fontWeight: 500 }}>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
