'use client';
import React, { useEffect, useState } from 'react';

interface XPToastProps {
  xp: number;
  label?: string;
  onDone?: () => void;
}

export default function XPToast({ xp, label = 'Step Complete', onDone }: XPToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.625rem',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #1a2942 100%)',
      border: '1px solid rgba(59,130,246,0.4)',
      borderRadius: '0.875rem',
      padding: '0.75rem 1.25rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: 'xpSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
      color: '#e2e8f0',
      fontSize: '0.875rem',
      fontWeight: 700,
      pointerEvents: 'none',
    }}>
      <style>{`
        @keyframes xpSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <span style={{ fontSize: '1.25rem' }}>✨</span>
      <span style={{ color: '#93c5fd' }}>{label}</span>
      <span style={{
        background: 'rgba(59,130,246,0.2)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: '0.5rem',
        padding: '0.2rem 0.6rem',
        color: '#60a5fa',
        fontSize: '0.8rem',
      }}>+{xp} XP</span>
    </div>
  );
}
