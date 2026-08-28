'use client';
import React, { useState } from 'react';

export interface SimulatorPreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  values: Record<string, number | boolean>;
  badge?: string;
  badgeColor?: string;
}

interface SimulatorPresetPanelProps {
  presets: SimulatorPreset[];
  onApply: (values: Record<string, number | boolean>) => void;
  onReset: () => void;
  title?: string;
}

export default function SimulatorPresetPanel({ presets, onApply, onReset, title = 'Clinical Scenarios' }: SimulatorPresetPanelProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', borderRadius: '0.875rem', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>🩺 {title}</span>
        </div>
        <button
          type="button"
          onClick={() => { setActiveId(null); onReset(); }}
          style={{ fontSize: '0.65rem', color: '#64748b', background: 'none', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '0.375rem', padding: '0.2rem 0.5rem', cursor: 'pointer', fontWeight: 600 }}
        >↺ Reset Normal</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {presets.map(p => (
          <button
            key={p.id}
            type="button"
            title={p.description}
            onClick={() => { setActiveId(p.id); onApply(p.values); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.4rem 0.875rem',
              fontSize: '0.72rem', fontWeight: 600,
              borderRadius: '0.5rem',
              border: activeId === p.id ? '1px solid rgba(59,130,246,0.6)' : '1px solid rgba(51,65,85,0.5)',
              background: activeId === p.id ? 'rgba(59,130,246,0.15)' : 'rgba(30,41,59,0.6)',
              color: activeId === p.id ? '#93c5fd' : '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
            {p.badge && (
              <span style={{ fontSize: '0.58rem', fontWeight: 700, background: p.badgeColor ?? 'rgba(239,68,68,0.15)', color: p.badgeColor ? '#fff' : '#f87171', borderRadius: '0.25rem', padding: '0.1rem 0.35rem' }}>{p.badge}</span>
            )}
          </button>
        ))}
      </div>
      {activeId && (
        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.6rem', fontStyle: 'italic' }}>
          {presets.find(p => p.id === activeId)?.description}
        </p>
      )}
    </div>
  );
}
