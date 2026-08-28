'use client';
import React, { useEffect, useState } from 'react';

interface AIWeeklyReportProps {
  token: string | null;
}

export default function AIWeeklyReport({ token }: AIWeeklyReportProps) {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('/api/v1/analytics/weekly-report', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setReport(data?.summary ?? data?.report ?? null);
      })
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div style={{ background: 'rgba(15,23,42,0.7)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(59,130,246,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1rem' }}>🤖</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>AI Weekly Learning Report</span>
      </div>
      {loading ? (
        <div style={{ color: '#475569', fontSize: '0.8rem', fontStyle: 'italic', padding: '0.5rem 0' }}>Generating your report…</div>
      ) : report ? (
        <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{report}</p>
      ) : (
        <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
          Keep studying to get your first AI weekly learning report. Complete at least 3 lessons or 10 flashcard reviews to unlock your personalized analysis.
        </p>
      )}
    </div>
  );
}
