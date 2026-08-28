'use client';
import React, { useMemo } from 'react';

interface RetentionHeatmapProps {
  activityDays: Record<string, number>;
}

function getColor(count: number): string {
  if (count === 0) return '#1e293b';
  if (count < 5) return '#1e40af';
  if (count < 15) return '#2563eb';
  if (count < 30) return '#3b82f6';
  return '#60a5fa';
}

export default function RetentionHeatmap({ activityDays }: RetentionHeatmapProps) {
  const weeks = useMemo(() => {
    const today = new Date();
    const days: { date: string; count: number; col: number; row: number }[] = [];
    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay(); // 0=Sun
      const weekIndex = Math.floor((363 - i) / 7);
      days.push({ date: dateStr, count: activityDays[dateStr] ?? 0, col: weekIndex, row: dayOfWeek });
    }
    return days;
  }, [activityDays]);

  const cellSize = 10;
  const gap = 2;
  const cols = 52;
  const rows = 7;
  const width = cols * (cellSize + gap);
  const height = rows * (cellSize + gap);

  const totalReviewed = Object.values(activityDays).reduce((a, b) => a + b, 0);
  const activeDays = Object.values(activityDays).filter(v => v > 0).length;

  return (
    <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(51,65,85,0.6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>365-Day Review Activity</div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: '#94a3b8' }}>
          <span><span style={{ color: '#60a5fa', fontWeight: 700 }}>{totalReviewed}</span> cards reviewed</span>
          <span><span style={{ color: '#60a5fa', fontWeight: 700 }}>{activeDays}</span> active days</span>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg width={width} height={height}>
          {weeks.map((day, i) => (
            <rect
              key={i}
              x={day.col * (cellSize + gap)}
              y={day.row * (cellSize + gap)}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill={getColor(day.count)}
              opacity={0.9}
            >
              <title>{day.date}: {day.count} cards reviewed</title>
            </rect>
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.6rem', color: '#475569' }}>Less</span>
        {['#1e293b', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa'].map((c, i) => (
          <rect key={i} style={{ width: 10, height: 10, background: c, borderRadius: 2, display: 'inline-block' }} />
        ))}
        <span style={{ fontSize: '0.6rem', color: '#475569' }}>More</span>
      </div>
    </div>
  );
}
