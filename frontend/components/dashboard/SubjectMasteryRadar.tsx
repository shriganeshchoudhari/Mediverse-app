'use client';
import React, { useMemo } from 'react';

interface RadarPoint { subject: string; mastery: number; }

interface SubjectMasteryRadarProps {
  data: RadarPoint[];
  size?: number;
}

export default function SubjectMasteryRadar({ data, size = 260 }: SubjectMasteryRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.38;
  const levels = 4;

  const points = useMemo(() => {
    if (!data.length) return [];
    return data.map((d, i) => {
      const angle = (2 * Math.PI * i) / data.length - Math.PI / 2;
      const r = (d.mastery / 100) * R;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        labelX: cx + (R + 22) * Math.cos(angle),
        labelY: cy + (R + 22) * Math.sin(angle),
        label: d.subject,
        mastery: d.mastery,
      };
    });
  }, [data, cx, cy, R]);

  const webPoints = useMemo(() => {
    return Array.from({ length: levels }, (_, lvl) =>
      data.map((_, i) => {
        const angle = (2 * Math.PI * i) / data.length - Math.PI / 2;
        const r = ((lvl + 1) / levels) * R;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      }).join(' ')
    );
  }, [data, cx, cy, R, levels]);

  const spokeLines = useMemo(() => {
    return data.map((_, i) => {
      const angle = (2 * Math.PI * i) / data.length - Math.PI / 2;
      return { x1: cx, y1: cy, x2: cx + R * Math.cos(angle), y2: cy + R * Math.sin(angle) };
    });
  }, [data, cx, cy, R]);

  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  if (!data.length) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
        Complete lessons to see your mastery radar
      </div>
    );
  }

  return (
    <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(51,65,85,0.6)' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Subject Mastery Radar</div>
      <svg width={size} height={size} style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
        {/* Web grid */}
        {webPoints.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="rgba(51,65,85,0.5)" strokeWidth="1" />
        ))}
        {/* Spoke lines */}
        {spokeLines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(51,65,85,0.4)" strokeWidth="1" />
        ))}
        {/* Mastery polygon */}
        {points.length > 0 && (
          <>
            <polygon points={polyPoints} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={4} fill="#3b82f6" stroke="#1e3a5f" strokeWidth="2" />
            ))}
          </>
        )}
        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.labelX}
            y={p.labelY}
            textAnchor={p.labelX < cx - 5 ? 'end' : p.labelX > cx + 5 ? 'start' : 'middle'}
            dominantBaseline="middle"
            fill="#94a3b8"
            fontSize="9"
            fontWeight="600"
          >
            {p.label.length > 10 ? p.label.slice(0, 10) + '…' : p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
