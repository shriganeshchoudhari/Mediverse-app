'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Clock, Target, Medal, AlertCircle } from 'lucide-react';

export default function OsceLeaderboardsPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/leaderboards/osce/osce-acute-abdomen')
      .then(res => res.json())
      .then(data => {
        setScores(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900/50 border border-indigo-500 text-indigo-400 mb-4 shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)]">
            <Trophy size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Global OSCE Leaderboard</h1>
          <p className="text-slate-400">Scenario: <span className="text-indigo-300 font-mono">Acute Abdomen (Appendicitis)</span></p>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/80 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="p-5 w-20 text-center">Rank</th>
                <th className="p-5">Physician</th>
                <th className="p-5 text-right"><div className="flex items-center justify-end gap-2"><Target size={14}/> Accuracy</div></th>
                <th className="p-5 text-right"><div className="flex items-center justify-end gap-2"><Clock size={14}/> Time</div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-500">Loading scores...</td></tr>
              ) : scores.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-500 flex justify-center items-center gap-2"><AlertCircle size={16}/> No scores recorded yet.</td></tr>
              ) : (
                scores.map((score, index) => (
                  <tr key={score.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-5 text-center font-bold">
                      {index === 0 && <Medal className="text-yellow-400 mx-auto" size={24} />}
                      {index === 1 && <Medal className="text-slate-300 mx-auto" size={24} />}
                      {index === 2 && <Medal className="text-amber-600 mx-auto" size={24} />}
                      {index > 2 && <span className="text-slate-500">#{index + 1}</span>}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 text-xs">
                          {score.username.substring(0,2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-200">{score.username}</span>
                      </div>
                    </td>
                    <td className="p-5 text-right font-mono font-bold text-indigo-400">
                      {score.scorePercentage}%
                    </td>
                    <td className="p-5 text-right font-mono text-slate-400">
                      {formatTime(score.completionTimeSeconds)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
